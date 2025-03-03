import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScheduleStyle.css';

const Schedule = ({ selectedDay }) => {
    const [scheduleData, setScheduleData] = useState([]);

    // Определяем текущий день недели, если selectedDay не задан
    const today = new Date();
    const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"];
    const defaultDay = selectedDay || dayNames[today.getDay()];

    useEffect(() => {
        if (defaultDay) {
            axios.get(`/TestData/schedule.json`)
                .then(response => {
                    const filteredData = response.data.filter(daySchedule => daySchedule.day === defaultDay);
                    setScheduleData(filteredData);
                })
                .catch(error => {
                    console.error('Error fetching schedule data:', error);
                });
        }
    }, [defaultDay]);

    return (
        <div className="schedule-container">
            <h1>Расписание на {defaultDay}</h1>
            {scheduleData.length > 0 ? (
                scheduleData.map((daySchedule, index) => (
                    <div key={index} className="day-schedule">

                        {daySchedule.schedule.map((lesson, lessonIndex) => (

                            <div key={lessonIndex} className="lesson">
                                <div className="dot"></div>
                                <div className="information__lesson">
                                    <div className="time">{lesson.time}</div>
                                    <div className="subject">{lesson.subject}</div>
                                    <div className="teacher">{lesson.teacher}</div>
                                    <div className="room">Аудитория:{lesson.room}</div>
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

export default Schedule;
