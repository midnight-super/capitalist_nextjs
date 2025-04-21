import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
  useTheme,
} from '@mui/material'

import FlagIcon from '@/menu-icons/flag'
import { addTagToFiles, removeTagFromFiles } from '@/services/file.service'
import { getFlagFromTag, getTagFromFlag } from '@/utils'

export default function AddFlagModal({ open, close, file, patchFile }) {
  const theme = useTheme()
  const { customTags, fileId } = file
  // Files are not supposed to have multiple flag tags, so only get the first one.
  const flagTag = customTags?.find((tag) => tag.startsWith('flag_'))
  const existingFlag = getFlagFromTag(flagTag)
  const actionLabel = existingFlag ? 'Update' : 'Add'
  const [flagColor, setFlagColor] = useState(existingFlag?.color || 'red')
  const [flagNote, setFlagNote] = useState(existingFlag?.note || '')
  const [flagNoteLabel, setFlagNoteLabel] = useState('Short Flag Note (no more than 30 characters)')
  const [flagNoteError, setFlagNoteError] = useState('')

  function onFlagNoteChange({ target: { value } }) {
    setFlagNote(value)
    setFlagNoteLabel(
      value.length > 0
        ? `Short Flag Note (${value.length} of 30 characters)`
        : 'Short Flag Note (no more than 30 characters)'
    )
    setFlagNoteError(value.length > 30 ? 'Flag note cannot exceed 30 characters' : '')
  }

  async function onSubmit(values) {
    if (!/^[a-zA-Z0-9 ]+$/.test(flagNote)) {
      setFlagNoteError('Please only use letters, numbers, and spaces for the flag note.')
      return
    }

    if (flagNote.length > 30) {
      setFlagNoteError('Flag note cannot exceed 30 characters')
      return
    }

    const newFlag = getTagFromFlag({ color: flagColor, note: flagNote })

    await addTagToFiles([fileId], newFlag)

    if (existingFlag) {
      // Files are not supposed to have multiple flag tags.
      const existingTag = getTagFromFlag(existingFlag)
      const updatedTags = file.customTags.filter((tag) => tag !== existingTag)

      // Remove the old flag tag, if it exists.
      await removeTagFromFiles([fileId], existingTag)

      // remove the old flag tag from the local file object
      patchFile({ fileId, customTags: [...updatedTags, newFlag] })
    } else {
      // If the file did not have a flag tag, just add the new one.
      patchFile({ fileId, customTags: [...customTags, newFlag] })
    }

    setFlagNoteError('')
    close()
  }

  return (
    <Dialog open={open} onClose={close} fullWidth disableScrollLock={true}>
      <DialogTitle>{actionLabel} Flag</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: 150 }}>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="Flag color"
            value={flagColor}
            onChange={(event) => {
              setFlagColor(event.target.value)
            }}
          >
            {Object.keys(theme.palette.flags).map((color) => (
              <FormControlLabel
                key={color}
                value={color}
                control={<Radio />}
                label={<FlagIcon color={theme.palette.flags[color]} />}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl>
          <TextField value={flagNote} label={flagNoteLabel} onChange={onFlagNoteChange} error={flagNoteError > ''} />
          {flagNoteError && <FormHelperText sx={{ color: 'error.main' }}>{flagNoteError}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button variant="outlined" onClick={close}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          {actionLabel} Flag
        </Button>
      </DialogActions>
    </Dialog>
  )
}
