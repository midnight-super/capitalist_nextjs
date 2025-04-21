import React from 'react'
import Image from 'next/image'
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'

export default function PublicPortalLayout({ children }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Stack sx={{ padding: isMobile ? 2 : 4 }} spacing={isMobile ? 2 : 4}>
      <Image width={118} height={40} src="/icons/capitalLogo.svg" alt="logo" priority />
      <Box component="main">{children}</Box>
    </Stack>
  )
}
