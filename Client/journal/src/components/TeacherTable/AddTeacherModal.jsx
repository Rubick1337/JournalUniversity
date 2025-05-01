// AddTeacherModal.jsx
import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonSelector from "../DepartmentsTable/PersonSelector";

const AddTeacherModal = ({
  open,
  onClose,
  departments,
  positions,
  onSave,
  people,
  personInputValue,
  onPersonInputChange,
  onAddPersonClick,
}) => {
  const [newTeacher, setNewTeacher] = React.useState({
    name: "",
    department: "",
    position: "",
  });

  const handleChange = (field, value) => {
    setNewTeacher((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!newTeacher.name || !newTeacher.department || !newTeacher.position) {
      onSave(null, "Все поля должны быть заполнены!");
      return;
    }

    const formattedData = {
      person_id: newTeacher.name.id,
      department_id: newTeacher.department,
      teaching_position_id: newTeacher.position, // Убедитесь, что это число, а не строка
    };

    console.log("Отправляемые данные:", formattedData); // Добавьте логирование
    onSave(formattedData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Добавить преподавателя</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <PersonSelector
          textValue="Личные данные"
          value={newTeacher.name}
          onChange={(value) => handleChange("name", value)}
          options={people}
          inputValue={personInputValue}
          onInputChange={onPersonInputChange}
          onAddPersonClick={onAddPersonClick}
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(option) =>
            `${option.surname} ${option.name} ${option.middlename}`
          }
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Кафедра</InputLabel>
          <Select
            value={newTeacher.department}
            onChange={(e) => handleChange("department", e.target.value)}
            label="Кафедра"
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Должность</InputLabel>
          <Select
            value={newTeacher.position}
            onChange={(e) => handleChange("position", e.target.value)}
            label="Должность"
          >
            {positions.map((pos) => (
              <MenuItem key={pos.id} value={pos.id}>
                {pos.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Отмена
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Добавить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddTeacherModal;
