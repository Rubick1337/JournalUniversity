import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScheduleStyle.css';

const Schedule = ({ selectedDay, weekType }) => {
    const [scheduleData, setScheduleData] = useState([]);

    useEffect(() => {
        if (selectedDay && weekType) {
            axios.get(`/TestData/schedule.json`)
                .then(response => {
                    const filteredData = response.data.filter(daySchedule =>
                        daySchedule.day === selectedDay && daySchedule.week === weekType
                    );
                    setScheduleData(filteredData);
                })
                .catch(error => console.error('Ошибка загрузки расписания:', error));
        }
    }, [selectedDay, weekType]);

    return (
        <div className="schedule-container">
            <h1>Расписание на {selectedDay} ({weekType === 'upper' ? 'Вн' : 'Нн'})</h1>
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

export default Schedule;
