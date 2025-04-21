import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Link } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export default function PreviewModal({ open, close, files }) {
  const [index, setIndex] = useState(0)
  const total = files.length
  const file = files[index] || {}
  const accessToken = localStorage.getItem('accessToken') || ''
  const url = `${baseURL}/restricted/preview/${file.id}?token=${accessToken}`
  const isImage = file.mediaType === 'image/jpeg' || file.mediaType === 'image/png'
  const isVideo = file.mediaType === 'video/mp4' || file.mediaType === 'VIDEO'
  const isAudio = file.mediaType === 'audio/mpeg' || file.mediaType === 'AUDIO'
  const isPdf = file.mediaType === 'application/pdf'
  const isNotSupported = !isImage && !isVideo && !isAudio && !isPdf

  function onPrevious() {
    setIndex(Math.max(index - 1, 0))
  }

  function onNext() {
    setIndex(Math.min(index + 1, files.length - 1))
  }

  return (
    <>
      <Dialog open={open} onClose={close} fullWidth>
        <DialogTitle>
          Previewing {`${index + 1} of ${total}:`}{' '}
          <Link href={url} target="_blank">
            {file.fileName}
          </Link>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
          {isImage && <img src={url} alt={file.fileName} style={{ width: '100%', height: 'auto' }} />}
          {isAudio && <audio src={url} controls />}
          {isVideo && <video src={url} controls style={{ width: '100%', height: 'auto' }} />}
          {isPdf && <iframe src={url} width="100%" height="600px" />}
          {isNotSupported && (
            <Typography>
              {file.fileName} is a {file.mediaType} file and cannot be previewed.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="outlined" disabled={index <= 0} startIcon={<ArrowBackIos />} onClick={onPrevious}>
            Previous
          </Button>
          <Button variant="outlined" onClick={close}>
            Close
          </Button>
          <Button
            variant="outlined"
            disabled={index >= files.length - 1}
            endIcon={<ArrowForwardIos />}
            onClick={onNext}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
