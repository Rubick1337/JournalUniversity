import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Box,
  Button,
  CircularProgress,
  TableSortLabel,
  Select,
  InputLabel,
  FormControl,
  MenuItem as SelectMenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  clearScheduleErrors ,
  clearCurrentSchedule,
  setPage,
  setLimit,
  setSearchParams,
} from "../../store/slices/scheduleSlice";

const SchedulesMain = () => {
  const dispatch = useDispatch();
  const {
    data: schedulesData,
    isLoading,
    errors,
    currentSchedule,
    meta,
    searchParams,
  } = useSelector((state) => state.schedule);

  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    start_date: "",
    semester_type: "autumn",
  });
  const [editSchedule, setEditSchedule] = useState({
    name: "",
    start_date: "",
    semester_type: "autumn",
  });
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchSemesterType, setSearchSemesterType] = useState("");

  useEffect(() => {
    dispatch(
      fetchSchedules({
        limit: meta?.limit || 5,
        page: meta?.page || 1,
        sortBy: orderBy,
        sortOrder: order,
        ...searchParams,
      })
    );
  }, [dispatch, meta?.limit, meta?.page, orderBy, order, searchParams]);

  useEffect(() => {
    if (errors.length > 0) {
      setAlertState({
        open: true,
        message: errors[0].message,
        severity: "error",
      });
      dispatch(clearScheduleErrors ());
    }
  }, [errors, dispatch]);

  const showAlert = (message, severity = "success") => {
    setAlertState({
      open: true,
      message,
      severity,
    });
    setTimeout(() => setAlertState((prev) => ({ ...prev, open: false })), 3000);
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit(newLimit));
    dispatch(setPage(1));
  };

  const handleSearchMenuClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchMenuClose = () => {
    setSearchAnchorEl(null);
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchDateChange = (event) => {
    setSearchDate(event.target.value);
  };

  const handleSearchSemesterTypeChange = (event) => {
    setSearchSemesterType(event.target.value);
  };

  const handleSearch = () => {
    dispatch(
      setSearchParams({
        nameQuery: searchName,
        dateQuery: searchDate,
        semesterTypeQuery: searchSemesterType,
      })
    );
    handleSearchMenuClose();
  };

  const handleResetSearch = () => {
    setSearchName("");
    setSearchDate("");
    setSearchSemesterType("");
    dispatch(
      setSearchParams({
        nameQuery: "",
        dateQuery: "",
        semesterTypeQuery: "",
      })
    );
    handleSearchMenuClose();
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    dispatch(setPage(1));
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditSchedule(currentRow);
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
    handleMenuClose();
  };

  const handleAdd = () => {
    setNewSchedule({
      name: "",
      start_date: "",
      semester_type: "autumn",
    });
    setOpenAddModal(true);
  };

  const handleCloseModals = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setOpenAddModal(false);
    dispatch(clearCurrentSchedule());
  };

  const handleSaveEdit = async () => {
    if (!editSchedule.name?.trim()) {
      showAlert("Название расписания должно быть заполнено!", "error");
      return;
    }
    if (!editSchedule.start_date) {
      showAlert("Дата начала должна быть указана!", "error");
      return;
    }

    try {
      await dispatch(
        updateSchedule({
          id: editSchedule.id,
          scheduleData: {
            name: editSchedule.name,
            start_date: editSchedule.start_date,
            semester_type: editSchedule.semester_type,
          },
        })
      ).unwrap();

      showAlert("Расписание успешно обновлено!", "success");
      handleCloseModals();
      dispatch(
        fetchSchedules({
          limit: meta.limit,
          page: meta.page,
          sortBy: orderBy,
          sortOrder: order,
          ...searchParams,
        })
      );
    } catch (error) {
      showAlert(error.message || "Ошибка при обновлении расписания", "error");
    }
  };

  const handleSaveAdd = async () => {
    if (!newSchedule.name?.trim()) {
      showAlert("Название расписания должно быть заполнено!", "error");
      return;
    }
    if (!newSchedule.start_date) {
      showAlert("Дата начала должна быть указана!", "error");
      return;
    }

    try {
      await dispatch(
        createSchedule({
          name: newSchedule.name,
          start_date: newSchedule.start_date,
          semester_type: newSchedule.semester_type,
        })
      ).unwrap();
      showAlert("Расписание успешно добавлено!", "success");
      handleCloseModals();
      dispatch(setPage(1));
      dispatch(
        fetchSchedules({
          limit: meta.limit,
          page: 1,
          sortBy: orderBy,
          sortOrder: order,
          ...searchParams,
        })
      );
    } catch (error) {
      showAlert(error.message || "Ошибка при добавлении расписания", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteSchedule(currentRow.id)).unwrap();
      showAlert("Расписание успешно удалено!", "success");
      handleCloseModals();

      if (schedulesData.length === 1 && meta.page > 1) {
        dispatch(setPage(meta.page - 1));
      } else {
        dispatch(
          fetchSchedules({
            limit: meta.limit,
            page: meta.page,
            sortBy: orderBy,
            sortOrder: order,
            ...searchParams,
          })
        );
      }
    } catch (error) {
      showAlert(error.message || "Ошибка при удалении расписания", "error");
    }
  };

  const getSemesterTypeName = (type) => {
    return type === "autumn" ? "Осенний" : "Весенний";
  };

  if (isLoading && schedulesData.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6">Редакции расписаний</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleSearchMenuClick}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleResetSearch}>
              <RefreshIcon />
            </IconButton>
            <Menu
              anchorEl={searchAnchorEl}
              open={Boolean(searchAnchorEl)}
              onClose={handleSearchMenuClose}
              PaperProps={{
                sx: {
                  p: 2,
                  width: 300,
                },
              }}
            >
              <TextField
                label="Поиск по названию"
                variant="outlined"
                size="small"
                fullWidth
                value={searchName}
                onChange={handleSearchNameChange}
                sx={{ mb: 2 }}
                autoFocus
              />
              <TextField
                label="Поиск по дате"
                variant="outlined"
                size="small"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                value={searchDate}
                onChange={handleSearchDateChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Тип семестра</InputLabel>
                <Select
                  value={searchSemesterType}
                  onChange={handleSearchSemesterTypeChange}
                  label="Тип семестра"
                >
                  <SelectMenuItem value="">
                    <em>Все типы</em>
                  </SelectMenuItem>
                  <SelectMenuItem value="autumn">Осенний</SelectMenuItem>
                  <SelectMenuItem value="spring">Весенний</SelectMenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleResetSearch}
                  disabled={!searchName && !searchDate && !searchSemesterType}
                >
                  Сбросить
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={!searchName && !searchDate && !searchSemesterType}
                >
                  Поиск
                </Button>
              </Box>
            </Menu>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleSortRequest("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleSortRequest("name")}
                >
                  Название
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "start_date"}
                  direction={orderBy === "start_date" ? order : "asc"}
                  onClick={() => handleSortRequest("start_date")}
                >
                  Дата начала
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "semester_type"}
                  direction={orderBy === "semester_type" ? order : "asc"}
                  onClick={() => handleSortRequest("semester_type")}
                >
                  Тип семестра
                </TableSortLabel>
              </TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedulesData.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.id}</TableCell>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>
                  {new Date(schedule.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{getSemesterTypeName(schedule.semester_type)}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, schedule)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={meta.total || 0}
          rowsPerPage={meta.limit}
          page={meta.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Записей на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
          <MenuItem onClick={handleDelete}>Удалить</MenuItem>
        </Menu>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          disabled={isLoading}
        >
          Добавить расписание
        </Button>
      </Box>

      {/* Модальное окно редактирования */}
      <Modal open={openEditModal} onClose={handleCloseModals}>
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
            <Typography variant="h6">Редактировать расписание</Typography>
            <IconButton onClick={handleCloseModals} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <TextField
              label="Название*"
              fullWidth
              margin="normal"
              value={editSchedule.name}
              onChange={(e) =>
                setEditSchedule({ ...editSchedule, name: e.target.value })
              }
            />
            <TextField
              label="Дата начала*"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editSchedule.start_date}
              onChange={(e) =>
                setEditSchedule({ ...editSchedule, start_date: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Тип семестра*</InputLabel>
              <Select
                value={editSchedule.semester_type}
                onChange={(e) =>
                  setEditSchedule({
                    ...editSchedule,
                    semester_type: e.target.value,
                  })
                }
                label="Тип семестра*"
              >
                <SelectMenuItem value="autumn">Осенний</SelectMenuItem>
                <SelectMenuItem value="spring">Весенний</SelectMenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleCloseModals}>Отмена</Button>
              <Button
                onClick={handleSaveEdit}
                color="primary"
                disabled={isLoading}
                sx={{ ml: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Сохранить"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Модальное окно удаления */}
      <Modal open={openDeleteModal} onClose={handleCloseModals}>
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
            <Typography variant="h6">Удалить расписание</Typography>
            <IconButton onClick={handleCloseModals} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography>
              Вы уверены, что хотите удалить расписание "{currentRow?.name}"?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleCloseModals}>Отмена</Button>
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                disabled={isLoading}
                sx={{ ml: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Удалить"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Модальное окно добавления */}
      <Modal open={openAddModal} onClose={handleCloseModals}>
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
            <Typography variant="h6">Добавить новое расписание</Typography>
            <IconButton onClick={handleCloseModals} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <TextField
              label="Название*"
              fullWidth
              margin="normal"
              value={newSchedule.name}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, name: e.target.value })
              }
            />
            <TextField
              label="Дата начала*"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newSchedule.start_date}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, start_date: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Тип семестра*</InputLabel>
              <Select
                value={newSchedule.semester_type}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    semester_type: e.target.value,
                  })
                }
                label="Тип семестра*"
              >
                <SelectMenuItem value="autumn">Осенний</SelectMenuItem>
                <SelectMenuItem value="spring">Весенний</SelectMenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleCloseModals}>Отмена</Button>
              <Button
                onClick={handleSaveAdd}
                color="primary"
                disabled={isLoading}
                sx={{ ml: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Добавить"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Уведомления */}
      {alertState.open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            p: 2,
            backgroundColor:
              alertState.severity === "error" ? "#f44336" : "#4caf50",
            color: "white",
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 9999,
          }}
        >
          {alertState.message}
        </Box>
      )}
    </>
  );
};

export default SchedulesMain;