import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScheduleDayStyle.css';

const ScheduleDay = () => {
    const [scheduleData, setScheduleData] = useState([]); // Данные расписания
    const [selectedDay, setSelectedDay] = useState(''); // Выбранный день недели
    const [weekType, setWeekType] = useState(''); // Тип недели: верхняя или нижняя

    // Дни недели с сокращенными названиями
    const daysOfWeek = [
        { full: 'Понедельник', short: 'Пн' },
        { full: 'Вторник', short: 'Вт' },
        { full: 'Среда', short: 'Ср' },
        { full: 'Четверг', short: 'Чт' },
        { full: 'Пятница', short: 'Пт' },
        { full: 'Суббота', short: 'Сб' }
    ];

    // Определяем сегодняшний день и тип недели
    useEffect(() => {
        const today = new Date();
        const dayIndex = today.getDay(); // 0 (воскресенье) - 6 (суббота)
        const todayDay = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Воскресенье не учитываем
        setSelectedDay(todayDay.full);

        // Определяем верхняя или нижняя неделя
        const weekNumber = Math.floor((today.getDate() - 1) / 7) + 1; // Номер недели в месяце
        const isUpperWeek = weekNumber % 2 === 1; // Нечетная неделя = верхняя
        setWeekType(isUpperWeek ? 'upper' : 'lower');
    }, []);

    // Загрузка данных расписания
    useEffect(() => {
        if (selectedDay && weekType) {
            axios.get('/TestData/schedule.json')
                .then(response => {
                    // Фильтруем данные по выбранному дню и типу недели
                    const filteredData = response.data.filter(item =>
                        item.day === selectedDay && item.week === weekType
                    );
                    setScheduleData(filteredData);
                })
                .catch(error => {
                    console.error('Ошибка загрузки данных:', error);
                });
        }
    }, [selectedDay, weekType]);

    // Обработчик изменения выбранного дня
    const handleDayChange = (day) => {
        setSelectedDay(day);
    };

    // Обработчик изменения типа недели
    const handleWeekChange = (event) => {
        setWeekType(event.target.value);
    };

    return (
        <div className="schedule-container">
            <h1>Расписание на {selectedDay}</h1>

            {/* Переключатель недели (верхняя/нижняя) */}
            <div className="week-selector">
                <label>
                    <input
                        type="radio"
                        value="upper"
                        checked={weekType === 'upper'}
                        onChange={handleWeekChange}
                    />
                    Верхняя неделя
                </label>
                <label>
                    <input
                        type="radio"
                        value="lower"
                        checked={weekType === 'lower'}
                        onChange={handleWeekChange}
                    />
                    Нижняя неделя
                </label>
            </div>

            {/* Кружки для выбора дня недели */}
            <div className="day-selector">
                {daysOfWeek.map((day, index) => (
                    <div
                        key={index}
                        className={`day-circle ${selectedDay === day.full ? 'active' : ''}`}
                        onClick={() => handleDayChange(day.full)}
                    >
                        {day.short}
                    </div>
                ))}
            </div>

            {/* Отображение расписания */}
            {scheduleData.length > 0 ? (
                scheduleData.map((daySchedule, index) => (
                    <div key={index} className="day-schedule">
                        {daySchedule.schedule.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="lesson-day">
                                <div className="dot"></div>
                                <div className="lesson-info">
                                    <div className="time">{lesson.time}</div>
                                    <div className="subject">{lesson.subject}</div>
                                    <div className="teacher">{lesson.teacher}</div>
                                    <div className="room">Аудитория: {lesson.room}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>Нет данных для отображения.</p>
            )}
        </div>
    );
};

export default ScheduleDay;