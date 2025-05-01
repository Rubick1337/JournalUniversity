import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, TablePagination, TextField, IconButton,
    Menu, MenuItem, Box, InputAdornment, Button, TableSortLabel,
    Autocomplete
} from '@mui/material';
import { AddCircleOutline, MoreVert, Search, Refresh } from '@mui/icons-material';
import Alert from '../Alert/Alert';
import AddDisciplineModal from './AddDisciplineModal';
import EditDisciplineModal from './EditDisciplineModal';
import DeleteDisciplineModal from './DeleteDisciplineModal';
import { fetchDepartments } from '../../store/slices/departmentSlice';
import {
    fetchSubjects,
    setPage,
    setLimit,
    setSearchParams,
    clearCurrentSubject,
    clearErrors,
    deleteSubject,
    updateSubject,
    createSubject,
    getSubjectById
} from '../../store/slices/subjectSlice';

const DisciplinesTable = React.memo(() => {
    const dispatch = useDispatch();
    const {
        data: subjects = [],
        currentSubject,
        isLoading,
        errors = [],
        meta = { page: 1, limit: 10, total: 0 },
        searchParams: reduxSearchParams = {}
    } = useSelector(state => state.subjects || {});

    const { data: departments = [] } = useSelector(state => state.departments || {});

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [searchValues, setSearchValues] = useState({
        nameQuery: '',
        departmentQuery: ''
    });
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const searchAnchorRef = useRef(null);

    const fetchData = useCallback(() => {
        dispatch(fetchSubjects({
            page: meta.page,
            limit: meta.limit,
            sortBy: orderBy,
            sortOrder: order,
            ...reduxSearchParams
        }));
    }, [dispatch, meta.page, meta.limit, orderBy, order, reduxSearchParams]);

    useEffect(() => {
        fetchData();
        dispatch(fetchDepartments({}));
    }, [fetchData, dispatch]);

    useEffect(() => {
        if (errors.length > 0) {
            setAlertState({
                open: true,
                message: errors[0].message || 'Произошла ошибка',
                severity: 'error'
            });
            dispatch(clearErrors());
        }
    }, [errors, dispatch]);

    const debouncedSearch = useCallback(
        debounce((params) => {
            dispatch(setSearchParams(params));
        }, 300),
        [dispatch]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = useCallback((field) => (e) => {
        const newSearchValues = {
            ...searchValues,
            [field]: e.target.value
        };
        setSearchValues(newSearchValues);
    }, [searchValues]);

    const handleSearch = useCallback(() => {
        debouncedSearch(searchValues);
        setSearchMenuOpen(false);
    }, [debouncedSearch, searchValues]);

    const handleSort = useCallback((property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }, [orderBy, order]);

    const handlePageChange = useCallback((_, newPage) => {
        dispatch(setPage(newPage + 1));
    }, [dispatch]);

    const handleRowsPerPageChange = useCallback((e) => {
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
    }, [dispatch]);

    const resetSearch = useCallback(() => {
        const newSearchValues = {
            nameQuery: '',
            departmentQuery: ''
        };
        setSearchValues(newSearchValues);
        dispatch(setSearchParams(newSearchValues));
        setOrderBy('name');
        setOrder('asc');
        setSearchMenuOpen(false);
    }, [dispatch]);

    const handleCloseAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, open: false }));
    }, []);

    const handleMenuClick = useCallback((event, subject) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedSubject(subject);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleEdit = useCallback(async (e) => {
        e.stopPropagation();
        if (selectedSubject) {
            await dispatch(getSubjectById(selectedSubject.id));
            setOpenEditModal(true);
            handleMenuClose();
        }
    }, [dispatch, selectedSubject, handleMenuClose]);

    const handleDelete = useCallback(async (e) => {
        e.stopPropagation();
        if (selectedSubject) {
            await dispatch(getSubjectById(selectedSubject.id));
            setOpenDeleteModal(true);
            handleMenuClose();
        }
    }, [dispatch, selectedSubject, handleMenuClose]);

    const handleAdd = useCallback(() => {
        setOpenAddModal(true);
    }, []);

    const renderTableHeader = useCallback((property, label) => (
        <TableCell sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
                active={orderBy === property}
                direction={orderBy === property ? order : 'asc'}
                onClick={() => handleSort(property)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    ), [handleSort, orderBy, order]);

    const toggleSearchMenu = useCallback(() => {
        setSearchMenuOpen(!searchMenuOpen);
    }, [searchMenuOpen]);

    if (isLoading) {
        return <Box sx={{ p: 3, textAlign: 'center' }}>Загрузка данных...</Box>;
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список дисциплин</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={toggleSearchMenu} ref={searchAnchorRef}>
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Autocomplete
                                    options={['', ...departments.map(d => d.name)]}
                                    value={searchValues.departmentQuery}
                                    onChange={(event, newValue) => {
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
                                    renderOption={(props, option) => (
                                        <MenuItem {...props}>
                                            {option === '' ? 'Все кафедры' : option}
                                        </MenuItem>
                                    )}
                                    getOptionLabel={(option) => option === '' ? 'Все кафедры' : option}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={resetSearch}
                                        disabled={!searchValues.nameQuery && !searchValues.departmentQuery}
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={handleSearch}
                                        disabled={!searchValues.nameQuery && !searchValues.departmentQuery}
                                    >
                                        Поиск
                                    </Button>
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <Table sx={{ minWidth: 650 }} aria-label="Таблица дисциплин">
                    <TableHead>
                        <TableRow>
                            {renderTableHeader('name', 'Название дисциплины')}
                            {renderTableHeader('department.name', 'Кафедра')}
                            <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.length > 0 ? (
                            subjects.map(subject => (
                                <TableRow
                                    key={subject.id}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{subject.name}</TableCell>
                                    <TableCell>{subject.department?.name || 'Не указана'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => handleMenuClick(e, subject)}
                                            aria-label="Действия"
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Нет данных о дисциплинах
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
                    onClick={(e) => e.stopPropagation()}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
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
                        Добавить дисциплину
                    </Button>
                </Box>
            </TableContainer>

            <AddDisciplineModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                onSave={(data) => dispatch(createSubject(data))}
                showAlert={setAlertState}
                departments={departments}
            />

            <EditDisciplineModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    dispatch(clearCurrentSubject());
                }}
                subject={currentSubject}
                onSave={async (data) => {
                    const resultAction = await dispatch(updateSubject({
                        id: currentSubject?.id,
                        data
                    }));

                    if (updateSubject.fulfilled.match(resultAction)) {
                        dispatch(fetchSubjects({
                            page: meta.page,
                            limit: meta.limit,
                            sortBy: orderBy,
                            sortOrder: order,
                            ...reduxSearchParams
                        }));
                    }

                    return resultAction;
                }}
                showAlert={setAlertState}
                departments={departments}
            />


            <DeleteDisciplineModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                subject={currentSubject}
                onDelete={() => dispatch(deleteSubject(currentSubject?.id))}
            />

            <Alert
                open={alertState.open}
                message={alertState.message}
                severity={alertState.severity}
                onClose={handleCloseAlert}
            />
        </>
    );
});

export default DisciplinesTable;