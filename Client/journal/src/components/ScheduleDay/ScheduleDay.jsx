import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ScheduleDayStyle.css';

const ScheduleDay = ({  }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [weekType, setWeekType] = useState('');
    const navigate = useNavigate();
    const role = "headman";
    const daysOfWeek = [
        { full: 'Понедельник', short: 'Пн' },
        { full: 'Вторник', short: 'Вт' },
        { full: 'Среда', short: 'Ср' },
        { full: 'Четверг', short: 'Чт' },
        { full: 'Пятница', short: 'Пт' },
        { full: 'Суббота', short: 'Сб' }
    ];

    useEffect(() => {
        const today = new Date();
        const dayIndex = today.getDay();
        const todayDay = dayIndex === 0 ? daysOfWeek[0] : daysOfWeek[dayIndex - 1];
        setSelectedDay(todayDay.full);

        const weekNumber = Math.floor((today.getDate() - 1) / 7) + 1;
        const isUpperWeek = weekNumber % 2 === 1;
        setWeekType(isUpperWeek ? 'upper' : 'lower');
    }, []);

    useEffect(() => {
        if (selectedDay && weekType) {
            axios.get('/TestData/schedule.json')
                .then(response => {
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

    const handleDayChange = (day) => {
        setSelectedDay(day);
    };

    const handleWeekChange = (event) => {
        setWeekType(event.target.value);
    };

    const handleLessonAction = (lessonId) => {
        navigate(`/infolesson/${lessonId}`);
    };

    return (
        <div className="schedule-container">
            <h1 className="day__title">Расписание на {selectedDay} ({weekType === 'upper' ? 'Вн' : 'Нн'})</h1>

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

            {scheduleData.length > 0 ? (
                scheduleData.map((daySchedule, index) => (
                    <div key={index} className="day-schedule">
                        {daySchedule.schedule.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="lesson">
                                <div className="dot"></div>
                                <div className="information__lesson__day">
                                    <div className="lesson-main-info">
                                        <div className="time">{lesson.time}</div>
                                        <div className="subject">{lesson.subject}</div>
                                        <div className="teacher">{lesson.teacher}</div>
                                        <div className="room">Аудитория: {lesson.room}</div>
                                    </div>
                                    <button
                                        className={`action-button ${role === 'teacher' ? 'conduct' : 'details'}`}
                                        onClick={() => handleLessonAction(lesson.id)}
                                    >
                                        {role === 'teacher' ? 'Провести' : 'Подробнее'}
                                    </button>
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