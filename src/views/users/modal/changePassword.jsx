import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomTextField from '@/components/customTextField'
import { resetPassword } from '@/services/client.service'
import toast from 'react-hot-toast'

import WarningModal from '@/views/componenets/warningModal'

const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'
const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'

const generatePassword = () => {
  const hasConsecutiveChars = (password) => {
    for (let i = 0; i < password.length - 3; i++) {
      const substring = password.slice(i, i + 4)
      if (/^[a-zA-Z0-9]+$/.test(substring)) {
        const sorted = substring.split('').sort().join('')
        if (sorted === substring) return true
      }
    }
    return false
  }

  const createValidPassword = () => {
    // Randomly determine the password length (between 8 and 15)
    const passwordLength = Math.floor(Math.random() * (15 - 8 + 1)) + 8

    let passwordArray = []

    // Ensure at least one character from each required type
    passwordArray.push(upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)])
    passwordArray.push(lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)])
    passwordArray.push(numbers[Math.floor(Math.random() * numbers.length)])
    passwordArray.push(specialChars[Math.floor(Math.random() * specialChars.length)])

    // Fill remaining slots with random characters from all types
    const allChars = upperCaseLetters + lowerCaseLetters + numbers + specialChars
    while (passwordArray.length < passwordLength) {
      passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)])
    }

    // Shuffle the array to ensure randomness
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]
    }

    const password = passwordArray.join('')

    // Validate: Ensure all required types are still present
    const containsUpperCase = /[A-Z]/.test(password)
    const containsLowerCase = /[a-z]/.test(password)
    const containsNumber = /[0-9]/.test(password)
    const containsSpecialChar = /[!@#$%^&*()\-=+[\]{}|;:,.<>?]/.test(password)

    if (
      !containsUpperCase ||
      !containsLowerCase ||
      !containsNumber ||
      !containsSpecialChar ||
      hasConsecutiveChars(password)
    ) {
      return createValidPassword() // Retry generation
    }

    return password
  }

  return createValidPassword()
}

const ChangePassword = ({ open, close, selectedItem }) => {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordTouched, setIsPasswordTouched] = useState(false)
  const [error, setError] = useState('')
  const [warningOpen, setWarningModal] = useState(false)
  const openWarningModal = () => {
    setWarningModal(true)
  }
  const [randomPassword, setRandomPassword] = useState(null)
  useEffect(() => {
    const final = generatePassword()
    setRandomPassword(final)
  }, [])
  const schema = yup.object().shape({
    newPassword: yup.string().required('New Password is required'),
    confirmPassword: yup.string().required('Confirm Password is required'),
  })

  const defaultValues = {
    newPassword: null,
    confirmPassword: null,
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

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

  const handleSuggestedPassword = () => {
    setPassword(randomPassword)
    setConfirmPassword(randomPassword)
    setValue('newPassword', randomPassword)
    setValue('confirmPassword', randomPassword)
  }

  const submitData = async () => {
    if (password && isPasswordTouched && !isPasswordValid) {
      return
    } else {
      const staffId = selectedItem
      setLoading(true)
      const res = await resetPassword(staffId, password)
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Password Update Successfully.')
        setLoading(false)
        close()
      } else {
        toast.error('Unable to update password.')
        setLoading(false)
      }
    }
  }

  const hanndleWarningClose = () => {
    setWarningModal(false)
    close()
  }
  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={openWarningModal}
        sx={{ px: '12px' }}
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: '586px',
            minHeight: '320px',
            maxHeight: '100%',
            boxShadow: 'none',
            position: 'relative',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        disableScrollLock
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            color: '#212121',
            py: '19px !important',
            px: '43px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 700,
          }}
        >
          {'Generate New Password'}
          <span onClick={close} style={{ cursor: 'pointer' }}>
            <img src="/icons/closeIcon.svg" alt="close" />
          </span>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: '34px 43px', height: '100%' }}>
          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0, // Full height and width
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional: add a semi-transparent background
              }}
            >
              <CircularProgress />
            </div>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: '20px',
            }}
          >
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: '#212121',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                Suggested Password:
              </Typography>
              <Box sx={{ ml: 1 }}>
                <Typography
                  component="span"
                  sx={{
                    color: '#4489FE',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}
                >
                  {randomPassword}
                </Typography>
              </Box>
            </Typography>

            <Box>
              <Button
                onClick={handleSuggestedPassword}
                variant="text"
                sx={{
                  width: '100%',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#4489FE',
                  textTransform: 'capitalize',
                  height: '44px',
                }}
              >
                {'Use Suggested Password'}
              </Button>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(submitData)}>
            <Box sx={{ filter: loading ? 'blur(5px)' : 'none' }}>
              <Box sx={{ p: 0 }}>
                <Grid container spacing={1} sx={{ m: 0, p: 0 }}>
                  <Grid
                    size={12}
                    sx={{
                      height: password && isPasswordTouched && !isPasswordValid ? '280px' : '90px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Controller
                        name="newPassword"
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
                            onChange={(e) => {
                              setPassword(e.target.value), onChange(e.target.value)
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <Typography sx={{ height: '30px' }}>
                      {errors.newPassword && (
                        <FormHelperText sx={{ color: '#EF4444' }}>{errors.newPassword.message}</FormHelperText>
                      )}
                    </Typography>

                    {password && isPasswordTouched && !isPasswordValid && (
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
                              validationStatus.hasConsecutiveChars && validationStatus.hasKeyboardPattern
                                ? '#2BA64A'
                                : '#EF4444',
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
                  </Grid>
                  <Grid
                    size={12}
                    sx={{
                      height: '90px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Controller
                        name="confirmPassword"
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
                            onChange={(e) => {
                              setConfirmPassword(e.target.value), onChange(e.target.value)
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <Typography sx={{ height: errors.confirmPassword ? '30px' : '0px' }}>
                      {errors.confirmPassword && (
                        <FormHelperText sx={{ color: '#EF4444' }}>{errors.confirmPassword.message}</FormHelperText>
                      )}
                    </Typography>
                    <Typography sx={{ height: '30px' }}>
                      {error && (
                        <FormHelperText sx={{ color: '#EF4444' }}>
                          <span> {error}</span>
                        </FormHelperText>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'capitalize',
                    width: '200px',
                    color: '#757575',
                    height: '44px',
                    borderRadius: '4px',
                    border: '1px solid #DEE0E4',
                    fontWeight: 700,
                    lineHeight: 'normal',
                  }}
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: '200px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'white',
                    textTransform: 'capitalize',
                    height: '44px',
                  }}
                >
                  {'Change Password'}
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={hanndleWarningClose} />
      )}
    </>
  )
}

export default ChangePassword
