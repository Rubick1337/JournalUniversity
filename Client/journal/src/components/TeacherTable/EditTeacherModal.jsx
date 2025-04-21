// EditTeacherModal.jsx
import React from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonSelector from '../DepartmentsTable/PersonSelector';

const EditTeacherModal = ({
                              open,
                              onClose,
                              teacher,
                              departments,
                              positions,
                              onSave,
                              people,
                              personInputValue,
                              onPersonInputChange,
                              onAddPersonClick
                          }) => {
    const [editedTeacher, setEditedTeacher] = React.useState(teacher || {
        name: '',
        department: '',
        position: ''
    });

    React.useEffect(() => {
        if (teacher) {
            setEditedTeacher(teacher);
        }
    }, [teacher]);

    const handleChange = (field, value) => {
        setEditedTeacher(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!editedTeacher.name || !editedTeacher.department || !editedTeacher.position) {
            onSave(null, 'Все поля должны быть заполнены!');
            return;
        }
        onSave(editedTeacher);
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
                boxShadow: 24,
                p: 4
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Редактировать преподавателя</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <PersonSelector
                    value={editedTeacher.name}
                    onChange={(value) => handleChange('name', value)}
                    people={people}
                    inputValue={personInputValue}
                    onInputChange={onPersonInputChange}
                    onAddPersonClick={onAddPersonClick}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Кафедра</InputLabel>
                    <Select
                        value={editedTeacher.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        label="Кафедра"
                    >
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.name}>{dept.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Должность</InputLabel>
                    <Select
                        value={editedTeacher.position}
                        onChange={(e) => handleChange('position', e.target.value)}
                        label="Должность"
                    >
                        {positions.map((pos) => (
                            <MenuItem key={pos.id} value={pos.name}>{pos.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>Отмена</Button>
                    <Button variant="contained" onClick={handleSubmit}>Сохранить</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditTeacherModal;