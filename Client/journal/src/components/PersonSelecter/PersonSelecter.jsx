import './PersonSelecter.css';

import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography, TextField } from '@mui/material';

export default function PersonSelecter({ selectedPerson = {}, personDataSelect = [], onSelectChange = () => {} }) {
  const [searchQuery, setSearchQuery] = useState('');
    console.log(personDataSelect)
  // Обработчик выбора
  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    // Находим выбранного человека по id
    const selectedPersonData = personDataSelect.find(person => person.id === selectedId);
    
    // Вызов внешнего обработчика, если он был передан как параметр
    if (onSelectChange && selectedPersonData) {
      onSelectChange(selectedPersonData);  // Передаем выбранный объект в родительский компонент
    }
  };

  // Обработчик изменения строки поиска
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Фильтрация списка по строке поиска
  const filteredPersonDataSelect = personDataSelect.filter((person) => {
    const fullName = `${person.surname} ${person.name} ${person.middlename}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Если нет данных для отображения
  if (personDataSelect.length === 0) {
    return (
      <FormControl fullWidth>
        <InputLabel id="person-select-label">Выберите персональные данные</InputLabel>
        <Select
          labelId="person-select-label"
          id="person-select"
          value=""
          label="Выберите ФИО"
          disabled
        >
          <MenuItem value="">
            <Typography variant="body2" color="textSecondary">Нет данных</Typography>
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  // Если есть данные для отображения, рендерим выпадающий список
  return (
    <FormControl fullWidth>
      <InputLabel id="person-select-label">Выберите персональные данные</InputLabel>
      <Select
        labelId="person-select-label"
        id="person-select"
        value={selectedPerson ? selectedPerson.id : ''}  // Используем id для отображения выбранного элемента
        label="Выберите ФИО"
        onChange={handleSelectChange}  // Используем локальный обработчик
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300, // Максимальная высота для прокрутки меню
            },
          },
        }}
      >
        {/* Поле для ввода поискового запроса */}
        <TextField
          label="Поиск"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginBottom: '10px' }}
        />
        
        {filteredPersonDataSelect.length === 0 ? (
          <MenuItem value="">
            <Typography variant="body2" color="textSecondary">Нет совпадений</Typography>
          </MenuItem>
        ) : (
          filteredPersonDataSelect.map((person) => (
            <MenuItem key={person.id} value={person.id}>
              {/* Отображаем фамилию, имя и отчество */}
              <Typography variant="body2">
                {person.surname} {person.name} {person.middlename}
              </Typography>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
