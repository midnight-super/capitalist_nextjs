import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

import CustomTextField from '@/components/customTextField';
import { addServiceCategStyles } from '@/styles/add-modals-styles';
import toast from 'react-hot-toast';
import { getTaskTypeList } from '@/services/taskType.service';
import CustomNestedSelectField from '@/components/customNestedSelectField';

const InputsModal = ({
  open,
  close,
  editId,
  isView,
  workflowConnections,
  selectedItemId,
  setListContainers,
  selectedService,
  listIndex,
  selectedType,
  allItems,
  taskName,
}) => {
  const {
    dialogContainer,
    dialogPaperProps,
    dialogBackdropProps,
    dialogTitle,
    dialogContent,
    dialogContentContainer,
    inputContainer,
    buttonContainer,
    button,
    loader,
  } = addServiceCategStyles;

  const [taskTypes, setTaskTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIoputs, setSelectedIoputs] = useState([]);

  const selectedTask = taskTypes?.find((task) => task?.label === selectedType);

  const filteredItems = allItems?.filter((task) => task?.id !== selectedItemId);

  const fetchTaskTypes = async () => {
    const filter = [
      {
        attribute: 'serviceId',
        operator: 'EQUAL',
        value: [selectedService],
      },
    ];
    const res = await getTaskTypeList('', filter);
    if (res) {
      setTaskTypes(
        res?.data?.map((item) => {
          return {
            label: item?.taskTypeName,
            value: item?.taskTypeId,
            inputs: item?.inputs,
            outputs: item?.outputs,
          };
        })
      );
      setIsLoading(false);
    } else {
      toast.error(res?.message || 'Server Error: Failed to fetch');
      setIsLoading(false);
    }
  };

  const transformedOptions = [
    ...filteredItems
      .map((task) => {
        const matchedTaskType = taskTypes?.find(
          (tt) => tt?.label === task?.taskType
        );
        if (!matchedTaskType) return null;

        return {
          label: task?.name,
          value: task?.id,
          inputs: matchedTaskType?.outputs?.map((input) => ({
            label: input?.name,
            value: input?.taskIoputId,
          })),
        };
      })
      .filter(Boolean),
  ];

  const onSubmitConnection = async () => {
    const newConnections = [];
    const uniqueConnections = new Set();

    selectedTask?.inputs?.forEach((input, index) => {
      const selectedOutput = selectedIoputs?.[index];
      if (!selectedOutput || !selectedOutput?.outputId) {
        return;
      }
      if (input.taskIoputId !== selectedOutput?.inputId) {
        return;
      }
      const outputTaskId = selectedOutput?.taskId;
      if (!outputTaskId) return; // Ensure valid outputTaskId

      const connectionKey = `${selectedOutput?.outputId}-${outputTaskId}-${selectedOutput?.inputId}`;
      if (!uniqueConnections.has(connectionKey)) {
        uniqueConnections.add(connectionKey);
        newConnections.push({
          mappingType:
            selectedOutput?.outputId === 'workflow_input' ? 'FILE' : 'TASK_OUTPUT',
          inputWorkflowTaskId: selectedItemId,
          inputId: input.taskIoputId,
          outputId: selectedOutput?.outputId,
          outputWorkflowTaskId: outputTaskId,
        });
      }
    });

    setListContainers((prev) =>
      prev.map((container, index) => {
        if (index === listIndex) {
          // Remove all connections for this task's inputs.
          const updatedConnections = container.connections.filter(
            (conn) => conn.inputWorkflowTaskId !== selectedItemId
          );
          return {
            ...container,
            connections: [...updatedConnections, ...newConnections],
          };
        }
        return container;
      })
    );

    close();
  };

  useEffect(() => {
    if (!workflowConnections?.length || !selectedTask?.inputs?.length) {
      return;
    }

    const outputIds = selectedTask.inputs
      .map((input) => {
        const connection = workflowConnections?.find(
          (conn) =>
            conn?.inputId === input?.taskIoputId && // Match inputId correctly
            conn?.inputWorkflowTaskId === selectedItemId
        );

        if (!connection) return null; // Skip if no matching connection found

        const matchedTask = transformedOptions?.find(
          (task) => task?.value === connection?.outputWorkflowTaskId
        );

        if (!matchedTask) return null; // Skip if no matching task found

        const matchedInput = matchedTask?.inputs?.find(
          (inp) => inp?.value === connection?.outputId
        );

        if (!matchedInput) return null; // Skip if no matching input found

        return {
          outputId: matchedInput?.value,
          taskId: matchedTask?.value,
          inputId: input?.taskIoputId, // Ensure inputId is correctly stored
        };
      })
      .filter(Boolean); // Remove null values

    if (outputIds?.length > 0) {
      setSelectedIoputs(outputIds); // Ensure it syncs with handleOptionClick
    }
  }, [workflowConnections, selectedTask]);

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={() => close()}
        sx={dialogContainer}
        maxWidth="lg"
        PaperProps={{
          sx: {
            ...dialogPaperProps,
            width: '55%',
          },
        }}
        BackdropProps={{
          sx: { dialogBackdropProps },
        }}
        disableScrollLock
      >
        <DialogTitle sx={dialogTitle}>
          {`Configure Inputs for ${taskName}`}
        </DialogTitle>
        <Divider />
        {isLoading && (
          <div style={loader}>
            <CircularProgress />
          </div>
        )}
        <DialogContent
          sx={{
            ...dialogContent,
            filter: isLoading ? 'blur(5px)' : 'none',
            height: 'auto',
            maxHeight: '80vh',
          }}
        >
          <Box sx={{ ...dialogContentContainer, height: 'auto' }}>
            <Box sx={{ ...inputContainer, width: '100%' }}>
              {selectedTask?.inputs?.length > 0 &&
                selectedTask?.inputs?.map((input, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '16px',
                    }}
                  >
                    <div style={{ flex: '1' }}>
                      <CustomTextField
                        type="text"
                        value={input?.name}
                        label={`Input ${idx + 1} Name`}
                        disabled={isView}
                      />
                    </div>

                    <div style={{ flex: '2' }}>
                      <CustomNestedSelectField
                        label="Select Task"
                        options={transformedOptions}
                        selectedSubOption={selectedIoputs}
                        setSelectedSubOption={setSelectedIoputs}
                        propIndex={idx}
                        workflowConnections={workflowConnections}
                        inputId={input?.taskIoputId}
                      />
                    </div>
                  </div>
                ))}
            </Box>

            <Box sx={{ ...buttonContainer, width: '48%', marginTop: '2rem' }}>
              <Button
                variant="outlined"
                sx={{
                  ...button,
                  color: '#757575',
                  border: '1px solid #DEE0E4',
                }}
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  ...button,
                  color: '#fff',
                }}
                disabled={editId && isView}
                onClick={onSubmitConnection}
              >
                {editId && !isView ? 'Update Connection' : 'Create Connection'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InputsModal;
