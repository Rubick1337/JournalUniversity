import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    CircularProgress,
    TableSortLabel,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    getTopicById,
    clearErrors,
    clearCurrentTopic,
    setPage,
    setLimit,
    setSearchParams,
    setSort
} from '../../store/slices/topicSlice';
import { fetchSubjects } from '../../store/slices/subjectSlice';

const TopicsTable = () => {
    const dispatch = useDispatch();
    const {
        data: topics,
        isLoading: isTopicsLoading,
        errors,
        currentTopic,
        meta,
        searchParams
    } = useSelector(state => state.topics);

    // Получаем subjects из Redux store
    const {
        data: subjects,
        isLoading: isSubjectsLoading
    } = useSelector(state => state.subjects);

    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newTopic, setNewTopic] = useState({ name: '', subjectId: '' });
    const [editTopic, setEditTopic] = useState({ name: '', subjectId: '' });
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [searchName, setSearchName] = useState('');
    const [searchSubject, setSearchSubject] = useState('');

    // Загружаем subjects при монтировании компонента
    useEffect(() => {
        dispatch(fetchSubjects({ limit: 1000 })); // Загружаем все предметы
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchTopics({
            limit: meta?.limit || 5,
            page: meta?.page || 1,
            ...searchParams
        }));
    }, [dispatch, meta?.limit, meta?.page, searchParams]);

    useEffect(() => {
        if (currentTopic) {
            setEditTopic({
                name: currentTopic.name,
                subjectId: currentTopic.subject?.id || ''
            });
        }
    }, [currentTopic]);

    useEffect(() => {
        if (errors.length > 0) {
            setAlertState({
                open: true,
                message: errors[0].message,
                severity: 'error'
            });
            dispatch(clearErrors());
        }
    }, [errors, dispatch]);

    const showAlert = (message, severity = 'success') => {
        setAlertState({
            open: true,
            message,
            severity
        });
        setTimeout(() => setAlertState(prev => ({ ...prev, open: false })), 3000);
    };

    const handleChangePage = (event, newPage) => {
        dispatch(setPage(newPage + 1));
    };

    const handleChangeRowsPerPage = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
    };

    const handleSearchMenuClick = (event) => {
        setSearchAnchorEl(event.currentTarget);
    };

    const handleSearchMenuClose = () => {
        setSearchAnchorEl(null);
    };

    const handleSearchNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleSearchSubjectChange = (event) => {
        setSearchSubject(event.target.value);
    };

    const handleSearch = () => {
        dispatch(setSearchParams({
            nameQuery: searchName,
            subjectQuery: searchSubject
        }));
        handleSearchMenuClose();
    };

    const handleResetSearch = () => {
        setSearchName('');
        setSearchSubject('');
        dispatch(setSearchParams({
            nameQuery: '',
            subjectQuery: '',
            idQuery: ''
        }));
        handleSearchMenuClose();
    };

    const handleSortRequest = (property) => {
        const isAsc = searchParams.sortBy === property && searchParams.sortOrder === 'asc';
        const newOrder = isAsc ? 'desc' : 'asc';
        dispatch(setSort({ sortBy: property, sortOrder: newOrder }));
        dispatch(setPage(1));
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        dispatch(getTopicById(currentRow.id));
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleAdd = () => {
        setNewTopic({ name: '', subjectId: subjects[0]?.id || '' }); // Устанавливаем первый предмет по умолчанию
        setOpenAddModal(true);
    };

    const handleCloseModals = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(false);
        setOpenAddModal(false);
        dispatch(clearCurrentTopic());
    };

    const handleSaveEdit = async () => {
        if (!editTopic.name?.trim()) {
            showAlert('Название темы должно быть заполнено!', 'error');
            return;
        }
        if (!editTopic.subjectId) {
            showAlert('Необходимо выбрать предмет!', 'error');
            return;
        }

        try {
            await dispatch(updateTopic({
                id: currentRow.id,
                data: {
                    name: editTopic.name,
                    subjectId: editTopic.subjectId
                }
            })).unwrap();

            showAlert('Тема успешно обновлена!', 'success');
            handleCloseModals();
            dispatch(fetchTopics({
                limit: meta.limit,
                page: meta.page,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при обновлении темы', 'error');
        }
    };

    const handleSaveAdd = async () => {
        if (!newTopic.name?.trim()) {
            showAlert('Название темы должно быть заполнено!', 'error');
            return;
        }
        if (!newTopic.subjectId) {
            showAlert('Необходимо выбрать предмет!', 'error');
            return;
        }

        try {
            await dispatch(createTopic({
                name: newTopic.name,
                subjectId: newTopic.subjectId
            })).unwrap();
            showAlert('Тема успешно добавлена!', 'success');
            handleCloseModals();
            dispatch(setPage(1));
            dispatch(fetchTopics({
                limit: meta.limit,
                page: 1,
                ...searchParams
            }));
        } catch (error) {
            showAlert(error.message || 'Ошибка при добавлении темы', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteTopic(currentRow.id)).unwrap();
            showAlert('Тема успешно удалена!', 'success');
            handleCloseModals();

            if (topics.length === 1 && meta.page > 1) {
                dispatch(setPage(meta.page - 1));
            } else {
                dispatch(fetchTopics({
                    limit: meta.limit,
                    page: meta.page,
                    ...searchParams
                }));
            }
        } catch (error) {
            showAlert(error.message || 'Ошибка при удалении темы', 'error');
        }
    };

    if (isTopicsLoading && topics.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Темы</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                            PaperProps={{
                                sx: {
                                    p: 2,
                                    width: 300
                                }
                            }}
                        >
                            <TextField
                                label="Поиск по названию"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchName}
                                onChange={handleSearchNameChange}
                                sx={{ mb: 2 }}
                                autoFocus
                            />
                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <InputLabel>Предмет</InputLabel>
                                <Select
                                    value={searchSubject}
                                    onChange={handleSearchSubjectChange}
                                    label="Предмет"
                                    disabled={isSubjectsLoading}
                                >
                                    <MenuItem value="">Все предметы</MenuItem>
                                    {subjects?.map(subject => (
                                        <MenuItem key={subject.id} value={subject.name}>
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleResetSearch}
                                    disabled={!searchName && !searchSubject}
                                >
                                    Сбросить
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    disabled={!searchName && !searchSubject}
                                >
                                    Поиск
                                </Button>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={searchParams.sortBy === 'id'}
                                    direction={searchParams.sortBy === 'id' ? searchParams.sortOrder : 'asc'}
                                    onClick={() => handleSortRequest('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={searchParams.sortBy === 'name'}
                                    direction={searchParams.sortBy === 'name' ? searchParams.sortOrder : 'asc'}
                                    onClick={() => handleSortRequest('name')}
                                >
                                    Наименование
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Предмет</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topics.map(topic => (
                            <TableRow key={topic.id}>
                                <TableCell>{topic.id}</TableCell>
                                <TableCell>{topic.name}</TableCell>
                                <TableCell>{topic.subject?.name || '-'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, topic)}>
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
                    count={meta.totalItems || 0}
                    rowsPerPage={meta.limit}
                    page={meta.page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Записей на странице:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                />

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
                    <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                </Menu>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={isTopicsLoading || isSubjectsLoading}
                >
                    Добавить тему
                </Button>
            </Box>

            {/* Модальное окно редактирования */}
            <Modal open={openEditModal} onClose={handleCloseModals}>
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
                        <Typography variant="h6">Редактировать тему</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название темы*"
                            fullWidth
                            margin="normal"
                            value={editTopic.name}
                            onChange={(e) => setEditTopic({ ...editTopic, name: e.target.value })}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Предмет*</InputLabel>
                            <Select
                                value={editTopic.subjectId}
                                onChange={(e) => setEditTopic({ ...editTopic, subjectId: e.target.value })}
                                label="Предмет*"
                                disabled={isSubjectsLoading}
                            >
                                {subjects?.map(subject => (
                                    <MenuItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseModals}>Отмена</Button>
                            <Button
                                onClick={handleSaveEdit}
                                color="primary"
                                disabled={isTopicsLoading}
                                sx={{ ml: 2 }}
                            >
                                {isTopicsLoading ? <CircularProgress size={24} /> : 'Сохранить'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Модальное окно удаления */}
            <Modal open={openDeleteModal} onClose={handleCloseModals}>
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
                        <Typography variant="h6">Удалить тему</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Typography>Вы уверены, что хотите удалить тему "{currentRow?.name}"?</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseModals}>Отмена</Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                color="error"
                                disabled={isTopicsLoading}
                                sx={{ ml: 2 }}
                            >
                                {isTopicsLoading ? <CircularProgress size={24} /> : 'Удалить'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Модальное окно добавления */}
            <Modal open={openAddModal} onClose={handleCloseModals}>
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
                        <Typography variant="h6">Добавить новую тему</Typography>
                        <IconButton onClick={handleCloseModals} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <TextField
                            label="Название темы*"
                            fullWidth
                            margin="normal"
                            value={newTopic.name}
                            onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Предмет*</InputLabel>
                            <Select
                                value={newTopic.subjectId}
                                onChange={(e) => setNewTopic({ ...newTopic, subjectId: e.target.value })}
                                label="Предмет*"
                                disabled={isSubjectsLoading}
                            >
                                {subjects?.map(subject => (
                                    <MenuItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseModals}>Отмена</Button>
                            <Button
                                onClick={handleSaveAdd}
                                color="primary"
                                disabled={isTopicsLoading || isSubjectsLoading}
                                sx={{ ml: 2 }}
                            >
                                {(isTopicsLoading || isSubjectsLoading) ? <CircularProgress size={24} /> : 'Добавить'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Уведомления */}
            {alertState.open && (
                <Box sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    p: 2,
                    backgroundColor: alertState.severity === 'error' ? '#f44336' : '#4caf50',
                    color: 'white',
                    borderRadius: 1,
                    boxShadow: 3,
                    zIndex: 9999
                }}>
                    {alertState.message}
                </Box>
            )}
        </>
    );
};

export default TopicsTable;