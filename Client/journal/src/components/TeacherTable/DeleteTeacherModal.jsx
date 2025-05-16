import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DeleteTeacherModal = ({ open, onClose, teacher, onDelete }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Удалить преподавателя</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography>
                    Вы уверены, что хотите удалить преподавателя {teacher?.name}?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={onClose} sx={{ mr: 2 }}>Отмена</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onDelete();
                            onClose();
                        }}
                    >
                        Удалить
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteTeacherModal;