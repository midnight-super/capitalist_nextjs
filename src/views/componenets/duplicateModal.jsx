import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import React from 'react';

const DuplicateModal = ({ open, close, item }) => {
  return (
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth="md"
        scroll="body"
        PaperProps={{
          sx: {
            width: '420px',
            height: '200px',
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
            height: '100%',
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%' }}>
            {/* Heading */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                sx={{
                  textAlign: 'left',
                  color: '#212121',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '28px',
                }}
              >
                Duplicate {item ? 'Item' : 'List'} Name
              </Typography>
            </Box>

            {/* Message */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                mt: '8px',
              }}
            >
              <Typography
                sx={{
                  textAlign: 'center',
                  color: '#212121',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                }}
              >
                {item ? 'Item' : 'List'} name must be unique across all lists!
              </Typography>
            </Box>

            {/* Close Button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: '24px',
                width: '100%',
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
                Close
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DuplicateModal;
