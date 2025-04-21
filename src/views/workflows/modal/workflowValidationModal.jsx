import { addWorkflowStyles } from '@/styles/add-workflow-styles';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import React from 'react';

const WorkflowValidationModal = ({ open, close, message = '' }) => {
  const {
    taskTypeDialogPaper,
    taskTypeBackdrop,
    addWorkflowText,
    taskTypeButtonContainer,
    selectButton,
  } = addWorkflowStyles;

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth="md"
      scroll="body"
      sx={{ px: '12px' }}
      slotProps={{
        paper: { sx: taskTypeDialogPaper },
        backdrop: { sx: taskTypeBackdrop }
      }}
      disableScrollLock={true}
    >
      <DialogContent>
        <Typography
          variant="h5"
          sx={{ ...addWorkflowText, fontWeight: 500, color: '#333', marginBottom: '12px', fontSize: '24px' }}
        >
          🚨 Circular Dependency Detected
        </Typography>
        <Typography
          sx={{ ...addWorkflowText, fontSize: '16px', color: '#666', marginBottom: '20px', fontWeight: 400 }}
        >
          {message}
        </Typography>

        <Box sx={taskTypeButtonContainer}>
          <Button onClick={close} variant="contained" sx={selectButton}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowValidationModal;
