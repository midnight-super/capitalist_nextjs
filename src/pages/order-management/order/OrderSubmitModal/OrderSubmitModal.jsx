import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import React from 'react'
import { CheckCircle } from '@mui/icons-material'
import { useRouter } from 'next/router'
const OrderSubmitModal = ({ show, setShow, onApprove, isLoading }) => {
  const router = useRouter()
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
            width: '650px',
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
          {'Order Added'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: '50px', pt: '30px', pb: '30px' }}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: '14px',
                mb: '20px',
              }}
            >
              <CheckCircle color="#29B77B" size={80} />
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
              The order has been submitted. <br />
              What would you like to do next?
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              mt: '24px',
            }}
          >
            <Button
              disabled={isLoading}
              variant="contained"
              onClick={() => onApprove('approve')}
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
                width: '45%',
                height: '50px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              Approve Order
            </Button>
            <Button
              disabled={isLoading}
              variant="contained"
              onClick={() => onApprove('approveAndConfigure')}
              sx={{
                borderRadius: '4px',
                textTransform: 'capitalize',
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 'normal',
                // padding: "10px 40px",
                width: '45%',
                height: '50px',
              }}
            >
              Approve & Configure Tasks
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              mt: '24px',
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
                border: '1px solid #29B77B',
                color: '#29B77B',
                boxShadow: 'none',
                // padding: "10px 40px",
                width: '90%',
                height: '50px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              Review & Edit Order
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: '24px', mt: '10px' }}>
            <Typography
              sx={{
                color: '#4489FE',
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 'normal',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => router.push('/order-management/order-list')}
            >
              Go to List of Orders
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OrderSubmitModal
