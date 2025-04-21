import Image from 'next/image'

import { CircularProgress, Stack } from '@mui/material'

export default function FallbackSpinner() {
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Image width={118} height={40} src="/icons/capitalLogo.svg" alt="logo" priority />
      <CircularProgress />
    </Stack>
  )
}
