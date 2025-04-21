import React from 'react'
import { filesize } from 'filesize'

import { Card, CardContent, CardHeader, Grid2 as Grid, Typography } from '@mui/material'
import AvatarWithName from '@/components/avatarWithName'
import { isoDateToReadable } from '@/utils'

export default function FileDetail({ file }) {
  const { mediaType, fileName, size, category, uploadedByName, createdAt, updatedByName, updatedAt } = file

  return (
    <Card variant="details">
      <CardHeader variant="details" title="Main File Details" />
      <CardContent>
        <Typography variant="h3">{fileName}</Typography>
        <Grid container spacing={2}>
          <Grid size={2}>
            <Typography>Uploaded By</Typography>
          </Grid>
          <Grid size={4}>
            <AvatarWithName variant="compact" name={uploadedByName} />
          </Grid>
          <Grid size={2}>
            <Typography>Type</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{mediaType}</Typography>
          </Grid>

          <Grid size={2}>
            <Typography>Uploaded Date</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{isoDateToReadable(createdAt)}</Typography>
          </Grid>
          <Grid size={2}>
            <Typography>Format</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{mediaType}</Typography>
          </Grid>

          <Grid size={2}>
            <Typography>Last Modified By</Typography>
          </Grid>
          <Grid size={4}>
            <AvatarWithName variant="compact" name={updatedByName} />
          </Grid>
          <Grid size={2}>
            <Typography>Size</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{filesize(size)}</Typography>
          </Grid>

          <Grid size={2}>
            <Typography>Last Modified Date</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{isoDateToReadable(updatedAt)}</Typography>
          </Grid>
          <Grid size={2}>
            <Typography>Category</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{category}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
