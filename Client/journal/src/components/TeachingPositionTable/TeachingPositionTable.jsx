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
    CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    fetchTeacherPositions,
    addTeacherPosition,
    updateTeacherPosition,
    deleteTeacherPosition,
    clearErrors,
    clearCurrentPosition
} from '../../store/slices/teacherPositionSlice';

const TeacherPositionsTable = () => {
    const dispatch = useDispatch();
    const {
        data: positionsData,
        isLoading,
        errors,
        currentPosition
    } = useSelector(state => state.teacherPositions);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchName, setSearchName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newPosition, setNewPosition] = useState({ name: '' });
    const [editPosition, setEditPosition] = useState({ name: '' });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        dispatch(fetchTeacherPositions());
    }, [dispatch]);

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

    const handleSearchNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchMenuClick = (event) => {
        setSearchAnchorEl(event.currentTarget);
    };

    const handleSearchMenuClose = () => {
        setSearchAnchorEl(null);
    };

    const handleEdit = () => {
        setEditPosition(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewPosition({ name: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        dispatch(clearCurrentPosition());
    };

    const handleSaveEdit = async () => {
        if (!editPosition.name) {
            showAlert('Название должности должно быть заполнено!', 'error');
            return;
        }

        try {
            await dispatch(updateTeacherPosition({
                id: editPosition.id,
                positionData: { name: editPosition.name }
            })).unwrap();

            await dispatch(fetchTeacherPositions());

            showAlert('Должность успешно обновлена!', 'success');
            handleCloseModals();
        } catch (error) {
            showAlert(error.message || 'Ошибка при обновлении', 'error');
        }
    };

    const handleSaveAdd = async () => {
        if (!newPosition.name) {
            showAlert('Название должности должно быть заполнено!', 'error');
            return;
        }

        try {
            await dispatch(addTeacherPosition({ name: newPosition.name })).unwrap();

            await dispatch(fetchTeacherPositions());

            showAlert('Должность успешно добавлена!', 'success');
            handleCloseModals();
        } catch (error) {
            showAlert(error.message || 'Ошибка при добавлении', 'error');
        }
    };


    const handleDeleteConfirm = () => {
        dispatch(deleteTeacherPosition(currentRow.id))
            .then(() => {
                showAlert('Должность успешно удалена!', 'success');
                handleCloseModals();
            });
    };

    const filteredData = (positionsData || []).filter(position => {
        const positionName = position?.name || '';
        return positionName.toLowerCase().includes(searchName.toLowerCase());
    });

    if (isLoading && positionsData.length === 0) {
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
                    <Typography variant="h6">Должности учителей</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleSearchMenuClick}>
                            <SearchIcon />
                        </IconButton>
                        <Menu
                            anchorEl={searchAnchorEl}
                            open={Boolean(searchAnchorEl)}
                            onClose={handleSearchMenuClose}
                        >
                            <Box sx={{ p: 2, width: 300 }}>
                                <TextField
                                    label="Поиск по названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={searchName}
                                    onChange={handleSearchNameChange}
                                />
                            </Box>
                        </Menu>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Наименование</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(position => (
                            <TableRow key={position.id}>
                                <TableCell>{position.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, position)}>
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
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
                    <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                </Menu>
                <Modal open={openEditModal || openDeleteModal || openAddModal} onClose={handleCloseModals}>
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
                            <Typography variant="h6">
                                {openEditModal && "Редактировать должность"}
                                {openDeleteModal && "Удалить должность"}
                                {openAddModal && "Добавить новую должность"}
                            </Typography>
                            <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            {openEditModal && (
                                <div>
                                    <TextField
                                        label="Название должности*"
                                        fullWidth
                                        margin="normal"
                                        value={editPosition.name}
                                        onChange={(e) => setEditPosition({ ...editPosition, name: e.target.value })}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button
                                            onClick={handleSaveEdit}
                                            color="primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <CircularProgress size={24} /> : 'Сохранить'}
                                        </Button>
                                    </Box>
                                </div>
                            )}
                            {openDeleteModal && (
                                <div>
                                    <Typography>Вы уверены, что хотите удалить должность "{currentRow?.name}"?</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button
                                            onClick={handleDeleteConfirm}
                                            color="error"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <CircularProgress size={24} /> : 'Удалить'}
                                        </Button>
                                    </Box>
                                </div>
                            )}
                            {openAddModal && (
                                <div>
                                    <TextField
                                        label="Название должности*"
                                        fullWidth
                                        margin="normal"
                                        value={newPosition.name}
                                        onChange={(e) => setNewPosition({ name: e.target.value })}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button
                                            onClick={handleSaveAdd}
                                            color="primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <CircularProgress size={24} /> : 'Добавить'}
                                        </Button>
                                    </Box>
                                </div>
                            )}
                        </Box>
                    </Box>
                </Modal>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={isLoading}
                >
                    Добавить должность
                </Button>
            </Box>

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

export default TeacherPositionsTable;