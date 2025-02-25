import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [animationClass, setAnimationClass] = useState(''); // Состояние для анимации

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        // Если день недели - воскресенье (0), возвращаем 6 (понедельник будет первым)
        return day === 0 ? 6 : day - 1;
    };

    const prevMonth = () => {
        setAnimationClass('slide-out-left'); // Анимация вылета влево
        setTimeout(() => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
            setAnimationClass('slide-in-right'); // Анимация появления справа
        }, 300); // Длительность анимации
    };

    const nextMonth = () => {
        setAnimationClass('slide-out-right'); // Анимация вылета вправо
        setTimeout(() => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
            setAnimationClass('slide-in-left'); // Анимация появления слева
        }, 300); // Длительность анимации
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
        const days = [];

        // Добавляем пустые дни перед первым днём месяца
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="empty"></div>);
        }

        // Добавляем дни месяца
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();
            days.push(
                <div key={i} className={isToday ? "day today" : "day"}>
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
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
                <div>Su</div>
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