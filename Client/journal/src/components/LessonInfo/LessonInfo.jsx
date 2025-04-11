import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const LessonInfo = ({ lessonData, role }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/schedule');
    };

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
            {value}
        </Typography>
    </Box>
);

export default LessonInfo;