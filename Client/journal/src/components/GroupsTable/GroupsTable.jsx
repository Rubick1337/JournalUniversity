import React, { useState, useEffect, useRef } from 'react';
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
    Autocomplete,
    InputAdornment,
    Button,
    TableSortLabel
} from '@mui/material';
import { MoreVert, AddCircleOutline, Search, Refresh } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
    setPage,
    setLimit,
    setSearchParams,
    clearCurrentGroup
} from '../../store/slices/groupSlice';
import { getAllFaculties } from '../../store/slices/facultySlice';
import { fetchDepartments } from '../../store/slices/departmentSlice';
import { fetchAcademicSpecialties } from '../../store/slices/academicSpecialtySlice';
import { fetchPersons } from '../../store/slices/personSlice';
import Alert from '../Alert/Alert';
import AddGroupModal from './AddGroupModal';
import EditGroupModal from './EditGroupModal';
import DeleteGroupModal from './DeleteGroupModal';

const GroupsTable = () => {
    const dispatch = useDispatch();
    const {
        data: groupsData = [],
        currentGroup,
        isLoading,
        errors = [],
        meta = { page: 1, limit: 10, total: 0 },
        searchParams: reduxSearchParams = {}
    } = useSelector(state => state.groups);

    const { data: faculties } = useSelector(state => state.faculty.facultiesList);
    const { data: departments } = useSelector(state => state.departments);
    const { data: specialities } = useSelector(state => state.academicSpecialties);
    const students = useSelector(state => state.person?.data || []);

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);
    const [searchValues, setSearchValues] = useState({
        nameQuery: '',
        facultyQuery: '',
        departmentQuery: '',
        specialtyQuery: ''
    });
    const searchAnchorRef = useRef(null);

    useEffect(() => {
        dispatch(fetchGroups({
            page: meta.page,
            limit: meta.limit,
            sortBy: orderBy,
            sortOrder: order,
            ...reduxSearchParams
        }));
        dispatch(getAllFaculties({ limit: 100 }));
        dispatch(fetchDepartments({ limit: 100 }));
        dispatch(fetchAcademicSpecialties({ limit: 100 }));
        dispatch(fetchPersons({ limit: 100 }));
    }, [dispatch, meta.page, meta.limit, orderBy, order, reduxSearchParams]);

    useEffect(() => {
        if (errors.length > 0) {
            setAlertState({
                open: true,
                message: errors[0].message || 'Произошла ошибка',
                severity: 'error'
            });
        }
    }, [errors]);

    const debouncedSearch = debounce((params) => {
        dispatch(setSearchParams(params));
    }, 300);

    const handleSearchChange = (field) => (e) => {
        const newSearchValues = {
            ...searchValues,
            [field]: e.target.value
        };
        setSearchValues(newSearchValues);
    };

    const handleSearch = () => {
        debouncedSearch(searchValues);
        setSearchMenuOpen(false);
    };

    const resetSearch = () => {
        const newSearchValues = {
            nameQuery: '',
            facultyQuery: '',
            departmentQuery: '',
            specialtyQuery: ''
        };
        setSearchValues(newSearchValues);
        dispatch(setSearchParams(newSearchValues));
        setOrderBy('name');
        setOrder('asc');
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
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
    };

    const handleSaveAdd = async (newGroupData) => {
        try {
            await dispatch(createGroup({
                name: newGroupData.name,
                graduationYear: newGroupData.endYear,
                yearOfBeginningOfStudy: newGroupData.startYear,
                facultyId: newGroupData.facultyId,
                departmentId: newGroupData.departmentId,
                academicSpecialtyCode: newGroupData.specialityCode,
                classRepresentativeId: newGroupData.headmanId,
                teacherCuratorId: newGroupData.teacherCuratorId
            })).unwrap();

            setAlertState({
                open: true,
                message: 'Группа успешно добавлена!',
                severity: 'success'
            });
        } catch (error) {
            setAlertState({
                open: true,
                message: error.message || 'Ошибка при добавлении группы',
                severity: 'error'
            });
        }
    };

    const handleSaveEdit = async (updatedGroupData) => {
        try {
            await dispatch(updateGroup({
                id: currentRow.id,
                data: {
                    name: updatedGroupData.name,
                    graduationYear: updatedGroupData.endYear,
                    yearOfBeginningOfStudy: updatedGroupData.startYear,
                    facultyId: updatedGroupData.facultyId,
                    departmentId: updatedGroupData.departmentId,
                    academicSpecialtyCode: updatedGroupData.specialityCode,
                    classRepresentativeId: updatedGroupData.headmanId,
                    teacherCuratorId: updatedGroupData.teacherCuratorId
                }
            })).unwrap();

            setAlertState({
                open: true,
                message: 'Группа успешно обновлена!',
                severity: 'success'
            });
        } catch (error) {
            setAlertState({
                open: true,
                message: error.message || 'Ошибка при обновлении группы',
                severity: 'error'
            });
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteGroup(currentRow.id)).unwrap();
            setAlertState({
                open: true,
                message: 'Группа успешно удалена!',
                severity: 'success'
            });
        } catch (error) {
            setAlertState({
                open: true,
                message: error.message || 'Ошибка при удалении группы',
                severity: 'error'
            });
        }
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

    const handleEdit = () => {
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setCurrentRow(null);
        setOpenAddModal(true);
    };

    const toggleSearchMenu = () => {
        setSearchMenuOpen(!searchMenuOpen);
    };

    const renderSortableHeader = (property, label) => (
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

    if (isLoading) return <Box sx={{ p: 3, textAlign: 'center' }}>Загрузка данных...</Box>;
    if (errors.length > 0) return <Box sx={{ p: 3, color: 'error.main' }}>Ошибка загрузки: {errors[0].message}</Box>;

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список групп</Typography>
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
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            sx={{ maxWidth: 400 }}
                        >
                            <Box sx={{ p: 2, width: 350 }}>
                                <TextField
                                    label="Поиск по названию группы"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.nameQuery}
                                    onChange={handleSearchChange('nameQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Autocomplete
                                    options={faculties?.map(f => f.name) || []}
                                    value={searchValues.facultyQuery}
                                    onChange={(_, newValue) => {
                                        setSearchValues(prev => ({
                                            ...prev,
                                            facultyQuery: newValue || ''
                                        }));
                                    }}
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
                                />
                                <Autocomplete
                                    options={departments?.map(d => d.name) || []}
                                    value={searchValues.departmentQuery}
                                    onChange={(_, newValue) => {
                                        setSearchValues(prev => ({
                                            ...prev,
                                            departmentQuery: newValue || ''
                                        }));
                                    }}
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
                                />
                                <Autocomplete
                                    options={specialities?.map(s => s.code) || []}
                                    value={searchValues.specialtyQuery}
                                    onChange={(_, newValue) => {
                                        setSearchValues(prev => ({
                                            ...prev,
                                            specialtyQuery: newValue || ''
                                        }));
                                    }}
                                    getOptionLabel={(option) => {
                                        const spec = specialities?.find(s => s.code === option);
                                        return spec ? `${option} (${spec.name})` : option;
                                    }}
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
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={resetSearch}
                                        disabled={!searchValues.nameQuery && !searchValues.facultyQuery &&
                                            !searchValues.departmentQuery && !searchValues.specialtyQuery}
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={handleSearch}
                                        disabled={!searchValues.nameQuery && !searchValues.facultyQuery &&
                                            !searchValues.departmentQuery && !searchValues.specialtyQuery}
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
                            {renderSortableHeader('year_of_beginning_of_study', 'Год начала')}
                            {renderSortableHeader('graduation_year', 'Год окончания')}
                            <TableCell sx={{ fontWeight: 'bold' }}>Факультет</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Кафедра</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Код специальности</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Староста</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupsData.length > 0 ? (
                            groupsData.map(group => (
                                <TableRow key={group.id}>
                                    <TableCell>{group.name}</TableCell>
                                    <TableCell>{group.yearOfBeginningOfStudy}</TableCell>
                                    <TableCell>{group.graduationYear}</TableCell>
                                    <TableCell>{group.faculty?.name}</TableCell>
                                    <TableCell>{group.department?.name}</TableCell>
                                    <TableCell>{group.academicSpecialty?.code}</TableCell>
                                    <TableCell>
                                        {group.classRepresentative
                                            ? `${group.classRepresentative.surname} ${group.classRepresentative.name}`
                                            : 'Не назначен'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => handleMenuClick(e, group)}
                                            aria-label="Действия"
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Нет данных о группах
                                </TableCell>
                            </TableRow>
                        )}
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
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
                    <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                </Menu>

                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutline />}
                        onClick={handleAdd}
                    >
                        Добавить группу
                    </Button>
                </Box>
            </TableContainer>

            <AddGroupModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                faculties={faculties || []}
                departments={departments || []}
                specialities={specialities || []}
                students={students || []}
                onSave={handleSaveAdd}
                showAlert={setAlertState}
            />

            <EditGroupModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    dispatch(clearCurrentGroup());
                }}
                group={currentGroup || currentRow}
                faculties={faculties || []}
                departments={departments || []}
                specialities={specialities || []}
                students={students || []}
                onSave={handleSaveEdit}
                showAlert={setAlertState}
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
                onClose={handleCloseAlert}
            />
        </>
    );
};

export default GroupsTable;