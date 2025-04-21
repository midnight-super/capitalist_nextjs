import React from 'react'

import { Box, IconButton, Tooltip } from '@mui/material'
import { CloudDownload, Share, Visibility } from '@mui/icons-material'

export default function IconActionButtons({
  disabled,
  downloadSelectedFiles,
  setIsPreviewModalOpen,
  setIsShareModalOpen,
}) {
  // Need to wrap IconButtons in spans, so the tooltip won't complain when they are disabled.
  return (
    <Box>
      <Tooltip title="Share File">
        <span>
          <IconButton aria-label="Share File" disabled={disabled} onClick={() => setIsShareModalOpen(true)}>
            <Share />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Download File">
        <span>
          <IconButton aria-label="Download File" disabled={disabled} onClick={downloadSelectedFiles}>
            <CloudDownload />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Preview File">
        <span>
          <IconButton aria-label="Preview File" disabled={disabled} onClick={() => setIsPreviewModalOpen(true)}>
            <Visibility />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}
