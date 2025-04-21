import { Box, Button, Checkbox, Typography, Menu, MenuItem, IconButton } from '@mui/material'
import { useRef, useState } from 'react'
import FileUpload from './FileUpload'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { toast } from 'react-hot-toast'
import DeleteIcon from '@mui/icons-material/Delete'
import { getOrderDetail } from '@/services/order.service'
import { useRouter } from 'next/router'

const FilesSection = ({
  checkedItems,
  setCheckedItems,
  files,
  setFiles,
  uploadingFiles,
  setUploadingFiles,
  activeTab,
  onPreview,
  onCreateOrderPart,
  orderParts,
  onFilesUploaded,
  onMoveFilesToOrderPart,
  onMoveFilesToGeneral,
  setPreviewFile,
  filesByTab,
  onMakeFileVisibleAgain,
  previewFile,
  onDeleteFile,
  setGeneralInformationFields,
  generalInformationFields,
  onCancel,
  setOrderParts,
  removedFile,
  setRemovedFile,
  selectedTask,
  setTaskFiles,
  selectedWorkflow,
  setWorkflowInputData,
  selectedPartId,
  initialState,
}) => {
  const fileInputRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFileIndex, setSelectedFileIndex] = useState(null)
  const [addToPartAnchorEl, setAddToPartAnchorEl] = useState(null)
  const [markAsResource, setMarkAsResource] = useState([])
  const [onPreviewIndex, setOnPreviewIndex] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const [workflowAnchorEl, setWorkflowAnchorEl] = useState(null)
  const router = useRouter()
  const { id } = router.query

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const isDuplicateFile = (newFile) => {
    return files.some(
      (existingFile) =>
        existingFile.name === newFile.name && existingFile.size === `${Math.round(newFile.size / 1024)}KB`
    )
  }

  const handleUploadProgress = (selectedFiles) => {
    const uniqueFiles = selectedFiles.filter((file) => !isDuplicateFile(file))

    if (uniqueFiles.length === 0) {
      return
    }
    const filesWithProgress = uniqueFiles.map((file) => ({
      file,
      name: file.name,
      progress: 0,
      uploading: true,
      currentTab: activeTab,
    }))

    setUploadingFiles((prev) => [...prev, ...filesWithProgress])
    onFilesUploaded(uniqueFiles)
  }

  const handleFilesUploaded = (completedFiles) => {
    handleUploadProgress(completedFiles)
  }

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length > 0) {
      handleUploadProgress(selectedFiles)
    }
    event.target.value = ''
  }

  const handleRemoveFiles = () => {
    if (activeTab === 'general') {
      const newFiles = files.filter((_, index) => !checkedItems[index])
      setFiles(newFiles)
      setCheckedItems({})
    } else {
      onMoveFilesToGeneral(activeTab)
    }
    setPreviewFile(null)
  }

  const hasSelectedFiles = Object.values(checkedItems).some((value) => value)

  const handleActionClick = (event, index, file) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedFileIndex(index)
    setSelectedFile(file)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedFileIndex(null)
  }

  const handlePreviewClick = (ind) => {
    setOnPreviewIndex(ind)
    onPreview(files[ind])
    handleMenuClose()
  }

  const handleAddToPartClick = (event) => {
    setAddToPartAnchorEl(event.currentTarget)
  }

  const handleAddToPartClose = () => {
    setAddToPartAnchorEl(null)
  }

  const handleAddToPart = (partId) => {
    onMoveFilesToOrderPart(partId)
    handleAddToPartClose()
    setPreviewFile(null)
  }

  const handleDelete = async (fileToDelete) => {
    if (activeTab !== 'configure-workflow') {
      const fileToDelete = filesByTab[activeTab][selectedFileIndex]
      onDeleteFile(fileToDelete, activeTab !== 'general')
      handleMenuClose()
    }

    if (activeTab === 'configure-workflow' && selectedTask && selectedPartId) {
      setWorkflowInputData((prev) => {
        const partData = prev[selectedPartId] || []

        return {
          ...prev,
          [selectedPartId]: partData.map((item) => {
            if (item.workflowTaskId === selectedTask.workflowTaskId && item.files) {
              return {
                ...item,
                files: item.files.filter((fileId) => fileId !== fileToDelete.fileId),
              }
            }
            return item
          }),
        }
      })
      setTaskFiles((prev) => ({
        ...prev,
        [selectedPartId]: {
          ...prev[selectedPartId],
          [selectedTask?.taskTypeId]: prev[selectedPartId][selectedTask?.taskTypeId]?.filter(
            (file) => file?.fileId !== selectedFile?.fileId
          ),
        },
      }))
    }
  }

  const handleDeleteUploadingFile = (file) => {
    if (file) {
      onDeleteFile(file, activeTab !== 'general')
      handleMenuClose()
    }
  }

  const handleMakeFileVisible = () => {
    if (selectedFileIndex !== null) {
      const fileToMove = filesByTab[activeTab][selectedFileIndex]

      onMakeFileVisibleAgain(activeTab, [fileToMove.fileId])

      handleMenuClose()
    }
  }

  const handleAllChecked = () => {
    const allCheck = {}
    files?.forEach((ele, ind) => {
      if (
        Object?.values(checkedItems)?.length === 0 ||
        Object?.values(checkedItems)?.some((value) => value === false)
      ) {
        allCheck[ind] = true
      } else {
        allCheck[ind] = false
      }
    })
    setCheckedItems(allCheck)
  }

  const handleAddToWorkflowTask = (task) => {
    const selectedFileIndices = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([index]) => Number(index))

    const selectedFiles = selectedFileIndices.map((index) => {
      const file = filesByTab[activeTab][index]

      if (file.file) {
        return {
          ...file,
          ...file.file,
          name: file.file.fileName || file.name,
          fileId: file.fileId || file.file.fileId,
        }
      }
      return file
    })

    setTaskFiles((prev) => ({
      ...prev,
      [activeTab]: {
        ...(prev[activeTab] || {}),
        [task.taskTypeId]: [...((prev[activeTab] && prev[activeTab][task.taskTypeId]) || []), ...selectedFiles],
      },
    }))

    setWorkflowInputData((prev) => {
      const orderPartData = prev[activeTab] || []

      const connection = selectedWorkflow[activeTab]?.workflowConnections.find(
        (conn) => conn.mappingType === 'FILE' && conn.inputWorkflowTaskId === task.workflowTaskId
      )

      if (!connection) return prev

      const fileIds = selectedFiles.map((file) => file.fileId)

      const existingInputIndex = orderPartData.findIndex(
        (item) => item.taskTypeInputId === connection.inputId && item.workflowTaskId === task.workflowTaskId
      )

      if (existingInputIndex >= 0) {
        const updatedData = [...orderPartData]
        updatedData[existingInputIndex] = {
          ...updatedData[existingInputIndex],
          files: [...(updatedData[existingInputIndex].files || []), ...fileIds],
        }

        return {
          ...prev,
          [activeTab]: updatedData,
        }
      } else {
        return {
          ...prev,
          [activeTab]: [
            ...orderPartData,
            {
              taskTypeInputId: connection.inputId,
              workflowTaskId: task.workflowTaskId,
              files: fileIds,
              data: '',
            },
          ],
        }
      }
    })

    setCheckedItems({})

    setWorkflowAnchorEl(null)

    toast.success(`Files assigned to ${task.taskNameTag}`)
  }

  const handleMarkMultipleAsResource = () => {
    if (checkedItems) {
      const keysWithTrue = Object.keys(checkedItems).filter((key) => checkedItems[key])

      if (keysWithTrue.length === 0) {
        toast.error('Please select files to mark as resource')
        return
      }

      const selectedFileIds = keysWithTrue.map((index) => files[index]?.fileId).filter(Boolean)

      keysWithTrue.forEach((ele) => {
        setGeneralInformationFields((prev) => ({
          ...prev,
          resourceFileIds: [...prev.resourceFileIds, files[ele]?.fileId],
        }))
      })

      setOrderParts((prev) =>
        prev.map((part) => {
          if (part?.id === activeTab) {
            const removedFiles = part?.orderPartFiles?.filter((file) =>
              selectedFileIds.includes(file?.orderPartFile?.fileId)
            )

            if (removedFiles?.length > 0) {
              setRemovedFile(removedFiles)
            }

            return {
              ...part,
              orderPartFiles: part?.orderPartFiles?.filter(
                (file) => !selectedFileIds.includes(file?.orderPartFile?.fileId)
              ),
            }
          }
          return part
        })
      )

      setCheckedItems({})
    }
  }

  const renderTopButtons = () => {
    if (activeTab === 'configure-workflow') {
      return (
        <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => {
              fileInputRef.current?.click()
            }}
            sx={{
              width: 'fit-content',
              fontSize: '12px',
              textTransform: 'none',
              border: '1px solid #4489FE',
              color: '#4489FE',
              padding: '8px 10px',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Upload More Files
          </Button>
        </Box>
      )
    }

    return (
      <Box sx={{ display: 'grid', gap: 0, mt: 3, alignItems: 'center', gridTemplateColumns: 'auto 1fr' }}>
        <Box>
          <Checkbox
            size="small"
            checked={
              Object?.values(checkedItems)?.length > 0 &&
              files?.length === Object?.values(checkedItems)?.length &&
              Object?.values(checkedItems)?.every((value) => value === true)
            }
            indeterminate={
              Object?.values(checkedItems)?.every((value) => value === false)
                ? false
                : (Object?.values(checkedItems)?.length > 0 &&
                    Object?.values(checkedItems)?.length !== files?.length) ||
                  (Object?.values(checkedItems)?.some((value) => value === false) && true)
            }
            onChange={(e) => {
              handleAllChecked()
            }}
            sx={{
              p: 0.5,
              mr: 1.5,
              color: '#212121',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Button
            onClick={handleMarkMultipleAsResource}
            variant="outlined"
            disabled={!Object.values(checkedItems).some(Boolean)}
            sx={{
              width: 'fit-content',
              fontSize: '12px',
              textTransform: 'none',
              border: '1px solid #4489FE',
              color: '#4489FE',
              padding: '8px 10px',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Mark as Resource
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              fileInputRef.current?.click()
            }}
            sx={{
              width: 'fit-content',
              fontSize: '12px',
              textTransform: 'none',
              border: '1px solid #4489FE',
              color: '#4489FE',
              padding: '8px 10px',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Upload More Files
          </Button>
        </Box>
      </Box>
    )
  }

  const renderBottomButtons = () => {
    if (activeTab === 'configure-workflow') {
      return null
    }

    if (activeTab === 'general') {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {hasSelectedFiles && orderParts.length > 0 && (
            <div style={{ position: 'relative' }}>
              <Button
                variant="contained"
                onClick={handleAddToPartClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  width: 'fit-content',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  bgcolor: '#4489FE',
                  border: '1px solid #4489FE',
                  borderRadius: '6px',
                  padding: '10px 25px',
                  boxShadow: 'none',
                }}
              >
                Add to Job
              </Button>
              <Menu
                anchorEl={addToPartAnchorEl}
                open={Boolean(addToPartAnchorEl)}
                onClose={handleAddToPartClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                    '& .MuiMenuItem-root': {
                      fontSize: '14px',
                      color: '#212121',
                      py: 1,
                      width: '100%',
                    },
                  },
                }}
              >
                {orderParts.map((part) => {
                  const hasFiles = Object.entries(checkedItems)
                    .filter(([_, isChecked]) => isChecked)
                    .map(([index]) => Number(index))
                    .some((index) => {
                      const file = filesByTab.general[index]
                      return filesByTab[part.id]?.some(
                        (partFile) => partFile.name === file.name && partFile.size === file.size
                      )
                    })

                  return (
                    <MenuItem
                      key={part.id}
                      onClick={() => handleAddToPart(part.id)}
                      disabled={hasFiles}
                      sx={{
                        width: '100%',
                        '&.Mui-disabled': {
                          opacity: 0.5,
                          color: '#666',
                        },
                      }}
                    >
                      {part.label}
                    </MenuItem>
                  )
                })}
              </Menu>
            </div>
          )}

          <Button
            variant="contained"
            onClick={onCreateOrderPart}
            sx={{
              width: 'fit-content',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'capitalize',
              bgcolor: '#4489FE',
              border: '1px solid #4489FE',
              borderRadius: '6px',
              padding: '10px 25px',
              boxShadow: 'none',
            }}
          >
            Create Job
          </Button>
        </Box>
      )
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        {hasSelectedFiles && (
          <Button
            variant="contained"
            onClick={handleRemoveFiles}
            sx={{
              width: 'fit-content',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'capitalize',
              bgcolor: '#4489FE',
              border: '1px solid #4489FE',
              borderRadius: '6px',
              padding: '10px 25px',
              boxShadow: 'none',
              whiteSpace: 'pre',
            }}
          >
            Remove from Job
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onCreateOrderPart}
          sx={{
            width: 'fit-content',
            fontSize: '14px',
            fontWeight: 500,
            textTransform: 'capitalize',
            bgcolor: '#4489FE',
            border: '1px solid #4489FE',
            borderRadius: '6px',
            padding: '10px 25px',
            boxShadow: 'none',
            whiteSpace: 'pre',
          }}
        >
          Create Job
        </Button>

        {hasSelectedFiles && (
          <div style={{ position: 'relative' }}>
            <Button
              variant="contained"
              onClick={(e) => setWorkflowAnchorEl(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                width: 'fit-content',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'capitalize',
                bgcolor: '#4489FE',
                border: '1px solid #4489FE',
                borderRadius: '6px',
                padding: '10px 25px',
                boxShadow: 'none',
                whiteSpace: 'pre',
              }}
            >
              Add to Task
            </Button>
            <Menu
              anchorEl={workflowAnchorEl}
              open={Boolean(workflowAnchorEl)}
              onClose={() => setWorkflowAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                  '& .MuiMenuItem-root': {
                    fontSize: '14px',
                    color: '#212121',
                    py: 1,
                  },
                },
              }}
            >
              {selectedWorkflow &&
                selectedWorkflow[activeTab]?.workflowTasks.map((task) => (
                  <MenuItem
                    key={task.workflowTaskId}
                    onClick={() => {
                      handleAddToWorkflowTask(task)
                      setWorkflowAnchorEl(null)
                    }}
                  >
                    {task.taskNameTag} - {task.taskTypeName}
                  </MenuItem>
                ))}
            </Menu>
          </div>
        )}
      </Box>
    )
  }

  const renderHeaderContent = () => {
    if (activeTab === 'general') {
      return {
        title: 'All Files',
        description: 'Please config all files',
      }
    }

    const currentPart = orderParts.find((part) => part.id === activeTab)
    if (currentPart) {
      return {
        title: `Files in ${currentPart.label}`,
        description: 'Please manage files for this job',
      }
    }

    return {
      title: 'All Files',
      description: 'Please config all files',
    }
  }

  if (files.length === 0 && !uploadingFiles.length) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <FileUpload
          onFilesUploaded={handleFilesUploaded}
          onUploadProgress={setUploadingFiles}
          simulateProgress={false}
          existingFiles={files}
        />

        <>
          <Typography
            sx={{
              color: '#666',
              fontSize: '14px',
              mb: 2,
              textAlign: 'center',
            }}
          >
            - or -
          </Typography>
          <Button
            variant="outlined"
            onClick={onCreateOrderPart}
            sx={{
              width: 'fit-content',
              color: '#4489FE',
              borderColor: '#4489FE',
              textTransform: 'none',
              fontSize: '14px',
              px: 4,
              py: 1,
              minWidth: '160px',
              alignSelf: 'center',
              '&:hover': {
                borderColor: '#3371db',
                bgcolor: 'rgba(68, 137, 254, 0.04)',
              },
            }}
          >
            Create Job
          </Button>
        </>
      </Box>
    )
  }

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        multiple
        accept="audio/*,video/*,application/pdf,application/zip,application/x-zip-compressed,image/*"
      />
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          px: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: '24px', mb: 0.5, textAlign: 'center' }}>
            {renderHeaderContent().title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {renderHeaderContent().description}
          </Typography>
        </Box>
        {renderTopButtons()}
      </Box>

      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          mb: 3,
          height: 'calc(100vh - 380px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: isHovered ? '#DADCE0 #fff' : 'transparent transparent',
          transition: 'opacity 0.4s ease-in-out',
          '@media (max-width: 991px)': {
            height: 'auto',
            maxHeight: '500px',
          },
        }}
      >
        {Array.isArray(files) &&
          files.map((file, index) => (
            <Box
              onClick={(e) => {
                e.stopPropagation()
                handlePreviewClick(index)
              }}
              key={index}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: '10px 25px',
                bgcolor: checkedItems[index] || (onPreviewIndex === index && previewFile) ? '#E9F0FD' : 'transparent',
                '&:hover': {
                  bgcolor: '#E9F0FD',
                  '& .action-icon': {
                    visibility: 'visible',
                  },
                },
              }}
            >
              {activeTab !== 'configure-workflow' && (
                <Box
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Checkbox
                    size="small"
                    checked={checkedItems[index] || false}
                    onChange={(e) => {
                      handleCheckboxChange(index)
                    }}
                    sx={{
                      p: 0.5,
                      mr: 1.5,
                      color: '#212121',
                      '&.Mui-checked': {
                        color: '#1976d2',
                      },
                    }}
                  />
                </Box>
              )}

              <Box sx={{ flex: '1' }}>
                <Typography
                  sx={{
                    fontSize: '14px',

                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    overflow: 'hidden',
                    wordBreak: 'break-all',
                  }}
                >
                  {activeTab === 'configure-workflow' ? file?.fileName : file?.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ color: '#212121', fontSize: '14px', marginLeft: '15px' }}>{file.size}</Typography>
                {generalInformationFields?.resourceFileIds?.includes(file?.fileId) ? (
                  <Box
                    sx={{
                      bgcolor: '#4489FE',
                      color: '#fff',
                      fontSize: '14px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    Res
                  </Box>
                ) : (
                  <Box
                    sx={{
                      bgcolor: '#4489FE',
                      color: '#fff',
                      fontSize: '14px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      visibility: 'hidden',
                    }}
                  >
                    Res
                  </Box>
                )}
                <Box
                  className="action-icon"
                  onClick={(e) => handleActionClick(e, index, file)}
                  sx={{
                    cursor: 'pointer',
                    visibility:
                      checkedItems[index] || (Boolean(anchorEl) && selectedFileIndex === index) ? 'visible' : 'hidden',
                  }}
                >
                  <img src="/icons/actionIcon.svg" alt="action" />
                </Box>
              </Box>
            </Box>
          ))}

        {uploadingFiles.map(
          (fileObj, index) =>
            fileObj?.currentTab === activeTab && (
              <FileUpload.UploadingItem
                key={`uploading-${index}`}
                file={fileObj}
                onCancel={() => {
                  onCancel(fileObj?.name)
                }}
                onDelete={() => {
                  handleDeleteUploadingFile(fileObj?.file)
                }}
              />
            )
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 0.5,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              '& .MuiMenuItem-root': {
                fontSize: '14px',
                color: '#666',
                py: 1,
                px: 2,
                minWidth: '120px',
              },
            },
          }}
          MenuListProps={{
            sx: { py: 0.5 },
          }}
        >
          {activeTab !== 'general' && activeTab !== 'configure-workflow' && (
            <MenuItem onClick={handleMakeFileVisible}>Make File Visible</MenuItem>
          )}
          <MenuItem onClick={() => handleDelete(selectedFile)} sx={{ color: 'error.main' }}>
            Delete File
          </MenuItem>
          {activeTab !== 'configure-workflow' && (
            <>
              {!generalInformationFields?.resourceFileIds?.includes(selectedFile?.fileId) ? (
                <MenuItem
                  onClick={() => {
                    setGeneralInformationFields((prev) => ({
                      ...prev,
                      resourceFileIds: [...prev.resourceFileIds, selectedFile?.fileId],
                    }))
                    setOrderParts((prev) =>
                      prev.map((part) => {
                        if (part?.id === activeTab) {
                          const removedFile = part?.orderPartFiles?.filter(
                            (file) => file?.orderPartFile?.fileId === selectedFile?.fileId
                          )
                          setRemovedFile(removedFile)
                          return {
                            ...part,
                            orderPartFiles: part?.orderPartFiles?.filter(
                              (file) => file?.orderPartFile?.fileId !== selectedFile?.fileId
                            ),
                          }
                        }
                        return part
                      })
                    )
                    handleMenuClose()
                  }}
                >
                  Mark as Resource
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    setGeneralInformationFields((prev) => ({
                      ...prev,
                      resourceFileIds: prev.resourceFileIds.filter((id) => id !== selectedFile?.fileId),
                    }))

                    const getFileData = async () => {
                      try {
                        const orderDetails = await getOrderDetail(id)

                        if (!orderDetails) {
                          return
                        }

                        let fileFound = false

                        for (const part of orderDetails.orderParts || []) {
                          const fileInPart = part.orderPartFiles?.find(
                            (file) => file?.orderPartFile?.fileId === selectedFile?.fileId
                          )

                          if (fileInPart) {
                            setOrderParts((prev) =>
                              prev.map((p) => {
                                if (p.id === part.orderPartId) {
                                  const fileAlreadyExists = p.orderPartFiles?.some(
                                    (f) => f?.orderPartFile?.fileId === selectedFile?.fileId
                                  )

                                  if (!fileAlreadyExists) {
                                    return {
                                      ...p,
                                      orderPartFiles: [...(p.orderPartFiles || []), fileInPart],
                                    }
                                  }
                                }
                                return p
                              })
                            )

                            fileFound = true
                            break
                          }
                        }

                        if (!fileFound) {
                          console.error(`Could not find data for file ID: ${selectedFile?.fileId}`)
                        }
                      } catch (error) {
                        console.error('Error restoring file:', error)
                      }
                    }

                    getFileData()

                    handleMenuClose()
                  }}
                >
                  Remove Resource
                </MenuItem>
              )}
            </>
          )}
        </Menu>
      </Box>

      {renderBottomButtons()}
    </Box>
  )
}

export default FilesSection
