import React, { useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentSubjects } from '../../store/slices/curriculumSlice';
import { fetchLabsStats, selectLabsStatsBySubject } from '../../store/slices/studyPlanSlice';

const COLORS = ['#4caf50', '#ffc107', '#f44336'];

const getProgressColor = (progress) => {
    if (progress >= 80) return COLORS[0];
    if (progress >= 50) return COLORS[1];
    return COLORS[2];
};

const ProfileCourses = ({ studentId }) => {
    const dispatch = useDispatch();
    const fetchedSubjects = useRef(new Set());

    const { currentStudentSubjects, isLoading, errors } = useSelector(
        (state) => state.curriculums
    );
    const labsStatsBySubject = useSelector(selectLabsStatsBySubject) || {};

    useEffect(() => {
        dispatch(getStudentSubjects({ studentId }));
    }, [studentId, dispatch]);

    useEffect(() => {
        currentStudentSubjects.forEach(subject => {
            const subjectId = subject.subject.id;
            if (!fetchedSubjects.current.has(subjectId)) {
                fetchedSubjects.current.add(subjectId);
                dispatch(fetchLabsStats({ studentId, subjectId }));
            }
        });
    }, [studentId, currentStudentSubjects, dispatch]);

    const courses = (currentStudentSubjects?.map(item => {
        const subjectId = item.subject.id;
        const stats = labsStatsBySubject[subjectId]?.stats;

        if (stats && stats.totalLabs !== undefined && stats.completedLabs !== undefined) {
            const totalLabs = stats.totalLabs || 0;
            const completedLabs = stats.completedLabs || 0;
            const progress = totalLabs > 0 ? Math.round((completedLabs / totalLabs) * 100) : 0;

            return {
                name: item.subject.name,
                progress,
                hasData: true,
                statsDetails: totalLabs > 0
                    ? `Выполнено: ${completedLabs}/${totalLabs}`
                    : 'Нет лабораторных работ'
            };
        }

        if (typeof item.progress === 'number') {
            return {
                name: item.subject.name,
                progress: item.progress,
                hasData: true,
                statsDetails: 'Прогресс по курсу'
            };
        }

        return {
            name: item.subject.name,
            progress: 0,
            hasData: true,
            statsDetails: 'Нет данных о выполнении'
        };
    }) || []).sort((a, b) => b.progress - a.progress); // сортировка по убыванию

    if (isLoading) return <Typography>Загрузка курсов...</Typography>;
    if (errors.length > 0) return <Typography color="error">Ошибка: {errors[0].message}</Typography>;

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                Мои курсы
            </Typography>
            <div className="courses-list">
                {courses.length === 0 && <Typography>Нет доступных курсов</Typography>}
                {courses.map((course, index) => (
                    <div key={index} className="course-item" style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" className="course-name">
                                {course.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {course.statsDetails}
                            </Typography>
                        </Box>
                        <div className="container--diagram" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {course.hasData ? (
                                <>
                                    <PieChart width={80} height={80}>
                                        <Pie
                                            data={[
                                                { value: course.progress },
                                                { value: 100 - course.progress }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            startAngle={90}
                                            endAngle={-270}
                                            innerRadius={25}
                                            outerRadius={35}
                                            dataKey="value"
                                        >
                                            <Cell fill={getProgressColor(course.progress)} />
                                            <Cell fill="#e0e0e0" />
                                        </Pie>
                                    </PieChart>
                                    <Typography variant="body1">{course.progress}%</Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Нет данных
                                </Typography>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default ProfileCourses;
