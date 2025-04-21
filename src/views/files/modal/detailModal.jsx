import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider
} from '@mui/material';
import React from 'react';
import FileDetails from './fileDetails';
import LinkedResources from './linkedResources';

const FileDetailModal = ({ open, close, file }) => {

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={close}
        maxWidth="lg"
        backdrop={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.2)' } }}
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
          {'File Details'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: '24px 24px', m: 0 }}>
          <FileDetails file={file} />
          <LinkedResources file={file} />
        </DialogContent>
        <DialogActions>
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileDetailModal;
