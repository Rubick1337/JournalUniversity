import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, IconButton, Box, Typography, Stack } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { PersonModal } from '../PersonCreationModal/PersonCreationModal';
import { useDispatch } from 'react-redux';
import { addPerson, fetchPersonsByFullName } from '../../store/slices/personSlice';

const PersonSelector = ({textValue = "Выбрать челвоека", value, onChange, options = [] }) => {
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showAddOption, setShowAddOption] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Функция для проверки, нужно ли выполнять поиск
    const shouldSearch = useCallback((searchText) => {
        const words = searchText.trim().split(/\s+/).filter(Boolean);
        return words.length >= 2 && searchText.trim().length >= 5;
    }, []);

    // Эффект для выполнения поиска при изменении inputValue
    useEffect(() => {
        const searchText = inputValue.trim();
        if (shouldSearch(searchText)) {
            setLoading(true);
            const timer = setTimeout(() => {
                dispatch(fetchPersonsByFullName({
                    fullNameQuery: searchText,
                    limit: 10,
                    page: 1,
                    sortBy: 'surname',
                    sortOrder: 'ASC'
                }))
                .unwrap()
                .then((response) => {
                    setSearchResults(response.data);
                    setShowAddOption(response.data.length === 0);
                })
                .catch((error) => {
                    console.error('Ошибка поиска:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
            }, 500); // Задержка для debounce

            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setShowAddOption(false);
        }
    }, [inputValue, dispatch, shouldSearch]);

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
        // Проверяем локальные options, если не выполняем поиск
        if (!shouldSearch(newInputValue)) {
            const exists = options.some(option =>
                getPersonLabel(option).toLowerCase().includes(newInputValue.toLowerCase())
            );
            setShowAddOption(newInputValue.length > 0 && !exists);
        }
    };

    const filterOptions = (options, { inputValue }) => {
        if (!inputValue) return options;
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
                // Обновляем локальный список
                setSearchResults(prev => [addedPerson, ...prev]);
            })
            .catch((err) => {
                alert(`Ошибка при добавлении: ${err.message}`);
            });
    };

    // Объединяем локальные options и результаты поиска
    const allOptions = [...options, ...searchResults].reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Autocomplete
                options={allOptions}
                getOptionLabel={getPersonLabel}
                value={normalizeValue()}
                onChange={(_, newValue) => {
                    onChange(newValue);
                    setShowAddOption(false);
                }}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                filterOptions={filterOptions}
                loading={loading}
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
                        shouldSearch(inputValue) ? 'Не найдено' : 'Введите минимум 2 слова (5+ символов)'
                    )
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={textValue}
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