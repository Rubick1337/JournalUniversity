import React, { useState, useCallback, useMemo } from 'react';
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
    MenuItem as SelectMenuItem
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import DepartmentEditModal from './DepartmentEditModal';
import DepartmentAddModal from './DepartmentAddModal';
import DepartmentDeleteModal from './DepartmentDeleteModal';
import {PersonModal} from '../PersonCreationModal/PersonCreationModal';
import Alert from '../Alert/Alert';
const initialDepartmentsData = [
    {
        id: "1",
        shortName: "ИВТ",
        fullName: "Информационные вычислительные технологии",
        head: "Иванов Иван Иванович",
        faculty: "Факультет компьютерных наук",
    },
    {
        id: "2",
        shortName: "МОП ЭВМ",
        fullName: "Математическое обеспечение и применение ЭВМ",
        head: "Петров Петр Петрович",
        faculty: "Факультет прикладной математики",
    },
    {
        id: "3",
        shortName: "ОФ",
        fullName: "Общая физика",
        head: "Сидоров Сидор Сидорович",
        faculty: "Факультет физики",
    },
    {
        id: "4",
        shortName: "ТП",
        fullName: "Теоретическая физика",
        head: "Кузнецов Алексей Владимирович",
        faculty: "Факультет физики",
    },
    {
        id: "5",
        shortName: "КГ",
        fullName: "Компьютерная графика",
        head: "Смирнова Елена Александровна",
        faculty: "Факультет компьютерных наук",
    },
    {
        id: "6",
        shortName: "МИ",
        fullName: "Математическая информатика",
        head: "Федоров Дмитрий Сергеевич",
        faculty: "Факультет прикладной математики",
    },
    {
        id: "7",
        shortName: "САПР",
        fullName: "Системы автоматизированного проектирования",
        head: "Николаева Ольга Ивановна",
        faculty: "Факультет компьютерных наук",
    },
    {
        id: "8",
        shortName: "ТВ",
        fullName: "Теория вероятностей",
        head: "Волков Андрей Николаевич",
        faculty: "Факультет прикладной математики",
    },
];

// Мок-данные для факультетов
const faculties = [
    "Факультет компьютерных наук",
    "Факультет прикладной математики",
    "Факультет физики",
    "Факультет химии",
    "Факультет биологии"
];
const DepartmentsTable = () => {
    const [departmentsData, setDepartmentsData] = useState(initialDepartmentsData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchParams, setSearchParams] = useState({
        shortName: '',
        fullName: '',
        head: '',
        faculty: ''
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [newDepartment, setNewDepartment] = useState({
        shortName: '',
        fullName: '',
        head: '',
        faculty: ''
    });
    const [editDepartment, setEditDepartment] = useState({
        shortName: '',
        fullName: '',
        head: '',
        faculty: ''
    });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [people, setPeople] = useState([
        { id: "1", fullName: "Иванов Иван Иванович", lastName: "Иванов", firstName: "Иван", patronymic: "Иванович" },
        { id: "2", fullName: "Петров Петр Петрович", lastName: "Петров", firstName: "Петр", patronymic: "Петрович" },
        { id: "3", fullName: "Сидоров Сидор Сидорович", lastName: "Сидоров", firstName: "Сидор", patronymic: "Сидорович" },
    ]);

    const [personInputValue, setPersonInputValue] = useState('');

    const filteredPeopleOptions = useMemo(() =>
            people
                .filter(person => person.fullName.toLowerCase().includes(personInputValue.toLowerCase()))
                .slice(0, 8),
        [people, personInputValue]
    );

    const filteredData = useMemo(() =>
            departmentsData.filter(department => (
                department.shortName.toLowerCase().includes(searchParams.shortName.toLowerCase()) &&
                department.fullName.toLowerCase().includes(searchParams.fullName.toLowerCase()) &&
                department.head.toLowerCase().includes(searchParams.head.toLowerCase()) &&
                department.faculty.toLowerCase().includes(searchParams.faculty.toLowerCase())
            )),
        [departmentsData, searchParams]
    );

    const showAlert = useCallback((message, severity = 'success') => {
        setAlertState({ open: true, message, severity });
    }, []);

    const handleCloseAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, open: false }));
    }, []);

    const handleSearchChange = useCallback((field) => (event) => {
        setSearchParams(prev => ({ ...prev, [field]: event.target.value }));
    }, []);

    const handleMenuClick = useCallback((event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSearchMenuClick = useCallback((event) => {
        setSearchAnchorEl(event.currentTarget);
    }, []);

    const handleSearchMenuClose = useCallback(() => {
        setSearchAnchorEl(null);
    }, []);

    const handleEdit = useCallback(() => {
        setEditDepartment(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    }, [currentRow, handleMenuClose]);

    const handleDelete = useCallback(() => {
        setOpenDeleteModal(true);
        handleMenuClose();
    }, [handleMenuClose]);

    const handleAdd = useCallback(() => {
        setNewDepartment({ shortName: '', fullName: '', head: '', faculty: '' });
        setPersonInputValue('');
        setOpenAddModal(true);
    }, []);

    const handleCloseModals = useCallback(() => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        setPersonInputValue('');
    }, []);

    const handlePersonInputChange = useCallback((event, value) => {
        setPersonInputValue(value);
    }, []);

    const handleAddNewPerson = useCallback((newPerson, error) => {
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

        if (openEditModal) {
            setEditDepartment(prev => ({ ...prev, head: fullName }));
        } else if (openAddModal) {
            setNewDepartment(prev => ({ ...prev, head: fullName }));
        }

        showAlert('Человек успешно добавлен!', 'success');
        setOpenPersonModal(false);
    }, [openEditModal, openAddModal, showAlert]);

    const handleSaveEdit = useCallback(() => {
        if (!editDepartment.shortName || !editDepartment.fullName ||
            !editDepartment.head || !editDepartment.faculty) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        setDepartmentsData(departmentsData.map(dept =>
            dept.id === currentRow.id ? { ...editDepartment, id: currentRow.id } : dept
        ));
        showAlert('Кафедра успешно обновлена!', 'success');
        handleCloseModals();
    }, [editDepartment, currentRow, departmentsData, showAlert, handleCloseModals]);

    const handleSaveAdd = useCallback(() => {
        if (!newDepartment.shortName || !newDepartment.fullName ||
            !newDepartment.head || !newDepartment.faculty) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        const newId = Math.max(...departmentsData.map(dept => parseInt(dept.id))) + 1;
        setDepartmentsData([...departmentsData, { ...newDepartment, id: newId.toString() }]);
        showAlert('Кафедра успешно добавлена!', 'success');
        handleCloseModals();
    }, [newDepartment, departmentsData, showAlert, handleCloseModals]);

    const handleDeleteConfirm = useCallback(() => {
        setDepartmentsData(departmentsData.filter(dept => dept.id !== currentRow.id));
        showAlert('Кафедра успешно удалена!', 'success');
        handleCloseModals();
    }, [currentRow, departmentsData, showAlert, handleCloseModals]);

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список кафедр</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleSearchMenuClick}>
                            <SearchIcon />
                        </IconButton>
                        <Menu
                            anchorEl={searchAnchorEl}
                            open={Boolean(searchAnchorEl)}
                            onClose={handleSearchMenuClose}
                            sx={{ maxWidth: 320 }}
                        >
                            <Box sx={{ p: 1, width: 320 }}>
                                <TextField
                                    label="Поиск по сокращенному названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchParams.shortName}
                                    onChange={handleSearchChange('shortName')}
                                    sx={{ maxWidth: 270 }}
                                />
                                <TextField
                                    label="Поиск по полному названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchParams.fullName}
                                    onChange={handleSearchChange('fullName')}
                                    sx={{ maxWidth: 270 }}
                                />
                                <TextField
                                    label="Поиск по ФИО заведующего"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchParams.head}
                                    onChange={handleSearchChange('head')}
                                    sx={{ maxWidth: 270 }}
                                />
                                <FormControl variant="outlined" size="small" fullWidth margin="normal">
                                    <InputLabel>Поиск по факультету</InputLabel>
                                    <Select
                                        value={searchParams.faculty}
                                        onChange={handleSearchChange('faculty')}
                                        label="Поиск по факультету"
                                        sx={{ maxWidth: 270 }}
                                    >
                                        <SelectMenuItem value="">Все факультеты</SelectMenuItem>
                                        {faculties.map((faculty) => (
                                            <SelectMenuItem key={faculty} value={faculty}>{faculty}</SelectMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Сокращенное название</TableCell>
                            <TableCell>Полное название</TableCell>
                            <TableCell>ФИО заведующего</TableCell>
                            <TableCell>Факультет</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(department => (
                            <TableRow key={department.id}>
                                <TableCell>{department.shortName}</TableCell>
                                <TableCell>{department.fullName}</TableCell>
                                <TableCell>{department.head}</TableCell>
                                <TableCell>{department.faculty}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, department)}>
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

            <DepartmentEditModal
                open={openEditModal}
                onClose={handleCloseModals}
                department={editDepartment}
                onDepartmentChange={(field, value) => setEditDepartment(prev => ({ ...prev, [field]: value }))}
                onSave={handleSaveEdit}
                people={people}
                personInputValue={personInputValue}
                onPersonInputChange={handlePersonInputChange}
                onAddPersonClick={() => setOpenPersonModal(true)}
                faculties={faculties}
            />

            <DepartmentAddModal
                open={openAddModal}
                onClose={handleCloseModals}
                department={newDepartment}
                onDepartmentChange={(field, value) => setNewDepartment(prev => ({ ...prev, [field]: value }))}
                onSave={handleSaveAdd}
                people={people}
                personInputValue={personInputValue}
                onPersonInputChange={handlePersonInputChange}
                onAddPersonClick={() => setOpenPersonModal(true)}
                faculties={faculties}
            />

            <DepartmentDeleteModal
                open={openDeleteModal}
                onClose={handleCloseModals}
                department={currentRow}
                onConfirm={handleDeleteConfirm}
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

export default React.memo(DepartmentsTable);