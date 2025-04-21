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
    FormControl,
    InputLabel,
    Select,
    Autocomplete,
    Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import Alert from '../Alert/Alert';
import AddTeacherModal from './AddTeacherModal';
import EditTeacherModal from './EditTeacherModal';
import DeleteTeacherModal from './DeleteTeacherModal';
import {PersonModal} from '../PersonCreationModal/PersonCreationModal';

// Mock данные
const mockTeachers = [
    { id: 1, name: 'Иванов Иван Иванович', department: 'Кафедра информатики', position: 'Доцент' },
    { id: 2, name: 'Петров Петр Петрович', department: 'Кафедра математики', position: 'Профессор' },
    { id: 3, name: 'Сидорова Анна Михайловна', department: 'Кафедра физики', position: 'Старший преподаватель' },
    { id: 4, name: 'Кузнецов Дмитрий Сергеевич', department: 'Кафедра информатики', position: 'Ассистент' },
    { id: 5, name: 'Смирнова Елена Владимировна', department: 'Кафедра экономики', position: 'Доцент' },
];

const mockDepartments = [
    { id: 1, name: 'Кафедра информатики' },
    { id: 2, name: 'Кафедра математики' },
    { id: 3, name: 'Кафедра физики' },
    { id: 4, name: 'Кафедра экономики' },
];

const mockPositions = [
    { id: 1, name: 'Профессор' },
    { id: 2, name: 'Доцент' },
    { id: 3, name: 'Старший преподаватель' },
    { id: 4, name: 'Ассистент' },
];

// Mock данные для людей
const mockPeople = [
    { id: 1, fullName: 'Иванов Иван Иванович', lastName: 'Иванов', firstName: 'Иван', patronymic: 'Иванович' },
    { id: 2, fullName: 'Петров Петр Петрович', lastName: 'Петров', firstName: 'Петр', patronymic: 'Петрович' },
    { id: 3, fullName: 'Сидорова Анна Михайловна', lastName: 'Сидорова', firstName: 'Анна', patronymic: 'Михайловна' },
    { id: 4, fullName: 'Кузнецов Дмитрий Сергеевич', lastName: 'Кузнецов', firstName: 'Дмитрий', patronymic: 'Сергеевич' },
    { id: 5, fullName: 'Смирнова Елена Владимировна', lastName: 'Смирнова', firstName: 'Елена', patronymic: 'Владимировна' },
];

const TeachersTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchName, setSearchName] = useState('');
    const [searchDepartment, setSearchDepartment] = useState('');
    const [searchPosition, setSearchPosition] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [personInputValue, setPersonInputValue] = useState('');

    // Modal states
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Используем mock данные
    const [teachersData, setTeachersData] = useState(mockTeachers);
    const [people, setPeople] = useState(mockPeople);
    const departments = mockDepartments;
    const positions = mockPositions;
    const loading = false;
    const error = null;

    // Обработчики для модальных окон
    const handleSaveAdd = (newTeacher) => {
        const newId = Math.max(...teachersData.map(teacher => teacher.id)) + 1;
        setTeachersData([...teachersData, { ...newTeacher, id: newId }]);
        showAlert('Преподаватель успешно добавлен!', 'success');
    };

    const handleSaveEdit = (updatedTeacher) => {
        setTeachersData(teachersData.map(teacher =>
            teacher.id === currentRow.id ? updatedTeacher : teacher
        ));
        showAlert('Преподаватель успешно обновлен!', 'success');
    };

    const handleDeleteConfirm = () => {
        setTeachersData(teachersData.filter(teacher => teacher.id !== currentRow.id));
        showAlert('Преподаватель успешно удален!', 'success');
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

    const handleSearchPositionChange = (event, newValue) => {
        setSearchPosition(newValue || '');
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

    const handlePersonInputChange = (_, value) => {
        setPersonInputValue(value);
    };

    const handleAddNewPerson = (newPerson, error) => {
        if (error) {
            showAlert(error, 'error');
            return;
        }

        const fullName = `${newPerson.lastName} ${newPerson.firstName} ${newPerson.patronymic || ''}`.trim();
        const newPersonWithId = {
            ...newPerson,
            id: `new-${Date.now()}`,
            fullName: fullName
        };

        setPeople(prev => [...prev, newPersonWithId]);
        showAlert('Человек успешно добавлен!', 'success');
        setOpenPersonModal(false);
    };

    // Фильтрация данных
    const filteredData = teachersData.filter(teacher => {
        const nameMatch = teacher.name.toLowerCase().includes(searchName.toLowerCase());
        const departmentMatch = searchDepartment === '' || teacher.department === searchDepartment;
        const positionMatch = searchPosition === '' || teacher.position === searchPosition;

        return nameMatch && departmentMatch && positionMatch;
    });

    if (loading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка загрузки данных: {error}</div>;

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список преподавателей</Typography>
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
                                    label="Поиск по ФИО"
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

                                <Autocomplete
                                    options={['', ...positions.map(pos => pos.name)]}
                                    value={searchPosition}
                                    onChange={handleSearchPositionChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Должность"
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
                                            {option === '' ? 'Все должности' : option}
                                        </MenuItem>
                                    )}
                                    getOptionLabel={(option) => option === '' ? 'Все должности' : option}
                                />
                            </Box>
                        </Menu>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Кафедра</TableCell>
                            <TableCell>Должность</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(teacher => (
                            <TableRow key={teacher.id}>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>{teacher.department}</TableCell>
                                <TableCell>{teacher.position}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, teacher)}>
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
            <AddTeacherModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                departments={departments}
                positions={positions}
                onSave={handleSaveAdd}
                showAlert={showAlert}
                people={people}
                personInputValue={personInputValue}
                onPersonInputChange={handlePersonInputChange}
                onAddPersonClick={() => setOpenPersonModal(true)}
            />

            <EditTeacherModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                teacher={currentRow}
                departments={departments}
                positions={positions}
                onSave={handleSaveEdit}
                showAlert={showAlert}
                people={people}
                personInputValue={personInputValue}
                onPersonInputChange={handlePersonInputChange}
                onAddPersonClick={() => setOpenPersonModal(true)}
            />

            <DeleteTeacherModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                teacher={currentRow}
                onDelete={handleDeleteConfirm}
            />

            <PersonModal
                open={openPersonModal}
                onClose={() => setOpenPersonModal(false)}
                onSave={handleAddNewPerson}
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

export default TeachersTable;