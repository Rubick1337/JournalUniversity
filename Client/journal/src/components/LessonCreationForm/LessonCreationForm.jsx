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
  Chip,
  Collapse,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import styles from "./LessonInfo.module.css";
import {
  createLesson,
  getPairsOnDate,
  clearCreateLessonState,
} from "../../store/slices/lessonSlice";
import { fetchAcademicBuildings } from "../../store/slices/academicBuildingSlice";
import { getAllSubjectTypes } from "../../store/slices/subjectTypeSlice";
import { fetchAudiences } from "../../store/slices/audienceSlice";
import { fetchSubjects } from "../../store/slices/subjectSlice";
import { fetchTeachers } from "../../store/slices/teacherSlice";
import { fetchGroups } from "../../store/slices/groupSlice";
import { fetchSubgroups } from "../../store/slices/subgroupSlice";
import { useDispatch, useSelector } from "react-redux";

const LessonCreateForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Получение данных из Redux store
  const { pairs, createLesson: createLessonState } = useSelector(
    (state) => state.lesson
  );
  const { data: academicBuildings, isLoading: buildingsLoading } = useSelector(
    (state) => state.academicBuildings
  );
  const { data: subjectTypes, isLoading: subjectTypeLoading } = useSelector(
    (state) => state.subjectType
  );
  const { data: audiences, isLoading: audiencesLoading } = useSelector(
    (state) => state.audiences
  );
  const { data: subjects, isLoading: subjectsLoading } = useSelector(
    (state) => state.subjects || {}
  );
  const { data: groups, isLoading: groupsLoading } = useSelector(
    (state) => state.groups || {}
  );
  const { data: subgroups, isLoading: subgroupsLoading } = useSelector(
    (state) => state.subgroups || {}
  );
  const teachersState = useSelector((state) => state.teachers || {});
  const teachers = teachersState.data || [];
  const teachersLoading = teachersState.isLoading || false;
  const { teacher_id } = useSelector((state) => state.user);
  const isTeacher = teacher_id != null;

  // Состояния формы
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
    audience: null,
    teacher: null,
    subject_type: "",
    subject: null,
    group: null,
    subgroup: null,
  });

  const [academicBuildingId, setAcademicBuildingId] = useState("");
  const [audienceSearch, setAudienceSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");

  // Состояния для управления раскрытием разделов
  const [expandedSections, setExpandedSections] = useState({
    timeInfo: true,
    subjectInfo: true,
    groupInfo: true,
    teacherInfo: true,
    locationInfo: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Эффекты для загрузки данных
  useEffect(() => {
    dispatch(fetchAcademicBuildings());
    dispatch(getAllSubjectTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPairsOnDate(formData.date));
  }, [formData.date, dispatch]);

  useEffect(() => {
    if (academicBuildingId) {
      dispatch(
        fetchAudiences({
          numberAudienceQuery: audienceSearch,
          academicBuildingIdQuery: academicBuildingId,
        })
      );
    }
  }, [academicBuildingId, audienceSearch, dispatch]);

  useEffect(() => {
    const params = {
      personQuery: teacherSearch,
      page: 1,
      limit: 10,
    };
    if (teacherSearch.length > 2) {
      dispatch(fetchTeachers(params));
    }
  }, [teacherSearch, dispatch]);

  useEffect(() => {
    if (subjectSearch.length > 2) {
      dispatch(fetchSubjects({ nameQuery: subjectSearch }));
    }
  }, [subjectSearch, dispatch]);

  useEffect(() => {
    if (groupSearch.length > 2) {
      dispatch(fetchGroups({ nameQuery: groupSearch }));
    }
  }, [groupSearch, dispatch]);

  useEffect(() => {
    if (formData.group?.id) {
      dispatch(fetchSubgroups({ groupIdQuery: formData.group.id }));
    } else {
      setFormData((prev) => ({ ...prev, subgroup: null }));
    }
  }, [formData.group, dispatch]);

  // Обработчики событий
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
    setFormData((prev) => ({ ...prev, audience: null }));
  };

  const handleAudienceChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, audience: newValue }));
  };

  const handleAudienceInputChange = (event, newInputValue) => {
    setAudienceSearch(newInputValue);
  };

  const handleTeacherChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, teacher: newValue }));
  };

  const handleTeacherInputChange = (event, newInputValue) => {
    setTeacherSearch(newInputValue);
  };

  const handleSubjectChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, subject: newValue }));
  };

  const handleSubjectInputChange = (event, newInputValue) => {
    setSubjectSearch(newInputValue);
  };

  const handleGroupChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, group: newValue, subgroup: null }));
  };

  const handleGroupInputChange = (event, newInputValue) => {
    setGroupSearch(newInputValue);
  };

  const handleSubgroupChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, subgroup: newValue }));
  };
  // Эффект для перенаправления после успешного создания занятия
  useEffect(() => {
    if (createLessonState.data?.id) {
      // Перенаправляем на страницу созданного занятия
      navigate(`/infolesson/${createLessonState.data.id}`);
      // Очищаем состояние создания занятия
      dispatch(clearCreateLessonState());
    }
  }, [createLessonState.data, navigate, dispatch]);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.audience ||
      !formData.teacher ||
      !formData.subject_type ||
      !formData.subject ||
      !formData.group
    )
      return;

    const lessonData = {
      date: formData.date,
      pair_id: formData.pair,
      audience_id: formData.audience.id,
      teacher_person_id: formData.teacher.id,
      group_id: formData.group.id,
      subgroup_id: formData.subgroup?.id || null,
      subject_id: formData.subject.id,
      topic_id: null,
      subject_type_id: formData.subject_type,
    };

    dispatch(createLesson(lessonData));
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

        {/* Отображение ошибки при создании занятия */}
        {createLessonState.errors && (
          <Box mt={2}>
            <Alert severity="error">
              Ошибка при создании занятия:{" "}
              {createLessonState.errors.message || "Неизвестная ошибка"}
            </Alert>
          </Box>
        )}
        {/* Раздел 1: Временные параметры */}
        <Box mt={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => toggleSection("timeInfo")}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6">Временные параметры</Typography>
            {expandedSections.timeInfo ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </Box>
          <Collapse in={expandedSections.timeInfo}>
            <Box mt={2}>
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
          </Collapse>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Раздел 2: Информация о предмете */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => toggleSection("subjectInfo")}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6">Информация о предмете</Typography>
            {expandedSections.subjectInfo ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </Box>
          <Collapse in={expandedSections.subjectInfo}>
            <Box mt={2}>
              <Autocomplete
                options={subjects || []}
                getOptionLabel={(subject) => subject.name}
                value={formData.subject}
                onChange={handleSubjectChange}
                onInputChange={handleSubjectInputChange}
                inputValue={subjectSearch}
                loading={subjectsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите дисциплину"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {subjectsLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  subjectSearch
                    ? "Ничего не найдено"
                    : "Введите название дисциплины (минимум 3 символа)"
                }
              />
            </Box>

            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel>Тип занятия</InputLabel>
                <Select
                  name="subject_type"
                  value={formData.subject_type}
                  onChange={handleChange}
                  label="Тип занятия"
                  required
                  disabled={subjectTypeLoading}
                >
                  {subjectTypes?.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Раздел 3: Группа и подгруппа */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => toggleSection("groupInfo")}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6">Группа и подгруппа</Typography>
            {expandedSections.groupInfo ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </Box>
          <Collapse in={expandedSections.groupInfo}>
            <Box mt={2}>
              <Autocomplete
                options={groups || []}
                getOptionLabel={(group) => group.name}
                value={formData.group}
                onChange={handleGroupChange}
                onInputChange={handleGroupInputChange}
                inputValue={groupSearch}
                loading={groupsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите группу"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {groupsLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  groupSearch
                    ? "Ничего не найдено"
                    : "Введите название группы (минимум 3 символа)"
                }
              />
            </Box>

            {formData.group && (
              <Box mt={3}>
                <FormControl fullWidth>
                  <InputLabel>Выберите подгруппу</InputLabel>
                  <Select
                    value={formData.subgroup?.id || ""}
                    onChange={(e) => {
                      const selectedSubgroup = subgroups.find(
                        (s) => s.id === e.target.value
                      );
                      handleSubgroupChange(null, selectedSubgroup);
                    }}
                    label="Выберите подгруппу"
                    disabled={subgroupsLoading}
                  >
                    <MenuItem value="">
                      <em>Не выбрано</em>
                    </MenuItem>
                    {subgroups?.map((subgroup) => (
                      <MenuItem key={subgroup.id} value={subgroup.id}>
                        {subgroup.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Collapse>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Раздел 4: Преподаватель */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => toggleSection("teacherInfo")}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6">Преподаватель</Typography>
            {expandedSections.teacherInfo ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </Box>
          <Collapse in={expandedSections.teacherInfo}>
            <Box mt={2}>
              <Autocomplete
                options={teachers}
                getOptionLabel={(teacher) =>
                  `${teacher.person.surname} ${teacher.person.name} ${
                    teacher.person.middlename || ""
                  }`
                }
                value={formData.teacher}
                onChange={handleTeacherChange}
                onInputChange={handleTeacherInputChange}
                inputValue={teacherSearch}
                loading={teachersLoading}
                renderOption={(props, teacher) => (
                  <li {...props}>
                    <div>
                      <div>{`${teacher.person.surname} ${teacher.person.name} ${
                        teacher.person.middlename || ""
                      }`}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        {teacher.department.name} •{" "}
                        {teacher.teachingPosition.name}
                      </div>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите преподавателя"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {teachersLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  teacherSearch
                    ? "Ничего не найдено"
                    : "Введите ФИО преподавателя (минимум 3 символа)"
                }
              />
            </Box>

            {formData.teacher && (
              <Box mt={2} display="flex" gap={1}>
                <Chip
                  label={formData.teacher.department.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={formData.teacher.teachingPosition.name}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            )}
          </Collapse>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Раздел 5: Место проведения */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => toggleSection("locationInfo")}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6">Место проведения</Typography>
            {expandedSections.locationInfo ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </Box>
          <Collapse in={expandedSections.locationInfo}>
            <Box mt={2}>
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
                          {audiencesLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  audienceSearch
                    ? "Ничего не найдено"
                    : "Введите название аудитории"
                }
              />
            </Box>
          </Collapse>
        </Box>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={
              createLessonState.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            type="submit"
            disabled={
              createLessonState.isLoading ||
              pairs.isLoading ||
              !formData.pair ||
              !formData.audience ||
              !formData.teacher ||
              !formData.subject_type ||
              !formData.subject ||
              !formData.group
            }
          >
            {createLessonState.isLoading
              ? "Сохранение..."
              : "Сохранить занятие"}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default LessonCreateForm;
