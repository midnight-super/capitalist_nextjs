import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useAuth } from '@/hooks/useAuth'
import FallbackSpinner from '@/components/spinner'

export default function AuthGuard({ children }) {
  const auth = useAuth()
  const router = useRouter()
  const isLoading = !router.isReady || auth.loading
  const isLoggedIn = !auth.loading && auth.user

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      console.log('AuthGuard: user not logged in', auth.user)
      // Pages with an AuthGuard require authentication.
      // If the user is not logged in, redirect to the login page.
      router.replace('/login')
    }
  }, [router.route])

  return isLoading || !isLoggedIn ? <FallbackSpinner /> : <>{children}</>
}
