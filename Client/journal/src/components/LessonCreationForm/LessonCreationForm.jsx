import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Divider,
  Box,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import styles from "./LessonInfo.module.css";
import { getPairsOnDate } from "../../store/slices/lessonSlice";
import { getAllAcademicBuilding } from "../../store/slices/academicBuildingSlice";
import { getAllAudience } from "../../store/slices/audienceSlice";
import { useDispatch, useSelector } from "react-redux";

const LessonCreateForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pairs } = useSelector((state) => state.lesson);
  const { data: academicBuildings, isLoading: buildingsLoading } = useSelector((state) => state.academicBuilding);
  const { data: audiences, isLoading: audiencesLoading } = useSelector((state) => state.audience);
  
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    pair: "",
    audience: null, // Теперь храним объект аудитории
  });
  const [academicBuildingId, setAcademicBuildingId] = useState("");
  const [audienceSearch, setAudienceSearch] = useState("");

  // Загрузка корпусов при монтировании
  useEffect(() => {
    dispatch(getAllAcademicBuilding());
  }, [dispatch]);

  // Загрузка пар при изменении даты
  useEffect(() => {
    dispatch(getPairsOnDate(formData.date));
  }, [formData.date, dispatch]);

  // Загрузка аудиторий при изменении корпуса или поискового запроса
  useEffect(() => {
    if (academicBuildingId) {
      dispatch(getAllAudience({
        numberAudienceQuery: audienceSearch,
        academicBuildingIdQuery: academicBuildingId
      }));
    }
  }, [academicBuildingId, audienceSearch, dispatch]);

  const handleBack = () => {
    navigate("/schedule");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuildingChange = (e) => {
    setAcademicBuildingId(e.target.value);
    setFormData(prev => ({...prev, audience: null})); // Сброс выбранной аудитории при смене корпуса
  };

  const handleAudienceChange = (event, newValue) => {
    setFormData(prev => ({...prev, audience: newValue}));
  };

  const handleAudienceInputChange = (event, newInputValue) => {
    setAudienceSearch(newInputValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.audience) return;
    
    const responseData = {
      date: formData.date,
      pair_id: formData.pair,
      audience_id: formData.audience.id,
      group_id: 1,
      subgroup_id: null,
      subject_id: 5,
      teacher_person_id: 10,
      topic_id: null,
      subject_type_id: 3,
    };
    console.log("Форма отправлена:", responseData);
    alert("Занятие сохранено!");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      <Paper
        elevation={0}
        className={styles.paperContainer}
        component="form"
        onSubmit={handleSubmit}
      >
        <Box className={styles.headerBox}>
          <IconButton onClick={handleBack} className={styles.backButton}>
            <ArrowBackIcon color="primary" />
          </IconButton>
          <Typography variant="h5" className={styles.title}>
            Создание нового занятия
          </Typography>
        </Box>

        <Divider className={styles.divider} />

        <Box mt={3}>
          <TextField
            fullWidth
            label="Дата"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>

        {pairs.isLoading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : pairs.errors ? (
          <Typography color="error" mt={2}>
            Ошибка при загрузке пар:{" "}
            {pairs.errors.message || "Неизвестная ошибка"}
          </Typography>
        ) : (
          <Box mt={3}>
            <FormControl fullWidth>
              <InputLabel>Выберите пару</InputLabel>
              <Select
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                label="Выберите пару"
                required
              >
                {pairs.data.map((pair) => (
                  <MenuItem key={pair.id} value={pair.id}>
                    {pair.name} ({pair.start} - {pair.break_end})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box mt={3}>
          <FormControl fullWidth>
            <InputLabel>Выберите корпус</InputLabel>
            <Select
              value={academicBuildingId}
              onChange={handleBuildingChange}
              label="Выберите корпус"
              required
              disabled={buildingsLoading}
            >
              {academicBuildings?.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mt={3}>
          <Autocomplete
            options={audiences || []}
            getOptionLabel={(option) => option.number}
            value={formData.audience}
            onChange={handleAudienceChange}
            onInputChange={handleAudienceInputChange}
            inputValue={audienceSearch}
            disabled={!academicBuildingId}
            loading={audiencesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Выберите аудиторию"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {audiencesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={audienceSearch ? "Ничего не найдено" : "Введите название аудитории"}
          />
        </Box>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            type="submit"
            disabled={pairs.isLoading || !formData.pair || !formData.audience}
          >
            Сохранить занятие
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default LessonCreateForm;