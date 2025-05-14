import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';
import './ProfileStyle.css';
import { getStudentById } from '../../store/slices/studentSlice';

const UserProfile = () => {
    const [tabValue, setTabValue] = useState(0);
    const [editMode, setEditMode] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { currentStudent, isLoading } = useSelector(state => state.students);

    // Загружаем данные студента при монтировании
    useEffect(() => {
        if (user?.student_id) {
            dispatch(getStudentById(user.student_id));
        }
    }, [user?.student_id, dispatch]);

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
        setEditMode(false);
    };

    if (isLoading || !currentStudent) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const profileData = {
        name: currentStudent.person
            ? `${currentStudent.person.surname} ${currentStudent.person.name} ${currentStudent.person.middlename || ''}`
            : 'Не указано',
        email: currentStudent.person?.email || 'Не указано',
        phone: currentStudent.person?.phoneNumber || 'Не указано',
        group: currentStudent.group?.name || 'Не указано',
        recordBook: currentStudent.id || 'Не указано',
        excusedAbsences: currentStudent.excusedAbsences || 0,
        unexcusedAbsences: currentStudent.unexcusedAbsences || 0,
        countReprimand: currentStudent.countReprimand,
    };

    return (
        <div className="background__profile">
            <Box className="profile-container">
                <ProfileSidebar profile={profileData} />
                <ProfileContent
                    tabValue={tabValue}
                    onTabChange={handleTabChange}
                    profile={profileData}
                    editMode={editMode}
                    setEditMode={setEditMode}
                />
            </Box>
        </div>
    );
};

export default UserProfile;