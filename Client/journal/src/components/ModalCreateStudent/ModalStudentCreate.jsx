import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './CreateStudentModal.css';

function ModalStudentCreate() {
    const [open, setOpen] = useState(false);
    const [student, setStudent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        group: '',
        subgroup: '',
    });

    const groups = ['Асоир', 'БГУИР', 'ВГУ','ВДИ', 'ГГТУ', 'ДГТУ'];
    const subgroups = ['Подгруппа 1', 'Подгруппа 2', 'Подгруппа 3'];

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Student created:', student);
        handleClose();
    };

    const handleKeyDown = (e, type) => {
        if (type === 'group') {
            const group = groups.find((g) => g.toLowerCase().startsWith(e.key.toLowerCase()));
            if (group) {
                setStudent((prevStudent) => ({
                    ...prevStudent,
                    group,
                }));
            }
        } else if (type === 'subgroup') {
            const subgroup = subgroups.find((s) => s.toLowerCase().startsWith(e.key.toLowerCase()));
            if (subgroup) {
                setStudent((prevStudent) => ({
                    ...prevStudent,
                    subgroup,
                }));
            }
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Создать студента
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="modal-box">
                    <IconButton className="close-button" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Создать студента
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                            Личная информация
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="Имя"
                            name="firstName"
                            autoComplete="given-name"
                            autoFocus
                            value={student.firstName}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Фамилия"
                            name="lastName"
                            autoComplete="family-name"
                            value={student.lastName}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={student.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="phone"
                            label="Телефон"
                            name="phone"
                            autoComplete="tel"
                            value={student.phone}
                            onChange={handleChange}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                            Учебная информация
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="group-label">Группа</InputLabel>
                            <Select
                                labelId="group-label"
                                id="group"
                                name="group"
                                value={student.group}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 'group')}
                                label="Группа"
                            >
                                {groups.map((group) => (
                                    <MenuItem key={group} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="subgroup-label">Подгруппа</InputLabel>
                            <Select
                                labelId="subgroup-label"
                                id="subgroup"
                                name="subgroup"
                                value={student.subgroup}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 'subgroup')}
                                label="Подгруппа"
                            >
                                {subgroups.map((subgroup) => (
                                    <MenuItem key={subgroup} value={subgroup}>
                                        {subgroup}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Создать
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

export default ModalStudentCreate;