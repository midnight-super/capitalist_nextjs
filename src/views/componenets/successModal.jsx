import React from 'react';
import { Box, Dialog, DialogContent, Typography } from '@mui/material';

export const SuccessModal = ({ open, close }) => {
  return (
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth="md"
        scroll="body"
        onClose={close}
        sx={{ px: '12px' }}
        PaperProps={{
          sx: {
            width: '446px',
            height: '307px',
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
          sx={{ px: '24px', pt: '0px', px: '90px', height: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Box>
              <Box sx={{ textAlign: 'center', mb: '24px', mt: '24px' }}>
                <img src="/icons/successIcon.svg" alt="upload" />
              </Box>
              <Typography
                sx={{
                  width: '322px',
                  textAlign: 'center',
                  color: '#212121',
                  fontWeight: 400,
                  lineHeight: '36px',
                  fontSize: '24px',
                }}
              >
                {'Successfully sent to client'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
