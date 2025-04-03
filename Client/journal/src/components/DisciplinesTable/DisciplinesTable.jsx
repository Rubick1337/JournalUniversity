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
    Box,
    Autocomplete
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '../Alert/Alert';
import AddDisciplineModal from './AddDisciplineModal';
import EditDisciplineModal from './EditDisciplineModal';
import DeleteDisciplineModal from './DeleteDisciplineModal';

// Mock данные
const mockDisciplines = [
    { id: 1, name: 'Программирование', department: 'Кафедра информатики' },
    { id: 2, name: 'Математический анализ', department: 'Кафедра математики' },
    { id: 3, name: 'Физика', department: 'Кафедра физики' },
    { id: 4, name: 'Базы данных', department: 'Кафедра информатики' },
    { id: 5, name: 'Экономика', department: 'Кафедра экономики' },
];

const mockDepartments = [
    { id: 1, name: 'Кафедра информатики' },
    { id: 2, name: 'Кафедра математики' },
    { id: 3, name: 'Кафедра физики' },
    { id: 4, name: 'Кафедра экономики' },
];

const DisciplinesTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchName, setSearchName] = useState('');
    const [searchDepartment, setSearchDepartment] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Modal states
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Используем mock данные
    const [disciplinesData, setDisciplinesData] = useState(mockDisciplines);
    const departments = mockDepartments;
    const loading = false;
    const error = null;

    // Обработчики для модальных окон
    const handleSaveAdd = (newDiscipline) => {
        const newId = Math.max(...disciplinesData.map(d => d.id)) + 1;
        setDisciplinesData([...disciplinesData, { ...newDiscipline, id: newId }]);
        showAlert('Дисциплина успешно добавлена!', 'success');
    };

    const handleSaveEdit = (updatedDiscipline) => {
        setDisciplinesData(disciplinesData.map(d =>
            d.id === currentRow.id ? updatedDiscipline : d
        ));
        showAlert('Дисциплина успешно обновлена!', 'success');
    };

    const handleDeleteConfirm = () => {
        setDisciplinesData(disciplinesData.filter(d => d.id !== currentRow.id));
        showAlert('Дисциплина успешно удалена!', 'success');
    };

    const showAlert = (message, severity = 'success') => {
        setAlertState({
            open: true,
            message,
            severity
        });
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    // Обработчики поиска
    const handleSearchNameChange = (event) => setSearchName(event.target.value);

    const handleSearchDepartmentChange = (event, newValue) => {
        setSearchDepartment(newValue || '');
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => setAnchorEl(null);
    const handleSearchMenuClick = (event) => setSearchAnchorEl(event.currentTarget);
    const handleSearchMenuClose = () => setSearchAnchorEl(null);

    const handleEdit = () => {
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => setOpenAddModal(true);

    // Фильтрация данных
    const filteredData = disciplinesData.filter(discipline => {
        const nameMatch = discipline.name.toLowerCase().includes(searchName.toLowerCase());
        const departmentMatch = searchDepartment === '' || discipline.department === searchDepartment;

        return nameMatch && departmentMatch;
    });

    if (loading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка загрузки данных: {error}</div>;

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список дисциплин</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleSearchMenuClick}>
                            <SearchIcon />
                        </IconButton>
                        <Menu
                            anchorEl={searchAnchorEl}
                            open={Boolean(searchAnchorEl)}
                            onClose={handleSearchMenuClose}
                            sx={{ maxWidth: 400 }}
                        >
                            <Box sx={{ p: 2, width: 350 }}>
                                <TextField
                                    label="Поиск по названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchName}
                                    onChange={handleSearchNameChange}
                                />

                                <Autocomplete
                                    options={['', ...departments.map(dept => dept.name)]}
                                    value={searchDepartment}
                                    onChange={handleSearchDepartmentChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Кафедра"
                                            margin="normal"
                                            fullWidth
                                            size="small"
                                        />
                                    )}
                                    freeSolo
                                    clearOnBlur
                                    selectOnFocus
                                    handleHomeEndKeys
                                    renderOption={(props, option) => (
                                        <MenuItem {...props}>
                                            {option === '' ? 'Все кафедры' : option}
                                        </MenuItem>
                                    )}
                                    getOptionLabel={(option) => option === '' ? 'Все кафедры' : option}
                                />
                            </Box>
                        </Menu>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название дисциплины</TableCell>
                            <TableCell>Кафедра</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(discipline => (
                            <TableRow key={discipline.id}>
                                <TableCell>{discipline.name}</TableCell>
                                <TableCell>{discipline.department}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, discipline)}>
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
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton onClick={handleAdd} color="primary">
                        <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </TableContainer>

            {/* Модальные окна */}
            <AddDisciplineModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                departments={departments}
                onSave={handleSaveAdd}
                showAlert={showAlert}
            />

            <EditDisciplineModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                discipline={currentRow}
                departments={departments}
                onSave={handleSaveEdit}
                showAlert={showAlert}
            />

            <DeleteDisciplineModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                discipline={currentRow}
                onDelete={handleDeleteConfirm}
            />

            <Alert
                open={alertState.open}
                message={alertState.message}
                severity={alertState.severity}
                handleClose={handleCloseAlert}
            />
        </>
    );
};

export default DisciplinesTable;