import React, { useState, useEffect } from 'react';
import {
    TextField,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    InputAdornment,
    Grow,
    Fade
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import SearchIcon from '@mui/icons-material/Search';
import CustomAlert from '../Alert/Alert';
import TopicsTable from './TopicsTable';
import './CreateLessonForm.css';
import LessonInfo from "../LessonInfo/LessonInfo";
const mockData = {
    buildings: ['Корпус 1', 'Корпус 2', 'Корпус 3', 'Корпус 4'],
    classNumbers: ['101', '102', '103', '201', '202', '203', '301', '302', '303'],
    pairs: ['1 пара', '2 пара', '3 пара', '4 пара'],
    lessonTypes: ['Лекция', 'Практика', 'Лабораторная', 'Семинар'],
    disciplines: [
        { id: 1, name: 'Математика' },
        { id: 2, name: 'Физика' },
        { id: 3, name: 'Программирование' },
        { id: 4, name: 'Английский язык' },
    ],
    teachers: [
        { id: 1, name: 'Иванов И.И.' },
        { id: 2, name: 'Петров П.П.' },
        { id: 3, name: 'Сидоров С.С.' },
        { id: 4, name: 'Кузнецова Е.В.' },
    ],
    groups: ['Группа 1', 'Группа 2', 'Группа 3'],
    subgroups: ['Подгруппа 1', 'Подгруппа 2'],
    topics: [
        { id: 1, name: 'Введение в математику', hours: 4, disciplineId: 1, completedHours: 4 },
        { id: 2, name: 'Дифференциальные уравнения', hours: 6, disciplineId: 1, completedHours: 3 },
        { id: 3, name: 'Механика', hours: 5, disciplineId: 2, completedHours: 0 },
        { id: 4, name: 'Электродинамика', hours: 6, disciplineId: 2, completedHours: 2 },
        { id: 5, name: 'Основы React', hours: 8, disciplineId: 3, completedHours: 8 },
        { id: 6, name: 'Грамматика английского', hours: 4, disciplineId: 4, completedHours: 1 },
    ],
    currentUser: { id: 3, name: 'Сидоров С.С.' }
};

const CreateLessonForm = () => {
    const [showLessonInfo, setShowLessonInfo] = useState(false);
    const [lessonData, setLessonData] = useState(null);
    const [date, setDate] = useState(dayjs());
    const [pair, setPair] = useState('');
    const [building, setBuilding] = useState('');
    const [classroom, setClassroom] = useState('');
    const [discipline, setDiscipline] = useState('');
    const [teacher, setTeacher] = useState(mockData.currentUser.id.toString());
    const [lessonType, setLessonType] = useState('');
    const [groupType, setGroupType] = useState('group');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSubgroup, setSelectedSubgroup] = useState('');
    const [topic, setTopic] = useState(null);
    const [openTopicDialog, setOpenTopicDialog] = useState(false);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [filteredClassrooms, setFilteredClassrooms] = useState([]);
    const [topicSearch, setTopicSearch] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');

    useEffect(() => {
        if (discipline) {
            const filtered = mockData.topics.filter(t =>
                t.disciplineId.toString() === discipline &&
                t.name.toLowerCase().includes(topicSearch.toLowerCase())
            );
            setFilteredTopics(filtered);
        } else {
            setFilteredTopics([]);
        }
    }, [discipline, topicSearch]);

    useEffect(() => {
        if (building) {
            const buildingNumber = building.split(' ')[1];
            const filtered = mockData.classNumbers.filter(c => c.startsWith(buildingNumber));
            setFilteredClassrooms(filtered);
        } else {
            setFilteredClassrooms([]);
        }
    }, [building]);

    const showAlert = (message, severity = 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!date || !pair || !building || !classroom || !discipline || !lessonType ||
            !selectedGroup || (groupType === 'subgroup' && !selectedSubgroup) || !topic) {
            showAlert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        // Проверяем, не завершена ли уже тема
        if (topic.completedHours >= topic.hours) {
            showAlert('Эта тема уже полностью проведена', 'warning');
            return;
        }

        const lessonData = {
            date: date.format('YYYY-MM-DD'),
            pair,
            building,
            classroom,
            discipline: mockData.disciplines.find(d => d.id.toString() === discipline)?.name || '',
            teacher: mockData.teachers.find(t => t.id.toString() === teacher)?.name || '',
            lessonType,
            groupType,
            group: groupType === 'group' ? selectedGroup : `${selectedGroup}, ${selectedSubgroup}`,
            topic: topic?.name || '',
            topicHours: topic?.hours || 0,
            completedHours: (topic?.completedHours || 0) + 1 // Увеличиваем проведенные часы на 1
        };
        setLessonData(lessonData);
        setShowLessonInfo(true);
        showAlert('Занятие успешно создано!', 'success');
    };

    const handleCancel = () => {
        setDate(dayjs());
        setPair('');
        setBuilding('');
        setClassroom('');
        setDiscipline('');
        setTeacher(mockData.currentUser.id.toString());
        setLessonType('');
        setGroupType('group');
        setSelectedGroup('');
        setSelectedSubgroup('');
        setTopic(null);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            {showLessonInfo ? (
                    <LessonInfo
                        lessonData={lessonData}
                        role="headman" // или "teacher" "headman" в зависимости от роли
                    />
                ) :(
            <Grow in={true} timeout={500}>
                <Paper elevation={3} className="form-container">
                    <Typography variant="h5" gutterBottom>Создание занятия</Typography>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            {[
                                { component: (
                                        <DatePicker
                                            label="Дата занятия *"
                                            value={date}
                                            onChange={(newDate) => setDate(newDate)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    ), delay: 100 },
                                { component: (
                                        <Autocomplete
                                            options={mockData.pairs}
                                            value={pair}
                                            onChange={(e, newValue) => setPair(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Пара *" />}
                                        />
                                    ), delay: 200 },
                                { component: (
                                        <Autocomplete
                                            options={mockData.buildings}
                                            value={building}
                                            onChange={(e, newValue) => {
                                                setBuilding(newValue);
                                                setClassroom('');
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Корпус *" />}
                                        />
                                    ), delay: 300 },
                                { component: (
                                        <Autocomplete
                                            options={filteredClassrooms}
                                            value={classroom}
                                            onChange={(e, newValue) => setClassroom(newValue)}
                                            disabled={!building}
                                            renderInput={(params) => <TextField {...params} label="Аудитория *" />}
                                        />
                                    ), delay: 400 },
                                { component: (
                                        <Autocomplete
                                            options={mockData.disciplines}
                                            getOptionLabel={(option) => option.name}
                                            value={mockData.disciplines.find(d => d.id.toString() === discipline) || null}
                                            onChange={(e, newValue) => {
                                                setDiscipline(newValue ? newValue.id.toString() : '');
                                                setTopic(null);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Дисциплина *" />}
                                        />
                                    ), delay: 500 },
                                { component: (
                                        <Autocomplete
                                            options={mockData.teachers}
                                            getOptionLabel={(option) => option.name}
                                            value={mockData.teachers.find(t => t.id.toString() === teacher) || null}
                                            onChange={(e, newValue) => setTeacher(newValue ? newValue.id.toString() : '')}
                                            renderInput={(params) => <TextField {...params} label="Преподаватель" />}
                                        />
                                    ), delay: 600 },
                                { component: (
                                        <Autocomplete
                                            options={mockData.lessonTypes}
                                            value={lessonType}
                                            onChange={(e, newValue) => setLessonType(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Вид занятия *" />}
                                        />
                                    ), delay: 700 }
                            ].map((item, index) => (
                                <Fade in={true} timeout={item.delay} key={index}>
                                    <FormControl fullWidth className="form-field">
                                        {item.component}
                                    </FormControl>
                                </Fade>
                            ))}
                        </div>

                        <Fade in={true} timeout={800}>
                            <FormControl component="fieldset" className="group-control">
                                <Typography variant="subtitle1">Группа/Подгруппа</Typography>
                                <RadioGroup row value={groupType} onChange={(e) => {
                                    setGroupType(e.target.value);
                                    if (e.target.value === 'group') setSelectedSubgroup('');
                                }}>
                                    <FormControlLabel value="group" control={<Radio />} label="Группа" />
                                    <FormControlLabel value="subgroup" control={<Radio />} label="Подгруппа" />
                                </RadioGroup>

                                <FormControl fullWidth className={groupType === 'subgroup' ? 'subgroup-control' : ''}>
                                    <Autocomplete
                                        options={mockData.groups}
                                        value={selectedGroup}
                                        onChange={(e, newValue) => setSelectedGroup(newValue)}
                                        renderInput={(params) => <TextField {...params} label="Группа *" />}
                                    />
                                </FormControl>

                                {groupType === 'subgroup' && (
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            options={mockData.subgroups}
                                            value={selectedSubgroup}
                                            disabled={!selectedGroup}
                                            onChange={(e, newValue) => setSelectedSubgroup(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Подгруппа *"
                                                    helperText={!selectedGroup ? "Сначала выберите группу" : ""}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                )}
                            </FormControl>
                        </Fade>

                        <Fade in={true} timeout={900}>
                            <FormControl fullWidth className="topic-field">
                                <TextField
                                    label="Тема занятия *"
                                    value={topic ? topic.name : ''}
                                    onClick={() => setOpenTopicDialog(true)}
                                    InputProps={{ readOnly: true }}
                                    helperText={topic ? `Часов: ${topic.hours} (Проведено: ${topic.completedHours})` : 'Нажмите для выбора темы'}
                                />
                            </FormControl>
                        </Fade>

                        <Fade in={true} timeout={1000}>
                            <div className="action-buttons">
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    onClick={handleCancel}
                                >
                                    Отменить
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className="submit-button"
                                    disabled={topic && topic.completedHours >= topic.hours}
                                >
                                    Провести занятие
                                </Button>
                            </div>
                        </Fade>
                    </form>

                    <Dialog
                        open={openTopicDialog}
                        onClose={() => {
                            setOpenTopicDialog(false);
                            setTopicSearch('');
                        }}
                        maxWidth="md"
                        fullWidth
                        TransitionComponent={Grow}
                    >
                        <DialogTitle>
                            <div className="search-container">
                                <TextField
                                    fullWidth
                                    label="Поиск темы"
                                    variant="outlined"
                                    value={topicSearch}
                                    onChange={(e) => setTopicSearch(e.target.value)}
                                    className="search-field"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <Typography variant="h6">Выберите тему</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <TopicsTable
                                filteredTopics={filteredTopics}
                                discipline={discipline}
                                topicSearch={topicSearch}
                                onTopicSelect={(selectedTopic) => {
                                    setTopic(selectedTopic);
                                    setOpenTopicDialog(false);
                                    setTopicSearch('');
                                }}
                            />
                        </DialogContent>
                        <DialogActions className="dialog-actions">
                            <Button onClick={() => {
                                setOpenTopicDialog(false);
                                setTopicSearch('');
                            }}>
                                Закрыть
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <CustomAlert
                        open={alertOpen}
                        message={alertMessage}
                        severity={alertSeverity}
                        handleClose={() => setAlertOpen(false)}
                    />
                </Paper>
            </Grow>
            )}
        </LocalizationProvider>
    );
};

export default CreateLessonForm;