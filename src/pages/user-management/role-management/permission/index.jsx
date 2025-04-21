'use client'

import { useState, useEffect } from 'react'
import { Box, Grid2 as Grid, CircularProgress, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Sidebar from './sidebar'
import PermissionsTable from './permissionsTable'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { getRoleById } from '@/services/role.service'
import { getPermissionById } from '@/services/permission.service'

export default function Permissions() {
  const router = useRouter()
  const { roleId, permissionId, edit } = router.query
  const [selectedRole, setSelectedRole] = useState('company-Set-up')
  const [roleName, setRoleName] = useState('')
  const [description, setDescription] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const [loading, setLoading] = useState(true)
  const [permissionTemplate, setPermissionTemplate] = useState(null)
  const [templateName, setTemplateName] = useState('')

  // Fetch existing data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      if (edit && roleId) {
        try {
          // Fetch role data for edit mode
          const roleData = await getRoleById(roleId)
          setRoleName(roleData.roleName)
          setDescription(roleData.description)

          // Fetch all permission templates for this role
          if (roleData.permissionIds && roleData.permissionIds.length > 0) {
            const templates = await Promise.all(roleData.permissionIds.map((id) => getPermissionById(id)))
            setPermissionTemplate(templates)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          toast.error('Failed to fetch role data')
          router.push('/user-management/role-management')
        }
      }
      // For create mode, permissionTemplate remains null
      setLoading(false)
    }

    fetchData()
  }, [edit, roleId])

  const handleBack = () => {
    router.push('/user-management/role-management')
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Add back button header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          onClick={handleBack}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            width: 'fit-content', // Limit clickable area
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation() // Stop event bubbling
              handleBack()
            }}
            sx={{
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              padding: '8px',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20, color: '#666666' }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: '16px',
              color: '#666666',
              fontWeight: 500,
            }}
          >
            Back to Roles
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Sidebar
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              roleName={roleName}
              setRoleName={setRoleName}
              isTouched={isTouched}
              setIsTouched={setIsTouched}
              isEdit={!!edit}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <PermissionsTable
              selectedRole={selectedRole}
              roleName={roleName}
              description={description}
              setDescription={setDescription}
              isTouched={isTouched}
              setIsTouched={setIsTouched}
              isEdit={!!edit}
              roleId={roleId}
              permissionId={permissionId}
              permissionTemplate={permissionTemplate}
              templateName={templateName}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

Permissions.permissions = ['designation.read']
