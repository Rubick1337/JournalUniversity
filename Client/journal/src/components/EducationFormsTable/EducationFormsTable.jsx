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
import {
    fetchEducationForms,
    addEducationForm,
    updateEducationForm,
    deleteEducationForm,
    clearErrors,
    clearCurrentForm,
    setPage,
    setLimit
} from '../../store/slices/educationFormSlice';

const EducationFormsTable = () => {
    const dispatch = useDispatch();
    const {
        data: formsData,
        isLoading,
        errors,
        currentForm,
        meta
    } = useSelector(state => state.educationForms);

    const [searchName, setSearchName] = useState('');
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newForm, setNewForm] = useState({ name: '' });
    const [editForm, setEditForm] = useState({ name: '' });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        dispatch(fetchEducationForms({
            limit: meta.limit,
            page: meta.page,
            nameQuery: searchName,
            sortBy: orderBy,
            sortOrder: order
        }));
    }, [dispatch, meta.limit, meta.page, searchName, orderBy, order]);

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
        dispatch(setPage(newPage + 1)); // MUI pages are 0-based, API is 1-based
    };

    const handleChangeRowsPerPage = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1)); // Reset to first page when changing rows per page
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

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        dispatch(setPage(1)); // Reset to first page when changing sort
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditForm(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewForm({ name: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        dispatch(clearCurrentForm());
    };

    const handleSaveEdit = async () => {
        if (!editForm.name?.trim()) {
            showAlert('Название формы обучения должно быть заполнено!', 'error');
            return;
        }

        try {
            await dispatch(updateEducationForm({
                id: editForm.id,
                formData: { name: editForm.name }
            })).unwrap();

            showAlert('Форма обучения успешно обновлена!', 'success');
            handleCloseModals();
            dispatch(fetchEducationForms({
                limit: meta.limit,
                page: meta.page,
                nameQuery: searchName,
                sortBy: orderBy,
                sortOrder: order
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при обновлении формы обучения', 'error');
        }
    };

    const handleSaveAdd = async () => {
        if (!newForm.name?.trim()) {
            showAlert('Название формы обучения должно быть заполнено!', 'error');
            return;
        }

        try {
            await dispatch(addEducationForm({ name: newForm.name })).unwrap();
            showAlert('Форма обучения успешно добавлена!', 'success');
            handleCloseModals();
            dispatch(setPage(1)); // Reset to first page after adding
            dispatch(fetchEducationForms({
                limit: meta.limit,
                page: 1,
                nameQuery: searchName,
                sortBy: orderBy,
                sortOrder: order
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при добавлении формы обучения', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteEducationForm(currentRow.id)).unwrap();
            showAlert('Форма обучения успешно удалена!', 'success');
            handleCloseModals();
            
            // Check if we need to go to previous page
            if (formsData.length === 1 && meta.page > 1) {
                dispatch(setPage(meta.page - 1));
            } else {
                dispatch(fetchEducationForms({
                    limit: meta.limit,
                    page: meta.page,
                    nameQuery: searchName,
                    sortBy: orderBy,
                    sortOrder: order
                }));
            }
        } catch (error) {
            showAlert(error.message || 'Ошибка при удалении формы обучения', 'error');
        }
    };

    if (isLoading && formsData.length === 0) {
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
                    <Typography variant="h6">Формы обучения</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleSearchMenuClick}>
                            <SearchIcon />
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
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchMenuClose()}
                                autoFocus
                            />
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
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formsData.map(form => (
                            <TableRow key={form.id}>
                                <TableCell>{form.id}</TableCell>
                                <TableCell>{form.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, form)}>
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
                    page={meta.page - 1} // Convert to 0-based for MUI
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
                    Добавить форму обучения
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
                        <Typography variant="h6">Редактировать форму обучения</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название формы обучения*"
                            fullWidth
                            margin="normal"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                        <Typography variant="h6">Удалить форму обучения</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Typography>Вы уверены, что хотите удалить форму обучения "{currentRow?.name}"?</Typography>
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
                        <Typography variant="h6">Добавить новую форму обучения</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название формы обучения*"
                            fullWidth
                            margin="normal"
                            value={newForm.name}
                            onChange={(e) => setNewForm({ name: e.target.value })}
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

export default EducationFormsTable;