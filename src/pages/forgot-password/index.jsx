import Image from 'next/image'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { Box, Button, Typography, FormControl, useTheme, useMediaQuery } from '@mui/material'
import CustomTextField from '@/components/customTextField'
export default function ForgotPassword() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) // Mobile and tablet check
  const {
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  const handleBack = () => {
    router.push('/login')
  }

  const handleSend = () => {
    router.push('/change-password')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: !isMobile && 'row',
        height: '100vh',
        width: '100vw',
        justifyContent: isMobile && 'center',
      }}
    >
      {/* Left Panel */}
      {!isMobile && (
        <Box
          sx={{
            flex: 'none', // Prevents it from stretching
            width: 475, // Set fixed width
            height: '100vh', // Full height
            backgroundImage: 'url("/icons/login-image.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '42px 52px',
          }}
        >
          <Image width={118} height={40} src="/icons/loginLogo.svg" alt="logo" />
        </Box>
      )}

      {/* Right Panel */}

      <Box
        sx={{
          flex: isMobile ? 'none' : 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Box
          sx={{
            width: '100vw',
            maxWidth: '450px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            p: isMobile && 3,
          }}
        >
          <Box sx={{ position: 'absolute', left: isMobile ? 20 : 0, top: -193 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                cursor: 'pointer',
                gap: '10px',
              }}
              onClick={handleBack}
            >
              <img height={24} width={24} src="/icons/backIcon.svg" alt="" />
              <Typography sx={{ color: '#757575', fontWeight: 400, fontSize: '14px' }}>Back</Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mb: '10px' }}>
            Forgot password
          </Typography>
          <Typography variant="body1" sx={{ mb: '42px' }}>
            Enter your email address to send instructions to reset your password to your email
          </Typography>
          <FormControl fullWidth sx={{ mb: '34px' }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField type={'email'} label={'E-mail'} value={value} onChange={onChange} />
              )}
            />
          </FormControl>
          <Button onClick={handleSend} variant="contained" fullWidth>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

// allow access without login
ForgotPassword.requireAuth = false
ForgotPassword.allowGuest = true
