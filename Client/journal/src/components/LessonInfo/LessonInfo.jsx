import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Divider,
    Box,
    IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import styles from './LessonInfo.module.css';
import AttendanceTable from './AttendanceTable';
import GradesTable from './GradesTable';
import axios from 'axios';


const LessonInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lessonData, setLessonData] = useState(null);
    const [loading, setLoading] = useState(true);

    const role = 'headman'; // или 'headman' или 'student'

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await axios.get('/TestData/schedule.json'); // Путь из public
                const scheduleData = response.data;

                let foundLesson = null;

                for (const day of scheduleData) {
                    const lesson = day.schedule.find(item => item.id === parseInt(id));
                    if (lesson) {
                        foundLesson = lesson;
                        break;
                    }
                }

                setLessonData(foundLesson);
            } catch (error) {
                console.error('Ошибка при загрузке или поиске занятия:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [id]);

    const handleBack = () => {
        navigate('/schedule');
    };

    if (loading) {
        return <div>Загрузка данных о занятии...</div>;
    }

    if (!lessonData) {
        return <div>Занятие с ID {id} не найдено</div>;
    }

    return (
        <div style={{ animation: 'fadeIn 0.3s' }}>
            <Paper elevation={0} className={styles.paperContainer}>
                <Box className={styles.headerBox}>
                    <IconButton
                        onClick={handleBack}
                        className={styles.backButton}
                    >
                        <ArrowBackIcon color="primary" />
                    </IconButton>
                    <Typography variant="h5" className={styles.title}>
                        Информация о занятии
                    </Typography>
                </Box>

                <Divider className={styles.divider} />

                <Box className={styles.infoGrid}>
                    <InfoItem label="Дата" value={lessonData.date} />
                    <InfoItem label="Пара" value={lessonData.pair} />
                    <InfoItem label="Аудитория" value={`${lessonData.building}, ${lessonData.classroom}`} />
                    <InfoItem label="Дисциплина" value={lessonData.discipline} />
                    <InfoItem label="Преподаватель" value={lessonData.teacher} />
                    <InfoItem label="Тема" value={lessonData.topic} />
                    <InfoItem label="Тип занятия" value={lessonData.type} />
                </Box>

                {role === 'headman' && <AttendanceTable lessonData={lessonData} />}
                {role === 'teacher' && <GradesTable lessonData={lessonData} />}
            </Paper>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <Box className={styles.infoItem}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom className={styles.infoLabel}>
            {label}
        </Typography>
        <Typography variant="body1" className={styles.infoValue}>
            {value || 'Не указано'}
        </Typography>
    </Box>
);

export default LessonInfo;