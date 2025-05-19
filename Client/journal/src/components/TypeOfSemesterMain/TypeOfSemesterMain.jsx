import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Box,
    Button,
    CircularProgress,
    TableSortLabel
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    fetchTypeOfSemesters,
    createTypeOfSemester,
    updateTypeOfSemester,
    deleteTypeOfSemester,
    clearErrors,
    clearCurrentSemester,
    setPage,
    setLimit,
    setSearchParams
} from '../../store/slices/typeOfSemesterSlice';

const TypeOfSemesterMain = () => {
    const dispatch = useDispatch();
    const {
        data: semestersData,
        isLoading,
        errors,
        currentSemester,
        meta,
        searchParams
    } = useSelector(state => state.typeOfSemesters);

    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newSemester, setNewSemester] = useState({ 
        name: '', 
        start: '', 
        end: '' 
    });
    const [editSemester, setEditSemester] = useState({ 
        name: '', 
        start: '', 
        end: '' 
    });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');
    const [searchName, setSearchName] = useState('');
    const [searchStartDate, setSearchStartDate] = useState('');
    const [searchEndDate, setSearchEndDate] = useState('');

    useEffect(() => {
        dispatch(fetchTypeOfSemesters({
            limit: meta?.limit || 5,
            page: meta?.page || 1,
            sortBy: orderBy,
            sortOrder: order,
            ...searchParams
        }));
    }, [dispatch, meta?.limit, meta?.page, orderBy, order, searchParams]);

    useEffect(() => {
        if (errors.length > 0) {
            setAlertState({
                open: true,
                message: errors[0].message,
                severity: 'error'
            });
            dispatch(clearErrors());
        }
    }, [errors, dispatch]);

    const showAlert = (message, severity = 'success') => {
        setAlertState({
            open: true,
            message,
            severity
        });
        setTimeout(() => setAlertState(prev => ({ ...prev, open: false })), 3000);
    };

    const handleChangePage = (event, newPage) => {
        dispatch(setPage(newPage + 1));
    };

    const handleChangeRowsPerPage = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
    };

    const handleSearchMenuClick = (event) => {
        setSearchAnchorEl(event.currentTarget);
    };

    const handleSearchMenuClose = () => {
        setSearchAnchorEl(null);
    };

    const handleSearchNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleSearchStartDateChange = (event) => {
        setSearchStartDate(event.target.value);
    };

    const handleSearchEndDateChange = (event) => {
        setSearchEndDate(event.target.value);
    };

    const handleSearch = () => {
        dispatch(setSearchParams({ 
            nameQuery: searchName,
            startDateQuery: searchStartDate,
            endDateQuery: searchEndDate
        }));
        handleSearchMenuClose();
    };

    const handleResetSearch = () => {
        setSearchName('');
        setSearchStartDate('');
        setSearchEndDate('');
        dispatch(setSearchParams({ 
            nameQuery: '',
            startDateQuery: '',
            endDateQuery: ''
        }));
        handleSearchMenuClose();
    };

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        dispatch(setPage(1));
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditSemester(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewSemester({ name: '', start: '', end: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        dispatch(clearCurrentSemester());
    };

    const handleSaveEdit = async () => {
        if (!editSemester.name?.trim()) {
            showAlert('Название семестра должно быть заполнено!', 'error');
            return;
        }
        if (!editSemester.start) {
            showAlert('Дата начала должна быть заполнена!', 'error');
            return;
        }
        if (!editSemester.end) {
            showAlert('Дата окончания должна быть заполнена!', 'error');
            return;
        }

        try {
            await dispatch(updateTypeOfSemester({
                id: editSemester.id,
                semesterData: { 
                    name: editSemester.name,
                    start: editSemester.start,
                    end: editSemester.end
                }
            })).unwrap();

            showAlert('Семестр успешно обновлен!', 'success');
            handleCloseModals();
            dispatch(fetchTypeOfSemesters({
                limit: meta.limit,
                page: meta.page,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при обновлении семестра', 'error');
        }
    };

    const handleSaveAdd = async () => {
        if (!newSemester.name?.trim()) {
            showAlert('Название семестра должно быть заполнено!', 'error');
            return;
        }
        if (!newSemester.start) {
            showAlert('Дата начала должна быть заполнена!', 'error');
            return;
        }
        if (!newSemester.end) {
            showAlert('Дата окончания должна быть заполнена!', 'error');
            return;
        }

        try {
            await dispatch(createTypeOfSemester({ 
                name: newSemester.name,
                start: newSemester.start,
                end: newSemester.end
            })).unwrap();
            showAlert('Семестр успешно добавлен!', 'success');
            handleCloseModals();
            dispatch(setPage(1));
            dispatch(fetchTypeOfSemesters({
                limit: meta.limit,
                page: 1,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при добавлении семестра', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteTypeOfSemester(currentRow.id)).unwrap();
            showAlert('Семестр успешно удален!', 'success');
            handleCloseModals();

            if (semestersData.length === 1 && meta.page > 1) {
                dispatch(setPage(meta.page - 1));
            } else {
                dispatch(fetchTypeOfSemesters({
                    limit: meta.limit,
                    page: meta.page,
                    sortBy: orderBy,
                    sortOrder: order,
                    ...searchParams
                }));
            }
        } catch (error) {
            showAlert(error.message || 'Ошибка при удалении семестра', 'error');
        }
    };

    if (isLoading && semestersData.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Типы семестров</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handleSearchMenuClick}>
                            <SearchIcon />
                        </IconButton>
                        <IconButton onClick={handleResetSearch}>
                            <RefreshIcon />
                        </IconButton>
                        <Menu
                            anchorEl={searchAnchorEl}
                            open={Boolean(searchAnchorEl)}
                            onClose={handleSearchMenuClose}
                            PaperProps={{
                                sx: {
                                    p: 2,
                                    width: 300
                                }
                            }}
                        >
                            <TextField
                                label="Поиск по названию"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchName}
                                onChange={handleSearchNameChange}
                                sx={{ mb: 2 }}
                                autoFocus
                            />
                            <TextField
                                label="Дата начала (от)"
                                type="date"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchStartDate}
                                onChange={handleSearchStartDateChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Дата окончания (до)"
                                type="date"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchEndDate}
                                onChange={handleSearchEndDateChange}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleResetSearch}
                                    disabled={!searchName && !searchStartDate && !searchEndDate}
                                >
                                    Сбросить
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    disabled={!searchName && !searchStartDate && !searchEndDate}
                                >
                                    Поиск
                                </Button>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleSortRequest('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSortRequest('name')}
                                >
                                    Наименование
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'start'}
                                    direction={orderBy === 'start' ? order : 'asc'}
                                    onClick={() => handleSortRequest('start')}
                                >
                                    Дата начала
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'end'}
                                    direction={orderBy === 'end' ? order : 'asc'}
                                    onClick={() => handleSortRequest('end')}
                                >
                                    Дата окончания
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {semestersData.map(semester => (
                            <TableRow key={semester.id}>
                                <TableCell>{semester.id}</TableCell>
                                <TableCell>{semester.name}</TableCell>
                                <TableCell>{new Date(semester.start).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(semester.end).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, semester)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={meta.total || 0}
                    rowsPerPage={meta.limit}
                    page={meta.page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Записей на странице:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                />

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
                    <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                </Menu>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={isLoading}
                >
                    Добавить семестр
                </Button>
            </Box>

            {/* Модальное окно редактирования */}
            <Modal open={openEditModal} onClose={handleCloseModals}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24
                }}>
                    <Box sx={{
                        bgcolor: '#1976d2',
                        color: 'white',
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6">Редактировать семестр</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название семестра*"
                            fullWidth
                            margin="normal"
                            value={editSemester.name}
                            onChange={(e) => setEditSemester({ ...editSemester, name: e.target.value })}
                        />
                        <TextField
                            label="Дата начала*"
                            type="date"
                            fullWidth
                            margin="normal"
                            value={editSemester.start ? editSemester.start.split('T')[0] : ''}
                            onChange={(e) => setEditSemester({ ...editSemester, start: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Дата окончания*"
                            type="date"
                            fullWidth
                            margin="normal"
                            value={editSemester.end ? editSemester.end.split('T')[0] : ''}
                            onChange={(e) => setEditSemester({ ...editSemester, end: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseModals}>Отмена</Button>
                            <Button
                                onClick={handleSaveEdit}
                                color="primary"
                                disabled={isLoading}
                                sx={{ ml: 2 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Сохранить'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Модальное окно удаления */}
            <Modal open={openDeleteModal} onClose={handleCloseModals}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24
                }}>
                    <Box sx={{
                        bgcolor: '#1976d2',
                        color: 'white',
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6">Удалить семестр</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Typography>Вы уверены, что хотите удалить семестр "{currentRow?.name}"?</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseModals}>Отмена</Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                color="error"
                                disabled={isLoading}
                                sx={{ ml: 2 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Удалить'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Модальное окно добавления */}
            <Modal open={openAddModal} onClose={handleCloseModals}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24
                }}>
                    <Box sx={{
                        bgcolor: '#1976d2',
                        color: 'white',
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6">Добавить новый семестр</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название семестра*"
                            fullWidth
                            margin="normal"
                            value={newSemester.name}
                            onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                        />
                        <TextField
                            label="Дата начала*"
                            type="date"
                            fullWidth
                            margin="normal"
                            value={newSemester.start}
                            onChange={(e) => setNewSemester({ ...newSemester, start: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Дата окончания*"
                            type="date"
                            fullWidth
                            margin="normal"
                            value={newSemester.end}
                            onChange={(e) => setNewSemester({ ...newSemester, end: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseModals}>Отмена</Button>
                            <Button
                                onClick={handleSaveAdd}
                                color="primary"
                                disabled={isLoading}
                                sx={{ ml: 2 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Добавить'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Уведомления */}
            {alertState.open && (
                <Box sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    p: 2,
                    backgroundColor: alertState.severity === 'error' ? '#f44336' : '#4caf50',
                    color: 'white',
                    borderRadius: 1,
                    boxShadow: 3,
                    zIndex: 9999
                }}>
                    {alertState.message}
                </Box>
            )}
        </>
    );
};

export default TypeOfSemesterMain;