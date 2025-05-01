import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../Alert/Alert";
import "./TableLearn.css";
//<======= REDUX =========
import { getCurriculumById } from "../../store/slices/curriculumSlice";
import {
  fetchCurriculumSubjects,
  addCurriculumSubject,
  updateCurriculumSubject,
  deleteCurriculumSubject,
} from "../../store/slices/curriculumSubjectSlice";
import { fetchAssessmentTypes } from "../../store/slices/assessmentTypeSlice";
import { fetchSubjects } from "../../store/slices/subjectSlice";
import { fetchDepartments } from "../../store/slices/departmentSlice";
//======== REDUX ========>
//<======= MUI =========
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Autocomplete,
  Box,
  Menu,
  MenuItem,
  Modal,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
//======== MUI ========>

const TableLearn = () => {
  const { curriculumId } = useParams();
  const dispatch = useDispatch();

  const [newRow, setNewRow] = useState({
    discipline: "",
    department: "",
    formOfAttestation: "",
    semester: "",
    all_hours: "",
    lecture_hours: "",
    lab_hours: "",
    practice_hours: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [disciplineSearch, setDisciplineSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    dispatch(getCurriculumById(curriculumId));
    dispatch(fetchCurriculumSubjects(curriculumId));
    dispatch(fetchAssessmentTypes());
    dispatch(fetchDepartments());
  }, [dispatch, curriculumId]);

  // Загрузка дисциплин с учетом фильтров
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {};
      if (disciplineSearch.trim() !== "") {
        params.nameQuery = disciplineSearch;
      }
      if (selectedDepartment) {
        params.departmentIdQuery = selectedDepartment.id;
      }
      // Загружаем дисциплины только если есть хотя бы один фильтр
      if (Object.keys(params).length > 0) {
        dispatch(fetchSubjects(params));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [disciplineSearch, selectedDepartment, dispatch]);

  // Обновление кафедры при выборе дисциплины
  useEffect(() => {
    if (newRow.discipline && newRow.discipline.department) {
      setNewRow(prev => ({
        ...prev,
        department: newRow.discipline.department
      }));
      setSelectedDepartment(newRow.discipline.department);
    }
  }, [newRow.discipline]);

  // Обновление списка дисциплин при выборе кафедры
  const handleDepartmentChange = (value) => {
    setNewRow(prev => ({ ...prev, department: value || "" }));
    setSelectedDepartment(value);
    // Если выбрана новая кафедра, сбрасываем выбранную дисциплину
    if (!value || (newRow.discipline && newRow.discipline.department?.id !== value?.id)) {
      setNewRow(prev => ({ ...prev, discipline: "" }));
    }
  };

  // Данные из Redux
  const {
    currentCurriculum = null,
    isLoading: curriculumIsLoading,
    errors: curriculumErrors,
  } = useSelector((state) => state.curriculums);

  const {
    data: curriculumSubjectData = [],
    isLoading: curriculumSubjectIsLoading,
  } = useSelector((state) => state.curriculumSubject);

  const { data: formsOfAttestation = [] } = useSelector(
    (state) => state.assessmentTypes
  );

  const { data: disciplines = [] } = useSelector((state) => state.subjects);
  const { data: departments = [] } = useSelector((state) => state.departments);

  if (curriculumIsLoading || curriculumSubjectIsLoading) return <div>Loading...</div>;
  if (curriculumErrors?.length > 0) {
    return (
      <div>
        Ошибка:
        <ul>
          {curriculumErrors.map((error, index) => (
            <li key={index}>{error.message || String(error)}</li>
          ))}
        </ul>
      </div>
    );
  }

  const specialtyTitle = `${currentCurriculum?.specialty?.code || ""} ${
    currentCurriculum?.specialty?.name || ""
  }`;
  const currentEducationForm = currentCurriculum?.education_form?.name || "";
  const startYear = currentCurriculum?.year_of_specialty_training || "";

  const showAlert = (message, severity = "success") => {
    setAlertState({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (
      ["semester", "all_hours", "lecture_hours", "lab_hours", "practice_hours"].includes(field) &&
      (value === "" || parseFloat(value) >= 0)
    ) {
      setNewRow({ ...newRow, [field]: value });
    } else if (!["semester", "all_hours", "lecture_hours", "lab_hours", "practice_hours"].includes(field)) {
      setNewRow({ ...newRow, [field]: value });
    }
  };

  const addRow = () => {
    if (
      !newRow.discipline ||
      !newRow.department ||
      !newRow.formOfAttestation ||
      !newRow.semester ||
      !newRow.all_hours
    ) {
      showAlert("Обязательные поля должны быть заполнены!", "error");
      return;
    }

    const newRowData = {
      subject: {
        id: newRow.discipline.id,
        name: newRow.discipline.name,
        department: {
          id: newRow.department.id,
          name: newRow.department.name,
          full_name: newRow.department.full_name,
        },
      },
      assessment_type: {
        id: newRow.formOfAttestation.id,
        name: newRow.formOfAttestation.name,
      },
      semester: parseInt(newRow.semester, 10),
      all_hours: parseInt(newRow.all_hours, 10),
      lecture_hours: parseInt(newRow.lecture_hours || 0, 10),
      lab_hours: parseInt(newRow.lab_hours || 0, 10),
      practice_hours: parseInt(newRow.practice_hours || 0, 10),
    };

    dispatch(addCurriculumSubject({ curriculumId, data: newRowData }))
      .unwrap()
      .then(() => {
        showAlert("Запись успешно добавлена!", "success");
        setNewRow({
          discipline: "",
          department: "",
          formOfAttestation: "",
          semester: "",
          all_hours: "",
          lecture_hours: "",
          lab_hours: "",
          practice_hours: "",
        });
        setSelectedDepartment(null);
        setDisciplineSearch("");
      })
      .catch((error) => {
        showAlert(`Ошибка при добавлении записи: ${error.message}`, "error");
      });
  };


  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
    handleMenuClose();
  };

  const handleCloseModals = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
  };

  const handleSaveEdit = () => {
    if (
      !currentRow?.subject?.name ||
      !currentRow?.subject?.department?.name ||
      !currentRow?.assessment_type?.name ||
      !currentRow.semester ||
      !currentRow.all_hours
    ) {
      showAlert("Обязательные поля должны быть заполнены!", "error");
      return;
    }

    const updatedData = {
      subject: {
        id: currentRow.subject.id,
        name: currentRow.subject.name,
        department: {
          id: currentRow.subject.department.id,
          name: currentRow.subject.department.name,
          full_name: currentRow.subject.department.full_name,
        },
      },
      assessment_type: {
        id: currentRow.assessment_type.id,
        name: currentRow.assessment_type.name,
      },
      semester: parseInt(currentRow.semester, 10),
      all_hours: parseInt(currentRow.all_hours, 10),
      lecture_hours: parseInt(currentRow.lecture_hours || 0, 10),
      lab_hours: parseInt(currentRow.lab_hours || 0, 10),
      practice_hours: parseInt(currentRow.practice_hours || 0, 10),
    };

    dispatch(
      updateCurriculumSubject({
        curriculumId,
        subjectId: currentRow.id,
        data: updatedData,
      })
    )
      .unwrap()
      .then(() => {
        showAlert("Запись успешно обновлена!", "success");
        handleCloseModals();
      })
      .catch((error) => {
        showAlert(`Ошибка при обновлении записи: ${error.message}`, "error");
      });
  };

  const handleDeleteConfirm = () => {
    dispatch(
      deleteCurriculumSubject({
        curriculumId,
        subjectId: currentRow.id,
      })
    )
      .unwrap()
      .then(() => {
        showAlert("Запись успешно удалена!", "success");
        handleCloseModals();
      })
      .catch((error) => {
        showAlert(`Ошибка при удалении записи: ${error.message}`, "error");
      });
  };

  return (
    <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <div style={{ padding: "16px" }}>
          <h2>{specialtyTitle}</h2>
          <p>Форма образования: {currentEducationForm}</p>
          <p>Год начала подготовки по учебному плану: {startYear}</p>
        </div>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>Дисциплина</TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>Кафедра</TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>Форма аттестации</TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>Семестр</TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>Всего часов</TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>Лекции</TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>Лабораторные</TableCell>
              <TableCell>Практические</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {curriculumSubjectData.map((row) => (
              <TableRow key={`${row.subject.id}-${row.semester}`}>
                <TableCell>
                  <Tooltip title={row.subject.name} arrow>
                    <span>{row.subject.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={row.subject.department.full_name} arrow>
                    <span>{row.subject.department.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{row.assessment_type.name}</TableCell>
                <TableCell>{row.semester}</TableCell>
                <TableCell>{row.all_hours}</TableCell>
                <TableCell>{row.lecture_hours || 0}</TableCell>
                <TableCell>{row.lab_hours || 0}</TableCell>
                <TableCell>{row.practice_hours || 0}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Autocomplete
                  options={disciplines}
                  getOptionLabel={(option) => option.name || ""}
                  value={newRow.discipline || null}
                  onChange={(e, value) => setNewRow({ ...newRow, discipline: value || "" })}
                  onInputChange={(e, value) => setDisciplineSearch(value)}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Выберите дисциплину"
                      fullWidth
                      required
                    />
                  )}
                  noOptionsText="Дисциплины не найдены"
                  loadingText="Загрузка дисциплин..."
                  filterSelectedOptions
                />
              </TableCell>
              <TableCell>
                <Autocomplete
                  options={departments}
                  getOptionLabel={(option) => option.name || ""}
                  value={newRow.department || null}
                  onChange={(e, value) => handleDepartmentChange(value)}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Выберите кафедру"
                      fullWidth
                    />
                  )}
                  noOptionsText="Нет доступных вариантов"
                />
              </TableCell>
              <TableCell>
                <Autocomplete
                  options={formsOfAttestation}
                  getOptionLabel={(option) => option.name || ""}
                  value={newRow.formOfAttestation || null}
                  onChange={(e, value) => setNewRow({ ...newRow, formOfAttestation: value || "" })}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Выберите форму аттестации"
                      fullWidth
                    />
                  )}
                  noOptionsText="Нет доступных вариантов"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  min="1"
                  sx={{ minWidth: 100 }}
                  step="1"
                  value={newRow.semester}
                  onChange={(e) => handleInputChange(e, "semester")}
                  placeholder="Семестр"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  min="0"
                  sx={{ minWidth: 100 }}
                  value={newRow.all_hours}
                  onChange={(e) => handleInputChange(e, "all_hours")}
                  placeholder="Всего часов"
                  fullWidth
                  required
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  min="0"
                  sx={{ minWidth: 100 }}
                  value={newRow.lecture_hours}
                  onChange={(e) => handleInputChange(e, "lecture_hours")}
                  placeholder="Лекции"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  min="0"
                  sx={{ minWidth: 100 }}
                  value={newRow.lab_hours}
                  onChange={(e) => handleInputChange(e, "lab_hours")}
                  placeholder="Лабы"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  min="0"
                  sx={{ minWidth: 100 }}
                  value={newRow.practice_hours}
                  onChange={(e) => handleInputChange(e, "practice_hours")}
                  placeholder="Практика"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={addRow} color="primary">
                  <AddCircleOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
        <MenuItem onClick={handleDelete}>Удалить</MenuItem>
      </Menu>
      <Modal
        open={openEditModal || openDeleteModal}
        onClose={handleCloseModals}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {openEditModal && "Редактировать запись"}
              {openDeleteModal && "Удалить запись"}
            </Typography>
            <IconButton onClick={handleCloseModals} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            {openEditModal && currentRow && (
              <div>
                <Autocomplete
                  value={currentRow.subject}
                  onChange={(e, value) =>
                    setCurrentRow({
                      ...currentRow,
                      subject: value,
                    })
                  }
                  options={disciplines}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Дисциплина"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  value={currentRow.subject.department}
                  onChange={(e, value) =>
                    setCurrentRow({
                      ...currentRow,
                      subject: {
                        ...currentRow.subject,
                        department: value,
                      },
                    })
                  }
                  options={departments}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Кафедра"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  value={currentRow.assessment_type}
                  onChange={(e, value) =>
                    setCurrentRow({
                      ...currentRow,
                      assessment_type: value,
                    })
                  }
                  options={formsOfAttestation}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Форма аттестации"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <TextField
                  label="Семестр"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={currentRow.semester || ""}
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      semester: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Всего часов"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={currentRow.all_hours || ""}
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      all_hours: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Лекционные часы"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={currentRow.lecture_hours || ""}
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      lecture_hours: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Лабораторные часы"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={currentRow.lab_hours || ""}
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      lab_hours: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Практические часы"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={currentRow.practice_hours || ""}
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      practice_hours: e.target.value,
                    })
                  }
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button onClick={handleCloseModals}>Отмена</Button>
                  <Button onClick={handleSaveEdit} color="primary">
                    Сохранить
                  </Button>
                </Box>
              </div>
            )}
            {openDeleteModal && (
              <div>
                <Typography>
                  Вы уверены, что хотите удалить запись{" "}
                  {currentRow?.subject?.name}?
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button onClick={handleCloseModals}>Отмена</Button>
                  <Button onClick={handleDeleteConfirm} color="error">
                    Удалить
                  </Button>
                </Box>
              </div>
            )}
          </Box>
        </Box>
      </Modal>

      <Alert
        open={alertState.open}
        message={alertState.message}
        severity={alertState.severity}
        handleClose={handleCloseAlert}
      />
    </Box>
  );
};

export default TableLearn;