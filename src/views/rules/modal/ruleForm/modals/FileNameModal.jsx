import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material'
import AutoCompleteMenu from '@/components/customDropdown'
import { listDirectoryFiles } from '@/services/file.service'

const FileNameModal = ({ open, onClose, onSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchListDirectoryFiles = async () => {
    try {
      const params = {
        directoryId: 0,
        page: 0,
        pageSize: 50,
        sortBy: 'createdAt',
        isDesc: true,
        isSearch: false,
      }

      const res = await listDirectoryFiles(params, [])
      if (res) {
        const fileNames = res.data.map((f) => f.fileName)
        const fileList = [...new Set(fileNames)].map((fn) => ({ value: fn, label: fn }))
        setFiles(fileList)
      }
      setLoading(true)
    } catch (e) {
      console.log('fetchListDirectoryFiles error', e)
      setLoading(true)
    }
  }

  useEffect(() => {
    if (open) {
      fetchListDirectoryFiles()
    }
  }, [open])

  return (
    <Dialog open={open && loading} onClose={onClose}>
      <DialogTitle>Select File</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 300, p: 2 }}>
          <AutoCompleteMenu
            value={selectedFile}
            setValue={setSelectedFile}
            option={files}
            placeHolder="Select File"
            label="File"
            width="100%"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onSelect(selectedFile?.value || '')
                onClose()
              }}
              disabled={!selectedFile}
            >
              Select
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default FileNameModal
