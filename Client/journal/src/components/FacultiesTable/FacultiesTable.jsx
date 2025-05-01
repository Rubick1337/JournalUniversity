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
    TableSortLabel,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '../Alert/Alert';
import PersonSelector from '../DepartmentsTable/PersonSelector';
import {
    getAllFaculties,
    setFacultyPage,
    setFacultyLimit,
    setFacultySearchParams,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    clearFacultyErrors
} from '../../store/slices/facultySlice';
import { fetchPersons } from '../../store/slices/personSlice';
import './FacultiesTable.css';

const FacultiesTable = () => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newFaculty, setNewFaculty] = useState({
        name: '',
        full_name: '',
        dean_person_id: null
    });
    const [editFaculty, setEditFaculty] = useState({
        id: '',
        name: '',
        full_name: '',
        dean_person_id: null
    });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [rowsMounted, setRowsMounted] = useState(false);

    const {
        data: facultiesData = [],
        isLoading,
        errors = [],
        meta = { page: 1, limit: 10, total: 0 }
    } = useSelector(state => state.faculty.facultiesList || {});
    const searchParams = useSelector(state => state.faculty.searchParams || {});
    const people = useSelector(state => state.person?.data || []);

    const [searchValues, setSearchValues] = useState({
        nameQuery: '',
        fullNameQuery: '',
        deanQuery: ''
    });

    useEffect(() => {
        dispatch(getAllFaculties({
            page: meta.page,
            limit: meta.limit,
            sortBy: orderBy,
            sortOrder: order,
            ...searchParams
        }));
        dispatch(fetchPersons({}));
    }, [dispatch, meta.page, meta.limit, searchParams, orderBy, order]);

    useEffect(() => {
        if (errors.length > 0) {
            setAlertState({
                open: true,
                message: errors[0].message || 'Произошла ошибка',
                severity: 'error'
            });
            dispatch(clearFacultyErrors());
        }
    }, [errors, dispatch]);

    useEffect(() => {
        // Активируем анимацию строк после загрузки данных
        if (facultiesData.length > 0 && !rowsMounted) {
            setTimeout(() => {
                setRowsMounted(true);
            }, 100);
        }
    }, [facultiesData, rowsMounted]);

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

    const handleSearchChange = (field) => (e) => {
        const newSearchValues = {
            ...searchValues,
            [field]: e.target.value
        };
        setSearchValues(newSearchValues);
    };

    const handleSearch = () => {
        dispatch(setFacultySearchParams(searchValues));
        setSearchAnchorEl(null);
        setRowsMounted(false);
    };

    const handleResetSearch = () => {
        setSearchValues({
            nameQuery: '',
            fullNameQuery: '',
            deanQuery: ''
        });
        dispatch(setFacultySearchParams({
            nameQuery: '',
            fullNameQuery: '',
            deanQuery: ''
        }));
        setSearchAnchorEl(null);
        setOrderBy('name');
        setOrder('asc');
        setRowsMounted(false);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const renderSortableHeader = (property, label) => (
        <TableCell>
            <TableSortLabel
                active={orderBy === property}
                direction={orderBy === property ? order : 'asc'}
                onClick={() => handleSort(property)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );

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
        setEditFaculty({
            id: currentRow.id,
            name: currentRow.name,
            full_name: currentRow.full_name,
            dean_person_id: currentRow.dean?.id || null
        });
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewFaculty({
            name: '',
            full_name: '',
            dean_person_id: null
        });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
    };

    const handleDeanChangeEdit = (person) => {
        setEditFaculty(prev => ({
            ...prev,
            dean_person_id: person ? person.id : null
        }));
    };

    const handleDeanChangeAdd = (person) => {
        setNewFaculty(prev => ({
            ...prev,
            dean_person_id: person ? person.id : null
        }));
    };

    const handleSaveEdit = () => {
        if (!editFaculty.name || !editFaculty.full_name) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        dispatch(updateFaculty({
            id: editFaculty.id,
            data: {
                name: editFaculty.name,
                full_name: editFaculty.full_name,
                dean_person_id: editFaculty.dean_person_id
            }
        }))
            .unwrap() // Добавьте unwrap() для обработки Promise
            .then(() => {
                showAlert('Факультет успешно обновлен!', 'success');
                handleCloseModals();
                // Обновляем данные после обновления
                dispatch(getAllFaculties({
                    page: meta.page,
                    limit: meta.limit,
                    sortBy: orderBy,
                    sortOrder: order,
                    ...searchParams
                }));
            })
            .catch(error => {
                showAlert(error.message || 'Ошибка при обновлении факультета', 'error');
            });
    };

    const handleSaveAdd = () => {
        if (!newFaculty.name || !newFaculty.full_name) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        dispatch(createFaculty({
            name: newFaculty.name,
            full_name: newFaculty.full_name,
            dean_person_id: newFaculty.dean_person_id
        }))
            .unwrap() // Добавьте unwrap() для обработки Promise
            .then(() => {
                showAlert('Факультет успешно добавлен!', 'success');
                handleCloseModals();
                // Обновляем данные после добавления
                dispatch(getAllFaculties({
                    page: meta.page,
                    limit: meta.limit,
                    sortBy: orderBy,
                    sortOrder: order,
                    ...searchParams
                }));
            })
            .catch(error => {
                showAlert(error.message || 'Ошибка при добавлении факультета', 'error');
            });
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteFaculty(currentRow.id))
            .then(() => {
                showAlert('Факультет успешно удален!', 'success');
                handleCloseModals();
            });
    };

    const handlePageChange = (_, newPage) => {
        dispatch(setFacultyPage(newPage + 1));
        setRowsMounted(false);
    };

    const handleRowsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setFacultyLimit(newLimit));
        dispatch(setFacultyPage(1));
        setRowsMounted(false);
    };

    if (isLoading) {
        return <div>Загрузка данных...</div>;
    }

    if (errors.length > 0) {
        return (
            <div>
                Ошибка загрузки данных:
                <ul>
                    {errors.map((err, index) => (
                        <li key={index}>{err.message || err.toString()}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список факультетов</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleSearchMenuClick} className="action-button">
                            <SearchIcon />
                        </IconButton>
                        <IconButton onClick={handleResetSearch} className="action-button">
                            <RefreshIcon />
                        </IconButton>
                        <Menu
                            anchorEl={searchAnchorEl}
                            open={Boolean(searchAnchorEl)}
                            onClose={handleSearchMenuClose}
                            sx={{ maxWidth: 320 }}
                        >
                            <Box sx={{ p: 2, width: 280 }}>
                                <TextField
                                    label="Поиск по названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.nameQuery}
                                    onChange={handleSearchChange('nameQuery')}
                                />
                                <TextField
                                    label="Поиск по полному названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.fullNameQuery}
                                    onChange={handleSearchChange('fullNameQuery')}
                                />
                                <TextField
                                    label="Поиск по декану"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.deanQuery}
                                    onChange={handleSearchChange('deanQuery')}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={handleResetSearch}
                                        disabled={!searchValues.nameQuery && !searchValues.fullNameQuery && !searchValues.deanQuery}
                                        className="action-button"
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={handleSearch}
                                        className="action-button"
                                    >
                                        Поиск
                                    </Button>
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            {renderSortableHeader('name', 'Название')}
                            {renderSortableHeader('full_name', 'Полное название')}
                            <TableCell>Декан</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {facultiesData.map((faculty, index) => (
                            <TableRow
                                key={faculty.id}
                                className={`table-row ${rowsMounted ? 'show' : ''}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <TableCell>{faculty.name}</TableCell>
                                <TableCell>{faculty.full_name}</TableCell>
                                <TableCell>
                                    {faculty.dean_person ? (
                                        `${faculty.dean_person.surname} ${faculty.dean_person.name} ${faculty.dean_person.middlename || ''}`.trim()
                                    ) : faculty.dean_person_id ? (
                                        `ID: ${faculty.dean_person_id} (данные не загружены)`
                                    ) : (
                                        'Не указан'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={(e) => handleMenuClick(e, faculty)}
                                        className="action-button"
                                    >
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
                    count={meta.total}
                    rowsPerPage={meta.limit}
                    page={meta.page - 1}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    labelRowsPerPage="Строк на странице:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                    }
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
                    <Box
                        className={`modal-fade ${(openEditModal || openDeleteModal || openAddModal) ? 'active' : ''}`}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            borderRadius: 1,
                            p: 0
                        }}
                    >
                        <Box sx={{
                            bgcolor: '#1976d2',
                            color: 'white',
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTopLeftRadius: 1,
                            borderTopRightRadius: 1
                        }}>
                            <Typography variant="h6">
                                {openEditModal && "Редактировать факультет"}
                                {openDeleteModal && "Удалить факультет"}
                                {openAddModal && "Добавить факультет"}
                            </Typography>
                            <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            {openEditModal && (
                                <div>
                                    <TextField
                                        label="Название"
                                        fullWidth
                                        margin="normal"
                                        value={editFaculty.name}
                                        onChange={(e) => setEditFaculty({ ...editFaculty, name: e.target.value })}
                                    />
                                    <TextField
                                        label="Полное название"
                                        fullWidth
                                        margin="normal"
                                        value={editFaculty.full_name}
                                        onChange={(e) => setEditFaculty({ ...editFaculty, full_name: e.target.value })}
                                    />
                                    <PersonSelector
                                        value={editFaculty.dean_person_id}
                                        onChange={handleDeanChangeEdit}
                                        options={people}
                                        label="Декан факультета"
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals} className="action-button">Отмена</Button>
                                        <Button onClick={handleSaveEdit} color="primary" className="action-button">Сохранить</Button>
                                    </Box>
                                </div>
                            )}
                            {openDeleteModal && (
                                <div>
                                    <Typography>Вы уверены, что хотите удалить факультет "{currentRow?.name}"?</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals} className="action-button">Отмена</Button>
                                        <Button onClick={handleDeleteConfirm} color="error" className="action-button">Удалить</Button>
                                    </Box>
                                </div>
                            )}
                            {openAddModal && (
                                <div>
                                    <TextField
                                        label="Название"
                                        fullWidth
                                        margin="normal"
                                        value={newFaculty.name}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                                    />
                                    <TextField
                                        label="Полное название"
                                        fullWidth
                                        margin="normal"
                                        value={newFaculty.full_name}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, full_name: e.target.value })}
                                    />
                                    <PersonSelector
                                        value={newFaculty.dean_person_id}
                                        onChange={handleDeanChangeAdd}
                                        options={people}
                                        label="Декан факультета"
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals} className="action-button">Отмена</Button>
                                        <Button onClick={handleSaveAdd} color="primary" className="action-button">Добавить</Button>
                                    </Box>
                                </div>
                            )}
                        </Box>
                    </Box>
                </Modal>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAdd}
                        >
                            Добавить факультет
                        </Button>
                    </Box>
                </Box>
            </TableContainer>

            <div className={`alert-slide ${alertState.open ? 'active' : ''}`}>
                <Alert
                    open={alertState.open}
                    message={alertState.message}
                    severity={alertState.severity}
                    onClose={handleCloseAlert}
                />
            </div>
        </>
    );
};

export default FacultiesTable;