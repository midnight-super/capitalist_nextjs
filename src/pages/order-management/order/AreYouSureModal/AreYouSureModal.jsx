import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from '@mui/material';
import React from 'react';

const AreYouSureModal = ({ show, setShow, onSave, isLoading }) => {
    return (
        <>
            <Dialog
                fullWidth
                open={show}
                maxWidth="lg"
                onClose={() => setShow(false)}
                sx={{ px: '12px' }}
                PaperProps={{
                    sx: {
                        width: '600px',
                        // height: '455px',
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
                <DialogTitle
                    sx={{
                        fontSize: '30px',
                        color: '#212121',
                        pb: '19px !important',
                        pt: '19px !important',
                        px: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 700,
                        lineHeight: 'normal',
                    }}
                >
                    {'Save Changes?'}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ px: '50px', pt: '30px', pb: "30px" }}>
                    <Box

                    >


                        <Typography
                            sx={{
                                textAlign: 'left',
                                color: '#212121',
                                fontWeight: 400,
                                lineHeight: '36px',
                                fontSize: '22px',
                            }}
                        >
                            Do you want to save your changes before exit?
                        </Typography>


                    </Box>


                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '24px',
                            mt: '24px',
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => setShow(false)}
                            sx={{
                                borderRadius: '2px',
                                fontSize: '16px',
                                fontWeight: 500,
                                lineHeight: 'normal',
                                backgroundColor: 'transparent',
                                border: "1px solid #4489FE",
                                color: "#4489FE",
                                boxShadow: "none",
                                padding: "10px 40px",
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="contained"
                            onClick={() => {
                                onSave()
                            }}
                            sx={{
                                borderRadius: '2px',
                                fontSize: '16px',
                                fontWeight: 500,
                                lineHeight: 'normal',
                                padding: "10px 40px",

                            }}
                        >
                            {isLoading ? "Please wait..." : "Save"}
                        </Button>
                    </Box>


                </DialogContent>
            </Dialog>
        </>
    );
};

export default AreYouSureModal;
