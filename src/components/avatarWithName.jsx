import React from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import { stringToColor } from '@/utils'

export default function AvatarWithName({ name, profileUrl, children, compact }) {
  const parts = `${name}`.split(' ')
  const firstName = parts[0]
  const lastName = parts[1] || ' '
  const bgcolor = stringToColor(name)
  if (compact) {
    return (
      <Avatar
        alt={name}
        src={profileUrl}
        variant="circular"
        sx={{
          height: 48,
          width: 48,
          fontSize: 12,
          textTransform: 'uppercase',
          bgcolor: profileUrl ? undefined : bgcolor,
        }}
      >
        {profileUrl ? null : `${firstName[0]}${lastName[0]}`}
      </Avatar>
    )
  }
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Avatar
        alt={name}
        src={profileUrl}
        variant="circular"
        sx={{
          height: 48,
          width: 48,
          fontSize: 12,
          textTransform: 'uppercase',
          bgcolor: profileUrl ? undefined : bgcolor,
        }}
      >
        {profileUrl ? null : `${firstName[0]}${lastName[0]}`}
      </Avatar>
      <Stack>
        <Typography variant="body1">{name}</Typography>
        {children}
      </Stack>
    </Stack>
  )
}
