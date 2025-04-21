import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useRouter } from 'next/router'

import { Box, Button, Checkbox, Typography, FormControl, FormHelperText, useTheme } from '@mui/material'

import { useAuth } from '@/hooks/useAuth'
import CustomTextField from '@/components/customTextField'

const schema = yup.object().shape({
  username: yup.string().trim().required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default function LoginForm({ loading, setLoading, isMobile }) {
  const theme = useTheme()
  const auth = useAuth()
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const login = (data) => {
    const { username, password } = data
    setLoading(true)
    auth.login({ username, password }, ({ success, message }) => {
      if (success) {
        setLoading(false)
        toast.success(message || 'Logged In Successfully')
      } else {
        setLoading(false)
        toast.error(message)
        setError('username', {
          type: 'manual',
          message: 'Email or Password is invalid',
        })
      }
    })
  }

  return (
    <Box
      sx={{
        width: '100vw',
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? 3 : 0,
        filter: loading ? 'blur(5px)' : 'none',
      }}
    >
      <Typography variant="h1">Sign in to Capital Typing</Typography>
      <Typography variant="body1" sx={{ marginBottom: '42px' }}>
        Enter your details below
      </Typography>
      <FormControl fullWidth sx={{ mb: '34px' }}>
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomTextField
              error={Boolean(errors.username)}
              autoComplete="off"
              type={'username'}
              label={'E-mail'}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
      </FormControl>
      <FormControl fullWidth sx={{ mb: '12px' }}>
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomTextField
              error={Boolean(errors.password)}
              passwordShow={() => setIsPasswordVisible(!isPasswordVisible)}
              autoComplete="off"
              show={isPasswordVisible}
              type={'password'}
              label={'Password'}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
      </FormControl>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '54px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            disableRipple
            sx={{ m: 0, p: 0 }}
            icon={<img src="/icons/checkIcon.svg" alt="" />}
            checkedIcon={<img src="/icons/checkChecked.svg" alt="" />}
          />
          <Typography
            sx={{
              color: '#757575',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 'normal',
              ml: '12px',
            }}
          >
            Remember me
          </Typography>
        </Box>
        <Typography
          onClick={() => router.push('/forgot-password')}
          sx={{
            color: '#757575',
            fontSize: '13px',
            fontWeight: 400,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Forgot Password?
        </Typography>
      </Box>
      <Button onClick={handleSubmit(login)} variant="contained" color="primary" fullWidth>
        Sign In
      </Button>
    </Box>
  )
}
