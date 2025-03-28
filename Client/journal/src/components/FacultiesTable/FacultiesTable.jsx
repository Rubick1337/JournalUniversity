import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import SearchIcon from '@mui/icons-material/Search';



const FacultiesTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchShortName, setSearchShortName] = useState('');
    const [searchFullName, setSearchFullName] = useState('');
    const [searchDean, setSearchDean] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newFaculty, setNewFaculty] = useState({ shortName: '', fullName: '', dean: '' });
    const [editFaculty, setEditFaculty] = useState({ shortName: '', fullName: '', dean: '' });

    const dispatch = useDispatch();
    const facultiesData = useSelector(state => state.faculty.facultiesList.data);
    const loading = useSelector(state => state.faculty.facultiesList.isLoading);
    const error = useSelector(state => state.faculty.facultiesList.errors);
    console.log("facultiesData",facultiesData)
    console.log("loading",loading)
    console.log("error",error)
    if(loading) {
        return <div>Загрузка данных...</div>;
    }
    if (error?.length > 0) {
        return (
            <div>
                Ошибка загрузки данных:
                <ul>
                    {error.map((err, index) => (
                        <li key={index}>{err.message || err.toString()}</li>
                    ))}
                </ul>
            </div>
        );
    }
    const handleSearchShortNameChange = (event) => {
        setSearchShortName(event.target.value);
    };

    const handleSearchFullNameChange = (event) => {
        setSearchFullName(event.target.value);
    };

    const handleSearchDeanChange = (event) => {
        setSearchDean(event.target.value);
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
        setEditFaculty(currentRow);
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewFaculty({ shortName: '', fullName: '', dean: '' });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
    };

    const handleSaveEdit = () => {
        // Логика сохранения изменений
        console.log('Измененная запись:', editFaculty);
        handleCloseModals();
    };

    const handleSaveAdd = () => {
        // Логика добавления новой записи
        console.log('Новая запись:', newFaculty);
        handleCloseModals();
    };

    const handleDeleteConfirm = () => {
        // Логика удаления записи
        console.log('Удалена запись:', currentRow);
        handleCloseModals();
    };

    const filteredData = facultiesData.filter(faculty => {
        return (
            faculty.shortName.toLowerCase().includes(searchShortName.toLowerCase()) &&
            faculty.fullName.toLowerCase().includes(searchFullName.toLowerCase()) &&
            faculty.dean.toLowerCase().includes(searchDean.toLowerCase())
        );
    });

    return (
        <TableContainer component={Paper}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">Список факультетов</Typography>
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
                                label="Поиск по ФИО декана"
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="normal"
                                value={searchDean}
                                onChange={handleSearchDeanChange}
                                sx={{ maxWidth: 270 }}
                            />
                        </Box>
                    </Menu>
                </Box>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Сокращенное название</TableCell>
                        <TableCell>Полное название</TableCell>
                        <TableCell>ФИО декана</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(faculty => (
                        <TableRow key={faculty.id}>
                            <TableCell>{faculty.shortName}</TableCell>
                            <TableCell>{faculty.fullName}</TableCell>
                            <TableCell>{faculty.dean}</TableCell>
                            <TableCell>
                                <IconButton onClick={(e) => handleMenuClick(e, faculty)}>
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
                                    value={editFaculty.shortName}
                                    onChange={(e) => setEditFaculty({ ...editFaculty, shortName: e.target.value })}
                                />
                                <TextField
                                    label="Полное название"
                                    fullWidth
                                    margin="normal"
                                    value={editFaculty.fullName}
                                    onChange={(e) => setEditFaculty({ ...editFaculty, fullName: e.target.value })}
                                />
                                <TextField
                                    label="ФИО декана"
                                    fullWidth
                                    margin="normal"
                                    value={editFaculty.dean}
                                    onChange={(e) => setEditFaculty({ ...editFaculty, dean: e.target.value })}
                                />
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
                                    value={newFaculty.shortName}
                                    onChange={(e) => setNewFaculty({ ...newFaculty, shortName: e.target.value })}
                                />
                                <TextField
                                    label="Полное название"
                                    fullWidth
                                    margin="normal"
                                    value={newFaculty.fullName}
                                    onChange={(e) => setNewFaculty({ ...newFaculty, fullName: e.target.value })}
                                />
                                <TextField
                                    label="ФИО декана"
                                    fullWidth
                                    margin="normal"
                                    value={newFaculty.dean}
                                    onChange={(e) => setNewFaculty({ ...newFaculty, dean: e.target.value })}
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
    );
};

export default FacultiesTable;