import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getForStudent } from '../../store/slices/absenteeismSlice';
import avatar from '../../images/user_default.png';
import './ProfileStyle.css';

const ProfileSidebar = ({ profile }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const absenteeismData = useSelector(state => state.absenteeism.studentAbsenteeism.data);
    console.log(absenteeismData);
    // Загружаем данные о прогулах при монтировании компонента
    useEffect(() => {

            dispatch(getForStudent(user.student_id));
    }, [dispatch, user?.student_id]);

    const excusedAbsences = absenteeismData?.data?.totals?.excusedHours || 0;
    const unexcusedAbsences = absenteeismData?.data?.totals?.unexcusedHours || 0;

    return (
        <Box className="profile-sidebar">
            <img src={avatar} width={130} height={130} className="avatar-img" alt="Аватар"/>
            <Typography variant="h5" className="profile-name">
                {profile.name}
            </Typography>
            <div className="absences-section">
                <h4 className="section-title-profile">Прогулы</h4>
                <div className="absences-container">
                    <div className="absence-item">
                        <div className="absence-number excused">{excusedAbsences}</div>
                        <div className="absence-label">По уважительной</div>
                    </div>
                    <div className="absence-item">
                        <div className="absence-number unexcused">{unexcusedAbsences}</div>
                        <div className="absence-label">Без уважительной</div>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default ProfileSidebar;