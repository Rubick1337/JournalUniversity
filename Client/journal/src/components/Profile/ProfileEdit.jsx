import React, {useEffect} from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import { updatePerson } from '../../store/slices/personSlice';
import './ProfileStyle.css';
import {getStudentById} from "../../store/slices/studentSlice";

const ProfileEdit = ({ profile, onProfileChange, editMode, setEditMode }) => {
    const dispatch = useDispatch();
    const [localProfile, setLocalProfile] = React.useState(profile);;
    const { user } = useSelector(state => state.user);
    const { currentStudent, isLoading } = useSelector(state => state.students);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (!currentStudent?.person?.id) {
                throw new Error('Не найден ID персоны');
            }

            // Подготавливаем данные для обновления
            const personData = {
                surname: localProfile.name.split(' ')[0] || '',
                name: localProfile.name.split(' ')[1] || '',
                middlename: localProfile.name.split(' ')[2] || null,
                phone_number: localProfile.phone || null,
                email: localProfile.email
            };

            await dispatch(updatePerson({
                id: currentStudent.person.id,
                personData
            })).unwrap();
            dispatch(getStudentById(user.student_id));
            setEditMode(false);

        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };
    console.log(currentStudent)
    return (
        <Box>
            <Typography variant="h6" className="section-title" sx={{ marginBottom: '20px' }}>
                Редактирование профиля
            </Typography>

            {editMode ? (
                <Box component="form" className="edit-form">
                    <TextField
                        fullWidth
                        label="ФИО"
                        name="name"
                        value={localProfile.name}
                        onChange={handleInputChange}
                        className="form-field"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={localProfile.email}
                        onChange={handleInputChange}
                        className="form-field"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Телефон"
                        name="phone"
                        value={localProfile.phone}
                        onChange={handleInputChange}
                        className="form-field"
                        margin="normal"
                    />
                    <Box className="buttons-group">
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            className="button-primary"
                        >
                            Сохранить
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setEditMode(false)}
                            className="button-outline"
                        >
                            Отмена
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Box className="info-grid" style={{ marginBottom: '20px' }}>
                        <Typography className="info-label">ФИО:</Typography>
                        <Typography className="info-value">{profile.name}</Typography>

                        <Typography className="info-label">Email:</Typography>
                        <Typography className="info-value">{profile.email}</Typography>

                        <Typography className="info-label">Телефон:</Typography>
                        <Typography className="info-value">{profile.phone}</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => setEditMode(true)}
                        className="button-primary"
                    >
                        Редактировать
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ProfileEdit;