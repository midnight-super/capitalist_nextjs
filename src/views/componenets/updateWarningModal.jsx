import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import React from 'react';

const UpdateWarningModal = ({ open, title, close, closeAll }) => {
    return (
        <>
            <Dialog
                fullWidth
                open={open}
                maxWidth="md"
                scroll="body"
                sx={{ px: '12px' }}
                PaperProps={{
                    sx: {
                        width: '420px',
                        height: '260px',
                        boxShadow: 'none',
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    },
                }}
                disableScrollLock={true}
            >
                <DialogContent
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: '24px',
                        py: '0px',
                        height: '100%',
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        textAlign: 'center',
                                        color: '#212121',
                                        fontWeight: 400,
                                        lineHeight: '36px',
                                        fontSize: '20px',
                                    }}
                                >
                                    {title}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                                mt: '24px',
                            }}
                        >
                            <Button
                                onClick={close}
                                variant="outlined"
                                sx={{
                                    textTransform: 'capitalize',
                                    color: '#757575',
                                    height: '50px',
                                    width: '100px',
                                    borderRadius: '4px',
                                    border: '1px solid #DEE0E4',
                                    fontWeight: 700,
                                    lineHeight: 'normal',
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={closeAll}
                                variant="contained"
                                sx={{
                                    textTransform: 'capitalize',
                                    height: '50px',
                                    width: '100px',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    fontWeight: 700,
                                    lineHeight: 'normal',
                                }}
                            >
                                {'Yes'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateWarningModal;
