import { Close } from '@mui/icons-material'
import { Box, Button, LinearProgress, Typography } from '@mui/material'
import Image from 'next/image'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import theme from '@/theme/theme'
import { filesize } from 'filesize'
const UploadingItem = ({ file, onCancel, onDelete }) => {
  return (
    <Box sx={{ py: '10px', px: '25px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" color="textSecondary" sx={{ minWidth: '150px' }}>
          {file.name}
        </Typography>
        <Box sx={{ position: 'relative', height: 4, flex: 1 }}>
          <LinearProgress variant="determinate" value={file?.progress} />
        </Box>
        {file?.progress < 100 ? (
          <Box
            onClick={onCancel}
            sx={{
              cursor: 'pointer',
              padding: '4px',
              '&:hover': { opacity: 0.7 },
            }}
          >
            <Close sx={{ width: 16, height: 16 }} />
          </Box>
        ) : (
          <Box
            onClick={onDelete}
            sx={{
              cursor: 'pointer',
              padding: '4px',
              '&:hover': { opacity: 0.7 },
            }}
          >
            <Close sx={{ width: 16, height: 16 }} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

const FileUpload = ({ onFilesUploaded, onUploadProgress, existingFiles = [], simulateProgress = true }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const uniqueFiles = acceptedFiles.filter(
          (file) =>
            !existingFiles.some((existing) => existing.name === file.name && existing.size === filesize(file.size))
        )

        if (uniqueFiles.length === 0) {
          return
        }

        if (!simulateProgress) {
          onFilesUploaded(uniqueFiles)
          return
        }

        // First set up files with progress
        const filesWithProgress = uniqueFiles.map((file) => ({
          file,
          name: file.name,
          progress: 0,
          uploading: true,
        }))

        onUploadProgress(filesWithProgress)

        // Simulate progress over time
        const interval = 100 // ms between progress updates
        const increment = 5 // % to increment each time

        const simulateUpload = () => {
          let currentProgress = 0
          const progressInterval = setInterval(() => {
            currentProgress += increment

            // Update progress
            const updatedFiles = filesWithProgress.map((file) => ({
              ...file,
              progress: Math.min(currentProgress, 100),
            }))

            onUploadProgress(updatedFiles)

            // When complete
            if (currentProgress >= 100) {
              clearInterval(progressInterval)
              // Only call upload complete when progress is done
              onFilesUploaded(uniqueFiles)
            }
          }, interval)
        }

        simulateUpload()
      }
    },
    [onFilesUploaded, onUploadProgress, existingFiles, simulateProgress]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          flex: 1,
          border: '2px dashed ',
          borderColor: theme.palette.textBackgroundColors.neutral400,
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          '@media (max-width: 991px)': {
            padding: '40px 0px',
          },
        }}
      >
        <Box
          {...getRootProps()}
          sx={{
            width: '100%',
            height: '100%',
            py: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: theme.palette.textBackgroundColors.neutral50,
            },
          }}
        >
          <input {...getInputProps()} />
          <Image src={'/icons/file_upload.svg'} alt="" width={55} height={55} />
          <Typography
            variant="h3"
            sx={{
              mt: 1.5,
              mb: 2,
            }}
          >
            Choose a file or drag & drop it here
          </Typography>
          <Button
            variant="outlined"
            sx={{
              px: 5,
              py: 1,
            }}
          >
            Browse Files
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

FileUpload.UploadingItem = UploadingItem
export default FileUpload
