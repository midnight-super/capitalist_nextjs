import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
} from '@mui/material';

const SuccessModal = ({ 
  open, 
  onClose, 
  title = "Success", 
  message, 
  buttonText = "Got it" 
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '400px',
          padding: '24px',
          textAlign: 'center',
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
        <Typography sx={{ mb: 3, color: '#666666' }}>
          {message}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={onClose}
          sx={{
            textTransform: 'none',
            height: '48px',
            backgroundColor: '#4489FE',
            '&:hover': {
              backgroundColor: '#4489FE',
            }
          }}
        >
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal; 