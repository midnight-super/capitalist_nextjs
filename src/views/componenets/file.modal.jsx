import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import CustomTooltip from './customTooltip';
import { downloadTranscriptionFile } from '@/services/event.service';

const FileModal = ({ data, open, close, status }) => {
  const [alertMessage, setAlertMessage] = useState(null)
  const handleView = () => {
    localStorage.removeItem('accessibilitySetting');
    localStorage.removeItem('languageSetting');
    const url = `/enduser/${data?.streamKey}/${data?.status}/${data?.meetingId}`;
    window.open(url, '_blank');
    close();
  };

  const handleDownloadTranscription = async () => {
    try {
      if (status === 'CANCELLED') {
        setAlertMessage('Transcript is not available for the cancel event.')
        return
      }
      const blob = await downloadTranscriptionFile(data.systemFile.fileId);

      // Ensure the file is a .docx
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Set the correct filename with .docx extension
      a.download = `${data.systemFile.fileId} transcription.docx`;

      // Append to document, trigger download, and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Release memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth="md"
        // scroll='body'
        onClose={close}
        sx={{ px: '12px' }}
        PaperProps={{
          sx: {
            width: '496px',
            height: alertMessage ? '270px' : '200px',
            boxShadow: 'none',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        disableScrollLock={true}
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            color: '#212121',
            p: '19px 18px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
          }}
        >
          {'Files and Downloads'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: '32px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: '19px' }}>
            <img src="/icons/youtube.svg" alt="youtube" />
            <Typography
              onClick={handleView}
              variant="body1"
              sx={{
                cursor: 'pointer',
                ml: '12px',
                borderBottom: '1px solid #212121',
              }}
            >
              LanguageStream Viewer
            </Typography>
          </Box>
          {data?.systemFile?.fileId && (
            <Box
              sx={{
                display: 'flex',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onClick={handleDownloadTranscription}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="/icons/machineIcon.svg" alt="youtube" />
                <Typography variant="body1" sx={{ ml: '12px' }}>
                  Initial Transcript
                </Typography>
              </Box>
              {/* {status !== 'COMPLETED_CAPTION' ? <CustomTooltip placement='top' arrow title={"Becomes available when the Event has been completed."}>
                            <img style={{ cursor: 'pointer', }} src='/icons/downloadFile.svg' alt='youtube' />
                        </CustomTooltip> :
                            <img src='/icons/downloadFile.svg' alt='youtube' />

                        } */}
              <img src="/icons/downloadFile.svg" alt="youtube" />
            </Box>
          )}
          {alertMessage && <Box
            sx={{
              mt: '19px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Alert sx={{ width: '100%' }} variant="filled" severity="error">
              {alertMessage}
            </Alert>
          </Box>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileModal;
