import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const PersonModal = React.memo(({ open, onClose, onSave, initialData = {} }) => {
  const [personData, setPersonData] = useState({
    lastName: '',
    firstName: '',
    patronymic: '',
    phone: '',
    email: ''
  });

  // Синхронизация с initialData при изменении
  useEffect(() => {
    if (open) {
      setPersonData({
        lastName: initialData?.lastName || '',
        firstName: initialData?.firstName || '',
        patronymic: initialData?.patronymic || '',
        phone: initialData?.phone || '',
        email: initialData?.email || ''
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Добавлено для предотвращения всплытия

    if (!personData.lastName.trim() || !personData.firstName.trim()) {
      onSave(null, 'Фамилия и имя обязательны для заполнения!');
      return;
    }

    onSave({
      ...personData,
      lastName: personData.lastName.trim(),
      firstName: personData.firstName.trim(),
      patronymic: personData.patronymic.trim()
    });
  };

  return (
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1
        }}>
          <Box sx={{
            bgcolor: '#1976d2',
            color: 'white',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4
          }}>
            <Typography variant="h6">
              {initialData.id ? 'Редактировать человека' : 'Добавить человека'}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <TextField
                label="Фамилия*"
                fullWidth
                margin="normal"
                name="lastName"
                value={personData.lastName}
                onChange={handleChange}
                required
            />
            <TextField
                label="Имя*"
                fullWidth
                margin="normal"
                name="firstName"
                value={personData.firstName}
                onChange={handleChange}
                required
            />
            <TextField
                label="Отчество"
                fullWidth
                margin="normal"
                name="patronymic"
                value={personData.patronymic}
                onChange={handleChange}
            />
            <TextField
                label="Телефон"
                fullWidth
                margin="normal"
                name="phone"
                value={personData.phone}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                name="email"
                value={personData.email}
                onChange={handleChange}
                type="email"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={onClose} sx={{ mr: 1 }}>Отмена</Button>
              <Button type="submit" variant="contained">Сохранить</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
  );
});