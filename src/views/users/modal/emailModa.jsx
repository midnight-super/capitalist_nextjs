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
import toast from 'react-hot-toast';

const EmailSend = ({ open, close, setSuccess, text }) => {
  const handleCopyClick = () => {
    const textToCopy = 'Copy Text';
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success('Copied link', {
          position: 'top-right',
          duration: 2000,
        });
      })
      .catch((error) => {
        toast.error('Failed to Copy link', {
          position: 'top-right',
          duration: 2000,
        });
      });
  };
  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={close}
        PaperProps={{
          sx: {
            width: '608px',
            height: '461px',
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
            fontSize: '18px',
            color: '#212121',
            py: '19px !important',
            px: '27px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
          }}
        >
          {'Send Email'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: '40px 90px', m: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box>
              <Box sx={{ textAlign: 'center', mb: '24px' }}>
                <img src="/icons/passwordIcon.svg" alt="upload" />
              </Box>
              <Typography
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  margin: 'auto',
                  color: '#212121',
                  fontWeight: 400,
                  lineHeight: '36px',
                  fontSize: '24px',
                  width: '364px',
                }}
              >
                {text}
              </Typography>
              <Box
                onClick={handleCopyClick}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: '14px',
                  color: '#4489FE',
                  fontWeight: 600,
                  fontSize: '16px',
                }}
              >
                {'Copy link'}{' '}
                <img
                  style={{ marginLeft: '4px' }}
                  src="/icons/copyIcon.svg"
                  alt="upload"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '29px',
                  mt: '40px',
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'capitalize',
                    height: '50px',
                    width: '200px',
                    color: '#4489FE',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: 'normal',
                  }}
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'capitalize',
                    height: '50px',
                    width: '200px',
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: 'normal',
                  }}
                  onClick={() => {
                    close(), setSuccess(true);
                  }}
                >
                  Send Email
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailSend;
