import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import React from 'react'
import { MdError } from 'react-icons/md'
import { useRouter } from 'next/router'
import { IoIosWarning } from 'react-icons/io'
const WarningModal = ({ show, setShow, serviceData, handleServiceSelect }) => {
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
          {'Warning'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: '50px', pt: '10px', pb: '30px' }}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: '0px',
                mb: '10px',
              }}
            >
              <IoIosWarning color="ffd700" size={80} />
            </Box>
            <Typography
              sx={{
                textAlign: 'center',
                color: '#212121',
                fontWeight: 400,
                lineHeight: '36px',
                fontSize: '22px',
              }}
            >
              Are you sure you want to change the service?
            </Typography>
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
                border: '1px solid #4489FE',
                color: '#4489FE',
                boxShadow: 'none',
                // padding: "10px 40px",
                width: '150px',
                height: '50px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleServiceSelect(serviceData)
                setShow(false)
              }}
              sx={{
                borderRadius: '4px',
                textTransform: 'capitalize',
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 'normal',
                backgroundColor: '#4489FE',
                border: '1px solid #4489FE',
                color: '#fff',
                boxShadow: 'none',
                // padding: "10px 40px",
                width: '150px',
                height: '50px',
                '&:hover': {
                  backgroundColor: '#4489FE',
                },
              }}
            >
              Yes
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WarningModal
