import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  InputAdornment,
  styled,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  createAbsenteeism,
  deleteAbsenteeism,
  updateAbsenteeism,
} from "../../store/slices/absenteeismSlice";

const AnimatedSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.success.main,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 32,
    height: 32,
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
    opacity: 1,
    backgroundColor: theme.palette.error.main,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const AttendanceTable = ({ lesson_id }) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExcused, setIsExcused] = useState(false);

  // Получаем данные из Redux store
  const {
    data: absenteeismData = [],
    isLoading: isLoadingAbsences,
    errors: absencesError,
  } = useSelector((state) => state.absenteeism.lessonAbsenteeism);

  const {
    data: studentsData = [],
    isLoading: isLoadingStudents,
    errors: studentsError,
  } = useSelector((state) => state.students.studentsOnLesson);

  const { isLoading: isDeleting } = useSelector(
    (state) => state.absenteeism.deleteStatus
  );

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setSearchTerm("");
    setIsExcused(false);
  };

  // Обработчик создания пропуска
  const handleCreateAbsenteeism = (studentId) => {
    const absenteeismData = {
      countExcusedHour: isExcused ? 2 : 0,
      countUnexcusedHour: isExcused ? 0 : 2,
      lessonId: lesson_id,
      studentId: studentId,
    };

    dispatch(createAbsenteeism(absenteeismData))
      .unwrap()
      .then(() => {
        // Убрали закрытие модального окна здесь
        // Оно закроется автоматически при обновлении данных
      })
      .catch((error) => {
        console.error("Ошибка при создании пропуска:", error);
      });
  };

  // Обработчик удаления пропуска
  const handleDeleteAbsenteeism = (absenteeismId) => {
    dispatch(deleteAbsenteeism(absenteeismId)).catch((error) => {
      console.error("Ошибка при удалении пропуска:", error);
    });
  };

  // Форматируем студентов для отображения
  const formattedStudents = studentsData
    ? studentsData.map((student) => ({
        id: student.id,
        name: student.person
          ? `${student.person.surname} ${student.person.name} ${
              student.person.middlename || ""
            }`.trim()
          : "Неизвестный студент",
        fullData: student,
      }))
    : [];

  // Форматируем пропуски для отображения
  const formattedAbsences = absenteeismData
    ? absenteeismData.map((absence) => ({
        id: absence.id,
        student_id: absence.student_id,
        student_name: absence.student?.person
          ? `${absence.student.person.surname} ${absence.student.person.name} ${
              absence.student.person.middlename || ""
            }`.trim()
          : "Неизвестный студент",
        excused_hours: absence.count_excused_hour || 0,
        unexcused_hours: absence.count_unexcused_hour || 0,
      }))
    : [];
  // Состояние для редактирования
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    excused: 0,
    unexcused: 0,
  });

  // Обработчик начала редактирования
  const handleStartEdit = (absence) => {
    setEditingId(absence.id);
    setEditValues({
      excused: absence.excused_hours,
      unexcused: absence.unexcused_hours,
    });
  };

  // Обработчик сохранения изменений
  const handleSaveEdit = (absence) => {
    dispatch(
      updateAbsenteeism({
        absenteeismId: absence.id, // ID записи о пропуске
        data: {
          studentId: absence.student_id, // Берем из текущей записи
          lessonId: lesson_id, // Берем из пропсов компонента
          countExcusedHour: editValues.excused,
          countUnexcusedHour: editValues.unexcused,
        },
      })
    )
      .unwrap()
      .then(() => {
        setEditingId(null);
      })
      .catch((error) => {
        console.error("Ошибка при обновлении пропуска:", error);
      });
  };

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Обработчик изменения значений в полях ввода
  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };
  const availableStudents = formattedStudents
    .filter(
      (student) => !formattedAbsences.some((a) => a.student_id === student.id)
    )
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isLoadingStudents || isLoadingAbsences) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (studentsError || absencesError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {studentsError || absencesError}
      </Alert>
    );
  }
  // Рассчитываем статистику посещаемости
  const totalStudents = formattedStudents.length;
  const absentStudents = formattedAbsences.length;
  const presentStudents = totalStudents - absentStudents;
  const attendancePercentage =
    totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Учет пропусков занятия</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          disabled={formattedAbsences.length >= formattedStudents.length}
        >
          Добавить пропуск
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ФИО студента</TableCell>
              <TableCell align="center">По уважительной</TableCell>
              <TableCell align="center">По неуважительной</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedAbsences.length > 0 ? (
              formattedAbsences.map((absence) => (
                <TableRow key={absence.id}>
                  <TableCell>{absence.student_name}</TableCell>

                  {/* Ячейка с уважительными пропусками - зеленый цвет */}
                  <TableCell align="center">
                    <Typography color="success.main">
                      {editingId === absence.id ? (
                        <TextField
                          type="number"
                          value={editValues.excused}
                          onChange={(e) =>
                            handleEditChange("excused", e.target.value)
                          }
                          size="small"
                          sx={{ width: 80 }}
                          inputProps={{ min: 0 }}
                          color="success"
                        />
                      ) : (
                        absence.excused_hours
                      )}
                    </Typography>
                  </TableCell>

                  {/* Ячейка с неуважительными пропусками - красный цвет */}
                  <TableCell align="center">
                    <Typography color="error.main">
                      {editingId === absence.id ? (
                        <TextField
                          type="number"
                          value={editValues.unexcused}
                          onChange={(e) =>
                            handleEditChange("unexcused", e.target.value)
                          }
                          size="small"
                          sx={{ width: 80 }}
                          inputProps={{ min: 0 }}
                          color="error"
                        />
                      ) : (
                        absence.unexcused_hours
                      )}
                    </Typography>
                  </TableCell>

                  {/* Ячейка с действиями */}
                  <TableCell align="center">
                    {editingId === absence.id ? (
                      <>
                        <IconButton
                          onClick={() => handleSaveEdit(absence)} // Теперь передаем весь объект absence
                          color="success"
                          sx={{ mr: 1 }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton onClick={handleCancelEdit} color="error">
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleStartEdit(absence)}
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteAbsenteeism(absence.id)}
                          color="error"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <CircularProgress size={24} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Нет данных о пропусках
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Статистика посещаемости */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            Общее количество студентов:
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {totalStudents}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            Присутствовало:
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            {presentStudents} ({attendancePercentage}%)
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            Отсутствовало:
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="error.main">
            {absentStudents}
          </Typography>
        </Box>
      </Box>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Добавить пропуск
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={3}
            gap={2}
          >
            <Typography color="error">Неуважительная</Typography>
            <AnimatedSwitch
              checked={isExcused}
              onChange={(e) => setIsExcused(e.target.checked)}
              inputProps={{ "aria-label": "Причина пропуска" }}
            />
            <Typography color="success.main">Уважительная</Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск студента..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ maxHeight: 300, overflow: "auto" }}>
            {availableStudents.length > 0 ? (
              availableStudents.map((student) => (
                <Box
                  key={student.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1.5}
                  sx={{
                    borderBottom: "1px solid #eee",
                    "&:hover": { backgroundColor: "action.hover" },
                    transition: "background-color 0.3s",
                  }}
                >
                  <Typography>{student.name}</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color={isExcused ? "success" : "error"}
                    onClick={() => handleCreateAbsenteeism(student.id)}
                    sx={{
                      minWidth: 120,
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    ПРОГУЛЯЛ
                  </Button>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={2}
              >
                Нет доступных студентов для добавления
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AttendanceTable;
