import AppLayout from '@/components/layout/AppLayout'
import theme from '../theme/theme'
import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import ReactHotToast from '@/styles/lib'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import { AuthProvider } from '@/context/AuthContext'

import AuthGuard from '@/components/auth/AuthGuard'
import GuestGuard from '@/components/auth/GuestGuard'
import PermissionGuard from '@/components/auth/PermissionGuard'

const Guard = ({ children, allowGuest, requireAuth, permissions }) => {
  if (permissions) {
    return <PermissionGuard permissions={permissions}>{children}</PermissionGuard>
  }

  if (requireAuth) {
    return <AuthGuard>{children}</AuthGuard>
  }

  if (allowGuest) {
    return <GuestGuard>{children}</GuestGuard>
  }

  return <>{children}</>
}

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>)

  // console.log('App Layout => Component', Component.name)
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
            <title>Capital Typing</title>
            <meta name="description" content="Capital Typing Software" />
          </Head>
          <ReactHotToast>
            <Toaster position="top-center" toastOptions={{ className: 'react-hot-toast' }} />
          </ReactHotToast>
          <Guard
            // default all pages to require auth, unless explicitly disabled
            requireAuth={Component.requireAuth ?? true}
            allowGuest={Component.allowGuest}
            permissions={Component.permissions}
          >
            {getLayout(<Component {...pageProps} />)}
          </Guard>
        </ThemeProvider>
      </AuthProvider>
    </LocalizationProvider>
  )
}
