import React, { useState } from 'react';
import { Autocomplete, TextField, IconButton, Box, Typography, Stack } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { PersonModal } from '../PersonCreationModal/PersonCreationModal';
import { useDispatch } from 'react-redux';
import { addPerson, fetchPersons } from '../../store/slices/personSlice';

const PersonSelector = ({ value, onChange, options = [] }) => {
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showAddOption, setShowAddOption] = useState(false);

    const getPersonLabel = (person) => {
        if (!person) return '';
        if (typeof person === 'object') {
            return `${person.surname} ${person.name} ${person.middlename || ''}`.trim();
        }
        const foundPerson = options.find(opt => opt.id === person);
        return foundPerson ? `${foundPerson.surname} ${foundPerson.name} ${foundPerson.middlename || ''}`.trim() : '';
    };

    const normalizeValue = () => {
        if (!value) return null;
        if (typeof value === 'object') return value;
        return options.find(opt => opt.id === value) || null;
    };

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        // Проверяем, есть ли введенное значение в списке options
        const exists = options.some(option =>
            getPersonLabel(option).toLowerCase().includes(newInputValue.toLowerCase())
        );
        setShowAddOption(newInputValue.length > 0 && !exists);
    };

    const filterOptions = (options, { inputValue }) => {
        return options.filter(option =>
            getPersonLabel(option).toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleAddNewPerson = (newPersonData, error) => {
        if (error) {
            alert(error);
            return;
        }

        const personToAdd = {
            surname: newPersonData.lastName,
            name: newPersonData.firstName,
            middlename: newPersonData.patronymic,
            phoneNumber: newPersonData.phone,
            email: newPersonData.email
        };

        dispatch(addPerson(personToAdd))
            .unwrap()
            .then((addedPerson) => {
                onChange(addedPerson);
                setModalOpen(false);
                setInputValue('');
                setShowAddOption(false);
                dispatch(fetchPersons({}));
            })
            .catch((err) => {
                alert(`Ошибка при добавлении: ${err.message}`);
            });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Autocomplete
                options={options}
                getOptionLabel={getPersonLabel}
                value={normalizeValue()}
                onChange={(_, newValue) => {
                    onChange(newValue);
                    setShowAddOption(false);
                }}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                filterOptions={filterOptions} // Используем нашу функцию фильтрации
                noOptionsText={
                    showAddOption ? (
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ p: 1, cursor: 'pointer' }}
                            onClick={() => setModalOpen(true)}
                        >
                            <PersonAddAltIcon color="primary" />
                            <Typography>
                                Добавить "{inputValue}" как нового заведующего
                            </Typography>
                        </Stack>
                    ) : (
                        'Не найдено'
                    )
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Заведующий кафедрой"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {params.InputProps.endAdornment}
                                    {showAddOption && (
                                        <IconButton
                                            onClick={() => setModalOpen(true)}
                                            color="primary"
                                            sx={{ mr: -1 }}
                                        >
                                            <PersonAddAltIcon />
                                        </IconButton>
                                    )}
                                </>
                            )
                        }}
                    />
                )}
            />

            <PersonModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setShowAddOption(false);
                }}
                onSave={handleAddNewPerson}
                initialData={{
                    lastName: inputValue.split(' ')[0] || '',
                    firstName: inputValue.split(' ')[1] || '',
                }}
            />
        </Box>
    );
};

export default PersonSelector;