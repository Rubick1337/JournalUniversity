import React from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem as SelectMenuItem,
    Box,
    Button
} from '@mui/material';
import PersonSelector from './PersonSelector';

const DepartmentForm = ({
                            department,
                            onDepartmentChange,
                            people,
                            personInputValue,
                            onPersonInputChange,
                            onAddPersonClick,
                            faculties,
                            onCancel,
                            onSubmit,
                            submitText = 'Сохранить'
                        }) => {
    return (
        <>
            <TextField
                label="Сокращенное название*"
                fullWidth
                margin="normal"
                value={department.shortName}
                onChange={(e) => onDepartmentChange('shortName', e.target.value)}
                required
            />
            <TextField
                label="Полное название*"
                fullWidth
                margin="normal"
                value={department.fullName}
                onChange={(e) => onDepartmentChange('fullName', e.target.value)}
                required
            />

            <PersonSelector
                value={department.head}
                onChange={(value) => onDepartmentChange('head', value)}
                people={people}
                inputValue={personInputValue}
                onInputChange={onPersonInputChange}
                onAddPersonClick={onAddPersonClick}
            />

            <FormControl fullWidth margin="normal" required>
                <InputLabel>Факультет*</InputLabel>
                <Select
                    value={department.faculty}
                    onChange={(e) => onDepartmentChange('faculty', e.target.value)}
                    label="Факультет*"
                >
                    {faculties.map((faculty) => (
                        <SelectMenuItem key={faculty} value={faculty}>{faculty}</SelectMenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={onCancel} sx={{ mr: 1 }}>Отмена</Button>
                <Button onClick={onSubmit} color="primary">{submitText}</Button>
            </Box>
        </>
    );
};

export default React.memo(DepartmentForm);