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
    fetchAcademicBuildings,
    createAcademicBuilding,
    updateAcademicBuilding,
    deleteAcademicBuilding,
    clearErrors,
    clearCurrentBuilding,
    setPage,
    setLimit,
    setSearchParams
} from '../../store/slices/academicBuildingSlice';

const AcademicBuildingMain = () => {
    const dispatch = useDispatch();
    const {
        data: buildingsData,
        isLoading,
        errors,
        currentBuilding,
        meta,
        searchParams
    } = useSelector(state => state.academicBuildings);

    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newBuilding, setNewBuilding] = useState({ name: '', address: '' });
    const [editBuilding, setEditBuilding] = useState({ name: '', address: '' });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');

    useEffect(() => {
        dispatch(fetchAcademicBuildings({
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

    const handleSearchAddressChange = (event) => {
        setSearchAddress(event.target.value);
    };

    const handleSearch = () => {
        dispatch(setSearchParams({ 
            nameQuery: searchName,
            addressQuery: searchAddress 
        }));
        handleSearchMenuClose();
    };

    const handleResetSearch = () => {
        setSearchName('');
        setSearchAddress('');
        dispatch(setSearchParams({ 
            nameQuery: '',
            addressQuery: '' 
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
        setEditBuilding(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewBuilding({ name: '', address: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        dispatch(clearCurrentBuilding());
    };

    const handleSaveEdit = async () => {
        if (!editBuilding.name?.trim()) {
            showAlert('Название корпуса должно быть заполнено!', 'error');
            return;
        }
        if (!editBuilding.address?.trim()) {
            showAlert('Адрес корпуса должен быть заполнен!', 'error');
            return;
        }

        try {
            await dispatch(updateAcademicBuilding({
                id: editBuilding.id,
                buildingData: { 
                    name: editBuilding.name,
                    address: editBuilding.address
                }
            })).unwrap();

            showAlert('Корпус успешно обновлен!', 'success');
            handleCloseModals();
            dispatch(fetchAcademicBuildings({
                limit: meta.limit,
                page: meta.page,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при обновлении корпуса', 'error');
        }
    };

    const handleSaveAdd = async () => {
        if (!newBuilding.name?.trim()) {
            showAlert('Название корпуса должно быть заполнено!', 'error');
            return;
        }
        if (!newBuilding.address?.trim()) {
            showAlert('Адрес корпуса должен быть заполнен!', 'error');
            return;
        }

        try {
            await dispatch(createAcademicBuilding({ 
                name: newBuilding.name,
                address: newBuilding.address
            })).unwrap();
            showAlert('Корпус успешно добавлен!', 'success');
            handleCloseModals();
            dispatch(setPage(1));
            dispatch(fetchAcademicBuildings({
                limit: meta.limit,
                page: 1,
                sortBy: orderBy,
                sortOrder: order,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при добавлении корпуса', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteAcademicBuilding(currentRow.id)).unwrap();
            showAlert('Корпус успешно удален!', 'success');
            handleCloseModals();

            if (buildingsData.length === 1 && meta.page > 1) {
                dispatch(setPage(meta.page - 1));
            } else {
                dispatch(fetchAcademicBuildings({
                    limit: meta.limit,
                    page: meta.page,
                    sortBy: orderBy,
                    sortOrder: order,
                    ...searchParams
                }));
            }
        } catch (error) {
            showAlert(error.message || 'Ошибка при удалении корпуса', 'error');
        }
    };

    if (isLoading && buildingsData.length === 0) {
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
                    <Typography variant="h6">Учебные корпуса</Typography>
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
                                label="Поиск по адресу"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchAddress}
                                onChange={handleSearchAddressChange}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleResetSearch}
                                    disabled={!searchName && !searchAddress}
                                >
                                    Сбросить
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    disabled={!searchName && !searchAddress}
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
                                    active={orderBy === 'address'}
                                    direction={orderBy === 'address' ? order : 'asc'}
                                    onClick={() => handleSortRequest('address')}
                                >
                                    Адрес
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buildingsData.map(building => (
                            <TableRow key={building.id}>
                                <TableCell>{building.id}</TableCell>
                                <TableCell>{building.name}</TableCell>
                                <TableCell>{building.address}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, building)}>
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
                    Добавить корпус
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
                        <Typography variant="h6">Редактировать корпус</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название корпуса*"
                            fullWidth
                            margin="normal"
                            value={editBuilding.name}
                            onChange={(e) => setEditBuilding({ ...editBuilding, name: e.target.value })}
                        />
                        <TextField
                            label="Адрес корпуса*"
                            fullWidth
                            margin="normal"
                            value={editBuilding.address}
                            onChange={(e) => setEditBuilding({ ...editBuilding, address: e.target.value })}
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
                        <Typography variant="h6">Удалить корпус</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Typography>Вы уверены, что хотите удалить корпус "{currentRow?.name}"?</Typography>
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
                        <Typography variant="h6">Добавить новый корпус</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название корпуса*"
                            fullWidth
                            margin="normal"
                            value={newBuilding.name}
                            onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                        />
                        <TextField
                            label="Адрес корпуса*"
                            fullWidth
                            margin="normal"
                            value={newBuilding.address}
                            onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
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

export default AcademicBuildingMain;