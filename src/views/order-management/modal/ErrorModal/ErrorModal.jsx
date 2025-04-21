import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import React from 'react'
import { MdError } from 'react-icons/md'
const ErrorModal = ({ show, setShow, errorMessage }) => {
  return (
    <>
      <Dialog
        fullWidth
        open={show}
        maxWidth="lg"
        // onClose={() => setShow(false)}
        sx={{ px: '12px' }}
        PaperProps={{
          sx: {
            width: '600px',
            // height: '455px',
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
            fontSize: '22px',
            color: '#212121',
            pb: '19px !important',
            pt: '19px !important',
            px: '24px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            lineHeight: 'normal',
          }}
        >
          {'Error'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: '50px', pt: '0px', pb: '30px' }}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                mt: '4px',
                mb: '20px',
              }}
            >
              <MdError color="#ff3333" size={60} />
              <Typography
                sx={{
                  fontSize: '15px',
                  color: '#757575',
                }}
              >
                Please fix the error below
              </Typography>
            </Box>
            {errorMessage?.map((ele) => {
              return (
                <Typography
                  sx={{
                    textAlign: 'left',
                    color: '#212121',
                    fontWeight: 400,
                    lineHeight: '36px',
                    fontSize: '22px',
                  }}
                >
                  • {ele}
                </Typography>
              )
            })}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              mt: '15px',
              mb: '15px',
            }}
          >
            <Button
              variant="contained"
              onClick={() => setShow(false)}
              sx={{
                borderRadius: '4px',
                textTransform: 'capitalize',
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 'normal',
                backgroundColor: 'transparent',
                border: '1px solid #ff3333',
                color: '#ff3333',
                boxShadow: 'none',
                // padding: "10px 40px",
                width: '150px',
                height: '50px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              OK
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ErrorModal
