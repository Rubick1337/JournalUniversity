import React, { useState, useEffect } from 'react';
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

const EditGroupModal = ({ open, onClose, group, faculties, departments, specialities, students, onSave, showAlert }) => {
    const [editGroup, setEditGroup] = useState({
        name: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 4,
        facultyId: '',
        departmentId: '',
        specialityCode: '',
        headmanId: null,
        teacherCuratorId: null
    });

    useEffect(() => {
        if (group) {
            setEditGroup({
                name: group.name || '',
                startYear: group.yearOfBeginningOfStudy || new Date().getFullYear(),
                endYear: group.graduationYear || new Date().getFullYear() + 4,
                facultyId: group.faculty?.id || '',
                departmentId: group.department?.id || '',
                specialityCode: group.academicSpecialty?.code || '',
                headmanId: group.classRepresentative?.id || null,
                teacherCuratorId: group.teacherCurator?.id || null
            });
        }
    }, [group]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditGroup(prev => ({ ...prev, [name]: value }));
    };

    const handleFacultyChange = (_, newValue) => {
        const selectedFaculty = faculties.find(f => f.id === newValue || f.name === newValue);
        setEditGroup(prev => ({
            ...prev,
            facultyId: selectedFaculty?.id || newValue,
            departmentId: '' // Сбрасываем кафедру при изменении факультета
        }));
    };

    const handleDepartmentChange = (_, newValue) => {
        const selectedDepartment = departments.find(d => d.id === newValue || d.name === newValue);
        setEditGroup(prev => ({
            ...prev,
            departmentId: selectedDepartment?.id || newValue
        }));
    };

    const handleSpecialityChange = (_, newValue) => {
        const selectedSpeciality = specialities.find(s => s.code === newValue);
        setEditGroup(prev => ({
            ...prev,
            specialityCode: selectedSpeciality?.code || newValue
        }));
    };

    const handleHeadmanChange = (newPerson) => {
        setEditGroup(prev => ({ ...prev, headmanId: newPerson?.id || null }));
    };

    const handleTeacherCuratorChange = (newPerson) => {
        setEditGroup(prev => ({ ...prev, teacherCuratorId: newPerson?.id || null }));
    };

    const handleSubmit = () => {
        if (!editGroup.name || !editGroup.facultyId || !editGroup.departmentId || !editGroup.specialityCode) {
            showAlert({
                open: true,
                message: 'Все обязательные поля должны быть заполнены!',
                severity: 'error'
            });
            return;
        }
        onSave(editGroup);
        onClose();
    };

    // Функции для получения отображаемых значений
    const getFacultyValue = () => {
        if (!editGroup.facultyId) return null;
        const faculty = faculties.find(f => f.id === editGroup.facultyId);
        return faculty ? faculty.name : editGroup.facultyId;
    };

    const getDepartmentValue = () => {
        if (!editGroup.departmentId) return null;
        const department = departments.find(d => d.id === editGroup.departmentId);
        return department ? department.name : editGroup.departmentId;
    };

    const getSpecialityValue = () => {
        if (!editGroup.specialityCode) return null;
        const speciality = specialities.find(s => s.code === editGroup.specialityCode);
        return speciality ? speciality.code : editGroup.specialityCode;
    };

    const getHeadmanValue = () => {
        if (!editGroup.headmanId) return null;
        return students.find(s => s.id === editGroup.headmanId);
    };

    const getTeacherCuratorValue = () => {
        if (!editGroup.teacherCuratorId) return null;
        return students.find(s => s.id === editGroup.teacherCuratorId);
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
                        required
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
                            required
                        />
                        <TextField
                            label="Год окончания"
                            fullWidth
                            margin="normal"
                            name="endYear"
                            type="number"
                            value={editGroup.endYear}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Autocomplete
                        options={faculties}
                        value={getFacultyValue()}
                        onChange={handleFacultyChange}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value?.id || option === value
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Факультет" margin="normal" fullWidth required />
                        )}
                    />

                    <Autocomplete
                        options={departments.filter(d =>
                            !editGroup.facultyId || d.facultyId === editGroup.facultyId
                        )}
                        value={getDepartmentValue()}
                        onChange={handleDepartmentChange}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value?.id || option === value
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Кафедра" margin="normal" fullWidth required />
                        )}
                    />

                    <Autocomplete
                        options={specialities}
                        value={getSpecialityValue()}
                        onChange={handleSpecialityChange}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            const spec = specialities.find(s => s.code === option.code);
                            return spec ? `${spec.code} (${spec.name})` : option.code;
                        }}
                        isOptionEqualToValue={(option, value) =>
                            option.code === value?.code || option === value
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Код специальности" margin="normal" fullWidth required />
                        )}
                    />

                    <PersonSelector
                        textValue="Староста группы"
                        value={getHeadmanValue()}
                        onChange={handleHeadmanChange}
                        options={students}
                    />

                    <PersonSelector
                        textValue="Куратор группы (преподаватель)"
                        value={getTeacherCuratorValue()}
                        onChange={handleTeacherCuratorChange}
                        options={students}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose} sx={{ mr: 1 }}>Отмена</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={!editGroup.name || !editGroup.facultyId ||
                                !editGroup.departmentId || !editGroup.specialityCode}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditGroupModal;