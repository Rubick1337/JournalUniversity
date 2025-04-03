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

const EditDisciplineModal = ({ open, onClose, discipline, departments, onSave, showAlert }) => {
    const [editDiscipline, setEditDiscipline] = React.useState(discipline || {
        name: '',
        department: ''
    });

    React.useEffect(() => {
        if (discipline) {
            setEditDiscipline(discipline);
        }
    }, [discipline]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditDiscipline(prev => ({ ...prev, [name]: value }));
    };

    const handleDepartmentChange = (event, newValue) => {
        setEditDiscipline(prev => ({ ...prev, department: newValue }));
    };

    const handleSubmit = () => {
        if (!editDiscipline.name || !editDiscipline.department) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }
        onSave(editDiscipline);
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
                    <Typography variant="h6">Редактировать дисциплину</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ p: 3 }}>
                    <TextField
                        label="Название дисциплины"
                        fullWidth
                        margin="normal"
                        name="name"
                        value={editDiscipline.name}
                        onChange={handleChange}
                    />

                    <Autocomplete
                        options={departments.map(dept => dept.name)}
                        value={editDiscipline.department}
                        onChange={handleDepartmentChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Кафедра"
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

export default EditDisciplineModal;