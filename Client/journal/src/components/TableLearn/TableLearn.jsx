import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Alert from "../Alert/Alert"; // Импортируем компонент Alert
import "./TableLearn.css";
//<======= REDUX =========
import { useDispatch, useSelector } from "react-redux";
import { getCurriculumById } from "../../store/slices/curriculumSlice";
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
} from "@mui/material";
//======== MUI ========>

const TableLearn = () => {
  //<======= GENERAL =========
  const { curriculumId } = useParams();
  const dispatch = useDispatch();
  //======== GENERAL ========>

  const [data, setData] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formsOfAttestation, setFormsOfAttestation] = useState([]);
  const [newRow, setNewRow] = useState({
    discipline: "",
    department: "",
    formOfAttestation: "",
    semester: "",
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

  //<======= STORY =========
  const {
    currentCurriculum = {},
    isLoading: curriculumIsLoading,
    errors: curriculumErrors,
  } = useSelector((state) => state.curriculum);

  useEffect(() => {
    //Get current curriculum
    dispatch(getCurriculumById({ curriculumId }));
  }, [dispatch, curriculumId]);
  useEffect(() => {
    axios
      .get("/TestData/data.json")
      .then((response) => {
        const {
          specialtyCode,
          specialtyName,
          startYear,
          tableData,
          disciplines,
          departments,
          formsOfAttestation,
        } = response.data;
        setData(tableData);
        setDisciplines(disciplines);
        setDepartments(departments);
        setFormsOfAttestation(formsOfAttestation);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        showAlert("Ошибка загрузки данных", "error");
      });
  }, []);

  if (curriculumIsLoading) return <div>Loading...</div>;
  if (curriculumErrors) return <div>Error: {curriculumErrors}</div>;

  const specialtyTitle = `${currentCurriculum.specialty?.code || ''} ${currentCurriculum.specialty?.name || ''}`;
  const currentEducationForm = currentCurriculum.education_form?.name || '';
  const startYear = currentCurriculum.year_of_specialty_training || '';
  //======== STORY ========>
  const showAlert = (message, severity = "success") => {
    setAlertState({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseAlert = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
  };


  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (
      field === "semester" &&
      (value === "" ||
        (parseFloat(value) > 0 && Number.isInteger(parseFloat(value))))
    ) {
      setNewRow({ ...newRow, [field]: value });
    } else if (field !== "semester") {
      setNewRow({ ...newRow, [field]: value });
    }
  };

  const handleAutocompleteChange = (value, field) => {
    setNewRow({ ...newRow, [field]: value || "" });
  };

  const addRow = () => {
    if (
      !newRow.discipline ||
      !newRow.department ||
      !newRow.formOfAttestation ||
      !newRow.semester
    ) {
      showAlert("Все поля должны быть заполнены!", "error");
      return;
    }

    const newRowWithId = {
      ...newRow,
      id: data.length + 1,
      semester: parseInt(newRow.semester, 10),
      animationClass: "fade-in",
    };

    setData([...data, newRowWithId]);
    setNewRow({
      discipline: "",
      department: "",
      formOfAttestation: "",
      semester: "",
    });
    showAlert("Запись успешно добавлена!", "success");
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
      !currentRow.discipline ||
      !currentRow.department ||
      !currentRow.formOfAttestation ||
      !currentRow.semester
    ) {
      showAlert("Все поля должны быть заполнены!", "error");
      return;
    }

    const updatedData = data.map((row) =>
      row.id === currentRow.id ? currentRow : row
    );
    setData(updatedData);
    handleCloseModals();
    showAlert("Запись успешно обновлена!", "success");
  };

  const handleDeleteConfirm = () => {
    const updatedData = data.filter((row) => row.id !== currentRow.id);
    setData(updatedData);
    handleCloseModals();
    showAlert("Запись успешно удалена!", "success");
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
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                Дисциплина
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                Кафедра
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                Форма аттестации
              </TableCell>
              <TableCell>Семестр</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className={row.animationClass || ""}>
                <TableCell>{row.discipline}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.formOfAttestation}</TableCell>
                <TableCell style={{ width: 150 }}>{row.semester}</TableCell>
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
                  value={newRow.discipline}
                  onChange={(e, value) =>
                    handleAutocompleteChange(value, "discipline")
                  }
                  options={disciplines.map((discipline) => discipline.name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Выберите дисциплину"
                      fullWidth
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Autocomplete
                  value={newRow.department}
                  onChange={(e, value) =>
                    handleAutocompleteChange(value, "department")
                  }
                  options={departments.map((department) => department.name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Выберите кафедру"
                      fullWidth
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Autocomplete
                  value={newRow.formOfAttestation}
                  onChange={(e, value) =>
                    handleAutocompleteChange(value, "formOfAttestation")
                  }
                  options={formsOfAttestation.map((form) => form.name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Выберите форму аттестации"
                      fullWidth
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  min="1"
                  sx={{ minWidth: 160 }}
                  step="1"
                  value={newRow.semester}
                  onChange={(e) => handleInputChange(e, "semester")}
                  placeholder="Введите семестр"
                  fullWidth
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          position: "sticky",
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-flex",
          justifyContent: "center",
          mt: 1,
          mb: 2,
        }}
      >
        <IconButton onClick={addRow} color="primary">
          <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
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
            {openEditModal && (
              <div>
                <TextField
                  label="Дисциплина"
                  fullWidth
                  margin="normal"
                  value={currentRow?.discipline || ""}
                  onChange={(e) =>
                    setCurrentRow({ ...currentRow, discipline: e.target.value })
                  }
                />
                <TextField
                  label="Кафедра"
                  fullWidth
                  margin="normal"
                  value={currentRow?.department || ""}
                  onChange={(e) =>
                    setCurrentRow({ ...currentRow, department: e.target.value })
                  }
                />
                <TextField
                  label="Форма аттестации"
                  fullWidth
                  margin="normal"
                  value={currentRow?.formOfAttestation || ""}
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      formOfAttestation: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Семестр"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={currentRow?.semester || ""}
                  onChange={(e) =>
                    setCurrentRow({ ...currentRow, semester: e.target.value })
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
                  Вы уверены, что хотите удалить запись {currentRow?.discipline}
                  ?
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

      {/* Компонент Alert для показа уведомлений */}
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
