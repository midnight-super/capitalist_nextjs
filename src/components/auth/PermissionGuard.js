import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useAuth } from '@/hooks/useAuth'
import FallbackSpinner from '@/components/spinner'
import ErrorPage from '@/components/layout/Error'

export default function PermissionGuard({ children, permissions }) {
  const auth = useAuth()
  const router = useRouter()
  const isLoading = !router.isReady || auth.loading
  const [hasPermissions, setHasPermissions] = useState(false)

  function checkPermissions() {
    // Check that the user has every permission required for the guarded children.
    return permissions.every((permission) => {
      const [resource, action] = permission.toLowerCase().split('.')
      // Encode page the permission into auth permission attribute names.
      const authResource = `p_${resource}`
      const authAction = 'permission' + action[0].toUpperCase() + action.slice(1)

      // Check if the resource is defined and if the specific permission is enabled.
      // Example: ['files.read'] checks for {'p_files': {'permissionRead': true}}
      return auth.user.permissions[authResource] && auth.user.permissions[authResource][authAction]
    })
  }
  useEffect(() => {
    if (!isLoading) {
      if (auth.user) {
        setHasPermissions(checkPermissions())
      } else {
        // Pages with a PermissionsGuard require authentication.
        // If the user is not logged in, redirect to the login page.
        console.log('PermissionGuard: user not logged in')
        router.replace('/login')
      }
    }
  }, [auth.user, isLoading])

  return isLoading ? (
    <FallbackSpinner />
  ) : hasPermissions ? (
    <>{children}</>
  ) : (
    <ErrorPage error="You do not have permission to view this page. Please talk to your administrator to request access." />
  )
}
