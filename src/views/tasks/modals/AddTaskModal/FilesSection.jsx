import { Avatar, Box, Button, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import FileUpload from './FileUpload'
import { toast } from 'react-hot-toast'
import theme from '@/theme/theme'
import { HighlightOffOutlined } from '@mui/icons-material'
const FilesSection = ({
  files,
  uploadingFiles,
  setUploadingFiles,
  onFilesUploaded,
  onDeleteFile,
  onCancel,
  onClearAll,
}) => {
  const fileInputRef = useRef(null)

  const isDuplicateFile = (newFile) => {
    return files.some(
      (existingFile) =>
        existingFile.name === newFile.name && existingFile.size === `${Math.round(newFile.size / 1024)}KB`
    )
  }

  const handleUploadProgress = (selectedFiles) => {
    const uniqueFiles = selectedFiles.filter((file) => !isDuplicateFile(file))

    if (uniqueFiles.length === 0) {
      toast.error('Duplicate files detected')
      return
    }

    const filesWithProgress = uniqueFiles.map((file) => ({
      file,
      name: file.name,
      progress: 0,
      uploading: true,
    }))

    setUploadingFiles((prev) => [...prev, ...filesWithProgress])
    onFilesUploaded(uniqueFiles)
  }

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length > 0) {
      handleUploadProgress(selectedFiles)
    }
    event.target.value = ''
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedFile(null)
  }

  const handleDeleteUploadingFile = (file) => {
    if (file) {
      onDeleteFile(file)
      handleMenuClose()
    }
  }

  if (files.length === 0 && !uploadingFiles.length) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <FileUpload
          onFilesUploaded={handleUploadProgress}
          onUploadProgress={setUploadingFiles}
          simulateProgress={false}
          existingFiles={files}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ mb: '24px', borderRadius: 1, border: `1px solid ${theme.palette.textBackgroundColors.neutral75}` }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        multiple
        accept="audio/*,video/*,application/pdf,application/zip,image/*"
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={1}
        borderBottom={`1px solid ${theme.palette.textBackgroundColors.neutral75}`}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              width: 22,
              height: 22,
              fontSize: 12,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.common.white,
              mr: 1,
            }}
          >
            {files.length}
          </Avatar>
          <Typography variant="body2">Items</Typography>
        </Box>
        <Box>
          <Button
            onClick={() => onClearAll()}
            variant="text"
            sx={{ textTransform: 'none', textDecoration: 'underline', mr: 1 }}
          >
            Clear All
          </Button>
          <Button
            onClick={() => {
              fileInputRef.current?.click()
            }}
            variant="outlined"
            sx={{ textTransform: 'none', maxHeight: '35px', maxWidth: '105px' }}
          >
            + Add Files
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3, pt: 1 }}>
        {files.map((file, index) => (
          <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ my: 2, px: 3 }}>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => onDeleteFile(file)} sx={{ p: 0, mr: 1 }}>
                <HighlightOffOutlined />
              </IconButton>
              <Typography variant="body1" color="textSecondary">
                {file.name}
              </Typography>
            </Box>
            <Typography variant="body1" color="textSecondary">
              {file.size}
            </Typography>
          </Box>
        ))}

        {uploadingFiles.map((fileObj, index) => (
          <FileUpload.UploadingItem
            key={`uploading-${index}`}
            file={fileObj}
            onCancel={() => onCancel(fileObj?.name)}
            onDelete={() => handleDeleteUploadingFile(fileObj?.file)}
          />
        ))}
      </Box>
    </Box>
  )
}

export default FilesSection
