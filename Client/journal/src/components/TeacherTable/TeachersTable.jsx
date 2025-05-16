import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, TablePagination, TextField, IconButton,
    Menu, MenuItem, Box, InputAdornment, Button, TableSortLabel
} from '@mui/material';
import { AddCircleOutline, MoreVert, Search, Refresh } from '@mui/icons-material';
import {
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    clearCurrentTeacher,
    setPage,
    setLimit,
    setSearchParams
} from '../../store/slices/teacherSlice';
import Alert from '../Alert/Alert';
import AddTeacherModal from './AddTeacherModal';
import EditTeacherModal from './EditTeacherModal';
import DeleteTeacherModal from './DeleteTeacherModal';
import { PersonModal } from '../PersonCreationModal/PersonCreationModal';
import { fetchPersons } from "../../store/slices/personSlice";
import { fetchDepartments } from "../../store/slices/departmentSlice";
import { fetchTeacherPositions } from "../../store/slices/teacherPositionSlice";

const TeachersTable = () => {
    const dispatch = useDispatch();
    const {
        data: teachersData,
        currentTeacher,
        isLoading,
        errors,
        meta,
        searchParams
    } = useSelector(state => state.teachers);

    const departments = useSelector(state => state.departments?.data || []);
    const positions = useSelector(state => state.teacherPositions?.data || []);
    const persons = useSelector(state => state.person.data || []);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [personInputValue, setPersonInputValue] = useState('');
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);
    const [localSearchValues, setLocalSearchValues] = useState({
        personQuery: '',
        departmentQuery: '',
        positionQuery: ''
    });
    const searchAnchorRef = useRef(null);

    const fetchData = useCallback(() => {
        dispatch(fetchTeachers({
            page: meta.page,
            limit: meta.limit,
            sortBy: orderBy,
            sortOrder: order,
            ...searchParams
        }));
    }, [dispatch, meta.page, meta.limit, orderBy, order, searchParams]);

    useEffect(() => {
        fetchData();
        dispatch(fetchPersons({}));
        dispatch(fetchDepartments({}));
        dispatch(fetchTeacherPositions({}));
    }, [fetchData, dispatch]);

    useEffect(() => {
        if (errors.length > 0) {
            setAlertState({
                open: true,
                message: errors[0].message || 'Произошла ошибка',
                severity: 'error'
            });
        }
    }, [errors]);

    const toggleSearchMenu = () => {
        setSearchMenuOpen(!searchMenuOpen);
    };

    const debouncedSearch = useRef(
        debounce((params) => {
            dispatch(setSearchParams(params));
        }, 300)
    ).current;

    const handleSearchChange = (field) => (e) => {
        const newSearchValues = {
            ...localSearchValues,
            [field]: e.target.value
        };
        setLocalSearchValues(newSearchValues);
    };

    const handleSearch = () => {
        debouncedSearch(localSearchValues);
        setSearchMenuOpen(false);
    };

    const resetSearch = () => {
        const newSearchValues = {
            personQuery: '',
            departmentQuery: '',
            positionQuery: ''
        };
        setLocalSearchValues(newSearchValues);
        dispatch(setSearchParams(newSearchValues));
        setSearchMenuOpen(false);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handlePageChange = (_, newPage) => {
        dispatch(setPage(newPage + 1));
    };

    const handleRowsPerPageChange = (e) => {
        dispatch(setLimit(parseInt(e.target.value, 10)));
        dispatch(setPage(1));
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    const handleMenuClick = (event, teacher) => {
        setAnchorEl(event.currentTarget);
        setSelectedTeacher(teacher);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        if (selectedTeacher) {
            dispatch(getTeacherById(selectedTeacher.id))
                .then(() => {
                    setOpenEditModal(true);
                    handleMenuClose();
                });
        }
    };

    const handleDelete = () => {
        if (selectedTeacher) {
            dispatch(getTeacherById(selectedTeacher.id))
                .then(() => {
                    setOpenDeleteModal(true);
                    handleMenuClose();
                });
        }
    };

    const handleAdd = () => {
        setOpenAddModal(true);
    };

    const handleSaveAdd = async (newTeacher) => {
        try {
            await dispatch(createTeacher(newTeacher));
            showAlert('Преподаватель успешно добавлен!', 'success');
            fetchData();
        } catch (error) {
            showAlert('Ошибка при добавлении преподавателя', 'error');
        }
    };

    const handleSaveEdit = async (updatedTeacher) => {
        try {
            await dispatch(updateTeacher({
                id: currentTeacher.id,
                data: updatedTeacher
            }));
            showAlert('Преподаватель успешно обновлен!', 'success');
            fetchData();
        } catch (error) {
            showAlert('Ошибка при обновлении преподавателя', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteTeacher(currentTeacher.id));
            showAlert('Преподаватель успешно удален!', 'success');
            fetchData();
        } catch (error) {
            showAlert('Ошибка при удалении преподавателя', 'error');
        }
    };

    const showAlert = (message, severity = 'success') => {
        setAlertState({
            open: true,
            message,
            severity
        });
    };

    const handlePersonInputChange = (_, value) => {
        setPersonInputValue(value);
    };

    const handleAddNewPerson = (newPerson, error) => {
        if (error) {
            showAlert(error, 'error');
            return;
        }
        showAlert('Человек успешно добавлен!', 'success');
        setOpenPersonModal(false);
    };

    const renderTableHeader = (property, label) => (
        <TableCell sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
                active={orderBy === property}
                direction={orderBy === property ? order : 'asc'}
                onClick={() => handleSort(property)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );

    if (isLoading) return <div>Загрузка данных...</div>;
    if (errors.length > 0) return <div>Ошибка загрузки данных: {errors[0].message}</div>;

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список преподавателей</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={toggleSearchMenu}
                            ref={searchAnchorRef}
                        >
                            <Search />
                        </IconButton>
                        <IconButton onClick={resetSearch}>
                            <Refresh />
                        </IconButton>
                        <Menu
                            anchorEl={searchAnchorRef.current}
                            open={searchMenuOpen}
                            onClose={toggleSearchMenu}
                            sx={{ maxWidth: 400 }}
                        >
                            <Box sx={{ p: 2, width: 350 }}>
                                <TextField
                                    label="Поиск по ФИО"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={localSearchValues.personQuery}
                                    onChange={handleSearchChange('personQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Поиск по кафедре"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={localSearchValues.departmentQuery}
                                    onChange={handleSearchChange('departmentQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Поиск по должности"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={localSearchValues.positionQuery}
                                    onChange={handleSearchChange('positionQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={resetSearch}
                                        disabled={!localSearchValues.personQuery &&
                                            !localSearchValues.departmentQuery &&
                                            !localSearchValues.positionQuery}
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={handleSearch}
                                        disabled={!localSearchValues.personQuery &&
                                            !localSearchValues.departmentQuery &&
                                            !localSearchValues.positionQuery}
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
                            {renderTableHeader('person.surname', 'ФИО')}
                            {renderTableHeader('department.name', 'Кафедра')}
                            {renderTableHeader('teachingPosition.name', 'Должность')}
                            <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teachersData.map(teacher => (
                            <TableRow key={teacher.id}>
                                <TableCell>{teacher.person?.surname} {teacher.person?.name} {teacher.person?.middlename}</TableCell>
                                <TableCell>{teacher.department?.name}</TableCell>
                                <TableCell>{teacher.teachingPosition?.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, teacher)}>
                                        <MoreVert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={meta.total || 0}
                    rowsPerPage={meta.limit}
                    page={meta.page - 1}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
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
                        <AddCircleOutline sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </TableContainer>

            <AddTeacherModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                departments={departments}
                people={persons}
                positions={positions}
                onSave={handleSaveAdd}
                showAlert={showAlert}
                personInputValue={personInputValue}
                onPersonInputChange={handlePersonInputChange}
                onAddPersonClick={() => setOpenPersonModal(true)}
            />

            <EditTeacherModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    dispatch(clearCurrentTeacher());
                }}
                teacher={currentTeacher}
                departments={departments}
                people={persons}
                positions={positions}
                onSave={handleSaveEdit}
                showAlert={showAlert}
                personInputValue={personInputValue}
                onPersonInputChange={handlePersonInputChange}
                onAddPersonClick={() => setOpenPersonModal(true)}
            />

            <DeleteTeacherModal
                open={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false);
                    dispatch(clearCurrentTeacher());
                }}
                teacher={currentTeacher}
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
                onClose={handleCloseAlert}
            />
        </>
    );
};

export default React.memo(TeachersTable);