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
        idQuery: '',
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
        dispatch(fetchAcademicSpecialties({}));
        dispatch(fetchEducationForms({}));
    }, [dispatch, meta.page, meta.limit, searchParams, orderBy, order]);

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
            setTimeout(() => {
                setRowsMounted(true);
            }, 100);
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
            idQuery: '',
            yearQuery: '',
            specialtyQuery: '',
            educationFormQuery: ''
        });
        dispatch(setSearchParams({
            idQuery: '',
            yearQuery: '',
            specialtyQuery: '',
            educationFormQuery: ''
        }));
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
        // Проверяем и логируем данные перед установкой
        console.log('Current row data:', {
            id: currentRow.id,
            year: currentRow.year_of_specialty_training,
            specialtyCode: currentRow.specialty?.code,
            educationFormId: currentRow.education_form?.id
        });

        setEditCurriculum({
            id: currentRow.id,
            year_of_specialty_training: currentRow.year_of_specialty_training,
            specialty_code: currentRow.specialty?.code || currentRow.specialty_code || '',
            education_form_id: currentRow.education_form?.id || currentRow.education_form_id || ''
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
            academic_specialty: {
                code: editCurriculum.specialty_code
            },
            education_form: {
                id: editCurriculum.education_form_id
            }
        };
        console.log('Editing curriculum:', {
            id: editCurriculum.id,
            year: editCurriculum.year_of_specialty_training,
            specialty: editCurriculum.specialty_code,
            educationForm: editCurriculum.education_form_id
        });
        dispatch(updateCurriculum({
            id: editCurriculum.id,
            data: updateData
        }))
            .unwrap()
            .then(() => {
                showAlert('Учебный план успешно обновлен!', 'success');
                handleCloseModals();
                dispatch(fetchCurriculums({
                    page: meta.page,
                    limit: meta.limit,
                    sortBy: orderBy,
                    sortOrder: order,
                    ...searchParams
                }));
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
            academic_specialty: { code: newCurriculum.specialty_code },
            education_form: { id: newCurriculum.education_form_id }
        }))
            .unwrap()
            .then(() => {
                showAlert('Учебный план успешно добавлен!', 'success');
                handleCloseModals();
                dispatch(fetchCurriculums({
                    page: meta.page,
                    limit: meta.limit,
                    sortBy: orderBy,
                    sortOrder: order,
                    ...searchParams
                }));
            })
            .catch(error => {
                showAlert(error.message || 'Ошибка при добавлении учебного плана', 'error');
            });
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteCurriculum(currentRow.id))
            .then(() => {
                showAlert('Учебный план успешно удален!', 'success');
                handleCloseModals();
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
                                        disabled={!searchValues.idQuery && !searchValues.yearQuery &&
                                            !searchValues.specialtyQuery && !searchValues.educationFormQuery}
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
                            {renderSortableHeader('year_of_specialty_training', 'Год подготовки')}
                            {renderSortableHeader('specialty_code', 'Код специальности')}
                            <TableCell>Форма обучения</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {curriculumsData.map((curriculum, index) => (
                            <TableRow
                                key={curriculum.id}
                                className={`table-row ${rowsMounted ? 'show' : ''}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <TableCell>{curriculum.year_of_specialty_training}</TableCell>
                                <TableCell>
                                    {curriculum.specialty?.code} - {curriculum.specialty?.name}
                                </TableCell>
                                <TableCell>
                                    {curriculum.education_form?.name}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleDetails(curriculum.id)}
                                        className="action-button"
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e) => handleMenuClick(e, curriculum)}
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
                                {openEditModal && "Редактировать учебный план"}
                                {openDeleteModal && "Удалить учебный план"}
                                {openAddModal && "Добавить учебный план"}
                            </Typography>
                            <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            {openEditModal && (
                                <div>
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
                                        <Button onClick={handleCloseModals} className="action-button">Отмена</Button>
                                        <Button onClick={handleSaveEdit} color="primary" className="action-button">Сохранить</Button>
                                    </Box>
                                </div>
                            )}
                            {openDeleteModal && (
                                <div>
                                    <Typography>Вы уверены, что хотите удалить учебный план {currentRow?.year_of_specialty_training}?</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleCloseModals} className="action-button">Отмена</Button>
                                        <Button onClick={handleDeleteConfirm} color="error" className="action-button">Удалить</Button>
                                    </Box>
                                </div>
                            )}
                            {openAddModal && (
                                <div>
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
                                        <Button onClick={handleCloseModals} className="action-button">Отмена</Button>
                                        <Button onClick={handleSaveAdd} color="primary" className="action-button">Добавить</Button>
                                    </Box>
                                </div>
                            )}
                        </Box>
                    </Box>
                </Modal>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAdd}
                    >
                        Добавить учебный план
                    </Button>
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

export default CurriculumsTable;