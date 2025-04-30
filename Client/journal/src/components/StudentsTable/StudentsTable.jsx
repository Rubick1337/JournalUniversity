import React, { useState, useMemo } from 'react';
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
    MenuItem as SelectMenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '../Alert/Alert';
import {PersonModal} from '../PersonCreationModal/PersonCreationModal';
import PersonSelector from '../DepartmentsTable/PersonSelector';

const initialStudentsData = [
    {
        id: "12345",
        name: "Иванов Иван Иванович",
        reprimands: 1,
        group: "Группа 101",
        subgroup: "Подгруппа 1",
        parent: "Петрова Мария Ивановна"
    },
    {
        id: "67890",
        name: "Петров Петр Петрович",
        reprimands: 0,
        group: "Группа 102",
        subgroup: "Подгруппа 2",
        parent: "Иванова Ольга Сергеевна"
    },
    {
        id: "54321",
        name: "Сидоров Сидор Сидорович",
        reprimands: 2,
        group: "Группа 103",
        subgroup: "Подгруппа 1",
        parent: "Сидорова Елена Викторовна"
    },
];

const groups = ["Группа 101", "Группа 102", "Группа 103"];
const subgroups = ["Подгруппа 1", "Подгруппа 2"];

const initialPeople = [
    { id: "1", fullName: "Иванов Иван Иванович", lastName: "Иванов", firstName: "Иван", patronymic: "Иванович" },
    { id: "2", fullName: "Петров Петр Петрович", lastName: "Петров", firstName: "Петр", patronymic: "Петрович" },
    { id: "3", fullName: "Сидоров Сидор Сидорович", lastName: "Сидоров", firstName: "Сидор", patronymic: "Сидорович" },
];

const StudentsTable = () => {
    const [studentsData, setStudentsData] = useState(initialStudentsData);
    const [people, setPeople] = useState(initialPeople);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchReprimands, setSearchReprimands] = useState('');
    const [searchGroup, setSearchGroup] = useState('');
    const [searchSubgroup, setSearchSubgroup] = useState('');
    const [searchParent, setSearchParent] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        id: '',
        name: '',
        reprimands: 0,
        group: '',
        subgroup: '',
        parent: ''
    });
    const [editStudent, setEditStudent] = useState({
        id: '',
        name: '',
        reprimands: 0,
        group: '',
        subgroup: '',
        parent: ''
    });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [personInputValue, setPersonInputValue] = useState('');

    const showAlert = (message, severity = 'success') => {
        setAlertState({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
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
        setEditStudent(currentRow);
        setPersonInputValue(currentRow.name);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewStudent({ id: '', name: '', reprimands: 0, group: '', subgroup: '', parent: '' });
        setPersonInputValue('');
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        setPersonInputValue('');
    };

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

        if (openEditModal) {
            setEditStudent(prev => ({ ...prev, name: fullName }));
        } else if (openAddModal) {
            setNewStudent(prev => ({ ...prev, name: fullName }));
        }

        showAlert('Человек успешно добавлен!', 'success');
        setOpenPersonModal(false);
    };

    const handleSaveEdit = () => {
        if (!editStudent.id || !editStudent.name || !editStudent.group || !editStudent.subgroup || !editStudent.parent) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        setStudentsData(studentsData.map(student =>
            student.id === currentRow.id ? editStudent : student
        ));
        showAlert('Данные студента успешно обновлены!', 'success');
        handleCloseModals();
    };

    const handleSaveAdd = () => {
        if (!newStudent.id || !newStudent.name || !newStudent.group || !newStudent.subgroup || !newStudent.parent) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        setStudentsData([...studentsData, newStudent]);
        showAlert('Студент успешно добавлен!', 'success');
        handleCloseModals();
    };

    const handleDeleteConfirm = () => {
        setStudentsData(studentsData.filter(student => student.id !== currentRow.id));
        showAlert('Студент успешно удален!', 'success');
        handleCloseModals();
    };

    const filteredData = useMemo(() =>
            studentsData.filter(student => (
                student.id.toLowerCase().includes(searchId.toLowerCase()) &&
                student.name.toLowerCase().includes(searchName.toLowerCase()) &&
                student.reprimands.toString().includes(searchReprimands) &&
                student.group.toLowerCase().includes(searchGroup.toLowerCase()) &&
                student.subgroup.toLowerCase().includes(searchSubgroup.toLowerCase()) &&
                student.parent.toLowerCase().includes(searchParent.toLowerCase())
            )),
        [studentsData, searchId, searchName, searchReprimands, searchGroup, searchSubgroup, searchParent]
    );

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список студентов</Typography>
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
                                    label="Поиск по ID зачетки"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    sx={{maxWidth: 270}}
                                />
                                <TextField
                                    label="Поиск по ФИО"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    sx={{maxWidth: 270}}
                                />
                                <TextField
                                    label="Поиск по кол-ву выговоров"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchReprimands}
                                    onChange={(e) => setSearchReprimands(e.target.value)}
                                    sx={{maxWidth: 270}}
                                />
                                <FormControl variant="outlined" size="small" fullWidth margin="normal">
                                    <InputLabel>Поиск по группе</InputLabel>
                                    <Select
                                        value={searchGroup}
                                        onChange={(e) => setSearchGroup(e.target.value)}
                                        label="Поиск по группе"
                                        sx={{maxWidth: 270}}
                                    >
                                        <SelectMenuItem value="">Все группы</SelectMenuItem>
                                        {groups.map((group) => (
                                            <SelectMenuItem key={group} value={group}>{group}</SelectMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" size="small" fullWidth margin="normal">
                                    <InputLabel>Поиск по подгруппе</InputLabel>
                                    <Select
                                        value={searchSubgroup}
                                        onChange={(e) => setSearchSubgroup(e.target.value)}
                                        label="Поиск по подгруппе"
                                        sx={{maxWidth: 270}}
                                    >
                                        <SelectMenuItem value="">Все подгруппы</SelectMenuItem>
                                        {subgroups.map((subgroup) => (
                                            <SelectMenuItem key={subgroup} value={subgroup}>{subgroup}</SelectMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Поиск по родителю"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchParent}
                                    onChange={(e) => setSearchParent(e.target.value)}
                                    sx={{maxWidth: 270}}
                                />
                            </Box>
                        </Menu>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID зачетки</TableCell>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Кол-во выговоров</TableCell>
                            <TableCell>Группа</TableCell>
                            <TableCell>Подгруппа</TableCell>
                            <TableCell>Родитель</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(student => (
                            <TableRow key={student.id}>
                                <TableCell>{student.id}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.reprimands}</TableCell>
                                <TableCell>{student.group}</TableCell>
                                <TableCell>{student.subgroup}</TableCell>
                                <TableCell>{student.parent}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, student)}>
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
                    onPageChange={(_, newPage) => setPage(newPage)}
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
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24 }}>
                        <Box sx={{ bgcolor: '#1976d2', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                        label="ID зачетки"
                                        fullWidth
                                        margin="normal"
                                        value={editStudent.id}
                                        onChange={(e) => setEditStudent({ ...editStudent, id: e.target.value })}
                                    />
                                    <PersonSelector
                                        value={editStudent.name}
                                        onChange={(value) => setEditStudent({ ...editStudent, name: value })}
                                        people={people}
                                        inputValue={personInputValue}
                                        onInputChange={handlePersonInputChange}
                                        onAddPersonClick={() => setOpenPersonModal(true)}
                                    />
                                    <TextField
                                        label="Кол-во выговоров"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={editStudent.reprimands}
                                        onChange={(e) => setEditStudent({ ...editStudent, reprimands: e.target.value })}
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Группа</InputLabel>
                                        <Select
                                            value={editStudent.group}
                                            onChange={(e) => setEditStudent({ ...editStudent, group: e.target.value })}
                                            label="Группа"
                                        >
                                            {groups.map((group) => (
                                                <SelectMenuItem key={group} value={group}>{group}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Подгруппа</InputLabel>
                                        <Select
                                            value={editStudent.subgroup}
                                            onChange={(e) => setEditStudent({ ...editStudent, subgroup: e.target.value })}
                                            label="Подгруппа"
                                        >
                                            {subgroups.map((subgroup) => (
                                                <SelectMenuItem key={subgroup} value={subgroup}>{subgroup}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Родитель"
                                        fullWidth
                                        margin="normal"
                                        value={editStudent.parent}
                                        onChange={(e) => setEditStudent({ ...editStudent, parent: e.target.value })}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button onClick={handleSaveEdit} color="primary">Сохранить</Button>
                                    </Box>
                                </div>
                            )}
                            {openDeleteModal && (
                                <div>
                                    <Typography>Вы уверены, что хотите удалить запись {currentRow?.name}?</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals}>Отмена</Button>
                                        <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
                                    </Box>
                                </div>
                            )}
                            {openAddModal && (
                                <div>
                                    <TextField
                                        label="ID зачетки"
                                        fullWidth
                                        margin="normal"
                                        value={newStudent.id}
                                        onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                                    />
                                    <PersonSelector
                                        value={newStudent.name}
                                        onChange={(value) => setNewStudent({ ...newStudent, name: value })}
                                        people={people}
                                        inputValue={personInputValue}
                                        onInputChange={handlePersonInputChange}
                                        onAddPersonClick={() => setOpenPersonModal(true)}
                                    />
                                    <TextField
                                        label="Кол-во выговоров"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={newStudent.reprimands}
                                        onChange={(e) => setNewStudent({ ...newStudent, reprimands: e.target.value })}
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Группа</InputLabel>
                                        <Select
                                            value={newStudent.group}
                                            onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
                                            label="Группа"
                                        >
                                            {groups.map((group) => (
                                                <SelectMenuItem key={group} value={group}>{group}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Подгруппа</InputLabel>
                                        <Select
                                            value={newStudent.subgroup}
                                            onChange={(e) => setNewStudent({ ...newStudent, subgroup: e.target.value })}
                                            label="Подгруппа"
                                        >
                                            {subgroups.map((subgroup) => (
                                                <SelectMenuItem key={subgroup} value={subgroup}>{subgroup}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Родитель"
                                        fullWidth
                                        margin="normal"
                                        value={newStudent.parent}
                                        onChange={(e) => setNewStudent({ ...newStudent, parent: e.target.value })}
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

export default React.memo(StudentsTable);