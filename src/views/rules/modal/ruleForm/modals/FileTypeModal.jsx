import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Box, FormControl, TextField } from '@mui/material'
import AutoCompleteMenu from '@/components/customDropdown'

const FileTypeModal = ({ open, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState(null)
  const [customType, setCustomType] = useState('')

  const fileTypesList = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'csv',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'mp4',
    'mov',
    'avi',
    'mkv',
    'mp3',
    'wav',
    'zip',
    'rar',
    '7z',
    'json',
    'xml',
    'custom',
  ]

  const fileTypes = fileTypesList.map((ext) => ({
    value: ext,
    label: ext,
  }))

  const handleSelect = () => {
    if (selectedType?.value === 'custom') {
      onSelect(customType)
    } else {
      onSelect(selectedType?.value || '')
    }
    onClose()
  }

  useEffect(() => {
    if (!open) {
      setSelectedType(null)
      setCustomType('')
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select File Type</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 300, p: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <AutoCompleteMenu
              value={selectedType}
              setValue={setSelectedType}
              option={fileTypes}
              placeHolder="Select File Type"
              label="File Type"
              width="100%"
            />
          </FormControl>
          {selectedType?.value === 'custom' && (
            <TextField
              fullWidth
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              label="Custom File Type"
              sx={{ mb: 2 }}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSelect}
              disabled={!selectedType || (selectedType?.value === 'custom' && !customType)}
            >
              Select
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default FileTypeModal
