import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

import { Card, CardContent, CardHeader, Grid2 as Grid, Typography } from '@mui/material'

import { getLinkedResource } from '@/services/file.service'
import { isoDateToReadable } from '@/utils'

const LinkedResources = ({ file }) => {
  const [loading, setLoading] = useState(true)
  const [resource, setResource] = useState({})
  const { orderId, orderSequencer, customerName, resourceType, orderDate, deliveryDate } = resource

  const fetchResource = async () => {
    setLoading(true)
    try {
      const res = await getLinkedResource(file)
      console.log('res', res)
      if ('resourceType' in { ...res }) {
        console.log('resource res', res)
        setResource(res)
      } else {
        console.error('fetchResource error response', res)
        toast.error(`${res}` || 'Server Error: Failed to fetch file list')
      }
    } catch (err) {
      console.error('fetchResource exception', err)
      toast.error(err.message || 'Unexpected Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('useEffect')
    fetchResource()
  }, [file])

  return (
    <Card variant="details">
      <CardHeader variant="details" title="Linked Resources" />
      <CardContent>
        <Grid container spacing={2} loading={loading}>
          <Grid size={2}>
            <Typography>Order ID</Typography>
          </Grid>
          <Grid size={4}>
            <Link href={`/orders/${orderId}`}>{orderSequencer}</Link>
          </Grid>
          <Grid size={2}>
            <Typography>Order Date</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{isoDateToReadable(orderDate)}</Typography>
          </Grid>

          <Grid size={2}>
            <Typography>Supplier/Customer Name</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{customerName || 'n/a'}</Typography>
          </Grid>
          <Grid size={2}>
            <Typography>Delivery Date</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>{isoDateToReadable(deliveryDate)}</Typography>
          </Grid>

          <Grid size={2}>
            <Typography>Related Resource</Typography>
          </Grid>
          <Grid size={10}>
            <Typography sx={{ textTransform: 'capitalize' }}>{`${resourceType}`.toLocaleLowerCase()}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default LinkedResources
