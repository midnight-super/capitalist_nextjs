'use client' // Error boundaries must be Client Components

import React, { useEffect } from 'react'
import { Button, Stack, Typography } from '@mui/material'

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Stack>
      <Typography variant="h2" component="h2" gutterBottom>
        Something went wrong
      </Typography>
      <Button variant="contained" onClick={() => reset()}>
        Try again
      </Button>
    </Stack>
  )
}

ErrorBoundary.allowGuest = true
ErrorBoundary.requireAuth = false
