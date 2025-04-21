import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Grid2 as Grid,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const PasswordFields = ({
  control,
  errors,
  watch,
  hideConfirmPassword = false,
  setIsPasswordValid, // Prop to control form submission
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')
  const hasStartedTyping = password.length > 0

  const passwordRequirements = [
    { label: '8+ characters', test: (pwd) => pwd.length >= 8 },
    { label: 'Uppercase', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Lowercase', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Number', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Special (!@#$%^&*)', test: (pwd) => /[!@#$%^&*]/.test(pwd) },
  ]

  // Check if all password requirements are met
  const isPasswordValid = (pwd) => {
    return passwordRequirements.every((req) => req.test(pwd))
  }

  // Check if passwords match when confirm password is required
  const doPasswordsMatch = () => {
    if (hideConfirmPassword) return true
    return password === confirmPassword && confirmPassword !== ''
  }

  // Update parent component about password validity
  useEffect(() => {
    if (setIsPasswordValid) {
      const isValid = isPasswordValid(password) && doPasswordsMatch()
      setIsPasswordValid(isValid)
    }
  }, [password, confirmPassword, hideConfirmPassword, setIsPasswordValid])

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={hideConfirmPassword ? 12 : 6}>
          <FormControl fullWidth error={!!errors.password}>
            <TextField
              {...control.register('password')}
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password?.type === 'required' && <FormHelperText>Password is required</FormHelperText>}
          </FormControl>
        </Grid>

        {!hideConfirmPassword && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.confirmPassword}>
              <TextField
                {...control.register('confirmPassword')}
                label="Confirm Password *"
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.confirmPassword?.type === 'required' && (
                <FormHelperText>Confirm password is required</FormHelperText>
              )}
              {password && confirmPassword && !doPasswordsMatch() && (
                <FormHelperText error>Passwords must match</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          {hasStartedTyping && (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mt: 1,
                bgcolor: 'background.paper',
                p: 1,
                borderRadius: 1,
              }}
            >
              {passwordRequirements.map((req, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    minWidth: 'fit-content',
                  }}
                >
                  {req.test(password) ? (
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: '0.8rem' }} />
                  ) : (
                    <ErrorOutlineIcon color="error" sx={{ fontSize: '0.8rem' }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: req.test(password) ? 'success.main' : 'error.main',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {req.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default PasswordFields
