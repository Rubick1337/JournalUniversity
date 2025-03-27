import React from 'react';
import { Typography, Box } from '@mui/material';
import './ProfileStyle.css';

const ProfileInfo = ({ profile }) => {
    return (
        <Box>
            <Typography variant="h6" className="section-title-information" sx={{ marginBottom: '20px' }}>
                Подробная информация
            </Typography>
            <Box className="info-grid">
                <Typography className="info-label">Email:</Typography>
                <Typography className="info-value">{profile.email}</Typography>
                <Typography className="info-label">Телефон:</Typography>
                <Typography className="info-value">{profile.phone}</Typography>
                <Typography className="info-label">Паспорт:</Typography>
                <Typography className="info-value">{profile.passport}</Typography>
                <Typography className="info-label">Группа:</Typography>
                <Typography className="info-value">{profile.group}</Typography>
                <Typography className="info-label">Номер зачётки:</Typography>
                <Typography className="info-value">{profile.recordBook}</Typography>
                <Typography className="info-label">Страна:</Typography>
                <Typography className="info-value">{profile.country}</Typography>
                <Typography className="info-label">Город:</Typography>
                <Typography className="info-value">{profile.city}</Typography>
            </Box>
        </Box>
    );
};

export default ProfileInfo;