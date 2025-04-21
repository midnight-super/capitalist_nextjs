import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { Stack, Typography } from '@mui/material'

import { useAuth } from '@/hooks/useAuth'
import FallbackSpinner from '@/components/spinner'

export default function LogoutPage() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      console.log('Router ready. Logging out.')
      auth.logout()
    }
  })

  return (
    <Stack sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <FallbackSpinner />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Logging out...
      </Typography>
    </Stack>
  )
}

// Logout removes all auth state.
// Allow access without auth, in case there is an invalid auth config in local storage.
LogoutPage.allowGuest = true
LogoutPage.requireAuth = false
