import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchScheduleForStudent } from '../../store/slices/scheduleSlice';
import './ScheduleStyle.css';

const Schedule = ({ selectedDay, formattedDate, weekType }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Получаем данные из Redux store
    const { user } = useSelector(state => state.user);
    const { studentSchedule, isLoading } = useSelector(state => state.schedule);

    const role = user?.role || "student";

    useEffect(() => {
        if (selectedDay && weekType && user?.student_id) {
            const date = getDateForDayOfWeek(selectedDay, weekType === 'upper');
            dispatch(fetchScheduleForStudent({
                studentId: user.student_id,
                date: date.toISOString().split('T')[0]
            }));
        }
    }, [selectedDay, weekType, user?.student_id, dispatch]);

    const getDateForDayOfWeek = (dayName, isUpperWeek) => {
        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const dayIndex = days.indexOf(dayName);
        if (dayIndex === -1) return new Date();

        const today = new Date();
        const currentDay = today.getDay();
        const diff = (dayIndex + 1) - (currentDay === 0 ? 7 : currentDay);

        let targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        const weekNumber = Math.floor((targetDate.getDate() - 1) / 7) + 1;
        const targetIsUpperWeek = weekNumber % 2 === 1;

        if (isUpperWeek !== targetIsUpperWeek) {
            targetDate.setDate(targetDate.getDate() + 7);
        }

        return targetDate;
    };

    const handleLessonAction = (lesson) => {
        navigate(`/infolesson/${lesson.id}`, {
            state: {
                lessonData: {
                    ...lesson,
                    date: formattedDate, // Используем переданную отформатированную дату
                    building: lesson.room.split(',')[0],
                    classroom: lesson.room.split(',')[1]?.trim(),
                    discipline: lesson.subject,
                    pair: `${lesson.time}`,
                    topic: 'Не указана'
                }
            }
        });
    };

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
            <h1>Расписание на {formattedDate} ({selectedDay})</h1>

            {isLoading ? (
                <p>Загрузка расписания...</p>
            ) : scheduleData.length > 0 ? (
                <div className="day-schedule">
                    {scheduleData.map((lesson, index) => (
                        <div key={index} className="lesson">
                            <div className="dot"></div>
                            <div className="information__lesson">
                                <div className="lesson-main-info">
                                    <div className="time">{lesson.time}</div>
                                    <div className="subject">{lesson.subject}</div>
                                    <div className="teacher">{lesson.teacher}</div>
                                    <div className="room">Аудитория: {lesson.room}</div>
                                    <div className="type">Тип: {lesson.type}</div>
                                </div>
                                <button
                                    className={`action-button ${role === 'teacher' ? 'conduct' : 'details'}`}
                                    onClick={() => handleLessonAction(lesson)}
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

export default Schedule;