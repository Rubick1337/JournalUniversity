import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Typography,
  Divider,
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import styles from "./LessonInfo.module.css";
import {
  getLessonDataById,
  clearCurrentLesson,
} from "../../store/slices/lessonSlice";
import { getAllAbsenteeismForLesson } from "../../store/slices/absenteeismSlice";
import AttendanceTable from "./AttendanceTable";
import {
  getStudentsOnLesson,
  clearStudentsOnLesson,
} from "../../store/slices/studentSlice";
const LessonInfoPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentLesson } = useSelector((state) => state.lesson);
  const userData = useSelector((state) => state.user.user);

  // Загружаем данные занятия
  useEffect(() => {
    dispatch(getLessonDataById(lessonId));
    dispatch(getAllAbsenteeismForLesson(lessonId));

    return () => {
      dispatch(clearCurrentLesson());
      dispatch(clearStudentsOnLesson()); // Очищаем студентов при размонтировании
    };
  }, [lessonId, dispatch]);

  // Загружаем студентов при изменении группы/подгруппы
  useEffect(() => {
    if (currentLesson?.data?.GroupForLesson?.id) {
      dispatch(
        getStudentsOnLesson({
          groupIdQuery: currentLesson.data.GroupForLesson.id,
          subgroupIdQuery: currentLesson.data.SubgroupForLesson?.id || null,
        })
      );
    }
  }, [
    dispatch,
    currentLesson?.data?.GroupForLesson?.id,
    currentLesson?.data?.SubgroupForLesson?.id,
  ]);
  const handleBack = () => {
    navigate(-1);
  };

  if (currentLesson.isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (currentLesson.errors) {
    return (
      <Box mt={2}>
        <Alert severity="error">
          Ошибка при загрузке занятия:{" "}
          {currentLesson.errors.message || "Неизвестная ошибка"}
        </Alert>
        <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
          Назад
        </Button>
      </Box>
    );
  }

  if (!currentLesson.data) {
    return (
      <Box mt={2}>
        <Alert severity="info">Занятие не найдено</Alert>
        <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
          Назад
        </Button>
      </Box>
    );
  }

  const lesson = currentLesson.data;
  const canMarkAbsences = (isClassRepresentative, isSubgroupLeader, lesson) => {
    if (lesson.SubgroupForLesson) {
      return isClassRepresentative || isSubgroupLeader;
    }
    return isClassRepresentative;
  };

  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      <Paper elevation={0} className={styles.paperContainer}>
        <Box className={styles.headerBox}>
          <IconButton onClick={handleBack} className={styles.backButton}>
            <ArrowBackIcon color="primary" />
          </IconButton>
          <Typography variant="h5" className={styles.title}>
            Информация о занятии
          </Typography>
        </Box>

        <Divider className={styles.divider} />

        {/* Основная информация о занятии */}
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            {lesson.SubjectForLesson?.name || "Название не указано"}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Chip
              label={lesson.SubjectTypeForLesson?.name || "Тип не указан"}
              color="primary"
              size="small"
            />
            <Chip
              label={`${lesson.PairForLesson?.name} (${lesson.PairForLesson?.start} - ${lesson.PairForLesson?.break_end})`}
              color="secondary"
              size="small"
            />
            <Chip
              label={new Date(lesson.date).toLocaleDateString()}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Информация о преподавателе */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Преподаватель
          </Typography>
          {lesson.TeacherForLesson ? (
            <>
              <Typography variant="body1" paragraph>
                <strong>ФИО:</strong> {lesson.TeacherForLesson.person.surname}{" "}
                {lesson.TeacherForLesson.person.name}{" "}
                {lesson.TeacherForLesson.person.middlename || ""}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <Chip
                  label={
                    lesson.TeacherForLesson.teachingPosition?.name ||
                    "Должность не указана"
                  }
                  size="small"
                  variant="outlined"
                />
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Преподаватель не указан
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Информация о группе */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Группа
          </Typography>
          {lesson.GroupForLesson ? (
            <>
              <Typography variant="body1" paragraph>
                <strong>Группа:</strong> {lesson.GroupForLesson.name}
              </Typography>

              {lesson.SubgroupForLesson && (
                <Typography variant="body1" paragraph>
                  <strong>Подгруппа:</strong> {lesson.SubgroupForLesson.name}
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Группа не указана
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Divider sx={{ my: 3 }} />

        {/* Информация о месте проведения */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Место проведения
          </Typography>
          {lesson.AudienceForLesson ? (
            <>
              <Typography variant="body1" paragraph>
                <strong>Аудитория:</strong> {lesson.AudienceForLesson.number}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Корпус:</strong>{" "}
                {lesson.AudienceForLesson.academicBuilding.name}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Место проведения не указано
            </Typography>
          )}
        </Box>
      </Paper>
      {canMarkAbsences(
        userData.isClassRepresentative,
        userData.isSubgroupLeader,
        lesson
      ) && <AttendanceTable lesson_id={lessonId} />}
    </div>
  );
};

export default LessonInfoPage;
