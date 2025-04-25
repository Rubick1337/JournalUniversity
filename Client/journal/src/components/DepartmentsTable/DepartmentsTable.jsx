import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, TablePagination, TextField, IconButton,
    Menu, MenuItem, Box, InputAdornment, Button, TableSortLabel
} from '@mui/material';
import { AddCircleOutline, MoreVert, Search, Refresh } from '@mui/icons-material'; // Добавлен иконка Refresh
import {
    fetchDepartments,
    setPage,
    setLimit,
    setSearchParams,
    deleteDepartment,
    updateDepartment,
    createDepartment
} from '../../store/slices/departmentSlice';
import { fetchPersons } from '../../store/slices/personSlice';
import { getAllFaculties } from '../../store/slices/facultySlice';
import DepartmentEditModal from './DepartmentEditModal';
import DepartmentAddModal from './DepartmentAddModal';
import DepartmentDeleteModal from './DepartmentDeleteModal';
import Alert from '../Alert/Alert';

const DepartmentsTable = () => {
    const dispatch = useDispatch();
    const {
        data: departmentsData = [],
        isLoading,
        errors = [],
        meta = { page: 1, limit: 10, total: 0 },
        searchParams: reduxSearchParams = {}
    } = useSelector(state => state.departments || {});

    const persons = useSelector(state => state.person?.data || []);
    const faculties = useSelector(state => state.faculty.facultiesList.data);

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [searchValues, setSearchValues] = useState({
        nameQuery: '',
        fullNameQuery: '',
        facultyQuery: ''
    });
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);
    const searchAnchorRef = useRef(null);

    useEffect(() => {
        dispatch(fetchDepartments({
            page: meta.page,
            limit: meta.limit,
            sortBy: orderBy,
            sortOrder: order,
            ...reduxSearchParams
        }));
        dispatch(fetchPersons({}));
        dispatch(getAllFaculties());
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
    useEffect(() => {
        if (alertState.open) {
            const timer = setTimeout(() => {
                setAlertState((prev) => ({ ...prev, open: false }));
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [alertState.open]);


    const toggleSearchMenu = () => {
        setSearchMenuOpen(!searchMenuOpen);
    };

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

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handleSearch = () => {
        debouncedSearch(searchValues);
        setSearchMenuOpen(false); // Закрыть меню поиска после выполнения поиска
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

    const formatHeadName = (head) => {
        if (!head) return 'Не указан';
        return `${head.surname} ${head.name} ${head.middlename || ''}`.trim();
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteDepartment(currentRow.id))
            .then(() => {
                setAlertState({
                    open: true,
                    message: 'Кафедра успешно удалена',
                    severity: 'success'
                });
                setOpenDeleteModal(false);
                refreshData();
            });
    };

    const handleSave = (values) => {
        if (currentRow) {
            // Получаем ID из значений или из объекта
            const headId = values.chairperson_of_the_department_person_id || values.head?.id;
            const facultyId = values.faculty_id || values.faculty?.id;

            const updateData = {
                name: values.name,
                full_name: values.full_name,
                head_person_id: headId, // Используем имя, которое ожидает сервер
                faculty_id: facultyId
            };

            console.log('Update data:', updateData);

            dispatch(updateDepartment({
                id: currentRow.id,
                data: updateData
            })).then(() => {
                refreshData();
                setOpenEditModal(false);
            });
        } else {
            dispatch(createDepartment(values)).then(() => {
                refreshData();
                setOpenAddModal(false);
            });
        }
    };

    const refreshData = () => {
        dispatch(fetchDepartments({
            page: meta.page,
            limit: meta.limit,
            sortBy: orderBy,
            sortOrder: order,
            ...reduxSearchParams
        }));
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

    const resetSearch = () => {
        const newSearchValues = {
            nameQuery: '',
            fullNameQuery: '',
            facultyQuery: ''
        };
        setSearchValues(newSearchValues);
        dispatch(setSearchParams(newSearchValues));
        setOrderBy('name');  // Сброс сортировки
        setOrder('asc');     // Сброс сортировки
        setSearchMenuOpen(false); // Закрыть меню поиска после сброса
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

    if (isLoading) {
        return <Box sx={{ p: 3, textAlign: 'center' }}>Загрузка данных...</Box>;
    }

    if (errors.length > 0) {
        return (
            <Box sx={{ p: 3, color: 'error.main' }}>
                Ошибка загрузки: {errors[0].message}
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список кафедр</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={toggleSearchMenu}
                            ref={searchAnchorRef}
                        >
                            <Search />
                        </IconButton>
                        <IconButton
                            onClick={resetSearch} // Кнопка сброса
                        >
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
                                    label="Поиск по сокращенному названию"
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
                                <TextField
                                    label="Поиск по полному названию"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.fullNameQuery}
                                    onChange={handleSearchChange('fullNameQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Поиск по факультету"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.facultyQuery}
                                    onChange={handleSearchChange('facultyQuery')}
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
                                        disabled={!searchValues.nameQuery && !searchValues.fullNameQuery && !searchValues.facultyQuery}
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={handleSearch}
                                        disabled={!searchValues.nameQuery && !searchValues.fullNameQuery && !searchValues.facultyQuery}
                                    >
                                        Поиск
                                    </Button>
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <Table sx={{ minWidth: 650 }} aria-label="Таблица кафедр">
                    <TableHead>
                        <TableRow>
                            {renderTableHeader('name', 'Сокращенное название')}
                            {renderTableHeader('full_name', 'Полное название')}
                            <TableCell sx={{ fontWeight: 'bold' }}>Заведующий</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Факультет</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departmentsData.length > 0 ? (
                            departmentsData.map(department => (
                                <TableRow
                                    key={department.id}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell>{department.full_name}</TableCell>
                                    <TableCell>{formatHeadName(department.head)}</TableCell>
                                    <TableCell>{department.faculty?.name || department.faculty}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => handleMenuClick(e, department)}
                                            aria-label="Действия"
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Нет данных о кафедрах
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
                        Добавить кафедру
                    </Button>
                </Box>
            </TableContainer>

            <DepartmentEditModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                department={currentRow}
                people={persons}
                faculties={faculties}
                onSave={handleSave}
            />

            <DepartmentAddModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                people={persons}
                faculties={faculties}
                onSave={handleSave}
            />

            <DepartmentDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                department={currentRow}
                onConfirm={handleDeleteConfirm}
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

export default DepartmentsTable;
