import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Divider,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import styles from "./LessonInfo.module.css";

const LessonCreateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Форма отправлена:", formData);

    alert("Занятие сохранено!");
    // navigate("/schedule");
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

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            type="submit"
          >
            Сохранить занятие
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default LessonCreateForm;
