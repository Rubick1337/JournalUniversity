import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonSelector from '../DepartmentsTable/PersonSelector';

const EditTeacherModal = ({
                              open,
                              onClose,
                              teacher, // текущий преподаватель для редактирования
                              departments, // список кафедр
                              positions, // список должностей
                              onSave, // callback для сохранения
                              people, // список людей
                              personInputValue, // значение поиска персоны
                              onPersonInputChange, // обработчик изменения поиска
                              onAddPersonClick // обработчик добавления новой персоны
                          }) => {
    // Состояние формы
    const [editedTeacher, setEditedTeacher] = React.useState({
        name: null, // объект person
        department_id: null, // ID кафедры
        teaching_position_id: null // ID должности
    });

    // Инициализация формы при получении данных преподавателя
    React.useEffect(() => {
        if (teacher) {
            setEditedTeacher({
                name: teacher.person, // сохраняем весь объект person
                department_id: teacher.department?.id, // сохраняем только ID кафедры
                teaching_position_id: teacher.teachingPosition?.id // сохраняем только ID должности
            });
        }
    }, [teacher]);

    // Обработчик изменения полей формы
    const handleChange = (field, value) => {
        setEditedTeacher(prev => ({ ...prev, [field]: value }));
    };

    // Обработчик отправки формы
    const handleSubmit = () => {
        // Валидация
        if (!editedTeacher.name || !editedTeacher.department_id || !editedTeacher.teaching_position_id) {
            onSave(null, 'Все поля должны быть заполнены!');
            return;
        }

        // Формируем данные для отправки
        const dataToSend = {
            person_id: editedTeacher.name.id, // извлекаем ID персоны
            department_id: editedTeacher.department_id,
            teaching_position_id: editedTeacher.teaching_position_id
        };

        // Вызываем callback с данными
        onSave(dataToSend);
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
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h6">Редактировать преподавателя</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Компонент выбора персоны */}
                <PersonSelector
                    value={editedTeacher.name}
                    onChange={(value) => handleChange('name', value)}
                    options={people}
                    inputValue={personInputValue}
                    onInputChange={onPersonInputChange}
                    onAddPersonClick={onAddPersonClick}
                    getOptionSelected={(option, value) => option.id === value.id}
                    getOptionLabel={(option) =>
                        `${option.surname} ${option.name} ${option.middlename}`
                    }
                />

                {/* Поле выбора кафедры */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Кафедра</InputLabel>
                    <Select
                        value={editedTeacher.department_id || ''}
                        onChange={(e) => handleChange('department_id', e.target.value)}
                        label="Кафедра"
                    >
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Поле выбора должности */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Должность</InputLabel>
                    <Select
                        value={editedTeacher.teaching_position_id || ''}
                        onChange={(e) => handleChange('teaching_position_id', e.target.value)}
                        label="Должность"
                    >
                        {positions.map((pos) => (
                            <MenuItem key={pos.id} value={pos.id}>
                                {pos.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Кнопки действий */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2
                }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={
                            !editedTeacher.name ||
                            !editedTeacher.department_id ||
                            !editedTeacher.teaching_position_id
                        }
                    >
                        Сохранить
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditTeacherModal;