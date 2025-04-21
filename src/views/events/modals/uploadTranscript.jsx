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

const UploadTranscript = ({ open, close, setSuccess, text }) => {
  return (
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth="lg"
        onClose={close}
        sx={{ px: '12px' }}
        PaperProps={{
          sx: {
            width: '600px',
            height: '455px',
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
            pb: '19px !important',
            pt: '19px !important',
            px: '24px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            lineHeight: 'normal',
          }}
        >
          {'Transcript Uploaded'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: '24px', pt: '24px', px: '90px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box>
              <Box sx={{ textAlign: 'center', mb: '24px', mt: '24px' }}>
                <img src="/icons/transcriptUpload.svg" alt="upload" />
              </Box>
              <Typography
                sx={{
                  textAlign: 'center',
                  color: '#212121',
                  fontWeight: 400,
                  lineHeight: '36px',
                  fontSize: '24px',
                }}
              >
                {text}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '29px',
                  mt: '24px',
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'capitalize',
                    height: '50px',
                    color: '#4489FE',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    width: '200px',
                  }}
                  onClick={close}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'capitalize',
                    height: '50px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    width: '200px',
                  }}
                  onClick={() => {
                    close(), setSuccess(true);
                  }}
                  fullWidth
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

export default UploadTranscript;
