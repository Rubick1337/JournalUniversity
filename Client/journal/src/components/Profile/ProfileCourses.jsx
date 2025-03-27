
import { Typography, CircularProgress, Box } from '@mui/material';
import './ProfileStyle.css';
import React, { useState } from 'react';
const ProfileCourses = () => {
    const [courses] = useState([
        { name: 'Программирование на Python', progress: 75 },
        { name: 'Базы данных', progress: 45 },
        { name: 'Веб-разработка', progress: 90 },
        { name: 'Алгоритмы и структуры данных', progress: 30 }
    ]);

    const getProgressColor = (progress) => {
        if (progress >= 80) return '#4caf50';
        if (progress >= 50) return '#ffc107';
        return '#f44336';
    };

    return (
        <Box>
            <Typography variant="h6" className="section-title" sx={{ marginBottom: '20px' }}>
                Мои курсы
            </Typography>
            <div className="courses-list">
                {courses.map((course, index) => (
                    <div key={index} className="course-item">
                        <div className="course-info">
                            <Typography variant="subtitle1" className="course-name">
                                {course.name}
                            </Typography>
                        </div>
                        <div className="course-progress">
                            <CircularProgress
                                variant="determinate"
                                value={course.progress}
                                size={60}
                                thickness={5}
                                sx={{
                                    color: getProgressColor(course.progress),
                                    marginRight: '10px'
                                }}
                            />
                            <Typography variant="body1" className="progress-percent">
                                {course.progress}%
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default ProfileCourses;