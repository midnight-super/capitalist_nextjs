import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material'
import AutoCompleteMenu from '@/components/customDropdown'
import { listDirectories } from '@/services/file.service'

const FolderNameModal = ({ open, onClose, onSelect }) => {
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchListDirectoryFolders = async () => {
    try {
      const params = {
        directoryId: 0,
      }

      const res = await listDirectories(params)
      if (res) {
        const folderNames = res?.folders.map((f) => f.directoryName)
        const folderList = [...new Set(folderNames)].map((fn) => ({ value: fn, label: fn }))
        setFolders(folderList)
      }
      setLoading(true)
    } catch (e) {
      console.log('fetchListDirectoryFolders error', e)
      setLoading(true)
    }
  }

  useEffect(() => {
    if (open) {
      fetchListDirectoryFolders()
    }
  }, [open])

  return (
    <Dialog open={open && loading} onClose={onClose}>
      <DialogTitle>Select Folder</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 300, p: 2 }}>
          <AutoCompleteMenu
            value={selectedFolder}
            setValue={setSelectedFolder}
            option={folders}
            placeHolder="Select Folder"
            label="Folder"
            width="100%"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onSelect(selectedFolder?.value || '')
                onClose()
              }}
              disabled={!selectedFolder}
            >
              Select
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default FolderNameModal
