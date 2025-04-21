import React from 'react'

import { Stack, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import AppLayout from './AppLayout'

export default function Error({ error }) {
  return (
    <AppLayout>
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ErrorOutline fontSize="large" color="error" />
        <Typography variant="body1" color="error">
          Error: {error}
        </Typography>
      </Stack>
    </AppLayout>
  )
}
