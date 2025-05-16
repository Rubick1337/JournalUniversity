import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchScheduleForStudent } from '../../store/slices/scheduleSlice';
import './ScheduleDayStyle.css';

const ScheduleDay = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Получаем данные из Redux store
    const { user } = useSelector(state => state.user);
    const {
        studentSchedule,
        isLoading,
        dateParams
    } = useSelector(state => state.schedule);

    const [selectedDay, setSelectedDay] = useState('');
    const [weekType, setWeekType] = useState('');

    const role = user?.role || "student"; // Получаем роль из Redux

    const daysOfWeek = [
        { full: 'Понедельник', short: 'Пн', number: 1 },
        { full: 'Вторник', short: 'Вт', number: 2 },
        { full: 'Среда', short: 'Ср', number: 3 },
        { full: 'Четверг', short: 'Чт', number: 4 },
        { full: 'Пятница', short: 'Пт', number: 5 },
        { full: 'Суббота', short: 'Сб', number: 6 }
    ];

    useEffect(() => {
        const today = new Date();
        const dayIndex = today.getDay();
        const todayDay = dayIndex === 0 ? daysOfWeek[0] : daysOfWeek[dayIndex - 1];
        setSelectedDay(todayDay.full);

        // Определяем тип недели (верхняя/нижняя)
        const weekNumber = Math.floor((today.getDate() - 1) / 7) + 1;
        const currentWeekType = weekNumber % 2 === 1 ? 'upper' : 'lower';
        setWeekType(currentWeekType);
    }, []);

    useEffect(() => {
        if (selectedDay && weekType && user?.student_id) {
            const selectedDayObj = daysOfWeek.find(day => day.full === selectedDay);

            dispatch(fetchScheduleForStudent({
                studentId: user.student_id,
                weekdayNumber: selectedDayObj.number,
                weekType: weekType === 'upper' ? 'Верхняя неделя' : 'Нижняя неделя'
            }));
        }
    }, [selectedDay, weekType, user?.student_id, dispatch]);

    const handleDayChange = (day) => {
        setSelectedDay(day);
    };

    const handleWeekChange = (event) => {
        setWeekType(event.target.value);
    };

    const handleLessonAction = (lessonId) => {
        navigate(`/infolesson/${lessonId}`);
    };

    // Преобразуем данные из Redux в удобный формат
    const formatScheduleData = () => {
        if (!studentSchedule?.scheduleDetails) return [];

        return studentSchedule.scheduleDetails.map(item => ({
            id: item.id,
            time: `${item.PairInSchedule?.start} - ${item.PairInSchedule?.end}`,
            subject: item.subject?.name,
            teacher: `${item.teacher?.person?.surname} ${item.teacher?.person?.name}`,
            room: `${item.audience?.academicBuilding?.name || ''} ${item.audience?.number || ''}`.trim(),
            type: item.subjectType?.name
        }));
    };

    const scheduleData = formatScheduleData();

    return (
        <div className="schedule-container">
            <h1 className="day__title">
                Расписание на {selectedDay} ({weekType === 'upper' ? 'Вн' : 'Нн'})
            </h1>

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

            {isLoading ? (
                <p>Загрузка расписания...</p>
            ) : scheduleData.length > 0 ? (
                <div className="day-schedule">
                    {scheduleData.map((lesson, index) => (
                        <div key={index} className="lesson">
                            <div className="dot"></div>
                            <div className="information__lesson__day">
                                <div className="lesson-main-info">
                                    <div className="time">{lesson.time}</div>
                                    <div className="subject">{lesson.subject}</div>
                                    <div className="teacher">{lesson.teacher}</div>
                                    <div className="room">Аудитория: {lesson.room}</div>
                                        <div className="type">Тип: {lesson.type}</div>
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
            ) : (
                <p>Нет данных для отображения.</p>
            )}
        </div>
    );
};

export default ScheduleDay;