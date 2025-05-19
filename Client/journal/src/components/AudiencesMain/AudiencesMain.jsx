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
  fetchAudiences,
  createAudience,
  updateAudience,
  deleteAudience,
  clearErrors,
  clearCurrentAudience,
  setPage,
  setLimit,
  setSearchParams,
} from "../../store/slices/audienceSlice";
import { fetchAcademicBuildings } from "../../store/slices/academicBuildingSlice";

const AudienceMain = () => {
  const dispatch = useDispatch();
  const {
    data: audiencesData,
    isLoading,
    errors,
    currentAudience,
    meta,
    searchParams,
  } = useSelector((state) => state.audiences);

  const { data: buildingsData } = useSelector(
    (state) => state.academicBuildings
  );

  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newAudience, setNewAudience] = useState({
    number: "",
    capacity: "",
    academicBuildingId: "",
  });
  const [editAudience, setEditAudience] = useState({
    number: "",
    capacity: "",
    academicBuildingId: "",
  });
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [searchNumber, setSearchNumber] = useState("");
  const [searchCapacity, setSearchCapacity] = useState("");
  const [searchBuilding, setSearchBuilding] = useState("");
useEffect(() => {
  dispatch(fetchAudiences({
    limit: meta?.limit || 5,
    page: meta?.page || 1,
    sortBy: orderBy,
    sortOrder: order,
    ...searchParams
  }));
  dispatch(fetchAcademicBuildings());
}, [dispatch, meta?.limit, meta?.page, orderBy, order, searchParams]);
  useEffect(() => {
    if (errors.length > 0) {
      setAlertState({
        open: true,
        message: errors[0].message,
        severity: "error",
      });
      dispatch(clearErrors());
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

  const handleSearchNumberChange = (event) => {
    setSearchNumber(event.target.value);
  };

  const handleSearchCapacityChange = (event) => {
    setSearchCapacity(event.target.value);
  };

  const handleSearchBuildingChange = (event) => {
    setSearchBuilding(event.target.value);
  };

  const handleSearch = () => {
    dispatch(
      setSearchParams({
        numberQuery: searchNumber,
        capacityQuery: searchCapacity,
        buildingIdQuery: searchBuilding,
      })
    );
    handleSearchMenuClose();
  };

  const handleResetSearch = () => {
    setSearchNumber("");
    setSearchCapacity("");
    setSearchBuilding("");
    dispatch(
      setSearchParams({
        numberQuery: "",
        capacityQuery: "",
        academicBuildingId: "",
      })
    );
    handleSearchMenuClose();
  };

const handleSortRequest = (property) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
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
    setEditAudience(currentRow);
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
    handleMenuClose();
  };

  const handleAdd = () => {
    setNewAudience({
      number: "",
      capacity: "",
      academicBuildingId: buildingsData[0]?.id || "",
    });
    setOpenAddModal(true);
  };

  const handleCloseModals = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setOpenAddModal(false);
    dispatch(clearCurrentAudience());
  };

  const handleSaveEdit = async () => {
    if (!editAudience.number?.trim()) {
      showAlert("Номер аудитории должен быть заполнен!", "error");
      return;
    }
    if (!editAudience.capacity || isNaN(editAudience.capacity)) {
      showAlert("Вместимость должна быть числом!", "error");
      return;
    }
    if (!editAudience.academicBuildingId) {
      showAlert("Необходимо выбрать корпус!", "error");
      return;
    }

    try {
      await dispatch(
        updateAudience({
          id: editAudience.id,
          audienceData: {
            number: editAudience.number,
            capacity: parseInt(editAudience.capacity),
            academicBuildingId: editAudience.academicBuildingId,
          },
        })
      ).unwrap();

      showAlert("Аудитория успешно обновлена!", "success");
      handleCloseModals();
      dispatch(
        fetchAudiences({
          limit: meta.limit,
          page: meta.page,
          sortBy: orderBy,
          sortOrder: order,
          ...searchParams,
        })
      );
    } catch (error) {
      showAlert(error.message || "Ошибка при обновлении аудитории", "error");
    }
  };

  const handleSaveAdd = async () => {
    if (!newAudience.number?.trim()) {
      showAlert("Номер аудитории должен быть заполнен!", "error");
      return;
    }
    if (!newAudience.capacity || isNaN(newAudience.capacity)) {
      showAlert("Вместимость должна быть числом!", "error");
      return;
    }
    if (!newAudience.academicBuildingId) {
      showAlert("Необходимо выбрать корпус!", "error");
      return;
    }

    try {
      await dispatch(
        createAudience({
          number: newAudience.number,
          capacity: parseInt(newAudience.capacity),
          academic_building_id: newAudience.academicBuildingId,
        })
      ).unwrap();
      showAlert("Аудитория успешно добавлена!", "success");
      handleCloseModals();
      dispatch(setPage(1));
      dispatch(
        fetchAudiences({
          limit: meta.limit,
          page: 1,
          sortBy: orderBy,
          sortOrder: order,
          ...searchParams,
        })
      );
    } catch (error) {
      showAlert(error.message || "Ошибка при добавлении аудитории", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteAudience(currentRow.id)).unwrap();
      showAlert("Аудитория успешно удалена!", "success");
      handleCloseModals();

      if (audiencesData.length === 1 && meta.page > 1) {
        dispatch(setPage(meta.page - 1));
      } else {
        dispatch(
          fetchAudiences({
            limit: meta.limit,
            page: meta.page,
            sortBy: orderBy,
            sortOrder: order,
            ...searchParams,
          })
        );
      }
    } catch (error) {
      showAlert(error.message || "Ошибка при удалении аудитории", "error");
    }
  };

  const getBuildingName = (buildingId) => {
    const building = buildingsData.find((b) => b.id === buildingId);
    return building ? building.name : "Неизвестный корпус";
  };

  if (isLoading && audiencesData.length === 0) {
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
          <Typography variant="h6">Аудитории</Typography>
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
                label="Поиск по номеру"
                variant="outlined"
                size="small"
                fullWidth
                value={searchNumber}
                onChange={handleSearchNumberChange}
                sx={{ mb: 2 }}
                autoFocus
              />
              <TextField
                label="Поиск по вместимости"
                variant="outlined"
                size="small"
                fullWidth
                value={searchCapacity}
                onChange={handleSearchCapacityChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Корпус</InputLabel>
                <Select
                  value={searchBuilding}
                  onChange={handleSearchBuildingChange}
                  label="Корпус"
                >
                  <SelectMenuItem value="">
                    <em>Все корпуса</em>
                  </SelectMenuItem>
                  {buildingsData.map((building) => (
                    <SelectMenuItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleResetSearch}
                  disabled={!searchNumber && !searchCapacity && !searchBuilding}
                >
                  Сбросить
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={!searchNumber && !searchCapacity && !searchBuilding}
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
                  active={orderBy === "number"}
                  direction={orderBy === "number" ? order : "asc"}
                  onClick={() => handleSortRequest("number")}
                >
                  Номер
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "capacity"}
                  direction={orderBy === "capacity" ? order : "asc"}
                  onClick={() => handleSortRequest("capacity")}
                >
                  Вместимость
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "academicBuilding.name"}
                  direction={
                    orderBy === "academicBuilding.name" ? order : "asc"
                  }
                  onClick={() => handleSortRequest("academicBuilding.name")}
                >
                  Корпус
                </TableSortLabel>
              </TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audiencesData.map((audience) => (
              <TableRow key={audience.id}>
                <TableCell>{audience.id}</TableCell>
                <TableCell>{audience.number}</TableCell>
                <TableCell>{audience.capacity}</TableCell>
                <TableCell>{audience.academicBuilding.name}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, audience)}>
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
          Добавить аудиторию
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
            <Typography variant="h6">Редактировать аудиторию</Typography>
            <IconButton onClick={handleCloseModals} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <TextField
              label="Номер аудитории*"
              fullWidth
              margin="normal"
              value={editAudience.number}
              onChange={(e) =>
                setEditAudience({ ...editAudience, number: e.target.value })
              }
            />
            <TextField
              label="Вместимость*"
              fullWidth
              margin="normal"
              type="number"
              value={editAudience.capacity}
              onChange={(e) =>
                setEditAudience({ ...editAudience, capacity: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Корпус*</InputLabel>
              <Select
                value={editAudience.academicBuildingId}
                onChange={(e) =>
                  setEditAudience({
                    ...editAudience,
                    academicBuildingId: e.target.value,
                  })
                }
                label="Корпус*"
                
              >
                {buildingsData.map((building) => (
                  <SelectMenuItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectMenuItem>
                ))}
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
            <Typography variant="h6">Удалить аудиторию</Typography>
            <IconButton onClick={handleCloseModals} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography>
              Вы уверены, что хотите удалить аудиторию "{currentRow?.number}"?
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
            <Typography variant="h6">Добавить новую аудиторию</Typography>
            <IconButton onClick={handleCloseModals} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <TextField
              label="Номер аудитории*"
              fullWidth
              margin="normal"
              value={newAudience.number}
              onChange={(e) =>
                setNewAudience({ ...newAudience, number: e.target.value })
              }
            />
            <TextField
              label="Вместимость*"
              fullWidth
              margin="normal"
              type="number"
              value={newAudience.capacity}
              onChange={(e) =>
                setNewAudience({ ...newAudience, capacity: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Корпус*</InputLabel>
              <Select
                value={newAudience.academicBuildingId}
                onChange={(e) =>
                  setNewAudience({
                    ...newAudience,
                    academicBuildingId: e.target.value,
                  })
                }
                label="Корпус*"
              >
                {buildingsData.map((building) => (
                  <SelectMenuItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectMenuItem>
                ))}
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

export default AudienceMain;
