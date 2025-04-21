import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useAuth } from '@/hooks/useAuth'
import FallbackSpinner from '@/components/spinner'

export default function GuestGuard({ children }) {
  const auth = useAuth()
  const router = useRouter()
  const isLoggedIn = !auth.loading && auth.user

  useEffect(() => {
    if (router.isReady && isLoggedIn) {
      // Public routes are meant for guests only.
      // If the user is logged in, they're not a guest, so
      // redirect to the home page.
      router.replace('/')
    }
  }, [router.route])

  // show spinner while auth and router are initializing
  return isLoggedIn ? <FallbackSpinner /> : <>{children}</>
}
