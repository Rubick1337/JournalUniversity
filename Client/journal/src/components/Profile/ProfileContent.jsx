import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ProfileInfo from './ProfileInfo';
import ProfileCourses from './ProfileCourses';
import ProfileEdit from './ProfileEdit';
import './ProfileStyle.css';

const ProfileContent = ({ tabValue, onTabChange, profile, onProfileChange, editMode, setEditMode }) => {
    return (
        <Box className="profile-content">
            <Tabs
                value={tabValue}
                onChange={(e, newValue) => onTabChange(newValue)}
                className="tabs-container"
                TabIndicatorProps={{ className: 'tabs-indicator' }}
            >
                <Tab label="Обо мне" className={tabValue === 0 ? 'tab-button active' : 'tab-button inactive'} />
                <Tab label="Курсы" className={tabValue === 1 ? 'tab-button active' : 'tab-button inactive'} />
                <Tab label="Изменить профиль" className={tabValue === 2 ? 'tab-button active' : 'tab-button inactive'} />
            </Tabs>

            <Box>
                {tabValue === 0 && <ProfileInfo profile={profile} />}
                {tabValue === 1 && <ProfileCourses />}
                {tabValue === 2 && (
                    <ProfileEdit
                        profile={profile}
                        onProfileChange={onProfileChange}
                        editMode={editMode}
                        setEditMode={setEditMode}
                    />
                )}
            </Box>
        </Box>
    );
};

export default ProfileContent;