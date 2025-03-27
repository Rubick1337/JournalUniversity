import React from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import './ProfileStyle.css';

const ProfileEdit = ({ profile, onProfileChange, editMode, setEditMode }) => {
    const [localProfile, setLocalProfile] = React.useState(profile);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onProfileChange(localProfile);
        setEditMode(false);
    };

    return (
        <Box>
            <Typography variant="h6" className="section-title" sx={{ marginBottom: '20px' }}>
                Редактирование профиля
            </Typography>

            {editMode ? (
                <Box component="form" className="edit-form">
                    <TextField
                        fullWidth
                        label="Имя"
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
                    <TextField
                        fullWidth
                        label="Паспорт"
                        name="passport"
                        value={localProfile.passport}
                        onChange={handleInputChange}
                        className="form-field"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Страна"
                        name="country"
                        value={localProfile.country}
                        onChange={handleInputChange}
                        className="form-field"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Город"
                        name="city"
                        value={localProfile.city}
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
                        <Typography className="info-label">Имя:</Typography>
                        <Typography className="info-value">{profile.name}</Typography>

                        <Typography className="info-label">Email:</Typography>
                        <Typography className="info-value">{profile.email}</Typography>

                        <Typography className="info-label">Телефон:</Typography>
                        <Typography className="info-value">{profile.phone}</Typography>

                        <Typography className="info-label">Паспорт:</Typography>
                        <Typography className="info-value">{profile.passport}</Typography>


                        <Typography className="info-label">Страна:</Typography>
                        <Typography className="info-value">{profile.country}</Typography>

                        <Typography className="info-label">Город:</Typography>
                        <Typography className="info-value">{profile.city}</Typography>
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