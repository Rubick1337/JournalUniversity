import React, { useState } from 'react';
import { Box } from '@mui/material';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';
import './ProfileStyle.css';

const UserProfile = () => {
    const [tabValue, setTabValue] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Гусев Алексей Сергеевич',
        email: 'poss1337@gmail.com',
        phone: '+7 (999) 123-45-67',
        passport: '4510 123456',
        group: 'АСОИР-221',
        recordBook: '12345678',
        country: 'Россия',
        city: 'Санкт-Петербург',
        excusedAbsences: 2,
        unexcusedAbsences: 3
    });

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
        setEditMode(false);
    };

    const handleProfileChange = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    return (
        <div className="background__profile">
            <Box className="profile-container">
                <ProfileSidebar
                    profile={profile}
                />
                <ProfileContent
                    tabValue={tabValue}
                    onTabChange={handleTabChange}
                    profile={profile}
                    onProfileChange={handleProfileChange}
                    editMode={editMode}
                    setEditMode={setEditMode}
                />
            </Box>
        </div>
    );
};

export default UserProfile;