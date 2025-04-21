import SearchableSelectField from '@/components/searchableSelectField';
import { addWorkflowStyles } from '@/styles/add-workflow-styles';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const TasktypeModal = ({
  open,
  close,
  closeAll,
  taskTypeList,
  control,
  setSelectedType,
  selectedType,
}) => {
  const {
    taskTypeDialogPaper,
    taskTypeBackdrop,
    taskTypeDialogContent,
    dropDownContainer,
    nameInput,
    addWorkflowText,
    taskTypeButtonContainer,
    cancelButton,
    selectButton,
  } = addWorkflowStyles;

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth="md"
        scroll="body"
        sx={{ px: '12px' }}
        PaperProps={{
          sx: taskTypeDialogPaper,
        }}
        BackdropProps={{
          sx: taskTypeBackdrop,
        }}
        disableScrollLock={true}
      >
        <DialogContent sx={taskTypeDialogContent}>
          <Box sx={dropDownContainer}>
            <Typography
              sx={{
                ...addWorkflowText,
                fontWeight: '400',
                fontSize: '16px',
                mb: '10px',
              }}
            >
              Please select task type for the service selected
            </Typography>
            <FormControl fullWidth sx={{ ...nameInput, mt: 1 }}>
              <Controller
                name="taskType"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SearchableSelectField
                    value={value}
                    label="Task types"
                    onChange={onChange}
                    options={taskTypeList}
                    add={false}
                    setSelectedType={setSelectedType}
                  />
                )}
              />
            </FormControl>
            <Box sx={taskTypeButtonContainer}>
              <Button onClick={close} variant="outlined" sx={cancelButton}>
                Cancel
              </Button>
              <Button
                onClick={closeAll}
                variant="contained"
                sx={selectButton}
                disabled={!selectedType}
              >
                Select
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TasktypeModal;
