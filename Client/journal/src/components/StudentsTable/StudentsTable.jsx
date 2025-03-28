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

const initialStudentsData = [
    { id: "12345", name: "Иванов Иван Иванович", course: 1, department: "Кафедра информатики", faculty: "Факультет компьютерных наук" },
    { id: "67890", name: "Петров Петр Петрович", course: 2, department: "Кафедра математики", faculty: "Факультет прикладной математики" },
    { id: "54321", name: "Сидоров Сидор Сидорович", course: 3, department: "Кафедра физики", faculty: "Факультет физики" },
];

const departments = ["Кафедра информатики", "Кафедра математики", "Кафедра физики"];
const faculties = ["Факультет компьютерных наук", "Факультет прикладной математики", "Факультет физики"];

const StudentsTable = () => {
    const [studentsData, setStudentsData] = useState(initialStudentsData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchCourse, setSearchCourse] = useState('');
    const [searchDepartment, setSearchDepartment] = useState('');
    const [searchFaculty, setSearchFaculty] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ id: '', name: '', course: '', department: '', faculty: '' });
    const [editStudent, setEditStudent] = useState({ id: '', name: '', course: '', department: '', faculty: '' });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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

    const handleSearchIdChange = (event) => {
        setSearchId(event.target.value);
    };

    const handleSearchNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleSearchCourseChange = (event) => {
        setSearchCourse(event.target.value);
    };

    const handleSearchDepartmentChange = (event) => {
        setSearchDepartment(event.target.value);
    };

    const handleSearchFacultyChange = (event) => {
        setSearchFaculty(event.target.value);
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
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewStudent({ id: '', name: '', course: '', department: '', faculty: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
    };

    const handleSaveEdit = () => {
        if (!editStudent.id || !editStudent.name || !editStudent.course || !editStudent.department || !editStudent.faculty) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }

        setStudentsData(studentsData.map(student =>
            student.id === currentRow.id ? editStudent : student
        ));
        showAlert('Данные студента успешно обновлены!', 'success');
        handleCloseModals();
    };

    const handleSaveAdd = () => {
        if (!newStudent.id || !newStudent.name || !newStudent.course || !newStudent.department || !newStudent.faculty) {
            showAlert('Все поля должны быть заполнены!', 'error');
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

    const filteredData = studentsData.filter(student => {
        return (
            student.id.toLowerCase().includes(searchId.toLowerCase()) &&
            student.name.toLowerCase().includes(searchName.toLowerCase()) &&
            student.course.toString().includes(searchCourse) &&
            student.department.toLowerCase().includes(searchDepartment.toLowerCase()) &&
            student.faculty.toLowerCase().includes(searchFaculty.toLowerCase())
        );
    });

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
                                    onChange={handleSearchIdChange}
                                    sx={{maxWidth: 270}}
                                />
                                <TextField
                                    label="Поиск по ФИО"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchName}
                                    onChange={handleSearchNameChange}
                                    sx={{maxWidth: 270}}
                                />
                                <TextField
                                    label="Поиск по курсу"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchCourse}
                                    onChange={handleSearchCourseChange}
                                    sx={{maxWidth: 270}}
                                />
                                <FormControl variant="outlined" size="small" fullWidth margin="normal">
                                    <InputLabel>Поиск по кафедре</InputLabel>
                                    <Select
                                        value={searchDepartment}
                                        onChange={handleSearchDepartmentChange}
                                        label="Поиск по кафедре"
                                        sx={{maxWidth: 270}}
                                    >
                                        <SelectMenuItem value="">Все кафедры</SelectMenuItem>
                                        {departments.map((dept) => (
                                            <SelectMenuItem key={dept} value={dept}>{dept}</SelectMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" size="small" fullWidth margin="normal">
                                    <InputLabel>Поиск по факультету</InputLabel>
                                    <Select
                                        value={searchFaculty}
                                        onChange={handleSearchFacultyChange}
                                        label="Поиск по факультету"
                                        sx={{maxWidth: 270}}
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
                            <TableCell>ID зачетки</TableCell>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Курс</TableCell>
                            <TableCell>Кафедра</TableCell>
                            <TableCell>Факультет</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(student => (
                            <TableRow key={student.id}>
                                <TableCell>{student.id}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.course}</TableCell>
                                <TableCell>{student.department}</TableCell>
                                <TableCell>{student.faculty}</TableCell>
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
                                    <TextField
                                        label="ФИО"
                                        fullWidth
                                        margin="normal"
                                        value={editStudent.name}
                                        onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                                    />
                                    <TextField
                                        label="Курс"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={editStudent.course}
                                        onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })}
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Кафедра</InputLabel>
                                        <Select
                                            value={editStudent.department}
                                            onChange={(e) => setEditStudent({ ...editStudent, department: e.target.value })}
                                            label="Кафедра"
                                        >
                                            {departments.map((dept) => (
                                                <SelectMenuItem key={dept} value={dept}>{dept}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Факультет</InputLabel>
                                        <Select
                                            value={editStudent.faculty}
                                            onChange={(e) => setEditStudent({ ...editStudent, faculty: e.target.value })}
                                            label="Факультет"
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
                                    <TextField
                                        label="ФИО"
                                        fullWidth
                                        margin="normal"
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    />
                                    <TextField
                                        label="Курс"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={newStudent.course}
                                        onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Кафедра</InputLabel>
                                        <Select
                                            value={newStudent.department}
                                            onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                                            label="Кафедра"
                                        >
                                            {departments.map((dept) => (
                                                <SelectMenuItem key={dept} value={dept}>{dept}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Факультет</InputLabel>
                                        <Select
                                            value={newStudent.faculty}
                                            onChange={(e) => setNewStudent({ ...newStudent, faculty: e.target.value })}
                                            label="Факультет"
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

            {/* Компонент Alert для отображения уведомлений */}
            <Alert
                open={alertState.open}
                message={alertState.message}
                severity={alertState.severity}
                handleClose={handleCloseAlert}
            />
        </>
    );
};

export default StudentsTable;