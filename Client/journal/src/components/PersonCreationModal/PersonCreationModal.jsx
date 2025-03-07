import "./PersonCreationModal.css";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PersonCreationModal({
  open = true,
  handleClose = () => {},
  handleSubmit = () => {},
  personData = {},
  handleChange = () => {},
}) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <IconButton className="close-button" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Персональные данные</Typography>
        <form onSubmit={handleSubmit}>
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Фамилия"
              name="surname"
              value={personData.surname}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Имя"
              name="name"
              value={personData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Отчество"
              name="middlename"
              value={personData.middlename}
              onChange={handleChange}
              
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={personData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Телефон"
              name="phone"
              value={personData.phone}
              onChange={handleChange}
            />
          </>

          <Button fullWidth type="submit" variant="contained" color="primary">
            Создать
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
