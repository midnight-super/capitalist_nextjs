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
import NestedMultipleSelect from '../nestedMultipleSelect';

const OutputsModal = ({
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
  listContainers,
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

  const [selectedIoputs, setSelectedIoputs] = useState({});

  const selectedTask = taskTypes?.find((task) => task?.label === selectedType);

  const filteredItems = allItems?.filter((task) => task?.id !== selectedItemId);

  const onSubmit = () => {
    const newConnections = Object.entries(selectedIoputs)?.flatMap(([outputIdx, inputs]) =>
      Object.entries(inputs)?.flatMap(([inputWorkflowTaskId, inputIds]) =>
        inputIds?.map((inputId) => ({
          mappingType:
            inputWorkflowTaskId === "workflow_output" ? "FILE" : "TASK_OUTPUT",
          inputWorkflowTaskId,
          inputId,
          outputId: selectedTask?.outputs?.[outputIdx]?.taskIoputId,
          outputWorkflowTaskId: selectedItemId,
        }))
      )
    ) || [];

    setListContainers((prev) =>
      prev.map((container, index) => {
        if (index === listIndex) {
          const updatedConnections = container.connections.filter(
            (conn) => conn.outputWorkflowTaskId !== selectedItemId
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
          inputs: matchedTaskType?.inputs?.map((output) => ({
            label: output?.name,
            value: output?.taskIoputId,
          })),
        };
      })
      .filter(Boolean),
  ];

  useEffect(() => {
    if (!workflowConnections || !selectedTask?.outputs) return;

    const updatedSelectedIoputs = {};

    workflowConnections.forEach((connection) => {
      const outputIndex = selectedTask?.outputs?.findIndex(
        (output) =>
          output?.taskIoputId === connection?.outputId &&
          connection?.outputWorkflowTaskId === selectedItemId
      );

      if (outputIndex !== -1) {
        if (!updatedSelectedIoputs[outputIndex]) {
          updatedSelectedIoputs[outputIndex] = {};
        }

        if (
          !updatedSelectedIoputs[outputIndex][connection?.inputWorkflowTaskId]
        ) {
          updatedSelectedIoputs[outputIndex][connection?.inputWorkflowTaskId] =
            [];
        }

        updatedSelectedIoputs[outputIndex][
          connection?.inputWorkflowTaskId
        ]?.push(connection?.inputId);
      }
    });

    setSelectedIoputs(updatedSelectedIoputs);
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
          {`Configure Outputs for ${taskName}`}
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {selectedTask?.outputs?.length > 0 &&
                  selectedTask?.outputs?.map((output, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '16px',
                      }}
                    >
                      <div style={{ flex: '1', width: '100%' }}>
                        <CustomTextField
                          type="text"
                          value={output?.name}
                          label={`Output ${idx + 1} Name`}
                          disabled={isView}
                        />
                      </div>

                      <div style={{ flex: '2', width: '50%' }}>
                        <NestedMultipleSelect
                          label="Select Tasks"
                          options={transformedOptions}
                          selectedSubOption={selectedIoputs}
                          setSelectedSubOption={setSelectedIoputs}
                          propIndex={idx}
                          workflowConnections={workflowConnections}
                          selectedItemId={selectedItemId}
                        />
                      </div>
                    </div>
                  ))}
              </div>
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
              {!isView && (
                <Button
                  variant="contained"
                  sx={{
                    ...button,
                    color: '#fff',
                  }}
                  disabled={editId && isView}
                  onClick={onSubmit}
                >
                  {editId && !isView
                    ? 'Update Connection'
                    : 'Create Connection'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OutputsModal;
