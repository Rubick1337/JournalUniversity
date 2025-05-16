import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Autocomplete,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonSelector from '../DepartmentsTable/PersonSelector';

const AddGroupModal = ({
                           open,
                           onClose,
                           faculties,
                           departments,
                           specialities,
                           students,
                           onSave,
                           showAlert
                       }) => {
    const [newGroup, setNewGroup] = useState({
        name: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 4,
        facultyId: null,  // Храним ID вместо названия
        departmentId: null,
        specialityCode: '',
        headmanId: null,
        teacherCuratorId: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewGroup(prev => ({ ...prev, [name]: value }));
    };

    const handleFacultyChange = (_, newValue) => {
        setNewGroup(prev => ({
            ...prev,
            facultyId: newValue ? newValue.id : null
        }));
    };

    const handleDepartmentChange = (_, newValue) => {
        setNewGroup(prev => ({
            ...prev,
            departmentId: newValue ? newValue.id : null
        }));
    };

    const handleSpecialityChange = (_, newValue) => {
        setNewGroup(prev => ({
            ...prev,
            specialityCode: newValue ? newValue.code : ''
        }));
    };

    const handleHeadmanChange = (newPerson) => {
        setNewGroup(prev => ({
            ...prev,
            headmanId: newPerson?.id || null
        }));
    };

    const handleTeacherCuratorChange = (newPerson) => {
        setNewGroup(prev => ({
            ...prev,
            teacherCuratorId: newPerson?.id || null
        }));
    };

    const handleSubmit = () => {
        if (!newGroup.name ||
            !newGroup.facultyId ||
            !newGroup.departmentId ||
            !newGroup.specialityCode) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }
        onSave(newGroup);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
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
                    <Typography variant="h6">Добавить новую группу</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ p: 3 }}>
                    <TextField
                        label="Название группы"
                        fullWidth
                        margin="normal"
                        name="name"
                        value={newGroup.name}
                        onChange={handleChange}
                        required
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Год начала"
                            fullWidth
                            margin="normal"
                            name="startYear"
                            type="number"
                            value={newGroup.startYear}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Год окончания"
                            fullWidth
                            margin="normal"
                            name="endYear"
                            type="number"
                            value={newGroup.endYear}
                            onChange={handleChange}
                        />
                    </Box>

                    <Autocomplete
                        options={faculties}
                        getOptionLabel={(option) => option.name}
                        value={faculties.find(f => f.id === newGroup.facultyId) || null}
                        onChange={handleFacultyChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Факультет"
                                margin="normal"
                                fullWidth
                                required
                            />
                        )}
                    />

                    <Autocomplete
                        options={departments}
                        getOptionLabel={(option) => option.name}
                        value={departments.find(d => d.id === newGroup.departmentId) || null}
                        onChange={handleDepartmentChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Кафедра"
                                margin="normal"
                                fullWidth
                                required
                            />
                        )}
                    />

                    <Autocomplete
                        options={specialities}
                        getOptionLabel={(option) => `${option.code} (${option.name})`}
                        value={specialities.find(s => s.code === newGroup.specialityCode) || null}
                        onChange={handleSpecialityChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Код специальности"
                                margin="normal"
                                fullWidth
                                required
                            />
                        )}
                    />

                    <PersonSelector
                        textValue="Староста группы"
                        value={students.find(s => s.id === newGroup.headmanId) || null}
                        onChange={handleHeadmanChange}
                        options={students}
                    />

                    <PersonSelector
                        textValue="Куратор (преподаватель)"
                        value={students.find(s => s.id === newGroup.teacherCuratorId) || null}
                        onChange={handleTeacherCuratorChange}
                        options={students}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose}>Отмена</Button>
                        <Button
                            onClick={handleSubmit}
                            color="primary"
                            variant="contained"
                        >
                            Добавить
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddGroupModal;