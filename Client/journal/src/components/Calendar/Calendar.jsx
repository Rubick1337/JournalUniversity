import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ onDaySelect }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedDay, setSelectedDay] = useState(null);
    const [animationClass, setAnimationClass] = useState(''); // Добавил недостающую переменную

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"];

    useEffect(() => {
        if (!selectedDay) {
            const todayDayName = dayNames[today.getDay()];
            console.log(`Сегодня: ${todayDayName}`);
            onDaySelect(todayDayName);
        }
    }, [selectedDay, onDaySelect]);

    const prevMonth = async () => {
        setAnimationClass('slide-out-left');
        await new Promise(resolve => setTimeout(resolve, 300));
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setAnimationClass('slide-in-right');
    };

    const nextMonth = async () => {
        setAnimationClass('slide-out-right');
        await new Promise(resolve => setTimeout(resolve, 300));
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setAnimationClass('slide-in-left');
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayOfWeek = dayNames[selectedDate.getDay()];
        console.log(`Выбранный день: ${dayOfWeek}`);
        onDaySelect(dayOfWeek);
    };

    const renderDays = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const days = [];

        const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = firstDayOffset; i > 0; i--) {
            days.push(
                <div key={`prev-${i}`} className="day prev-month">
                    {prevMonthDays - i + 1}
                </div>
            );
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

            const isSelected = i === selectedDay;

            days.push(
                <div
                    key={i}
                    className={`day ${isSelected ? "selected" : isToday && !selectedDay ? "today" : ""}`}
                    onClick={() => handleDayClick(i)}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div className={`calendar ${animationClass}`}>
            <div className="header">
                <div id="month-year">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
            </div>
            <div className="weekdays">
                <div>Пн</div>
                <div>Вт</div>
                <div>Ср</div>
                <div>Чт</div>
                <div>Пт</div>
                <div>Сб</div>
                <div>Вс</div>
            </div>
            <div id="days" className="days">
                {renderDays()}
            </div>
            <div className="group__carret">
                <div className="left__carret carret" onClick={prevMonth}></div>
                <div className="right__carret carret" onClick={nextMonth}></div>
            </div>
        </div>
    );
};

export default Calendar;
