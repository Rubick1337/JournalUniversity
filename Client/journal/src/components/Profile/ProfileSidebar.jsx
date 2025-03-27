import React from 'react';
import { Typography, Box } from '@mui/material';
import avatar from '../../images/user_default.png';
import './ProfileStyle.css';

const ProfileSidebar = ({ profile }) => {
    return (
        <Box className="profile-sidebar">
            <img src={avatar} width={130} height={130} className="avatar-img" alt="Аватар"/>
            <Typography variant="h5" className="profile-name">
                {profile.name}
            </Typography>
            <div className="absences-section">
                <h4 className="section-absences-title">Прогулы</h4>
                <div className="absences-container">
                    <div className="absence-item">
                        <div className="absence-number excused">{profile.excusedAbsences}</div>
                        <div className="absence-label">По уважительной</div>
                    </div>
                    <div className="absence-item">
                        <div className="absence-number unexcused">{profile.unexcusedAbsences}</div>
                        <div className="absence-label">Без уважительной</div>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default ProfileSidebar;