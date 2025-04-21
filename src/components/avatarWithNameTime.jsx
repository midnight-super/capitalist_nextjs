import React from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { stringToColor } from '@/utils'
import moment from 'moment'

export default function AvatarWithNameTime({ name, profileUrl, time, compact = false }) {
  if (!name) return null

  // Extract name before the '(' character
  const cleanedName = name.split('(')[0].trim()
  const parts = cleanedName.split(' ')
  const firstName = parts[0] || ''
  const lastName = parts[1] || ''
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
  const bgcolor = stringToColor(cleanedName)

  const avatarSize = compact ? 48 : 48

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        alt={cleanedName}
        src={profileUrl}
        variant={'circular'}
        sx={{
          width: avatarSize,
          height: avatarSize,
          fontSize: 12,
          textTransform: 'uppercase',
          bgcolor: profileUrl ? undefined : bgcolor,
        }}
      >
        {profileUrl ? null : initials}
      </Avatar>
      {!compact && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', pr: 0.5 }}>
              Used by
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {cleanedName}
            </Typography>
          </Box>
          {time && (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {moment(time).fromNow()}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}
