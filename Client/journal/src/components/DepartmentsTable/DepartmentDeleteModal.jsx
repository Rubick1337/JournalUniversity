import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const DepartmentDeleteModal = ({
                                   open,
                                   onClose,
                                   department,
                                   onConfirm
                               }) => {
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
                <Typography variant="h6" gutterBottom>
                    Подтверждение удаления
                </Typography>
                <Typography sx={{ mb: 3 }}>
                    Вы уверены, что хотите удалить кафедру "{department?.name}"?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onConfirm}
                    >
                        Удалить
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DepartmentDeleteModal;