import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchScheduleForStudent,
  clearStudentSchedule,
  fetchLessonsForStudent,
  clearStudentLessons,
} from "../../store/slices/scheduleSlice";
import "./ScheduleStyle.css";

function parseFormattedDate(formattedDate) {
  const [day, month, year] = formattedDate.split(".");
  return new Date(year, month - 1, day);
}

const Schedule = ({ selectedDay, formattedDate, weekType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { studentSchedule, studentLessons, isLoading } = useSelector(
    (state) => state.schedule
  );
  const role = user?.role || "student";
  const getDateForDayOfWeek = (dayName, isUpperWeek) => {
    const days = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    const dayIndex = days.indexOf(dayName);
    if (dayIndex === -1) return new Date();

    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayIndex + 1 - (currentDay === 0 ? 7 : currentDay);

    let targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    const weekNumber = Math.floor((targetDate.getDate() - 1) / 7) + 1;
    const targetIsUpperWeek = weekNumber % 2 === 1;

    if (isUpperWeek !== targetIsUpperWeek) {
      targetDate.setDate(targetDate.getDate() + 7);
    }
  };
  useEffect(() => {
    if (selectedDay && weekType && user?.student_id) {
      const date = getDateForDayOfWeek(selectedDay, weekType === "upper");
      const today = new Date();
      const selectedDate = parseFormattedDate(formattedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();
      const formattedDateToRespons = `${year}-${month}-${
        day < 10 ? "0" : ""
      }${day}`;

      today.setHours(0, 0, 0, 0);
      dispatch(clearStudentSchedule());
      dispatch(clearStudentLessons());

      // 1. Если дата в прошлом - только проведенные занятия
      if (selectedDate < today) {
        dispatch(
          fetchLessonsForStudent({
            studentId: user.student_id,
            date: formattedDateToRespons,
          })
        );
      }
      // 2. Если дата в будущем - только расписание
      else if (selectedDate > today) {
        dispatch(
          fetchScheduleForStudent({
            studentId: user.student_id,
            date: formattedDateToRespons,
          })
        );
      }
      // 3. Если сегодня - оба запроса
      else {
        dispatch(
          fetchLessonsForStudent({
            studentId: user.student_id,
            date: formattedDateToRespons,
          })
        );
        dispatch(
          fetchScheduleForStudent({
            studentId: user.student_id,
            date: formattedDateToRespons,
          })
        );
      }
    }
  }, [selectedDay, weekType, user?.student_id, dispatch]);

  // Проверяем, совпадает ли занятие из расписания с проведенным
  const isLessonMatch = (scheduled, completed) => {
    return (
      scheduled.PairInSchedule?.id === completed.pair_id &&
      scheduled.group_id === completed.group_id &&
      (scheduled.subgroup_id === completed.subgroup_id ||
        (!scheduled.subgroup_id && !completed.subgroup_id)) &&
      scheduled.subject?.id === completed.subject_id &&
      scheduled.subjectType?.id === completed.subject_type_id
    );
  };

  // Формируем объединенный список занятий
  const getCombinedLessons = () => {
    const scheduledLessons = studentSchedule?.scheduleDetails || [];
    const completedLessons = studentLessons || [];

    // Сначала обрабатываем проведенные занятия
    const result = completedLessons.map((lesson) => ({
      ...formatCompletedLesson(lesson),
      isCompleted: true,
      isScheduled: scheduledLessons.some((s) => isLessonMatch(s, lesson)),
      isExtra: !scheduledLessons.some((s) => isLessonMatch(s, lesson)),
    }));

    // Добавляем незавершенные занятия из расписания
    scheduledLessons.forEach((scheduled) => {
      const wasCompleted = completedLessons.some((completed) =>
        isLessonMatch(scheduled, completed)
      );
      if (!wasCompleted) {
        result.push({
          ...formatScheduledLesson(scheduled),
          isCompleted: false,
          isScheduled: true,
          isExtra: false,
        });
      }
    });

    return result.sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatScheduledLesson = (lesson) => ({
    id: lesson.id,
    time: `${lesson.PairInSchedule?.start} - ${lesson.PairInSchedule?.end}`,
    subject: lesson.subject?.name,
    teacher: `${lesson.teacher?.person?.surname} ${lesson.teacher?.person?.name}`,
    room: `${lesson.audience?.academicBuilding?.name || ""} ${
      lesson.audience?.number || ""
    }`.trim(),
    type: lesson.subjectType?.name,
    pairId: lesson.PairInSchedule?.id,
    groupId: lesson.group_id,
    subgroupId: lesson.subgroup_id,
    subjectId: lesson.subject?.id,
    subjectTypeId: lesson.subjectType?.id,
  });

  const formatCompletedLesson = (lesson) => ({
    id: lesson.id,
    time: `${lesson.PairForLesson?.start} - ${lesson.PairForLesson?.end}`,
    subject: lesson.SubjectForLesson?.name,
    teacher: `${lesson.TeacherForLesson?.person?.surname} ${lesson.TeacherForLesson?.person?.name}`,
    room: `${lesson.AudienceForLesson?.academicBuilding?.name || ""} ${
      lesson.AudienceForLesson?.number || ""
    }`.trim(),
    type: lesson.SubjectTypeForLesson?.name,
    pairId: lesson.pair_id,
    groupId: lesson.group_id,
    subgroupId: lesson.subgroup_id,
    subjectId: lesson.subject_id,
    subjectTypeId: lesson.subject_type_id,
    hasMarkedAbsences: lesson.has_marked_absences,
    topic: lesson.TopicForLesson?.name,
  });

  const handleLessonAction = (lesson) => {
    navigate(`/infolesson/${lesson.id}`, {
      state: {
        lessonData: {
          ...lesson,
          date: formattedDate,
          building: lesson.room.split(",")[0],
          classroom: lesson.room.split(",")[1]?.trim(),
          discipline: lesson.subject,
          pair: lesson.time,
          topic: lesson.topic || "Не указана",
          isCompleted: lesson.isCompleted,
        },
      },
    });
  };

  const combinedLessons = getCombinedLessons();
  const today = new Date();
  const selectedDate = parseFormattedDate(formattedDate);
  today.setHours(0, 0, 0, 0);

  return (
    <div className="schedule-container">
      <h1>
        Расписание на {formattedDate} ({selectedDay},{" "}
        {weekType === "upper" ? "Вн" : "Нн"})
      </h1>

      {isLoading ? (
        <p>Загрузка расписания...</p>
      ) : combinedLessons.length > 0 ? (
        <div className="day-schedule">
          {combinedLessons.map((lesson, index) => (
            <div
              key={index}
              className={`lesson ${lesson.isCompleted ? "completed" : ""} ${
                lesson.isExtra ? "extra" : ""
              }`}
            >
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
                  className={`action-button ${
                    lesson.isCompleted ? "conduct" : "disabled"
                  }`}
                  onClick={() =>
                    lesson.isCompleted && handleLessonAction(lesson)
                  }
                  disabled={!lesson.isCompleted}
                >
                  {lesson.isCompleted
                    ? lesson.hasMarkedAbsences
                      ? "Посмотреть"
                      : "К занятию"
                    : selectedDate <= today
                    ? "Не проводилось"
                    : "Запланировано"}
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
