import React, { useState } from 'react'
import Image from 'next/image'
import { Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import LoginForm from './LoginForm'

const LoginPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [loading, setLoading] = useState(false)

  const LeftPanel = () => (
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
  )

  const RightPanel = ({ children }) => (
    <Box
      sx={{
        flex: isMobile ? 'none' : 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        position: 'relative',
      }}
    >
      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <CircularProgress />
        </div>
      )}
      {children}
    </Box>
  )

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
      {!isMobile && <LeftPanel />}
      <RightPanel>
        <LoginForm
          {...{
            loading,
            setLoading,
            isMobile,
          }}
        />
      </RightPanel>
    </Box>
  )
}
LoginPage.guestGuard = true
export default LoginPage
