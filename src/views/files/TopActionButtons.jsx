import React from 'react'
import { Box, Button } from '@mui/material'
import { CloudDownload as DownloadIcon, Share as ShareIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export default function TopActionBar({ disabled, downloadSelectedFiles, setIsPreviewModalOpen, setIsShareModalOpen }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '60px',
      }}
    >
      <Button
        variant="outlined"
        disabled={disabled}
        startIcon={<ShareIcon />}
        onClick={() => setIsShareModalOpen(true)}
      >
        Share
      </Button>

      <Button variant="outlined" disabled={disabled} startIcon={<DownloadIcon />} onClick={downloadSelectedFiles}>
        Download
      </Button>

      <Button
        variant="outlined"
        disabled={disabled}
        startIcon={<VisibilityIcon />}
        onClick={() => setIsPreviewModalOpen(true)}
      >
        Preview
      </Button>
    </Box>
  )
}
