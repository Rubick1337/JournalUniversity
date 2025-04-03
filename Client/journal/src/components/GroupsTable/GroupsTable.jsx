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
import AddGroupModal from './AddGroupModal';
import EditGroupModal from './EditGroupModal';
import DeleteGroupModal from './DeleteGroupModal';

// Mock данные
const mockGroups = [
    {
        id: 1,
        name: 'ИВТ-20-1',
        startYear: 2020,
        endYear: 2024,
        faculty: 'Факультет информатики',
        department: 'Кафедра программирования',
        specialityCode: '09.03.01',
        headmanId: 101
    },
    {
        id: 2,
        name: 'МАТ-19-2',
        startYear: 2019,
        endYear: 2023,
        faculty: 'Факультет математики',
        department: 'Кафедра прикладной математики',
        specialityCode: '01.03.02',
        headmanId: 102
    },
];

const mockFaculties = [
    { id: 1, name: 'Факультет информатики' },
    { id: 2, name: 'Факультет математики' },
    { id: 3, name: 'Факультет физики' },
];

const mockDepartments = [
    { id: 1, name: 'Кафедра программирования' },
    { id: 2, name: 'Кафедра прикладной математики' },
    { id: 3, name: 'Кафедра теоретической физики' },
];

const mockSpecialities = [
    { id: 1, code: '09.03.01', name: 'Информатика и вычислительная техника' },
    { id: 2, code: '01.03.02', name: 'Прикладная математика и информатика' },
    { id: 3, code: '03.03.02', name: 'Физика' },
];

const mockStudents = [
    { id: 101, name: 'Иванов Иван Иванович' },
    { id: 102, name: 'Петров Петр Петрович' },
];

const GroupsTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchName, setSearchName] = useState('');
    const [searchFaculty, setSearchFaculty] = useState('');
    const [searchDepartment, setSearchDepartment] = useState('');
    const [searchSpeciality, setSearchSpeciality] = useState('');
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
    const [groupsData, setGroupsData] = useState(mockGroups);
    const faculties = mockFaculties;
    const departments = mockDepartments;
    const specialities = mockSpecialities;
    const students = mockStudents;
    const loading = false;
    const error = null;

    // Обработчики для модальных окон
    const handleSaveAdd = (newGroup) => {
        const newId = Math.max(...groupsData.map(g => g.id)) + 1;
        setGroupsData([...groupsData, { ...newGroup, id: newId }]);
        showAlert('Группа успешно добавлена!', 'success');
    };

    const handleSaveEdit = (updatedGroup) => {
        setGroupsData(groupsData.map(g =>
            g.id === currentRow.id ? updatedGroup : g
        ));
        showAlert('Группа успешно обновлена!', 'success');
    };

    const handleDeleteConfirm = () => {
        setGroupsData(groupsData.filter(g => g.id !== currentRow.id));
        showAlert('Группа успешно удалена!', 'success');
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
    const handleSearchFacultyChange = (event, newValue) => setSearchFaculty(newValue || '');
    const handleSearchDepartmentChange = (event, newValue) => setSearchDepartment(newValue || '');
    const handleSearchSpecialityChange = (event, newValue) => setSearchSpeciality(newValue || '');

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
    const filteredData = groupsData.filter(group => {
        const nameMatch = group.name.toLowerCase().includes(searchName.toLowerCase());
        const facultyMatch = searchFaculty === '' || group.faculty === searchFaculty;
        const departmentMatch = searchDepartment === '' || group.department === searchDepartment;
        const specialityMatch = searchSpeciality === '' || group.specialityCode === searchSpeciality;

        return nameMatch && facultyMatch && departmentMatch && specialityMatch;
    });

    if (loading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка загрузки данных: {error}</div>;

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список групп</Typography>
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
                                    label="Поиск по названию группы"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchName}
                                    onChange={handleSearchNameChange}
                                />

                                <Autocomplete
                                    options={['', ...faculties.map(f => f.name)]}
                                    value={searchFaculty}
                                    onChange={handleSearchFacultyChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Факультет"
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
                                            {option === '' ? 'Все факультеты' : option}
                                        </MenuItem>
                                    )}
                                    getOptionLabel={(option) => option === '' ? 'Все факультеты' : option}
                                />

                                <Autocomplete
                                    options={['', ...departments.map(d => d.name)]}
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
                                    options={['', ...specialities.map(s => s.code)]}
                                    value={searchSpeciality}
                                    onChange={handleSearchSpecialityChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Код специальности"
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
                                            {option === '' ? 'Все специальности' : option}
                                        </MenuItem>
                                    )}
                                    getOptionLabel={(option) => option === '' ? 'Все специальности' : option}
                                />
                            </Box>
                        </Menu>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Год начала</TableCell>
                            <TableCell>Год окончания</TableCell>
                            <TableCell>Факультет</TableCell>
                            <TableCell>Кафедра</TableCell>
                            <TableCell>Код специальности</TableCell>
                            <TableCell>Староста</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(group => {
                            const headman = students.find(s => s.id === group.headmanId);
                            return (
                                <TableRow key={group.id}>
                                    <TableCell>{group.name}</TableCell>
                                    <TableCell>{group.startYear}</TableCell>
                                    <TableCell>{group.endYear}</TableCell>
                                    <TableCell>{group.faculty}</TableCell>
                                    <TableCell>{group.department}</TableCell>
                                    <TableCell>{group.specialityCode}</TableCell>
                                    <TableCell>{headman?.name || 'Не назначен'}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(e) => handleMenuClick(e, group)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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
            <AddGroupModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                faculties={faculties}
                departments={departments}
                specialities={specialities}
                students={students}
                onSave={handleSaveAdd}
                showAlert={showAlert}
            />

            <EditGroupModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                group={currentRow}
                faculties={faculties}
                departments={departments}
                specialities={specialities}
                students={students}
                onSave={handleSaveEdit}
                showAlert={showAlert}
            />

            <DeleteGroupModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                group={currentRow}
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

export default GroupsTable;