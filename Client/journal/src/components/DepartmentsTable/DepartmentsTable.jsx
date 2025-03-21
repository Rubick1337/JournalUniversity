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
    MenuItem as SelectMenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const departmentsData = [
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
    // Добавьте остальные записи
];

const faculties = ["Факультет компьютерных наук", "Факультет прикладной математики", "Факультет физики"];

const DepartmentsTable = () => {
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
    const [newDepartment, setNewDepartment] = useState({ shortName: '', fullName: '', head: '', faculty: '' });
    const [editDepartment, setEditDepartment] = useState({ shortName: '', fullName: '', head: '', faculty: '' });

    const handleSearchShortNameChange = (event) => {
        setSearchShortName(event.target.value);
    };

    const handleSearchFullNameChange = (event) => {
        setSearchFullName(event.target.value);
    };

    const handleSearchHeadChange = (event) => {
        setSearchHead(event.target.value);
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
        setEditDepartment(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewDepartment({ shortName: '', fullName: '', head: '', faculty: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
    };

    const handleSaveEdit = () => {
        // Логика сохранения изменений
        console.log('Измененная запись:', editDepartment);
        handleCloseModals();
    };

    const handleSaveAdd = () => {
        // Логика добавления новой записи
        console.log('Новая запись:', newDepartment);
        handleCloseModals();
    };

    const handleDeleteConfirm = () => {
        // Логика удаления записи
        console.log('Удалена запись:', currentRow);
        handleCloseModals();
    };

    const filteredData = departmentsData.filter(department => {
        return (
            department.shortName.toLowerCase().includes(searchShortName.toLowerCase()) &&
            department.fullName.toLowerCase().includes(searchFullName.toLowerCase()) &&
            department.head.toLowerCase().includes(searchHead.toLowerCase()) &&
            department.faculty.toLowerCase().includes(searchFaculty.toLowerCase())
        );
    });

    return (
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
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
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
                                    label="Сокращенное название"
                                    fullWidth
                                    margin="normal"
                                    value={editDepartment.shortName}
                                    onChange={(e) => setEditDepartment({ ...editDepartment, shortName: e.target.value })}
                                />
                                <TextField
                                    label="Полное название"
                                    fullWidth
                                    margin="normal"
                                    value={editDepartment.fullName}
                                    onChange={(e) => setEditDepartment({ ...editDepartment, fullName: e.target.value })}
                                />
                                <TextField
                                    label="ФИО заведующего"
                                    fullWidth
                                    margin="normal"
                                    value={editDepartment.head}
                                    onChange={(e) => setEditDepartment({ ...editDepartment, head: e.target.value })}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Факультет</InputLabel>
                                    <Select
                                        value={editDepartment.faculty}
                                        onChange={(e) => setEditDepartment({ ...editDepartment, faculty: e.target.value })}
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
                                <Typography>Вы уверены, что хотите удалить запись {currentRow?.shortName}?</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button onClick={handleCloseModals}>Отмена</Button>
                                    <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
                                </Box>
                            </div>
                        )}
                        {openAddModal && (
                            <div>
                                <TextField
                                    label="Сокращенное название"
                                    fullWidth
                                    margin="normal"
                                    value={newDepartment.shortName}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, shortName: e.target.value })}
                                />
                                <TextField
                                    label="Полное название"
                                    fullWidth
                                    margin="normal"
                                    value={newDepartment.fullName}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, fullName: e.target.value })}
                                />
                                <TextField
                                    label="ФИО заведующего"
                                    fullWidth
                                    margin="normal"
                                    value={newDepartment.head}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Факультет</InputLabel>
                                    <Select
                                        value={newDepartment.faculty}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, faculty: e.target.value })}
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
    );
};

export default DepartmentsTable;