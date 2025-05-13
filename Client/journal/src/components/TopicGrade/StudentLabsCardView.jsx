import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    styled
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import {
    fetchStudentLabs,
    selectStudentData,
    selectPaginatedLabs,
    selectPageCount,
    setSearchTerm,
    setCurrentPage
} from '../../store/slices/studentLabsSlice'; // Изменен путь импорта

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

const GradeChip = styled(Chip)(({ theme, grade }) => ({
    fontWeight: 600,
    ...(grade === 'отлично' && {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
    }),
    ...(grade === 'зачет' && {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    }),
    ...(grade === 'хорошо' && {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.contrastText,
    }),
    ...(grade === 'удовлетворительно' && {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.contrastText,
    }),
    ...(!grade && {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[800],
    }),
}));

const StudentLabsCardView = () => {
    const dispatch = useDispatch();
    const studentData = useSelector(selectStudentData);
    const paginatedLabs = useSelector(selectPaginatedLabs);
    const pageCount = useSelector(selectPageCount);
    const { loading, error } = useSelector(state => state.studentLabs);

    useEffect(() => {
        dispatch(fetchStudentLabs());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        dispatch(setSearchTerm(e.target.value));
    };

    const handlePageChange = (event, value) => {
        dispatch(setCurrentPage(value));
    };

    if (loading) {
        return (
            <Box sx={{
                p: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <Typography variant="h6">Загрузка данных...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                p: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <Typography variant="h6" color="error">
                    Ошибка загрузки данных: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            minHeight: '100vh'
        }}>
            <Fade in timeout={500}>
                <Paper elevation={3} sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    background: 'white'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                        <Avatar
                            alt={studentData.student}
                            sx={{
                                width: 80,
                                height: 80,
                                mr: { sm: 3 },
                                mb: { xs: 2, sm: 0 },
                                fontSize: '2rem',
                                bgcolor: '#3f51b5'
                            }}
                        >
                            {studentData.student.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                                {studentData.student}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {studentData.discipline} • {studentData.group}
                            </Typography>
                        </Box>
                    </Box>

                    <TextField
                        fullWidth
                        label="Поиск по теме лабораторной работы"
                        variant="outlined"
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                            ),
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                </Paper>
            </Fade>

            {paginatedLabs.length > 0 ? (
                <>
                    <Grid container spacing={3}>
                        {paginatedLabs.map((lab, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Zoom in timeout={500 + (index * 100)}>
                                    <StyledCard>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: 3
                                            }}>
                                                {lab.topic}
                                            </Typography>

                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                                <GradeChip
                                                    label={lab.grade ? lab.grade : 'Не сдано'}
                                                    grade={lab.grade}
                                                    size="medium"
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    Статус
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </StyledCard>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>

                    {pageCount > 1 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                            '& .MuiPaginationItem-root': {
                                borderRadius: 1,
                            }
                        }}>
                            <Pagination
                                count={pageCount}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Fade in timeout={500}>
                    <Paper elevation={0} sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <Typography variant="h6" color="text.secondary">
                            Ничего не найдено
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Попробуйте изменить параметры поиска
                        </Typography>
                    </Paper>
                </Fade>
            )}
        </Box>
    );
};

export default StudentLabsCardView;