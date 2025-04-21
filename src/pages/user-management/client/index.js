import { tableWrapperStyles } from '@/styles/table-styles'
import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ClientTable from '@/views/client/clientTable'
import { getClientList } from '@/services/client.service'
import toast from 'react-hot-toast'

const Client = () => {
  const { mainContainer } = tableWrapperStyles
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchClientData = async () => {
    setLoading(true)
    try {
      const response = await getClientList(
        {
          page: 0,
          pageSize: 10,
          sortBy: 'createdAt',
          isDesc: true,
        },
        []
      )

      if (response?.success) {
        setClients(response.data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast.error('Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientData()
  }, [])

  return (
    <Box sx={mainContainer}>
      <ClientTable data={clients} loading={loading} fetchClientData={fetchClientData} />
    </Box>
  )
}

Client.permissions = ['client.read']
export default Client
