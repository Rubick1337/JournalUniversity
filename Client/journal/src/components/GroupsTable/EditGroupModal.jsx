import React from 'react';
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

const EditGroupModal = ({ open, onClose, group, faculties, departments, specialities, students, onSave, showAlert }) => {
    const [editGroup, setEditGroup] = React.useState(group || {
        name: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 4,
        faculty: '',
        department: '',
        specialityCode: '',
        headmanId: null
    });

    React.useEffect(() => {
        if (group) {
            setEditGroup(group);
        }
    }, [group]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditGroup(prev => ({ ...prev, [name]: value }));
    };

    const handleFacultyChange = (event, newValue) => {
        setEditGroup(prev => ({ ...prev, faculty: newValue }));
    };

    const handleDepartmentChange = (event, newValue) => {
        setEditGroup(prev => ({ ...prev, department: newValue }));
    };

    const handleSpecialityChange = (event, newValue) => {
        setEditGroup(prev => ({ ...prev, specialityCode: newValue }));
    };

    const handleHeadmanChange = (event, newValue) => {
        setEditGroup(prev => ({ ...prev, headmanId: newValue?.id || null }));
    };

    const handleSubmit = () => {
        if (!editGroup.name || !editGroup.faculty || !editGroup.department || !editGroup.specialityCode) {
            showAlert('Все обязательные поля должны быть заполнены!', 'error');
            return;
        }
        onSave(editGroup);
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
                    <Typography variant="h6">Редактировать группу</Typography>
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
                        value={editGroup.name}
                        onChange={handleChange}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Год начала"
                            fullWidth
                            margin="normal"
                            name="startYear"
                            type="number"
                            value={editGroup.startYear}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Год окончания"
                            fullWidth
                            margin="normal"
                            name="endYear"
                            type="number"
                            value={editGroup.endYear}
                            onChange={handleChange}
                        />
                    </Box>

                    <Autocomplete
                        options={faculties.map(f => f.name)}
                        value={editGroup.faculty}
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
                        options={departments.map(d => d.name)}
                        value={editGroup.department}
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
                        options={specialities.map(s => s.code)}
                        value={editGroup.specialityCode}
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
                        getOptionLabel={(option) => {
                            const spec = specialities.find(s => s.code === option);
                            return spec ? `${option} (${spec.name})` : option;
                        }}
                    />

                    <Autocomplete
                        options={students}
                        value={students.find(s => s.id === editGroup.headmanId) || null}
                        onChange={handleHeadmanChange}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Староста группы"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose}>Отмена</Button>
                        <Button onClick={handleSubmit} color="primary">Сохранить</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditGroupModal;