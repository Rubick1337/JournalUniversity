import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DeleteDisciplineModal = ({ open, onClose, discipline, onDelete }) => {
    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24
            }}>
                <Box sx={{
                    bgcolor: '#1976d2',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6">Удалить дисциплину</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Typography>
                        Вы уверены, что хотите удалить дисциплину "{discipline?.name}"?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose}>Отмена</Button>
                        <Button onClick={handleDelete} color="error">Удалить</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteDisciplineModal;