import React from 'react';
import { Autocomplete, TextField, Box, Button, Typography } from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { FormControl } from '@mui/material';

const PersonSelector = ({
                            value,
                            onChange,
                            people,
                            inputValue,
                            onInputChange,
                            onAddPersonClick
                        }) => {
    return (
        <FormControl fullWidth margin="normal">
            <Autocomplete
                options={people}
                getOptionLabel={(option) => option.fullName}
                value={people.find(p => p.fullName === value) || null}
                onChange={(_, newValue) => {
                    onChange(newValue ? newValue.fullName : '');
                }}
                inputValue={inputValue}
                onInputChange={(_, value) => onInputChange(_, value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="ФИО заведующего*"
                        margin="normal"
                        required
                    />
                )}
                noOptionsText={
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Не найдено</Typography>
                        <Button
                            startIcon={<PersonAddIcon />}
                            onClick={onAddPersonClick}
                            size="small"
                        >
                            Добавить нового
                        </Button>
                    </Box>
                }
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.fullName}
                    </li>
                )}
            />
        </FormControl>
    );
};

export default React.memo(PersonSelector);