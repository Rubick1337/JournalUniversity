import React from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import PersonSelector from './PersonSelector';

const DepartmentForm = ({
                            department = {},
                            onSave,
                            onCancel,
                            people = [],
                            faculties = [],
                            submitText = "Сохранить"
                        }) => {
    const [formData, setFormData] = React.useState({
        name: department.name || '',
        full_name: department.full_name || '',
        head_id: department.head?.id || department.head_id || null,
        faculty_id: department.faculty?.id || department.faculty_id || null
    });

    // Логирование изменений в форме
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field changed: ${name} = ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: value === "" ? null : value
        }));
    };

    // Логирование выбора заведующего
    const handlePersonChange = (person) => {
        console.log("Head person selected:", person);
        setFormData(prev => ({
            ...prev,
            head_id: person ? person.id : null
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = {
            name: formData.name,
            full_name: formData.full_name,
            faculty_id: Number(formData.faculty_id),
            chairperson_of_the_department_person_id: formData.head_id ? Number(formData.head_id) : null
        };

        console.log("Data to send before onSave:", dataToSend);  // Логирование данных перед отправкой

        onSave(dataToSend);
    };


    // Логирование состояния формы при каждом рендере
    React.useEffect(() => {
        console.log("Form data updated:", formData);
    }, [formData]);

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Сокращенное название"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />

            <TextField
                label="Полное название"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />

            <PersonSelector
                value={formData.head_id}
                onChange={handlePersonChange}
                options={people}
            />

            <TextField
                select
                label="Факультет"
                name="faculty_id"
                value={formData.faculty_id || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            >
                <MenuItem value="">Выберите факультет</MenuItem>
                {faculties.map(faculty => (
                    <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.fullName || faculty.full_name}
                    </MenuItem>
                ))}
            </TextField>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button variant="outlined" onClick={onCancel}>
                    Отмена
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!formData.faculty_id}
                >
                    {submitText}
                </Button>
            </Box>
        </form>
    );
};

export default DepartmentForm;
