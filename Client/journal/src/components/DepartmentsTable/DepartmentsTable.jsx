import React, { useState, useCallback } from 'react';
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
    Select,
    FormControl,
    InputLabel,
    MenuItem as SelectMenuItem,
    Autocomplete
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { PersonModal } from '../PersonCreationModal/PersonCreationModal';
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
];

const faculties = ["Факультет компьютерных наук", "Факультет прикладной математики", "Факультет физики"];

const DepartmentsTable = () => {
    const [departmentsData, setDepartmentsData] = useState(initialDepartmentsData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchShortName, setSearchShortName] = useState('');
    const [searchFullName, setSearchFullName] = useState('');
    const [searchHead, setSearchHead] = useState('');
    const [searchFaculty, setSearchFaculty] = useState('');
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

    const filteredPeopleOptions = people
        .filter(person =>
            person.fullName.toLowerCase().includes(personInputValue.toLowerCase())
        )
        .slice(0, 8);

    const showAlert = useCallback((message, severity = 'success') => {
        setAlertState({
            open: true,
            message,
            severity
        });
    }, []);

    const handleCloseAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, open: false }));
    }, []);

    const handleSearchShortNameChange = useCallback((event) => {
        setSearchShortName(event.target.value);
    }, []);

    const handleSearchFullNameChange = useCallback((event) => {
        setSearchFullName(event.target.value);
    }, []);

    const handleSearchHeadChange = useCallback((event) => {
        setSearchHead(event.target.value);
    }, []);

    const handleSearchFacultyChange = useCallback((event) => {
        setSearchFaculty(event.target.value);
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
            setEditDepartment(prev => ({
                ...prev,
                head: fullName
            }));
        } else if (openAddModal) {
            setNewDepartment(prev => ({
                ...prev,
                head: fullName
            }));
        }

        showAlert('Человек успешно добавлен!', 'success');
    }, [openEditModal, openAddModal, showAlert]);

    const renderPersonSelector = useCallback((isEditModal) => {
        const value = isEditModal ? editDepartment.head : newDepartment.head;
        const setValue = isEditModal ?
            (val) => setEditDepartment({...editDepartment, head: val}) :
            (val) => setNewDepartment({...newDepartment, head: val});

        return (
            <FormControl fullWidth margin="normal">
                <Autocomplete
                    options={filteredPeopleOptions}
                    getOptionLabel={(option) => option.fullName}
                    value={people.find(p => p.fullName === value) || null}
                    onChange={(_, newValue) => {
                        setValue(newValue ? newValue.fullName : '');
                    }}
                    inputValue={personInputValue}
                    onInputChange={handlePersonInputChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="ФИО заведующего*"
                            margin="normal"
                            required
                        />
                    )}
                    noOptionsText={
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Не найдено</Typography>
                            <Button
                                startIcon={<PersonAddIcon />}
                                onClick={() => setOpenPersonModal(true)}
                                size="small"
                            >
                                Добавить нового
                            </Button>
                        </Box>
                    }
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.fullName}
                        </li>
                    )}
                />
            </FormControl>
        );
    }, [editDepartment, newDepartment, filteredPeopleOptions, people, personInputValue, handlePersonInputChange]);

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

    const filteredData = departmentsData.filter(department => {
        return (
            department.shortName.toLowerCase().includes(searchShortName.toLowerCase()) &&
            department.fullName.toLowerCase().includes(searchFullName.toLowerCase()) &&
            department.head.toLowerCase().includes(searchHead.toLowerCase()) &&
            department.faculty.toLowerCase().includes(searchFaculty.toLowerCase())
        );
    });

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
                                    value={searchShortName}
                                    onChange={handleSearchShortNameChange}
                                    sx={{ maxWidth: 270 }}
                                />
                                <TextField
                                    label="Поиск по полному названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchFullName}
                                    onChange={handleSearchFullNameChange}
                                    sx={{ maxWidth: 270 }}
                                />
                                <TextField
                                    label="Поиск по ФИО заведующего"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchHead}
                                    onChange={handleSearchHeadChange}
                                    sx={{ maxWidth: 270 }}
                                />
                                <FormControl variant="outlined" size="small" fullWidth margin="normal">
                                    <InputLabel>Поиск по факультету</InputLabel>
                                    <Select
                                        value={searchFaculty}
                                        onChange={handleSearchFacultyChange}
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
                            <Typography variant="h6">Редактировать запись</Typography>
                            <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <TextField
                                label="Сокращенное название*"
                                fullWidth
                                margin="normal"
                                value={editDepartment.shortName}
                                onChange={(e) => setEditDepartment({ ...editDepartment, shortName: e.target.value })}
                                required
                            />
                            <TextField
                                label="Полное название*"
                                fullWidth
                                margin="normal"
                                value={editDepartment.fullName}
                                onChange={(e) => setEditDepartment({ ...editDepartment, fullName: e.target.value })}
                                required
                            />
                            {renderPersonSelector(true)}
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Факультет*</InputLabel>
                                <Select
                                    value={editDepartment.faculty}
                                    onChange={(e) => setEditDepartment({ ...editDepartment, faculty: e.target.value })}
                                    label="Факультет*"
                                >
                                    {faculties.map((faculty) => (
                                        <SelectMenuItem key={faculty} value={faculty}>{faculty}</SelectMenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={handleCloseModals}>Отмена</Button>
                                <Button onClick={handleSaveEdit} color="primary">Сохранить</Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
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
                            <Typography variant="h6">Удалить запись</Typography>
                            <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Typography>Вы уверены, что хотите удалить запись {currentRow?.shortName}?</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={handleCloseModals}>Отмена</Button>
                                <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
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
                            <Typography variant="h6">Добавить новую запись</Typography>
                            <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <TextField
                                label="Сокращенное название*"
                                fullWidth
                                margin="normal"
                                value={newDepartment.shortName}
                                onChange={(e) => setNewDepartment({ ...newDepartment, shortName: e.target.value })}
                                required
                            />
                            <TextField
                                label="Полное название*"
                                fullWidth
                                margin="normal"
                                value={newDepartment.fullName}
                                onChange={(e) => setNewDepartment({ ...newDepartment, fullName: e.target.value })}
                                required
                            />
                            {renderPersonSelector(false)}
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Факультет*</InputLabel>
                                <Select
                                    value={newDepartment.faculty}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, faculty: e.target.value })}
                                    label="Факультет*"
                                >
                                    {faculties.map((faculty) => (
                                        <SelectMenuItem key={faculty} value={faculty}>{faculty}</SelectMenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={handleCloseModals}>Отмена</Button>
                                <Button onClick={handleSaveAdd} color="primary">Добавить</Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton onClick={handleAdd} color="primary">
                        <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </TableContainer>

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