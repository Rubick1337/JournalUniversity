import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ onDaySelect, onWeekTypeSelect }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedDay, setSelectedDay] = useState(today.getDate()); // Начальное значение для selectedDay
    const [animationClass, setAnimationClass] = useState('');
    const [weekType, setWeekType] = useState('');

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

    // Функция для определения типа недели
    const getWeekTypeForDate = (date) => {
        const firstMonday = new Date(date.getFullYear(), date.getMonth(), 1);
        while (firstMonday.getDay() !== 1) {
            firstMonday.setDate(firstMonday.getDate() + 1);
        }

        const weekNumber = Math.floor((date.getDate() - firstMonday.getDate()) / 7) + 1;
        return weekNumber % 2 === 1 ? 'upper' : 'lower';
    };

    // useEffect для обработки выбора дня
    useEffect(() => {
        if (selectedDay !== null) {
            const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
            const dayOfWeek = dayNames[selectedDate.getDay()];

            // Вызываем колбэки только если selectedDay изменился
            onDaySelect(selectedDate, dayOfWeek);
            const weekTypeValue = getWeekTypeForDate(selectedDate);
            setWeekType(weekTypeValue);
            onWeekTypeSelect(weekTypeValue);
        }
    }, [selectedDay, currentDate]); // Зависимости: selectedDay и currentDate

    // Обработчик выбора дня
    const handleDayClick = (day) => {
        if (day !== selectedDay) {
            setSelectedDay(day);
        }
    };

    // Рендер дней календаря
    const renderDays = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Исправление для понедельника
        const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

        const days = [];

        // Добавляем дни предыдущего месяца
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${i}`} className="day prev-month">
                    {daysInPrevMonth - i}
                </div>
            );
        }

        // Добавляем дни текущего месяца
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            const isSelected = i === selectedDay;

            // Убираем выделение today, если есть selected день
            const todayClass = isToday && selectedDay === null ? "today" : "";
            days.push(
                <div
                    key={`day-${i}`}
                    className={`day ${isSelected ? "selected" : ""} ${todayClass}`}
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
            <div className="header__calendar">
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
        </div>
    );
};

export default Calendar;