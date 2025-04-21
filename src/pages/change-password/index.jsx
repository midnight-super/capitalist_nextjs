import CustomTextField from '@/components/customTextField'
import { Box, Button, FormControl, Typography } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

export default function ChangePassword() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmall = useMediaQuery('(max-width:1400px)')

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordTouched, setIsPasswordTouched] = useState(false)
  const [error, setError] = useState('')

  const handleSend = () => {
    router.push('/login')
  }

  const validatePassword = () => {
    const hasEightChars = password.length >= 8
    const hasNumber = /[0-9]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasConsecutiveChars = /(.)\1\1\1/.test(password)
    const hasKeyboardPattern =
      /(1234|2345|3456|4567|5678|6789|7890|asdf|qwer|zxcv|abcd|bcde|cdef|defg|ghij|ijkl|klmn|mnop|opqr|pqrs|rstu|stuv|tuvw|uvwx|wxyz)/i.test(
        password
      ) // Checks for 4 or more consecutive keyboard patterns.

    return {
      hasEightChars,
      hasNumber,
      hasUppercase,
      hasLowercase,
      hasConsecutiveChars: !hasConsecutiveChars,
      hasKeyboardPattern: !hasKeyboardPattern,
    }
  }

  const validationStatus = validatePassword()

  useEffect(() => {
    if (password) {
      setIsPasswordTouched(true)
    }
  }, [password])

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleToggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const isPasswordValid = Object.values(validationStatus).every(Boolean)

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Confirm password does not match')
    } else {
      setError('')
    }
  }, [confirmPassword, password])

  const submitData = (data) => {
    handleSend()
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            flex: 'none',
            width: 475,
            height: '100vh',
            backgroundImage: 'url("/icons/login-image.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '42px 52px',
          }}
        >
          <Image width={118} height={40} src="/icons/loginLogo.svg" alt="logo" />
        </Box>
      )}

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
            width: '100%',
            maxWidth: '450px',
            display: 'flex',
            flexDirection: 'column',
            // mr: !isMobile ? "40px" : 0,
            position: 'relative',
            p: isMobile && 3,
          }}
        >
          <Typography
            sx={{
              color: '#212121',
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: '32px',
              mb: '10px',
            }}
          >
            Change your password
          </Typography>
          <Typography
            sx={{
              color: '#757575',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              mb: '42px',
            }}
          >
            Enter a new password below to change your password
          </Typography>
          <FormControl fullWidth sx={{ mb: '40px' }}>
            <Controller
              name="newPass"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <CustomTextField
                  type={'password'}
                  label={'New Password'}
                  value={password}
                  passwordShow={handleToggleVisibility}
                  show={isPasswordVisible}
                  isPasswordValid={isPasswordValid}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Controller
              name="confirmPass"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <CustomTextField
                  type={'password'}
                  label={'Confirm New Password'}
                  value={confirmPassword}
                  passwordShow={handleToggleVisibility}
                  show={isPasswordVisible}
                  isPasswordValid={confirmPassword === password && confirmPassword !== ''}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}
            />
          </FormControl>
          <Typography sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            {error && (
              <Typography
                sx={{
                  color: '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                <img src="/icons/errorCross.svg" style={{ paddingRight: '2px' }} />
                <span> {error}</span>
              </Typography>
            )}
          </Typography>
          {password && isSmall && isPasswordTouched && !isPasswordValid && (
            <Box
              sx={{
                marginTop: '0px',
                backgroundColor: '#FFFF',
                padding: '12px',
                borderRadius: '4px',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                sx={{
                  color: '#757575',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: 'normal',
                  pb: '12px',
                }}
              >
                Password must include at least:
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasEightChars ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasEightChars ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}{' '}
                {'8 characters'}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasNumber ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasNumber ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}{' '}
                {'1 number'}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasUppercase ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasUppercase ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}
                {'1 uppercase letter'}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasLowercase ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasLowercase ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}{' '}
                {'1 lowercase letter'}
              </Typography>

              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#757575',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: 'normal',
                  p: '10px 0px 8px 0px',
                }}
              >
                Password must not include:
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color:
                    validationStatus.hasConsecutiveChars && validationStatus.hasKeyboardPattern ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasConsecutiveChars && validationStatus.hasKeyboardPattern ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}
                {`4 or more consecutive characters (e.g. "11111", "12345", "qwert")`}
              </Typography>
            </Box>
          )}
          <Button
            onClick={handleSend}
            variant="contained"
            fullWidth
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              textTransform: 'capitalize',
              height: '44px',

              mt: password && isSmall && isPasswordTouched && !isPasswordValid && '40px',
            }}
          >
            Change Password
          </Button>

          {password && !isSmall && isPasswordTouched && !isPasswordValid && (
            <Box
              sx={{
                position: 'absolute',
                top: 110,
                right: -242,
                backgroundColor: '#FFFF',
                padding: '12px',
                width: '230px',
                height: '210px',
                borderRadius: '4px',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#757575',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: 'normal',
                  pb: '12px',
                }}
              >
                Password must include at least:
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasEightChars ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasEightChars ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}{' '}
                {'8 characters'}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasNumber ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasNumber ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}{' '}
                {'1 number'}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasUppercase ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasUppercase ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}
                {'1 uppercase letter'}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: validationStatus.hasLowercase ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasLowercase ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}{' '}
                {'1 lowercase letter'}
              </Typography>

              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#757575',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: 'normal',
                  p: '10px 0px 8px 0px',
                }}
              >
                Password must not include:
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color:
                    validationStatus.hasConsecutiveChars && validationStatus.hasKeyboardPattern ? '#2BA64A' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {validationStatus.hasConsecutiveChars && validationStatus.hasKeyboardPattern ? (
                  <img src="/icons/greenTick.svg" style={{ paddingRight: '4px' }} />
                ) : (
                  <img src="/icons/errorCross.svg" style={{ paddingRight: '4px' }} />
                )}
                {`4 or more consecutive characters (e.g. "11111", "12345", "qwert")`}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

ChangePassword.allowGuest = true
ChangePassword.requireAuth = false
