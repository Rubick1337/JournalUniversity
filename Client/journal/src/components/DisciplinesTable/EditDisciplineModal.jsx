import React, { useEffect } from 'react';
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

const EditDisciplineModal = ({ open, onClose, subject, departments, onSave, showAlert }) => {
    const [editDiscipline, setEditDiscipline] = React.useState({
        name: '',
        department: ''
    });

    useEffect(() => {
        if (subject) {
            setEditDiscipline({
                name: subject.name || '',
                department: subject.department?.name || ''
            });
        }
    }, [subject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditDiscipline(prev => ({ ...prev, [name]: value }));
    };

    const handleDepartmentChange = (event, newValue) => {
        setEditDiscipline(prev => ({ ...prev, department: newValue }));
    };

    const handleSubmit = async () => {
        if (!editDiscipline.name || !editDiscipline.department) {
            showAlert('Все поля должны быть заполнены!', 'error');
            return;
        }

        const selectedDepartment = departments.find(d => d.name === editDiscipline.department);
        if (!selectedDepartment) {
            showAlert('Выберите корректную кафедру', 'error');
            return;
        }

        try {
            await onSave({
                name: editDiscipline.name,
                departmentId: selectedDepartment.id
            });
            onClose(); // Закрываем модальное окно после успешного сохранения
        } catch (error) {
            // Ошибка будет обработана в родительском компоненте
        }
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
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1
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

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <Button variant="outlined" onClick={onClose}>Отмена</Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            color="primary"
                            disabled={!editDiscipline.name || !editDiscipline.department}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default React.memo(EditDisciplineModal);