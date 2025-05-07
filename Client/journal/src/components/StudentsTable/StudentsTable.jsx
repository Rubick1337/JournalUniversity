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
import { fetchPersons } from '../../store/slices/personSlice';
const StudentsTable = () => {
    const dispatch = useDispatch();
    const searchAnchorRef = useRef(null);

    // Redux state
    const {
        data: studentsData,
        isLoading: studentsLoading,
        errors: studentsErrors,
        meta: studentsMeta,
        searchParams: studentsSearchParams
    } = useSelector(state => state.students);

    const {
        data: groupsData,
        isLoading: groupsLoading,
        meta: groupsMeta
    } = useSelector(state => state.groups);

    const persons = useSelector(state => state.person?.data || []);

    // Local state for UI controls
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

    const [subgroups, setSubgroups] = useState(["Подгруппа 1", "Подгруппа 2"]);

    // Fetch initial data
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
    }, [dispatch, studentsMeta.page, studentsMeta.limit, orderBy, order, studentsSearchParams]);

    // Show errors if any
    useEffect(() => {
        if (studentsErrors.length > 0) {
            showAlert(studentsErrors[0].message, 'error');
            dispatch(clearErrors());
        }
    }, [studentsErrors, dispatch]);

    // Initialize search values from Redux
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

    const showAlert = (message, severity = 'success') => {
        setAlertState({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

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
        setSearchMenuOpen(false);
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
        setSearchValues(newSearchValues);
        dispatch(setSearchParams(newSearchValues));
        setOrderBy('person.surname');
        setOrder('ASC');
        setSearchMenuOpen(false);
    };

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

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditStudent({
            name: currentRow.name,
            reprimands: currentRow.reprimands,
            group: currentRow.group,
            groupId: currentRow.groupId,
            subgroup: currentRow.subgroup,
            subgroupId: currentRow.subgroupId,
            parent: currentRow.parent,
            perentPersonId: currentRow.perentPersonId,
            personId: currentRow.personId
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

    const handlePersonSelect = (selectedPerson, field = 'student') => {
        const fullName = `${selectedPerson.surname} ${selectedPerson.name} ${selectedPerson.middlename || ''}`.trim();
        if (openEditModal) {
            if (field === 'student') {
                setEditStudent(prev => ({
                    ...prev,
                    name: fullName,
                    personId: selectedPerson.id
                }));
            } else {
                setEditStudent(prev => ({
                    ...prev,
                    parent: fullName,
                    perentPersonId: selectedPerson.id
                }));
            }
        } else if (openAddModal) {
            if (field === 'student') {
                setNewStudent(prev => ({
                    ...prev,
                    name: fullName,
                    personId: selectedPerson.id
                }));
            } else {
                setNewStudent(prev => ({
                    ...prev,
                    parent: fullName,
                    perentPersonId: selectedPerson.id
                }));
            }
        }
    };

    const handleGroupSelect = (groupName, isEdit) => {
        const selectedGroup = groupsData.find(g => g.name === groupName);
        if (isEdit) {
            setEditStudent(prev => ({
                ...prev,
                group: groupName,
                groupId: selectedGroup?.id || ''
            }));
        } else {
            setNewStudent(prev => ({
                ...prev,
                group: groupName,
                groupId: selectedGroup?.id || ''
            }));
        }
    };

    const handlePageChange = (_, newPage) => {
        dispatch(setPage(newPage + 1));
    };

    const handleRowsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
    };

    const handleSaveEdit = () => {
        if (!editStudent.name || !editStudent.groupId || !editStudent.subgroupId || !editStudent.perentPersonId) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        const updateData = new StudentDataForUpdateDto({
            countReprimand: editStudent.reprimands,
            iconPath: '',
            personId: editStudent.personId,
            groupId: editStudent.groupId,
            subgroupId: editStudent.subgroupId,
            perentPersonId: editStudent.perentPersonId
        });

        dispatch(updateStudent({
            id: currentRow.id,
            data: updateData
        })).then(() => {
            showAlert('Данные студента успешно обновлены!', 'success');
            handleCloseModals();
        });
    };

    const handleSaveAdd = () => {
        if (!newStudent.name || !newStudent.groupId || !newStudent.subgroupId || !newStudent.perentPersonId) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        const createData = new StudentDataForCreateDto({
            countReprimand: newStudent.reprimands,
            iconPath: '',
            personId: newStudent.personId,
            groupId: newStudent.groupId,
            subgroupId: newStudent.subgroupId,
            perentPersonId: newStudent.perentPersonId
        });

        dispatch(createStudent(createData)).then(() => {
            showAlert('Студент успешно добавлен!', 'success');
            handleCloseModals();
        });
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteStudent(currentRow.id)).then(() => {
            showAlert('Студент успешно удален!', 'success');
            handleCloseModals();
        });
    };

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
                                        onChange={handleSearchChange('groupQuery')}
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
                                        selectedPerson={editStudent.name ? {
                                            surname: editStudent.name.split(' ')[0] || '',
                                            name: editStudent.name.split(' ')[1] || '',
                                            middlename: editStudent.name.split(' ')[2] || '',
                                            id: editStudent.personId
                                        } : null}
                                        personDataSelect={persons}
                                        onSelectChange={(person) => handlePersonSelect(person, 'student')}
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
                                            onChange={(e) => setEditStudent({ ...editStudent, subgroup: e.target.value, subgroupId: e.target.value })}
                                            label="Подгруппа"
                                        >
                                            {subgroups.map((subgroup) => (
                                                <SelectMenuItem key={subgroup} value={subgroup}>{subgroup}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <PersonSelector
                                        label="Родитель"
                                        selectedPerson={editStudent.parent ? {
                                            surname: editStudent.parent.split(' ')[0] || '',
                                            name: editStudent.parent.split(' ')[1] || '',
                                            middlename: editStudent.parent.split(' ')[2] || '',
                                            id: editStudent.perentPersonId
                                        } : null}
                                        personDataSelect={persons}
                                        onSelectChange={(person) => handlePersonSelect(person, 'parent')}
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
                                        selectedPerson={null}
                                        personDataSelect={persons}
                                        onSelectChange={(person) => handlePersonSelect(person, 'student')}
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
                                            onChange={(e) => setNewStudent({ ...newStudent, subgroup: e.target.value, subgroupId: e.target.value })}
                                            label="Подгруппа"
                                        >
                                            {subgroups.map((subgroup) => (
                                                <SelectMenuItem key={subgroup} value={subgroup}>{subgroup}</SelectMenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <PersonSelector
                                        label="Родитель"
                                        selectedPerson={null}
                                        personDataSelect={persons}
                                        onSelectChange={(person) => handlePersonSelect(person, 'parent')}
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

class StudentDataForCreateDto {
    constructor({
                    countReprimand,
                    iconPath,
                    personId,
                    groupId,
                    subgroupId,
                    perentPersonId,
                }) {
        this.count_reprimand = countReprimand;
        this.icon_path = iconPath;
        this.person_id = personId;
        this.group_id = groupId;
        this.subgroup_id = subgroupId;
        this.perent_person_id = perentPersonId;
    }
}

class StudentDataForUpdateDto {
    constructor({
                    countReprimand,
                    iconPath,
                    personId,
                    groupId,
                    subgroupId,
                    perentPersonId,
                }) {
        this.count_reprimand = countReprimand;
        this.icon_path = iconPath;
        this.person_id = personId;
        this.group_id = groupId;
        this.subgroup_id = subgroupId;
        this.perent_person_id = perentPersonId;
    }
}

export default React.memo(StudentsTable);