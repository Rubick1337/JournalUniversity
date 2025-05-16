import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function CustomAlert({ open, message, severity, handleClose }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={1500}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{
                    width: '100%',
                    backgroundColor: severity === 'error' ? '#f44336' : '#4caf50',
                    borderRadius: '8px',
                    boxShadow: 3,
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}