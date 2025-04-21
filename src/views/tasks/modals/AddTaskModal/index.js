import React, { useRef, useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  useTheme,
  useMediaQuery,
  Autocomplete,
  Typography,
  Checkbox,
} from '@mui/material'
import AssignedPeopleChips from './AssignedPeopleChips'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ModalHeader from '@/components/customModalHeader'
import moment from 'moment'
import { handleCreateTask } from '@/services/task.service'
import FilesSection from './FilesSection'
import { uploadTaskFiles } from '@/services/workflow.service'
import { deleteFiles } from '@/services/file.service'
import toast from 'react-hot-toast'
import { filesize } from 'filesize'
import WarningModal from '@/views/componenets/warningModal'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
const AddTaskModal = ({ open, close, staffList, fetchTaskLists }) => {
  const [taskNameError, setTaskNameError] = useState(false)
  const [dueDateError, setDueDateError] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [taskName, setTaskName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [instructions, setInstructions] = useState('')
  const [assignedPeople, setAssignedPeople] = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  // File Upload Receive //
  const [files, setFiles] = useState([])
  const [uploadingFiles, setUploadingFiles] = useState([])
  const uploadControllersRef = useRef({})

  useEffect(() => {
    if (!open) {
      setHasChanges(false)
    }
  }, [open])

  const handleFilesUploaded = async (completedFiles) => {
    try {
      await uploadTaskFiles(
        '0',
        completedFiles,
        (progress, fileName) => {
          setUploadingFiles((prev) => prev.map((file) => (file?.name === fileName ? { ...file, progress } : file)))
        },
        uploadControllersRef
      ).then((res) => {
        if (res?.success && res?.data[0] !== undefined) {
          toast.success('Files uploaded successfully')
          const uploaded = completedFiles.filter((file) => res.fileIds[file.name])
          setFiles((prev) =>
            prev.concat(
              uploaded.map((file) => ({
                name: file.name,
                size: filesize(file.size),
                fileId: res.fileIds[file.name],
                mediaType: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
              }))
            )
          )
          setUploadingFiles((prev) => prev.filter((file) => !res.fileIds[file.name]))
          setHasChanges(true)
        } else {
          toast.error('Failed to upload files')
        }
      })
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    }
  }
  const hanndleWarningClose = () => {
    setShowWarning(false)
    close()
  }
  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value)
    if (e.target.value.trim()) setTaskNameError(false)
    setHasChanges(true)
  }

  const handleDueDateChange = (moment) => {
    if (moment) {
      setDueDate(moment.format('YYYY-MM-DD'))
      setDueDateError(false)
      setHasChanges(true)
    }
  }

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value)
    setHasChanges(true)
  }

  const handleAssignedPeopleChange = (e, newValue) => {
    setAssignedPeople(newValue)
    setHasChanges(true)
  }

  const handleCancelUpload = (fileName) => {
    const controller = uploadControllersRef.current[fileName]
    if (controller) {
      controller.abort()
      delete uploadControllersRef.current[fileName]
    }
    setUploadingFiles((prev) => prev?.filter((file) => file?.name !== fileName))
    setHasChanges(true)
  }

  const handleDeleteFile = async (fileToDelete) => {
    try {
      const fileForDelete = {
        fileName: fileToDelete.name,
        fileId: fileToDelete.fileId,
        size: fileToDelete.size,
      }

      const deleteResponse = await deleteFiles([fileForDelete])

      if (deleteResponse === 'Deleted') {
        setFiles((prev) => prev.filter((file) => file.fileId !== fileToDelete.fileId))
        toast.success('File deleted successfully')
        setHasChanges(true)
      } else {
        throw new Error('Failed to delete file')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to delete file')
    }
  }

  const handleClearAll = () => {
    setFiles([])
    setHasChanges(true)
  }

  const handleRemovePerson = (personToRemove) => {
    setAssignedPeople((prev) => prev.filter((person) => person.staffId !== personToRemove))
    setHasChanges(true)
  }

  const handleSubmit = async () => {
    let hasError = false

    if (!taskName.trim()) {
      setTaskNameError(true)
      hasError = true
    } else {
      setTaskNameError(false)
    }

    if (!dueDate) {
      setDueDateError(true)
      hasError = true
    } else {
      setDueDateError(false)
    }
    if (hasError) return

    const payload = {
      taskTitle: taskName,
      dueDate: dueDate || null,
      staffInstruction: instructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignees: assignedPeople.map((person) => ({
        assigneeId: person.staffId,
        assigneeName: person.fullName,
        assigneeEmail: person.email,
      })),
      files: files.map((file) => ({
        fileName: file.name,
        mediaType: file.mediaType,
        size: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileId: file.fileId,
      })),
    }
    try {
      const response = await handleCreateTask(payload)
      if (response) {
        fetchTaskLists()
      } else {
        console.error('Task creation failed:', response)
      }
    } catch (error) {
      console.error('Error while creating task:', error)
    }

    setHasChanges(false)
    close()
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={() => (hasChanges ? setShowWarning(true) : close())}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
      >
        <ModalHeader title="Create Task" onClose={() => (hasChanges ? setShowWarning(true) : close())} />
        <Box sx={{ pt: 2, pb: 8 }}>
          <DialogContent sx={{ p: 0, px: 4 }}>
            <TextField
              fullWidth
              label="Task Name"
              variant="outlined"
              value={taskName}
              onChange={handleTaskNameChange}
              error={taskNameError}
              helperText={taskNameError ? 'Task Name is required' : ''}
              sx={textFieldSx}
            />
            <DatePicker
              label="Due Date"
              placeholder="Due Date"
              value={dueDate ? moment(dueDate) : null}
              onChange={handleDueDateChange}
              slotProps={{
                textField: {
                  error: dueDateError,
                  helperText: dueDateError ? 'Due date is required' : '',
                },
              }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Instructions"
              variant="outlined"
              value={instructions}
              onChange={handleInstructionsChange}
              sx={textFieldSx}
            />

            <FilesSection
              files={files}
              setFiles={setFiles}
              uploadingFiles={uploadingFiles}
              setUploadingFiles={setUploadingFiles}
              onFilesUploaded={handleFilesUploaded}
              onDeleteFile={handleDeleteFile}
              onCancel={handleCancelUpload}
              onClearAll={handleClearAll}
            />

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <Autocomplete
                multiple
                options={staffList}
                getOptionLabel={(option) => option.fullName}
                value={assignedPeople}
                onChange={handleAssignedPeopleChange}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    {option.fullName}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign Staff"
                    variant="outlined"
                    placeholder={
                      assignedPeople.length > 0
                        ? assignedPeople.map((person) => person.fullName).join(', ')
                        : 'Select staff...'
                    }
                  />
                )}
                renderTags={() => (
                  <input type="text" value={assignedPeople.map((p) => p.fullName).join(', ')} hidden readOnly />
                )}
              />
            </FormControl>

            <AssignedPeopleChips assignedPeople={assignedPeople} onRemovePerson={handleRemovePerson} />
          </DialogContent>

          <DialogActions sx={{ mt: 20, justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => (hasChanges ? setShowWarning(true) : close())}
              sx={actionButtonSx}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} sx={actionButtonSx}>
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <WarningModal open={showWarning} close={() => setShowWarning(false)} closeAll={hanndleWarningClose} />
    </>
  )
}

const textFieldSx = {
  mb: 3,
  mt: 1,
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
  },
}

const actionButtonSx = {
  textTransform: 'capitalize',
  borderRadius: 1,
  px: 3,
  py: 1,
}

export default AddTaskModal
