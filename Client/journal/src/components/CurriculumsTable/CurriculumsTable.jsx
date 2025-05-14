import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import InfoIcon from '@mui/icons-material/Info';
import Alert from '../Alert/Alert';
import {
    fetchCurriculums,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
    clearErrors,
    setPage,
    setLimit,
    setSearchParams
} from '../../store/slices/curriculumSlice';
import { fetchAcademicSpecialties } from '../../store/slices/academicSpecialtySlice';
import { fetchEducationForms } from '../../store/slices/educationFormSlice';

const CurriculumsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const userRole = user?.role_id;

    // Определение прав доступа
    const canEdit = [3, 4, 5].includes(userRole); // Роли 3,4,5 могут редактировать
    const canViewOnly = userRole === 2; // Роль 2 может только просматривать

    const [anchorEl, setAnchorEl] = useState(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newCurriculum, setNewCurriculum] = useState({
        year_of_specialty_training: '',
        specialty_code: '',
        education_form_id: ''
    });
    const [editCurriculum, setEditCurriculum] = useState({
        id: '',
        year_of_specialty_training: '',
        specialty_code: '',
        education_form_id: ''
    });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [orderBy, setOrderBy] = useState('year_of_specialty_training');
    const [order, setOrder] = useState('asc');
    const [rowsMounted, setRowsMounted] = useState(false);

    const {
        data: curriculumsData = [],
        isLoading,
        errors = [],
        meta = { page: 1, limit: 10, total: 0 },
        searchParams = {}
    } = useSelector(state => state.curriculums);

    const academicSpecialties = useSelector(state => state.academicSpecialties.data || []);
    const educationForms = useSelector(state => state.educationForms.data || []);

    const [searchValues, setSearchValues] = useState({
        yearQuery: '',
        specialtyQuery: '',
        educationFormQuery: ''
    });

    useEffect(() => {
        dispatch(fetchCurriculums({
            page: meta.page,
            limit: meta.limit,
            sortBy: orderBy,
            sortOrder: order,
            ...searchParams
        }));
        dispatch(fetchAcademicSpecialties());
        dispatch(fetchEducationForms());
    }, [dispatch, meta.page, meta.limit, orderBy, order, searchParams]);

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

    useEffect(() => {
        if (curriculumsData.length > 0 && !rowsMounted) {
            setRowsMounted(true);
        }
    }, [curriculumsData, rowsMounted]);

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
        setSearchValues({
            ...searchValues,
            [field]: e.target.value
        });
    };

    const handleSearch = () => {
        dispatch(setSearchParams(searchValues));
        setSearchAnchorEl(null);
        setRowsMounted(false);
    };

    const handleResetSearch = () => {
        setSearchValues({
            yearQuery: '',
            specialtyQuery: '',
            educationFormQuery: ''
        });
        dispatch(setSearchParams({}));
        setSearchAnchorEl(null);
        setOrderBy('year_of_specialty_training');
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

    const handleDetails = (id) => {
        navigate(`/curriculum/${id}`);
    };

    const handleEdit = () => {
        if (!currentRow) return;

        setEditCurriculum({
            id: currentRow.id,
            year_of_specialty_training: currentRow.year_of_specialty_training,
            specialty_code: currentRow.specialty?.code || '',
            education_form_id: currentRow.education_form?.id || ''
        });

        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewCurriculum({
            year_of_specialty_training: '',
            specialty_code: '',
            education_form_id: ''
        });
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
    };

    const handleSaveEdit = () => {
        if (!editCurriculum.year_of_specialty_training || !editCurriculum.specialty_code || !editCurriculum.education_form_id) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        const updateData = {
            year_of_specialty_training: editCurriculum.year_of_specialty_training,
            specialty_code: editCurriculum.specialty_code,
            education_form_id: editCurriculum.education_form_id
        };

        dispatch(updateCurriculum({
            id: editCurriculum.id,
            data: updateData
        }))
            .unwrap()
            .then(() => {
                showAlert('Учебный план успешно обновлен!', 'success');
                handleCloseModals();
            })
            .catch(error => {
                showAlert(error.message || 'Ошибка при обновлении учебного плана', 'error');
            });
    };

    const handleSaveAdd = () => {
        if (!newCurriculum.year_of_specialty_training || !newCurriculum.specialty_code || !newCurriculum.education_form_id) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }

        dispatch(createCurriculum({
            year_of_specialty_training: newCurriculum.year_of_specialty_training,
            specialty_code: newCurriculum.specialty_code,
            education_form_id: newCurriculum.education_form_id
        }))
            .unwrap()
            .then(() => {
                showAlert('Учебный план успешно добавлен!', 'success');
                handleCloseModals();
            })
            .catch(error => {
                showAlert(error.message || 'Ошибка при добавлении учебного плана', 'error');
            });
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteCurriculum(currentRow.id))
            .unwrap()
            .then(() => {
                showAlert('Учебный план успешно удален!', 'success');
                handleCloseModals();
            })
            .catch(error => {
                showAlert(error.message || 'Ошибка при удалении учебного плана', 'error');
            });
    };

    const handlePageChange = (_, newPage) => {
        dispatch(setPage(newPage + 1));
        setRowsMounted(false);
    };

    const handleRowsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
        setRowsMounted(false);
    };

    if (isLoading) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Список учебных планов</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleSearchMenuClick}>
                            <SearchIcon />
                        </IconButton>
                        <IconButton onClick={handleResetSearch}>
                            <RefreshIcon />
                        </IconButton>
                        <Menu
                            anchorEl={searchAnchorEl}
                            open={Boolean(searchAnchorEl)}
                            onClose={handleSearchMenuClose}
                        >
                            <Box sx={{ p: 2, width: 280 }}>
                                <TextField
                                    label="Поиск по году"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.yearQuery}
                                    onChange={handleSearchChange('yearQuery')}
                                />
                                <TextField
                                    label="Поиск по специальности"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.specialtyQuery}
                                    onChange={handleSearchChange('specialtyQuery')}
                                />
                                <TextField
                                    label="Поиск по форме обучения"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={searchValues.educationFormQuery}
                                    onChange={handleSearchChange('educationFormQuery')}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={handleResetSearch}
                                    >
                                        Сбросить
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={handleSearch}
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
                            {renderSortableHeader('year_of_specialty_training', 'Год подготовки')}
                            {renderSortableHeader('specialty_code', 'Код специальности')}
                            <TableCell>Форма обучения</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {curriculumsData.map((curriculum, index) => (
                            <TableRow key={curriculum.id}>
                                <TableCell>{curriculum.year_of_specialty_training}</TableCell>
                                <TableCell>
                                    {curriculum.specialty?.code} - {curriculum.specialty?.name}
                                </TableCell>
                                <TableCell>
                                    {curriculum.education_form?.name}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDetails(curriculum.id)}>
                                        <InfoIcon />
                                    </IconButton>
                                    {canEdit && (
                                        <IconButton onClick={(e) => handleMenuClick(e, curriculum)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}
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
                />
                {canEdit && (
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
                        <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                    </Menu>
                )}
                <Modal open={openEditModal || openDeleteModal || openAddModal} onClose={handleCloseModals}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
                    }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                            {openEditModal && "Редактировать учебный план"}
                            {openDeleteModal && "Удалить учебный план"}
                            {openAddModal && "Добавить учебный план"}
                        </Typography>
                        {openEditModal && (
                            <Box>
                                <TextField
                                    label="Год подготовки"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={editCurriculum.year_of_specialty_training}
                                    onChange={(e) => setEditCurriculum({ ...editCurriculum, year_of_specialty_training: e.target.value })}
                                />
                                <TextField
                                    select
                                    label="Специальность"
                                    fullWidth
                                    margin="normal"
                                    value={editCurriculum.specialty_code}
                                    onChange={(e) => setEditCurriculum({ ...editCurriculum, specialty_code: e.target.value })}
                                >
                                    {academicSpecialties.map((specialty) => (
                                        <MenuItem key={specialty.code} value={specialty.code}>
                                            {specialty.code} - {specialty.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    label="Форма обучения"
                                    fullWidth
                                    margin="normal"
                                    value={editCurriculum.education_form_id}
                                    onChange={(e) => setEditCurriculum({ ...editCurriculum, education_form_id: e.target.value })}
                                >
                                    {educationForms.map((form) => (
                                        <MenuItem key={form.id} value={form.id}>
                                            {form.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button onClick={handleCloseModals} sx={{ mr: 1 }}>Отмена</Button>
                                    <Button variant="contained" onClick={handleSaveEdit}>Сохранить</Button>
                                </Box>
                            </Box>
                        )}
                        {openDeleteModal && (
                            <Box>
                                <Typography>Вы уверены, что хотите удалить учебный план?</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button onClick={handleCloseModals} sx={{ mr: 1 }}>Отмена</Button>
                                    <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Удалить</Button>
                                </Box>
                            </Box>
                        )}
                        {openAddModal && (
                            <Box>
                                <TextField
                                    label="Год подготовки"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={newCurriculum.year_of_specialty_training}
                                    onChange={(e) => setNewCurriculum({ ...newCurriculum, year_of_specialty_training: e.target.value })}
                                />
                                <TextField
                                    select
                                    label="Специальность"
                                    fullWidth
                                    margin="normal"
                                    value={newCurriculum.specialty_code}
                                    onChange={(e) => setNewCurriculum({ ...newCurriculum, specialty_code: e.target.value })}
                                >
                                    {academicSpecialties.map((specialty) => (
                                        <MenuItem key={specialty.code} value={specialty.code}>
                                            {specialty.code} - {specialty.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    label="Форма обучения"
                                    fullWidth
                                    margin="normal"
                                    value={newCurriculum.education_form_id}
                                    onChange={(e) => setNewCurriculum({ ...newCurriculum, education_form_id: e.target.value })}
                                >
                                    {educationForms.map((form) => (
                                        <MenuItem key={form.id} value={form.id}>
                                            {form.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button onClick={handleCloseModals} sx={{ mr: 1 }}>Отмена</Button>
                                    <Button variant="contained" onClick={handleSaveAdd}>Добавить</Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Modal>
                {canEdit && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAdd}
                        >
                            Добавить учебный план
                        </Button>
                    </Box>
                )}
            </TableContainer>

            <Alert
                open={alertState.open}
                message={alertState.message}
                severity={alertState.severity}
                onClose={handleCloseAlert}
            />
        </>
    );
};

export default CurriculumsTable;