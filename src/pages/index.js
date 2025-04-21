import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Stack, Typography } from '@mui/material'

import { useAuth } from '@/hooks/useAuth'
import FallbackSpinner from '@/components/spinner'

export default function Home() {
  const auth = useAuth()
  const router = useRouter()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (router.isReady && auth.user) {
      const { role } = auth.user

      if (!role) {
        setError('You have not yet been assigned a role. Please contact your administrator.')
      } else {
        // TODO: Redirect admins to somewhere else?
        router.replace('/order-management/order-list')
      }
    }
  })

  return (
    <Stack sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <FallbackSpinner />
      )}
    </Stack>
  )
}
