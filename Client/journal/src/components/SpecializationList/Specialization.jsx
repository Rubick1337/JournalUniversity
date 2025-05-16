import React, { useEffect, useState } from 'react';
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
import Alert from '../Alert/Alert';
import {
    fetchAcademicSpecialties,
    addAcademicSpecialty,
    updateAcademicSpecialty,
    deleteAcademicSpecialty,
    getAcademicSpecialtyByCode,
    clearErrors,
    clearCurrentSpecialty,
    setPage,
    setLimit,
    setSearchParams
} from '../../store/slices/academicSpecialtySlice';

const SpecializationListTable = () => {
    const dispatch = useDispatch();
    const {
        data: specialties,
        isLoading,
        errors,
        currentSpecialty,
        meta,
        searchParams
    } = useSelector(state => state.academicSpecialties);

    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCode, setSearchCode] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newSpecialty, setNewSpecialty] = useState({ code: '', name: '' });
    const [editSpecialty, setEditSpecialty] = useState({ code: '', name: '' });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [orderBy, setOrderBy] = useState('code');
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        dispatch(fetchAcademicSpecialties({
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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchCodeChange = (event) => {
        setSearchCode(event.target.value);
    };

    const handleSearch = () => {
        dispatch(setSearchParams({
            nameQuery: searchTerm,
            codeQuery: searchCode
        }));
        handleSearchMenuClose();
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        setSearchCode('');
        dispatch(setSearchParams({
            nameQuery: '',
            codeQuery: ''
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
        dispatch(getAcademicSpecialtyByCode(currentRow.code))
            .then(() => {
                setEditSpecialty(currentRow);
                setOpenEditModal(true);
                handleMenuClose();
            });
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewSpecialty({ code: '', name: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        dispatch(clearCurrentSpecialty());
    };

    const handleSaveEdit = async () => {
        if (!editSpecialty.code?.trim() || !editSpecialty.name?.trim()) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }

        try {
            await dispatch(updateAcademicSpecialty({
                code: editSpecialty.code,
                specialtyData: { name: editSpecialty.name }
            })).unwrap();

            showAlert('Специальность успешно обновлена!', 'success');
            handleCloseModals();
            dispatch(fetchAcademicSpecialties({
                limit: meta.limit,
                page: meta.page,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при обновлении специальности', 'error');
        }
    };

    const handleSaveAdd = async () => {
        if (!newSpecialty.code?.trim() || !newSpecialty.name?.trim()) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }

        try {
            await dispatch(addAcademicSpecialty(newSpecialty)).unwrap();
            showAlert('Специальность успешно добавлена!', 'success');
            handleCloseModals();
            dispatch(setPage(1));
            dispatch(fetchAcademicSpecialties({
                limit: meta.limit,
                page: 1,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при добавлении специальности', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteAcademicSpecialty(currentRow.code)).unwrap();
            showAlert('Специальность успешно удалена!', 'success');
            handleCloseModals();

            if (specialties.length === 1 && meta.page > 1) {
                dispatch(setPage(meta.page - 1));
            } else {
                dispatch(fetchAcademicSpecialties({
                    limit: meta.limit,
                    page: meta.page,
                    sortBy: orderBy,
                    sortOrder: order,
                    ...searchParams
                }));
            }
        } catch (error) {
            showAlert(error.message || 'Ошибка при удалении специальности', 'error');
        }
    };

    if (isLoading && specialties.length === 0) {
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
                    <Typography variant="h6">Список специальностей</Typography>
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
                                    width: 350
                                }
                            }}
                        >
                            <TextField
                                label="Поиск по названию"
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="normal"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                autoFocus
                            />
                            <TextField
                                label="Поиск по коду"
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="normal"
                                value={searchCode}
                                onChange={handleSearchCodeChange}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleResetSearch}
                                    disabled={!searchTerm && !searchCode}
                                >
                                    Сбросить
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    disabled={!searchTerm && !searchCode}
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
                                    active={orderBy === 'code'}
                                    direction={orderBy === 'code' ? order : 'asc'}
                                    onClick={() => handleSortRequest('code')}
                                >
                                    Код специальности
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSortRequest('name')}
                                >
                                    Название специальности
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {specialties.map(specialty => (
                            <TableRow key={specialty.code}>
                                <TableCell>{specialty.code}</TableCell>
                                <TableCell>{specialty.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, specialty)}>
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
                    Добавить специальность
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
                        <Typography variant="h6">Редактировать специальность</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Код специальности*"
                            fullWidth
                            margin="normal"
                            value={editSpecialty.code}
                            onChange={(e) => setEditSpecialty({ ...editSpecialty, code: e.target.value })}
                            disabled
                        />
                        <TextField
                            label="Название специальности*"
                            fullWidth
                            margin="normal"
                            value={editSpecialty.name}
                            onChange={(e) => setEditSpecialty({ ...editSpecialty, name: e.target.value })}
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
                        <Typography variant="h6">Удалить специальность</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Typography>Вы уверены, что хотите удалить специальность "{currentRow?.name}"?</Typography>
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
                        <Typography variant="h6">Добавить специальность</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Код специальности*"
                            fullWidth
                            margin="normal"
                            value={newSpecialty.code}
                            onChange={(e) => setNewSpecialty({ ...newSpecialty, code: e.target.value })}
                        />
                        <TextField
                            label="Название специальности*"
                            fullWidth
                            margin="normal"
                            value={newSpecialty.name}
                            onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
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

export default SpecializationListTable;