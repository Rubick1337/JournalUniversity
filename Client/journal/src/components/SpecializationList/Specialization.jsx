import React, { useState } from 'react';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '../Alert/Alert';

const initialData = [
    { id: "09.03.01", name: "Информатика и вычислительная техника" },
    { id: "09.03.02", name: "Информационные системы и технологии" },
    { id: "09.03.03", name: "Прикладная информатика" },
    { id: "09.03.04", name: "Программная инженерия" },
    { id: "09.03.05", name: "Информационная безопасность" },
];

const SpecializationListTable = () => {
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newSpecialty, setNewSpecialty] = useState({ id: '', name: '' });
    const [editSpecialty, setEditSpecialty] = useState({ id: '', name: '' });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const showAlert = (message, severity) => {
        setAlertState({
            open: true,
            message,
            severity,
        });
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditSpecialty(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewSpecialty({ id: '', name: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
    };

    const handleSaveEdit = () => {
        if (!editSpecialty.id || !editSpecialty.name) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }

        setData(data.map(item => item.id === currentRow.id ? editSpecialty : item));
        showAlert('Специальность успешно изменена!', 'success');
        handleCloseModals();
    };

    const handleSaveAdd = () => {
        if (!newSpecialty.id || !newSpecialty.name) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }

        setData([...data, newSpecialty]);
        showAlert('Специальность успешно добавлена!', 'success');
        handleCloseModals();
    };

    const handleDeleteConfirm = () => {
        setData(data.filter(item => item.id !== currentRow.id));
        showAlert('Специальность успешно удалена!', 'success');
        handleCloseModals();
    };

    const filteredData = data.filter(row =>
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список специальностей</Typography>
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        size="small"
                        sx={{ width: 300 }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер специальности</TableCell>
                            <TableCell>Расшифровка специальности</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, row)}>
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
                                {openEditModal && "Редактировать запись"}
                                {openDeleteModal && "Удалить запись"}
                                {openAddModal && "Добавить новую запись"}
                            </Typography>
                            <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            {openEditModal && (
                                <div>
                                    <TextField
                                        label="Номер специальности"
                                        fullWidth
                                        margin="normal"
                                        value={editSpecialty.id}
                                        onChange={(e) => setEditSpecialty({ ...editSpecialty, id: e.target.value })}
                                    />
                                    <TextField
                                        label="Расшифровка специальности"
                                        fullWidth
                                        margin="normal"
                                        value={editSpecialty.name}
                                        onChange={(e) => setEditSpecialty({ ...editSpecialty, name: e.target.value })}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button onClick={handleSaveEdit} color="primary">Сохранить</Button>
                                    </Box>
                                </div>
                            )}
                            {openDeleteModal && (
                                <div>
                                    <Typography>Вы уверены, что хотите удалить запись {currentRow?.id}?</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
                                    </Box>
                                </div>
                            )}
                            {openAddModal && (
                                <div>
                                    <TextField
                                        label="Номер специальности"
                                        fullWidth
                                        margin="normal"
                                        value={newSpecialty.id}
                                        onChange={(e) => setNewSpecialty({ ...newSpecialty, id: e.target.value })}
                                    />
                                    <TextField
                                        label="Расшифровка специальности"
                                        fullWidth
                                        margin="normal"
                                        value={newSpecialty.name}
                                        onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button onClick={handleSaveAdd} color="primary">Добавить</Button>
                                    </Box>
                                </div>
                            )}
                        </Box>
                    </Box>
                </Modal>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton onClick={handleAdd} color="primary">
                        <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </TableContainer>

            <Alert
                open={alertState.open}
                message={alertState.message}
                severity={alertState.severity}
                handleClose={handleCloseAlert}
            />
        </>
    );
};

export default SpecializationListTable;