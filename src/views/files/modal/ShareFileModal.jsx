import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'

import { getFileShareId } from '@/services/file.service'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL

const ShareFileModal = ({ open, close, files }) => {
  const fileId = files[0]?.id
  const [linkType, setLinkType] = useState('public')
  const [shareLink, setShareLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function copyLinkToClipboard() {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        toast.success('Copied share link to clipboard.', {
          position: 'top-right',
          duration: 2000,
        })
      })
      .catch((error) => {
        console.error('Failed to copy share link: ', error)
        toast.error('Failed to copy share link to clipboard.', {
          position: 'top-right',
          duration: 2000,
        })
      })
  }

  function onChangeLinkType(event) {
    setLinkType(event.target.value)
  }

  useEffect(() => {
    setLoading(true)
    getFileShareId(files.map((f) => f.id))
      .then(({ data: shareId }) => {
        console.log('shareId', shareId)
        if (linkType === 'public') {
          setShareLink(`${siteURL}/public/files/${shareId}`)
        } else {
          setShareLink(`${siteURL}/public/files/${shareId}?token=${localStorage.getItem('accessToken')}`)
        }
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [linkType])

  return (
    <Dialog open={open} onClose={close} fullWidth disableScrollLock={true}>
      <DialogTitle>Sharing {files.length} Files</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: 150 }}>
        <TextField id="share-link" disabled value={shareLink} loading={loading} />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={linkType}
            onChange={onChangeLinkType}
          >
            <FormControlLabel value="public" control={<Radio />} label="Public" />
            <FormControlLabel value="restricted" control={<Radio />} label="Restricted" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button variant="outlined" onClick={close}>
          Cancel
        </Button>
        <Button variant="contained" onClick={copyLinkToClipboard}>
          Copy Link
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareFileModal
