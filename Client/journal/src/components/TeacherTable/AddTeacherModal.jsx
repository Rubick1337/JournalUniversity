import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddTeacherModal = ({ open, onClose, departments, positions, onSave, showAlert }) => {
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        department: '',
        position: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTeacher(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!newTeacher.name || !newTeacher.department || !newTeacher.position) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }
        onSave(newTeacher);
        onClose();
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
                boxShadow: 24
            }}>
                <Box sx={{
                    bgcolor: '#1976d2',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6">Добавить нового преподавателя</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ p: 3 }}>
                    <TextField
                        label="ФИО преподавателя"
                        fullWidth
                        margin="normal"
                        name="name"
                        value={newTeacher.name}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Кафедра</InputLabel>
                        <Select
                            name="department"
                            value={newTeacher.department}
                            onChange={handleChange}
                            label="Кафедра"
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.name}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Должность</InputLabel>
                        <Select
                            name="position"
                            value={newTeacher.position}
                            onChange={handleChange}
                            label="Должность"
                        >
                            {positions.map((pos) => (
                                <MenuItem key={pos.id} value={pos.name}>
                                    {pos.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose}>Отмена</Button>
                        <Button onClick={handleSubmit} color="primary">Добавить</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddTeacherModal;