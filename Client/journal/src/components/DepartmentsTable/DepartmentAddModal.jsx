import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DepartmentForm from './DepartmentForm';

const DepartmentAddModal = ({
                                open,
                                onClose,
                                department,
                                onDepartmentChange,
                                onSave,
                                people,
                                personInputValue,
                                onPersonInputChange,
                                onAddPersonClick,
                                faculties
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
                    <Typography variant="h6">Добавить новую запись</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ p: 3 }}>
                    <DepartmentForm
                        department={department}
                        onDepartmentChange={onDepartmentChange}
                        people={people}
                        personInputValue={personInputValue}
                        onPersonInputChange={onPersonInputChange}
                        onAddPersonClick={onAddPersonClick}
                        faculties={faculties}
                        onCancel={onClose}
                        onSubmit={onSave}
                        submitText="Добавить"
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default React.memo(DepartmentAddModal);