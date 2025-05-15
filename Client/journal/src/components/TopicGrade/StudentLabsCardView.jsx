// StudentTopicsView.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchTopicsProgress,
    fetchLabsStats,
    selectPaginatedTopics,
    selectPageCount,
    selectLoading,
    selectError,
    selectSearchTerm,
    selectCurrentPage,
    setSearchTerm,
    setCurrentPage,
    selectSelectedSubjectId,
    selectLabsStats,
} from '../../store/slices/studyPlanSlice';
import { useSearchParams } from 'react-router-dom';

import {
    Card,
    CardContent,
    Typography,
    TextField,
    Pagination,
    Grid,
    Chip,
    Box,
    Avatar,
    Paper,
    Fade,
    Zoom,
    CircularProgress,
    Divider,
    styled
} from '@mui/material';
import { Search as SearchIcon, School as SchoolIcon } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[8],
    },
}));

const ScoreChip = styled(Chip)(({ theme, score }) => ({
    fontWeight: 600,
    ...(score === 5 && {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
    }),
    ...(score === 4 && {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.contrastText,
    }),
    ...(score === 3 && {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.contrastText,
    }),
    ...(!score && {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[800],
    }),
}));

const StudentTopicsView = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const studentId = user?.student_id;
    const paginatedTopics = useSelector(selectPaginatedTopics);
    const pageCount = useSelector(selectPageCount);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const searchTerm = useSelector(selectSearchTerm);
    const currentPage = useSelector(selectCurrentPage);
    const labsStats = useSelector(selectLabsStats);
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get('subjectId');

    useEffect(() => {
        if (studentId && subjectId) {
            dispatch(fetchTopicsProgress({ studentId, subjectId }));
            dispatch(fetchLabsStats({ studentId, subjectId }));
        }
    }, [dispatch, studentId, subjectId]);

    const handleSearchChange = (e) => {
        dispatch(setSearchTerm(e.target.value));
    };

    const handlePageChange = (event, value) => {
        dispatch(setCurrentPage(value));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, color: 'error.main' }}>
                <Typography>Ошибка: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Fade in timeout={500}>
                <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            <SchoolIcon />
                        </Avatar>
                        <Typography variant="h5">Прогресс по темам</Typography>
                    </Box>

                    {labsStats && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Статистика по лабораторным работам:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Всего работ: {labsStats.stats.totalLabs}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Выполнено: {labsStats.stats.completedLabs}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">
                                        Процент выполнения: {labsStats.stats.completionPercentage}%
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">
                                        Часов выполнено: {labsStats.stats.completedHours}/{labsStats.stats.totalHours}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    <TextField
                        fullWidth
                        label="Поиск по названию темы или типу занятия"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                        sx={{ mb: 3 }}
                    />
                </Paper>
            </Fade>

            {paginatedTopics.length > 0 ? (
                <>
                    <Grid container spacing={3}>
                        {paginatedTopics.map((topic, index) => (
                            <Grid item xs={12} sm={6} md={4} key={topic.id}>
                                <Zoom in timeout={500 + (index * 100)}>
                                    <StyledCard>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {topic.topic.name}
                                            </Typography>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Неделя: {topic.weekNumber}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Часы: {topic.hours}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Тип: {topic.subjectType.name}
                                                </Typography>
                                                {topic.withDefense && (
                                                    <Chip
                                                        label="С защитой"
                                                        size="small"
                                                        color="secondary"
                                                        sx={{ mt: 1 }}
                                                    />
                                                )}
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Оценка
                                                    </Typography>
                                                    <ScoreChip
                                                        label={topic.progress.score || 'Не выполнено'}
                                                        score={topic.progress.score}
                                                    />
                                                </Box>
                                                {topic.progress.isCompleted && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(topic.progress.completionDate).toLocaleDateString()}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </StyledCard>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>

                    {pageCount > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Fade in timeout={500}>
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            Темы не найдены
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {searchTerm ? 'Попробуйте изменить параметры поиска' : 'Нет данных для отображения'}
                        </Typography>
                    </Paper>
                </Fade>
            )}
        </Box>
    );
};

export default StudentTopicsView;