import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const UploadingItem = ({ file, onCancel, onDelete }) => {
  return (
    <Box
      sx={{
        py: '10px',
        px: '25px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: '#666',
            fontSize: '14px',
            minWidth: '150px',
          }}
        >
          {file.name}
        </Typography>

        <Box sx={{ position: 'relative', height: 4, flex: 1 }}>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #E3F2FD 50%, #F5F5F5 50%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              '@keyframes shimmer': {
                '0%': {
                  backgroundPosition: '100% 0',
                },
                '100%': {
                  backgroundPosition: '-100% 0',
                },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: `${file?.progress}%`,
              height: '100%',
              borderRadius: 2,
              bgcolor: '#4489FE',
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </Box>
        {file?.progress < 100 ? (
          <Box
            onClick={onCancel}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              '&:hover': {
                opacity: 0.7,
              },
            }}
          >
            <Image src={'/icons/close_icon.svg'} alt="" width={16} height={16} />
          </Box>
        ) : (
          <Box
            onClick={onDelete}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              '&:hover': {
                opacity: 0.7,
              },
            }}
          >
            <Image src={'/icons/close_icon.svg'} alt="" width={16} height={16} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

const FileUpload = ({ onFilesUploaded, onUploadProgress, simulateProgress = true, existingFiles = [] }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const uniqueFiles = acceptedFiles.filter(
          (file) =>
            !existingFiles.some(
              (existing) => existing.name === file.name && existing.size === `${Math.round(file.size / 1024)}KB`
            )
        )

        if (uniqueFiles.length === 0) {
          return
        }

        if (!simulateProgress) {
          onFilesUploaded(uniqueFiles)
          return
        }

        const filesWithProgress = uniqueFiles.map((file) => ({
          file,
          name: file.name,
          progress: 0,
          uploading: true,
        }))

        onUploadProgress(filesWithProgress)
      }
    },
    [onFilesUploaded, onUploadProgress, simulateProgress, existingFiles]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    },
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
          border: '2px dashed #D8D8D8',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#F9FBFF',
          mb: 4,
          // padding: '200px 20px',
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#F9FBFF',
            },
          }}
        >
          <input {...getInputProps()} />
          <Image src={'/icons/file_upload.svg'} alt="" width={55} height={55} />
          <Typography
            sx={{
              color: '#212121',
              fontSize: '16px',
              mt: 1.5,
              mb: 2,
            }}
          >
            Drag and drop Files Here to Upload
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#4489FE',
              color: '#fff',
              textTransform: 'none',
              fontSize: '14px',
              px: 5,
              py: 1,
              '&:hover': {
                bgcolor: '#3371db',
              },
            }}
          >
            Upload Files
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

FileUpload.UploadingItem = UploadingItem
export default FileUpload
