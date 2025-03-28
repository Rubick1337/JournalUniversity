import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';

const ProfileCourses = () => {
    const [courses] = useState([
        { name: 'Программирование на Python', progress: 75 },
        { name: 'Базы данных', progress: 45 },
        { name: 'Веб-разработка', progress: 90 },
        { name: 'Алгоритмы и структуры данных', progress: 30 }
    ]);

    const COLORS = ['#4caf50', '#ffc107', '#f44336']; // Цвета для разного прогресса

    const getProgressColor = (progress) => {
        if (progress >= 80) return COLORS[0];
        if (progress >= 50) return COLORS[1];
        return COLORS[2];
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                Мои курсы
            </Typography>
            <div className="courses-list">
                {courses.map((course, index) => (
                    <div key={index} className="course-item">
                        <Typography variant="subtitle1" className="course-name">
                            {course.name}
                        </Typography>
                        <div className="container--diagram">
                            <PieChart width={80} height={80}>
                                <Pie
                                    data={[{ value: course.progress }, { value: 100 - course.progress }]}
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
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default ProfileCourses;
