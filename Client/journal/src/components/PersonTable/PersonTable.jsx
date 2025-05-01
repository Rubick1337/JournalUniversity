import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
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
    Box,
    Button,
    TableSortLabel,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import {
    fetchPersons,
    createPerson,
    updatePerson,
    deletePerson,
    clearPersonErrors,
    setPersonPage,
    setPersonLimit,
    setPersonSearchParams
} from '../../store/slices/personSlice';
import Alert from '../Alert/Alert';
import './PersonsTable.css';

const PersonsTable = () => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [orderBy, setOrderBy] = useState('surname');
    const [order, setOrder] = useState('asc');
    const [rowsMounted, setRowsMounted] = useState(false);
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        middlename: '',
        phoneNumber: '',
        email: ''
    });
    const [searchValues, setSearchValues] = useState({
        surnameQuery: '',
        nameQuery: '',
        middlenameQuery: '',
        phoneNumberQuery: '',
        emailQuery: ''
    });

    // Селекторы с shallowEqual для оптимизации
    const { data, isLoading, errors, meta } = useSelector(state => ({
        data: state.person?.data || [],
        isLoading: state.person?.isLoading || false,
        errors: state.person?.errors || [],
        meta: state.person?.meta || { page: 1, limit: 10, total: 0 }
    }), shallowEqual);

    const searchParams = useSelector(state => state.person?.searchParams || {}, shallowEqual);

    // Загрузка данных
    useEffect(() => {
        const params = {
            limit: meta.limit,
            page: meta.page,
            sortBy: orderBy,
            sortOrder: order,
            surnameQuery: searchParams.surnameQuery || '',
            nameQuery: searchParams.nameQuery || '',
            middlenameQuery: searchParams.middlenameQuery || '',
            phoneNumberQuery: searchParams.phoneNumberQuery || '',
            emailQuery: searchParams.emailQuery || ''
        };
        dispatch(fetchPersons(params));
    }, [
        dispatch,
        meta.limit,
        meta.page,
        orderBy,
        order,
        searchParams.surnameQuery,
        searchParams.nameQuery,
        searchParams.middlenameQuery,
        searchParams.phoneNumberQuery,
        searchParams.emailQuery
    ]);

    // Эффекты для анимации и обработки ошибок
    useEffect(() => {
        if (data.length > 0 && !rowsMounted) {
            setTimeout(() => setRowsMounted(true), 100);
        }
    }, [data, rowsMounted]);

    useEffect(() => {
        if (errors.length > 0) {
            setAlertState({
                open: true,
                message: errors[0].message || 'Произошла ошибка',
                severity: 'error'
            });
            dispatch(clearPersonErrors());
        }
    }, [errors, dispatch]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                if (openAddModal) {
                    handleCreate();
                } else if (openEditModal) {
                    handleUpdate();
                } else if (openDeleteModal) {
                    handleDeleteConfirm();
                }
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openAddModal, openEditModal, openDeleteModal, formData, currentRow]);
    // CRUD методы
    const handleCreate = async () => {
        try {
            const createData = {
                surname: formData.surname,
                name: formData.name,
                middlename: formData.middlename || null,
                phone_number: formData.phoneNumber || null,
                email: formData.email
            };

            await dispatch(createPerson(createData)).unwrap();
            showAlert('Человек успешно добавлен!', 'success');
            handleCloseAddModal();

            // Обновляем данные после успешного добавления
            dispatch(fetchPersons({
                limit: meta.limit,
                page: meta.page,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));

        } catch (error) {
            showAlert(error.message || 'Ошибка при добавлении', 'error');
        }
    };

    const handleUpdate = async () => {
        if (!currentRow?.id) return;

        try {
            const updateData = {
                surname: formData.surname,
                name: formData.name,
                middlename: formData.middlename || null,
                phone_number: formData.phoneNumber || null,
                email: formData.email
            };

            await dispatch(updatePerson({
                id: currentRow.id,
                personData: updateData
            })).unwrap();

            showAlert('Данные успешно обновлены!', 'success');
            handleCloseEditModal();

            // Обновляем данные после успешного обновления
            dispatch(fetchPersons({
                limit: meta.limit,
                page: meta.page,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));

        } catch (error) {
            console.error('Ошибка при обновлении:', error);
            showAlert(error.message || 'Ошибка при обновлении', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!currentRow?.id) return;

        try {
            await dispatch(deletePerson(currentRow.id)).unwrap();
            showAlert('Человек успешно удален!', 'success');
            handleCloseDeleteModal();
        } catch (error) {
            showAlert(error.message || 'Ошибка при удалении', 'error');
        }
    };

    // Обработчики модальных окон
    const handleOpenEditModal = (row) => {
        setCurrentRow(row);
        setFormData({
            surname: row.surname,
            name: row.name,
            middlename: row.middlename || '',
            phoneNumber: row.phoneNumber || '',
            email: row.email || ''
        });
        setOpenEditModal(true);
        setAnchorEl(null);
    };

    const handleOpenDeleteModal = (row) => {
        setCurrentRow(row);
        setOpenDeleteModal(true);
        setAnchorEl(null);
    };

    const handleOpenAddModal = () => {
        setFormData({
            surname: '',
            name: '',
            middlename: '',
            phoneNumber: '',
            email: ''
        });
        setOpenAddModal(true);
    };
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setCurrentRow(null);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setCurrentRow(null);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Вспомогательные функции
    const showAlert = (message, severity = 'success') => {
        setAlertState({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Обработчики поиска и сортировки
    const handleSearchChange = (field) => (e) => {
        setSearchValues(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSearch = () => {
        console.log("Параметры поиска:", searchValues);
        dispatch(setPersonSearchParams(searchValues));
        setSearchAnchorEl(null);
        setRowsMounted(false);
    };

    const handleResetSearch = () => {
        setSearchValues({
            surnameQuery: '',
            nameQuery: '',
            middlenameQuery: '',
            phoneNumberQuery: '',
            emailQuery: ''
        });
        dispatch(setPersonSearchParams({
            surnameQuery: '',
            nameQuery: '',
            middlenameQuery: '',
            phoneNumberQuery: '',
            emailQuery: ''
        }));
        setSearchAnchorEl(null);
        setOrderBy('surname');
        setOrder('asc');
        setRowsMounted(false);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const renderSortableHeader = (property, label) => (
        <TableCell>
            <TableSortLabel
                active={orderBy === property}
                direction={orderBy === property ? order : 'asc'}
                onClick={() => handleSort(property)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );

    const handleSearchMenuClick = (event) => {
        setSearchAnchorEl(event.currentTarget);
    };

    const handleSearchMenuClose = () => {
        setSearchAnchorEl(null);
    };

    const handlePageChange = (_, newPage) => {
        dispatch(setPersonPage(newPage + 1));
        setRowsMounted(false);
    };

    const handleRowsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setPersonLimit(newLimit));
        dispatch(setPersonPage(1));
        setRowsMounted(false);
    };

    if (isLoading) {
        return <div>Загрузка данных...</div>;
    }

    if (errors.length > 0) {
        return (
            <div>
                Ошибка загрузки данных:
                <ul>
                    {errors.map((err, index) => (
                        <li key={index}>{err.message || err.toString()}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список людей</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleSearchMenuClick} className="action-button">
                            <SearchIcon />
                        </IconButton>
                        <IconButton onClick={handleResetSearch} className="action-button">
                            <RefreshIcon />
                        </IconButton>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddModal}
                            className="action-button"
                        >
                            Добавить
                        </Button>
                        <Menu
                            anchorEl={searchAnchorEl}
                            open={Boolean(searchAnchorEl)}
                            onClose={handleSearchMenuClose}
                            sx={{ maxWidth: 320 }}
                        >
                            <Box sx={{ p: 2, width: 280 }}>
                                <TextField
                                    label="Поиск по фамилии"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.surnameQuery}
                                    onChange={handleSearchChange('surnameQuery')}
                                />
                                <TextField
                                    label="Поиск по имени"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.nameQuery}
                                    onChange={handleSearchChange('nameQuery')}
                                />
                                <TextField
                                    label="Поиск по отчеству"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.middlenameQuery}
                                    onChange={handleSearchChange('middlenameQuery')}
                                />
                                <TextField
                                    label="Поиск по телефону"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.phoneNumberQuery}
                                    onChange={handleSearchChange('phoneNumberQuery')}
                                />
                                <TextField
                                    label="Поиск по email"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.emailQuery}
                                    onChange={handleSearchChange('emailQuery')}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={handleResetSearch}
                                        disabled={!searchValues.surnameQuery && !searchValues.nameQuery &&
                                            !searchValues.middlenameQuery && !searchValues.phoneNumberQuery &&
                                            !searchValues.emailQuery}
                                        className="action-button"
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={handleSearch}
                                        className="action-button"
                                    >
                                        Поиск
                                    </Button>
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            {renderSortableHeader('surname', 'Фамилия')}
                            {renderSortableHeader('name', 'Имя')}
                            {renderSortableHeader('middlename', 'Отчество')}
                            <TableCell>Телефон</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((person, index) => (
                            <TableRow
                                key={person.id}
                                className={`table-row ${rowsMounted ? 'show' : ''}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <TableCell>{person.surname}</TableCell>
                                <TableCell>{person.name}</TableCell>
                                <TableCell>{person.middlename || '-'}</TableCell>
                                <TableCell>{person.phone_number || '-'}</TableCell>
                                <TableCell>{person.email || '-'}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={(e) => handleMenuClick(e, person)}
                                        className="action-button"
                                    >
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
                    count={meta.total}
                    rowsPerPage={meta.limit}
                    page={meta.page - 1}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    labelRowsPerPage="Строк на странице:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                    }
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => handleOpenEditModal(currentRow)}>
                        Редактировать
                    </MenuItem>
                    <MenuItem onClick={() => handleOpenDeleteModal(currentRow)}>
                        Удалить
                    </MenuItem>
                </Menu>
            </TableContainer>

            {/* Модальное окно добавления */}
            <Dialog open={openAddModal} onClose={handleCloseAddModal}>
                <DialogTitle>Добавить нового человека</DialogTitle>
                <DialogContent onKeyPress={(e) => e.key === 'Enter' && handleCreate()}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="surname"
                        label="Фамилия"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.surname}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="name"
                        label="Имя"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.name}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="middlename"
                        label="Отчество"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.middlename}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="phoneNumber"
                        label="Телефон"
                        type="tel"
                        fullWidth
                        variant="standard"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddModal}>Отмена</Button>
                    <Button onClick={handleCreate}>Добавить</Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={openEditModal} onClose={handleCloseEditModal}>
                <DialogTitle>Редактировать данные</DialogTitle>
                <DialogContent onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="surname"
                        label="Фамилия"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.surname}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="name"
                        label="Имя"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.name}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="middlename"
                        label="Отчество"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.middlename}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="phoneNumber"
                        label="Телефон"
                        type="tel"
                        fullWidth
                        variant="standard"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal}>Отмена</Button>
                    <Button onClick={handleUpdate}>Сохранить</Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно удаления */}
            <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent onKeyPress={(e) => e.key === 'Enter' && handleDeleteConfirm()}>
                    <DialogContentText>
                        Вы уверены, что хотите удалить {currentRow?.surname} {currentRow?.name} {currentRow?.middlename}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal}>Отмена</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
                </DialogActions>
            </Dialog>

            {/* Компонент Alert для уведомлений */}
            <div className="alert-container">
                <div className={`alert-slide ${alertState.open ? 'active' : ''}`}>
                    <Alert
                        open={alertState.open}
                        message={alertState.message}
                        severity={alertState.severity}
                        onClose={handleCloseAlert}
                    />
                </div>
            </div>
        </>
    );
};

export default PersonsTable;