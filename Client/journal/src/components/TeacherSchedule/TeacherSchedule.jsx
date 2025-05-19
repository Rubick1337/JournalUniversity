import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchScheduleForTeacher } from "../../store/slices/scheduleSlice";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Add, Info } from "@mui/icons-material";

const TeacherSchedule = ({ date,teacherId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teacherSchedule, isLoading } = useSelector((state) => state.schedule);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (teacherId && date) {
      if (selectedDate <= today) {
        alert("Выбранная дата уже прошла. Здесь должен быть другой запрос.");
      }

      dispatch(
        fetchScheduleForTeacher({
          teacherId: teacherId,
          date: date,
        })
      );
    }
  }, [date, teacherId, dispatch]);

  const handleCreateLesson = () => {
    navigate("/infolesson", {
      state: {
        lessonData: {
          date: date,
          building: "",
          classroom: "",
          discipline: "",
          pair: "",
          topic: "",
          isNew: true,
        },
      },
    });
  };

  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5); // Отрезаем секунды
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h2">
            Расписание на {formatDate(date)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateLesson}
          >
            Создать занятие
          </Button>
        </Box>

        {teacherSchedule?.teacher && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Преподаватель: {teacherSchedule.teacher.person.surname}{" "}
              {teacherSchedule.teacher.person.name}{" "}
              {teacherSchedule.teacher.person.middlename}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Кафедра: {teacherSchedule.teacher.department.full_name}
            </Typography>
          </Box>
        )}
      </Paper>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : teacherSchedule?.scheduleDetails?.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {teacherSchedule.scheduleDetails.map((lesson, index) => (
            <Card key={index} elevation={3}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" component="h3">
                    {lesson.subject.name}
                  </Typography>
                  <Chip
                    label={lesson.subjectType.name}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Время:</strong> {formatTime(lesson.pairInfo.start)}{" "}
                    - {formatTime(lesson.pairInfo.end)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Перерыв:</strong>{" "}
                    {formatTime(lesson.pairInfo.break_start)} -{" "}
                    {formatTime(lesson.pairInfo.break_end)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography variant="body2">
                    <strong>Аудитория:</strong> {lesson.audience.number},{" "}
                    {lesson.audience.academicBuilding.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Группы:</strong>{" "}
                    {lesson.groups.map((g) => g.name).join(", ")}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Info />}
                  onClick={() => navigate(`/infolesson/${lesson.pairInfo.id}`)}
                >
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            На выбранную дату занятий не запланировано
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TeacherSchedule;
