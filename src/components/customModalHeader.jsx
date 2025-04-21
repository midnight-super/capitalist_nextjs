import { DialogTitle, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close' // If you're okay using MUI icons

const ModalHeader = ({ title, onClose }) => (
  <DialogTitle
    sx={{
      pl: '43px',
      pr: '16px',
      py: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Typography component="div" variant="h2">
      <b>{title}</b>
    </Typography>
    <IconButton onClick={onClose} color="primary" size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>
)

export default ModalHeader
