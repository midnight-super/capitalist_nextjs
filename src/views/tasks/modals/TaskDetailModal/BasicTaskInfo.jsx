import React from 'react'
import { Paper, Typography, Grid2, Box } from '@mui/material'
import { statusOptions, getColorMap } from '../../OrderStatus'
const BasicTaskInfo = ({ title, description, id, status, theme }) => {
  // Status color mapping similar to TaskColumn
  const getStatusColor = (status) => {
    const colorMap = getColorMap(theme)
    return colorMap[status] || theme.palette.success.main
  }

  // Status label mapping similar to TaskColumn
  const getStatusLabel = (status) => {
    const matchedOption = statusOptions.find((option) => option.value === status)
    return matchedOption?.label || status
  }

  const statusColor = getStatusColor(status)
  const statusLabel = getStatusLabel(status)

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mt: 5,
        mb: 3,
        border: '1px solid',
        borderColor: theme.palette.textBackgroundColors.neutral75,
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
        Basic Task Information
      </Typography>

      <Typography component="div" variant="h3" sx={{ pb: 1 }}>
        <b>{title}</b>
      </Typography>
      <Typography variant="body1" color="textDisabled" sx={{ mb: 2 }}>
        {description}
      </Typography>

      <Grid2 container spacing={2} sx={{ mt: 1 }} alignItems="baseline">
        <Grid2 item xs={6}>
          <Typography variant="h3">#ID:</Typography>
        </Grid2>
        <Grid2 item xs={2}>
          <Typography variant="h3">{id.slice(-6)}</Typography>
        </Grid2>
        <Grid2 item xs={1}>
          <Typography variant="h3">|</Typography>
        </Grid2>
        <Grid2 item xs={3} sx={{ textAlign: 'right' }}>
          <Box
            paddingLeft={1}
            paddingRight={1}
            borderRadius={2}
            bgcolor={theme.palette.statusBackground[status]}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: statusColor,
                mr: 1,
              }}
            />
            <Typography variant="body1" color={statusColor}>
              {statusLabel}
            </Typography>
          </Box>
        </Grid2>
      </Grid2>
    </Paper>
  )
}

export default BasicTaskInfo
