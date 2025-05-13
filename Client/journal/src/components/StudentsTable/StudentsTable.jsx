import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
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
    CircularProgress,
    TableSortLabel,
    InputAdornment
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import Alert from '../Alert/Alert';
import { PersonModal } from '../PersonCreationModal/PersonCreationModal';
import PersonSelector from '../DepartmentsTable/PersonSelector';
import {
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    setPage,
    setLimit,
    setSearchParams,
    clearErrors,
    clearCurrentStudent
} from '../../store/slices/studentSlice';
import {
    fetchGroups,
    setPage as setGroupPage,
    setLimit as setGroupLimit,
    setSearchParams as setGroupSearchParams
} from '../../store/slices/groupSlice';
import {
    fetchSubgroups,
    setPage as setSubgroupPage,
    setLimit as setSubgroupLimit,
    setSearchParams as setSubgroupSearchParams
} from '../../store/slices/subgroupSlice';
import { fetchPersons } from '../../store/slices/personSlice';

const StudentsTable = () => {
    const dispatch = useDispatch();
    const searchAnchorRef = useRef(null);

    // Состояние из Redux
    const {
        data: studentsData,
        isLoading: studentsLoading,
        errors: studentsErrors,
        meta: studentsMeta,
        searchParams: studentsSearchParams
    } = useSelector(state => state.students);
    console.log(studentsData)
    const {
        data: groupsData,
        isLoading: groupsLoading,
        meta: groupsMeta
    } = useSelector(state => state.groups);

    const {
        data: subgroupsData,
        isLoading: subgroupsLoading,
        meta: subgroupsMeta
    } = useSelector(state => state.subgroups);

    const persons = useSelector(state => state.person?.data || []);

    // Локальное состояние для UI
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);
    const [orderBy, setOrderBy] = useState('person.surname');
    const [order, setOrder] = useState('ASC');
    const [searchValues, setSearchValues] = useState({
        idQuery: '',
        surnameQuery: '',
        nameQuery: '',
        groupQuery: '',
        subgroupQuery: '',
        parentQuery: '',
        reprimandQuery: ''
    });
    const [loadingSubgroups, setLoadingSubgroups] = useState(false);

    const [newStudent, setNewStudent] = useState({
        name: '',
        reprimands: 0,
        group: '',
        groupId: '',
        subgroup: '',
        subgroupId: '',
        parent: '',
        perentPersonId: '',
        personId: ''
    });

    const [editStudent, setEditStudent] = useState({
        name: '',
        reprimands: 0,
        group: '',
        groupId: '',
        subgroup: '',
        subgroupId: '',
        parent: '',
        perentPersonId: '',
        personId: ''
    });

    // Загрузка данных при монтировании и изменении параметров
    useEffect(() => {
        dispatch(fetchStudents({
            page: studentsMeta.page,
            limit: studentsMeta.limit,
            sortBy: orderBy,
            sortOrder: order,
            query: studentsSearchParams
        }));

        dispatch(fetchGroups({}));
        dispatch(fetchPersons({}));
        dispatch(fetchSubgroups({}));
    }, [dispatch, studentsMeta.page, studentsMeta.limit, orderBy, order, studentsSearchParams]);

    // Показ ошибок
    useEffect(() => {
        if (studentsErrors.length > 0) {
            showAlert(studentsErrors[0].message, 'error');
            dispatch(clearErrors());
        }
    }, [studentsErrors, dispatch]);

    // Инициализация параметров поиска
    useEffect(() => {
        if (studentsSearchParams) {
            setSearchValues({
                idQuery: studentsSearchParams.idQuery || '',
                surnameQuery: studentsSearchParams.surnameQuery || '',
                nameQuery: studentsSearchParams.nameQuery || '',
                groupQuery: studentsSearchParams.groupQuery || '',
                subgroupQuery: studentsSearchParams.subgroupQuery || '',
                parentQuery: studentsSearchParams.parentQuery || '',
                reprimandQuery: studentsSearchParams.reprimandQuery || ''
            });
        }
    }, [studentsSearchParams]);

    // Функция для показа уведомлений
    const showAlert = (message, severity = 'success') => {
        setAlertState({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    // Функции для работы с поиском
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

    const handleGroupSearchSelect = async (groupName) => {
        const newSearchValues = {
            ...searchValues,
            groupQuery: groupName,
            subgroupQuery: '' // Сбрасываем подгруппу при изменении группы
        };

        setSearchValues(newSearchValues);

        // Загружаем подгруппы для выбранной группы
        if (groupName) {
            setLoadingSubgroups(true);
            try {
                await dispatch(fetchSubgroups({
                    groupQuery: groupName,
                    limit: 100
                }));
            } finally {
                setLoadingSubgroups(false);
            }
        }
    };

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handleSearch = () => {
        debouncedSearch.cancel();
        dispatch(setSearchParams(searchValues));
        dispatch(fetchStudents({
            page: 1,
            limit: studentsMeta.limit,
            sortBy: orderBy,
            sortOrder: order,
        }));
    };

    const resetSearch = () => {
        const newSearchValues = {
            idQuery: '',
            surnameQuery: '',
            nameQuery: '',
            groupQuery: '',
            subgroupQuery: '',
            parentQuery: '',
            reprimandQuery: ''
        };

        debouncedSearch.cancel();
        setSearchValues(newSearchValues);
        dispatch(setSearchParams(newSearchValues));
        setOrderBy('person.surname');
        setOrder('ASC');

        dispatch(fetchStudents({
            page: 1,
            limit: studentsMeta.limit,
            sortBy: 'person.surname',
            sortOrder: 'ASC'
        }));
    };

    // Сортировка таблицы
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'ASC';
        setOrder(isAsc ? 'DESC' : 'ASC');
        setOrderBy(property);
    };

    const renderTableHeader = (property, label) => (
        <TableCell sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
                active={orderBy === property}
                direction={orderBy === property ? order.toLowerCase() : 'asc'}
                onClick={() => handleSort(property)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );

    // Работа с контекстным меню
    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Обработчики для модальных окон
    const handleEdit = () => {
        setEditStudent({
            name: currentRow.name,
            reprimands: currentRow.reprimands,
            group: currentRow.group.name,
            groupId: currentRow.group.id,
            subgroup: currentRow.subgroup.name,
            subgroupId: currentRow.subgroup.id,
            parent: currentRow.perent ?
                `${currentRow.perent.surname} ${currentRow.perent.name} ${currentRow.perent.middlename || ''}` : '',
            perentPersonId: currentRow.perent?.id || '',
            personId: currentRow.person.id
        });
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewStudent({
            name: '',
            reprimands: 0,
            group: '',
            groupId: '',
            subgroup: '',
            subgroupId: '',
            parent: '',
            perentPersonId: '',
            personId: ''
        });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        dispatch(clearCurrentStudent());
    };

    // Выбор персоны (студента или родителя)
    const handlePersonSelect = (selectedPerson, field = 'student') => {
        if (!selectedPerson) {
            if (openEditModal) {
                setEditStudent(prev => ({
                    ...prev,
                    ...(field === 'student' ? {
                        name: '',
                        personId: null
                    } : {
                        parent: '',
                        perentPersonId: null
                    })
                }));
            } else if (openAddModal) {
                setNewStudent(prev => ({
                    ...prev,
                    ...(field === 'student' ? {
                        name: '',
                        personId: null
                    } : {
                        parent: '',
                        perentPersonId: null
                    })
                }));
            }
            return;
        }

        const fullName = `${selectedPerson.surname} ${selectedPerson.name} ${selectedPerson.middlename || ''}`.trim();

        if (openEditModal) {
            setEditStudent(prev => ({
                ...prev,
                ...(field === 'student' ? {
                    name: fullName,
                    personId: selectedPerson.id
                } : {
                    parent: fullName,
                    perentPersonId: selectedPerson.id
                })
            }));
        } else if (openAddModal) {
            setNewStudent(prev => ({
                ...prev,
                ...(field === 'student' ? {
                    name: fullName,
                    personId: selectedPerson.id
                } : {
                    parent: fullName,
                    perentPersonId: selectedPerson.id
                })
            }));
        }
    };

    // Выбор группы с загрузкой подгрупп
    const handleGroupSelect = async (groupName, isEdit) => {
        const selectedGroup = groupsData.find(g => g.name === groupName);

        if (isEdit) {
            setEditStudent(prev => ({
                ...prev,
                group: groupName,
                groupId: selectedGroup?.id || '',
                subgroup: '',
                subgroupId: ''
            }));
        } else {
            setNewStudent(prev => ({
                ...prev,
                group: groupName,
                groupId: selectedGroup?.id || '',
                subgroup: '',
                subgroupId: ''
            }));
        }

        setLoadingSubgroups(true);
        try {
            await dispatch(fetchSubgroups({
                groupQuery: groupName,
                limit: 100
            }));
        } finally {
            setLoadingSubgroups(false);
        }
    };

    // Выбор подгруппы
    const handleSubgroupSelect = (subgroupName, isEdit) => {
        const selectedSubgroup = subgroupsData.find(s => s.name === subgroupName);
        if (isEdit) {
            setEditStudent(prev => ({
                ...prev,
                subgroup: subgroupName,
                subgroupId: selectedSubgroup?.id || ''
            }));
        } else {
            setNewStudent(prev => ({
                ...prev,
                subgroup: subgroupName,
                subgroupId: selectedSubgroup?.id || ''
            }));
        }
    };

    // Пагинация
    const handlePageChange = (_, newPage) => {
        dispatch(setPage(newPage + 1));
    };

    const handleRowsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
    };

    // Сохранение изменений
    const handleSaveEdit = () => {
        const updateData = {
            count_reprimand: editStudent.reprimands ?? 0,
            icon_path: editStudent.iconPath ?? '',
            person_id: editStudent.personId,
            group_id: editStudent.groupId,
            subgroup_id: editStudent.subgroupId,
            perent_person_id: editStudent.perentPersonId
        };

        dispatch(updateStudent({
            id: currentRow.id,
            data: updateData
        })).then(() => {
            showAlert('Данные студента успешно обновлены!', 'success');
            handleCloseModals();
        });
    };

    // Добавление нового студента
    const handleSaveAdd = () => {
        if (!newStudent.personId || !newStudent.groupId || !newStudent.subgroupId) {
            showAlert('Заполните все обязательные поля!', 'error');
            return;
        }

        const createData = {
            count_reprimand: newStudent.reprimands ?? 0,
            icon_path: newStudent.iconPath ?? '',
            person_id: newStudent.personId,
            group_id: newStudent.groupId,
            subgroup_id: newStudent.subgroupId,
            perent_person_id: newStudent.perentPersonId ?? null
        };

        console.log("Sending to server:", createData);

        dispatch(createStudent(createData)).then(() => {
            showAlert('Студент успешно добавлен!', 'success');
            handleCloseModals();
        });
    };

    // Удаление студента
    const handleDeleteConfirm = () => {
        dispatch(deleteStudent(currentRow.id)).then(() => {
            showAlert('Студент успешно удален!', 'success');
            handleCloseModals();
        });
    };

    // Мемоизированные данные для таблицы
    const filteredData = useMemo(() => studentsData, [studentsData]);

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список студентов</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={toggleSearchMenu}
                            ref={searchAnchorRef}
                        >
                            <SearchIcon />
                        </IconButton>
                        <IconButton onClick={resetSearch}>
                            <RefreshIcon />
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
                                    label="Поиск по ID зачетки"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.idQuery}
                                    onChange={handleSearchChange('idQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Поиск по фамилии"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.surnameQuery}
                                    onChange={handleSearchChange('surnameQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Поиск по имени"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.nameQuery}
                                    onChange={handleSearchChange('nameQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Поиск по выговорам"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.reprimandQuery}
                                    onChange={handleSearchChange('reprimandQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControl fullWidth margin="normal" size="small">
                                    <InputLabel>Поиск по группе</InputLabel>
                                    <Select
                                        value={searchValues.groupQuery}
                                        onChange={(e) => handleGroupSearchSelect(e.target.value)}
                                        label="Поиск по группе"
                                    >
                                        <SelectMenuItem value="">Все группы</SelectMenuItem>
                                        {groupsData.map((group) => (
                                            <SelectMenuItem key={group.id} value={group.name}>{group.name}</SelectMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal" size="small">
                                    <InputLabel>Поиск по подгруппе</InputLabel>
                                    <Select
                                        value={searchValues.subgroupQuery}
                                        onChange={handleSearchChange('subgroupQuery')}
                                        label="Поиск по подгруппе"
                                        disabled={!searchValues.groupQuery || loadingSubgroups}
                                    >
                                        <SelectMenuItem value="">Все подгруппы</SelectMenuItem>
                                        {loadingSubgroups ? (
                                            <SelectMenuItem disabled>
                                                <CircularProgress size={24} />
                                            </SelectMenuItem>
                                        ) : (
                                            subgroupsData
                                                .filter(subgroup => subgroup.group_id && subgroup.group_id.name === searchValues.groupQuery)
                                                .map((subgroup) => (
                                                    <SelectMenuItem key={subgroup.id} value={subgroup.name}>
                                                        {subgroup.name}
                                                    </SelectMenuItem>
                                                ))
                                        )}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Поиск по родителю"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.parentQuery}
                                    onChange={handleSearchChange('parentQuery')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={resetSearch}
                                        disabled={!Object.values(searchValues).some(val => val)}
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={handleSearch}
                                        disabled={!Object.values(searchValues).some(val => val)}
                                    >
                                        Поиск
                                    </Button>
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                {studentsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID зачетки</TableCell>
                                    {renderTableHeader('person.surname', 'ФИО')}
                                    {renderTableHeader('count_reprimand', 'Кол-во выговоров')}
                                    {renderTableHeader('group.name', 'Группа')}
                                    {renderTableHeader('subgroup.name', 'Подгруппа')}
                                    <TableCell sx={{ fontWeight: 'bold' }}>Родитель</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell>
                                            {student.person.surname} {student.person.name} {student.person.middlename || ''}
                                        </TableCell>
                                        <TableCell>{student.countReprimand}</TableCell>
                                        <TableCell>{student.group.name}</TableCell>
                                        <TableCell>{student.subgroup.name}</TableCell>
                                        <TableCell>
                                            {student.perent && student.perent.surname && student.perent.name
                                                ? `${student.perent.surname} ${student.perent.name} ${student.perent.middlename || ''}`.trim()
                                                : 'Не указан'}
                                        </TableCell>
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
                            count={studentsMeta.total}
                            rowsPerPage={studentsMeta.limit}
                            page={studentsMeta.page - 1}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelRowsPerPage="Строк на странице:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
                            }
                        />
                    </>
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
                    <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                </Menu>

                <Modal open={openEditModal || openDeleteModal || openAddModal} onClose={handleCloseModals}>
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
                                    <PersonSelector
                                        label="Студент"
                                        value={editStudent.personId}
                                        onChange={(person) => handlePersonSelect(person, 'student')}
                                        options={persons}
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
                                            onChange={(e) => handleGroupSelect(e.target.value, true)}
                                            label="Группа"
                                        >
                                            {groupsData.map((group) => (
                                                <SelectMenuItem key={group.id} value={group.name}>{group.name}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Подгруппа</InputLabel>
                                        <Select
                                            value={editStudent.subgroup}
                                            onChange={(e) => handleSubgroupSelect(e.target.value, true)}
                                            label="Подгруппа"
                                            disabled={!editStudent.group || loadingSubgroups}
                                        >
                                            <SelectMenuItem value="">Выберите подгруппу</SelectMenuItem>
                                            {loadingSubgroups ? (
                                                <SelectMenuItem disabled>
                                                    <CircularProgress size={24} />
                                                </SelectMenuItem>
                                            ) : (
                                                subgroupsData
                                                    .filter(subgroup => subgroup.group_id && subgroup.group_id.name === editStudent.group)
                                                    .map((subgroup) => (
                                                        <SelectMenuItem key={subgroup.id} value={subgroup.name}>
                                                            {subgroup.name} (Группа: {subgroup.group_id.name})
                                                        </SelectMenuItem>
                                                    ))
                                            )}
                                        </Select>
                                    </FormControl>
                                    <PersonSelector
                                        label="Родитель"
                                        value={editStudent.perentPersonId}
                                        onChange={(person) => handlePersonSelect(person, 'parent')}
                                        options={persons}
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
                                    <PersonSelector
                                        label="Студент"
                                        value={newStudent.personId}
                                        onChange={(person) => handlePersonSelect(person, 'student')}
                                        options={persons}
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
                                            onChange={(e) => handleGroupSelect(e.target.value, false)}
                                            label="Группа"
                                        >
                                            {groupsData.map((group) => (
                                                <SelectMenuItem key={group.id} value={group.name}>{group.name}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Подгруппа</InputLabel>
                                        <Select
                                            value={newStudent.subgroup}
                                            onChange={(e) => handleSubgroupSelect(e.target.value, false)}
                                            label="Подгруппа"
                                            disabled={!newStudent.group || loadingSubgroups}
                                        >
                                            <SelectMenuItem value="">Выберите подгруппу</SelectMenuItem>
                                            {loadingSubgroups ? (
                                                <SelectMenuItem disabled>
                                                    <CircularProgress size={24} />
                                                </SelectMenuItem>
                                            ) : (
                                                subgroupsData
                                                    .filter(subgroup => subgroup.group_id && subgroup.group_id.name === newStudent.group)
                                                    .map((subgroup) => (
                                                        <SelectMenuItem key={subgroup.id} value={subgroup.name}>
                                                            {subgroup.name} (Группа: {subgroup.group_id.name})
                                                        </SelectMenuItem>
                                                    ))
                                            )}
                                        </Select>
                                    </FormControl>
                                    <PersonSelector
                                        label="Родитель"
                                        value={newStudent.perentPersonId}
                                        onChange={(person) => handlePersonSelect(person, 'parent')}
                                        options={persons}
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