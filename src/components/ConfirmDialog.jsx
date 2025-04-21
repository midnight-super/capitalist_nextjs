import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '400px',
          padding: '24px',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        '& .MuiTypography-root': {
          fontSize: '18px',
          fontWeight: 700,
          color: '#212121'
        }
      }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#666666' }}>
          {content}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '20px 24px', gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'capitalize',
            color: '#757575',
            border: '1px solid #DEE0E4',
            '&:hover': {
              border: '1px solid #DEE0E4',
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            textTransform: 'capitalize',
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 