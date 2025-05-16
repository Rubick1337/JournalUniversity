import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DepartmentForm from './DepartmentForm';

const DepartmentEditModal = ({
                                 open,
                                 onClose,
                                 department = {},
                                 people = [],
                                 faculties = [],
                                 onSave
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
                    <Typography variant="h6">Редактировать запись</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ p: 3 }}>
                    <DepartmentForm
                        department={department}
                        onSave={onSave}
                        onCancel={onClose}
                        people={people}
                        faculties={faculties}
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default DepartmentEditModal;