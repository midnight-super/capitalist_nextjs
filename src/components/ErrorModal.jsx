import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ErrorModal = ({ open, onClose, title, message }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '8px',
                    padding: '16px',
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px'
            }}>
                <Typography variant="h6" component="div" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                    {title || 'Error'}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: '#757575' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '16px' }}>
                <Typography variant="body1">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: '8px 16px' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: '#4489FE',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#4489FE',
                        }
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorModal; 