import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import CustomTextField from '@/components/customTextField'
import AutoCompleteMenu from '@/components/customDropdown'
import { create, getByID, update } from '@/services/client.service'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import WarningModal from '@/views/componenets/warningModal'

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  status: 'Active',
}

const UserAddModal = ({ open, close, email, editId, fetchClientUsers, isView, isFromHeader, passwordModalOpen }) => {
  const [selectedStatus, setSelectedStatus] = useState({
    value: 'Active',
    label: 'Active',
  })
  const [loading, setLoading] = useState(false)
  const [clientData, setClientData] = useState(null)
  const [warningOpen, setWarningModal] = useState(false)
  const openWarningModal = () => {
    setWarningModal(true)
  }

  const router = useRouter()
  // Validation Schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First Name is required'),
    lastName: Yup.string().trim().required('Last Name is required'),
    email: Yup.string().trim().email('Invalid email address').required('Email is required'),
    status: Yup.string().oneOf(['Active', 'InActive'], 'Invalid status').required('Status is required'),
  })

  const {
    reset,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema), // Integrate Yup schema
  })

  const statuses = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' },
  ]

  const userClientDetail = async () => {
    setLoading(true)
    const res = await getByID(editId)
    if (res) {
      setClientData(res)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }
  useEffect(() => {
    editId && userClientDetail()
  }, [editId])

  useEffect(() => {
    if (clientData) {
      setValue('email', clientData?.email)
      setValue('firstName', clientData?.firstName)
      setValue('lastName', clientData?.lastName)
      setValue('status', clientData?.status === 'ACTIVE' ? 'Active' : 'InActive')
      setSelectedStatus({
        value: clientData?.status === 'ACTIVE' ? 'Active' : 'InActive',
        label: clientData?.status === 'ACTIVE' ? 'Active' : 'InActive',
      })
    }
  }, [clientData])
  // Submit Handler
  const onSubmit = async (data) => {
    try {
      const finalData = {
        userId: editId,
        nameTitle: `${data?.firstName} ${data?.lastName}`,
        ...data,
        password: editId ? data?.password : '112233', // Add password for new users only
      }
      setLoading(true)
      if (editId && !isView) {
        const res = await update(finalData, editId)
        if (res) {
          toast.success('Client Updated Successfully.')
          setLoading(false)
          fetchClientUsers()
          close() // Close the modal
        }
      } else {
        const res = await create(finalData)
        if (res) {
          toast.success('Client Created Successfully.')
          setLoading(false)
          if (!isFromHeader) {
            fetchClientUsers && fetchClientUsers()
          } else {
            router.push('/admin/client-users')
          }
          // email(true); // Call email callback
          close() // Close the modal
        }
      }
    } catch (error) {
      toast.error(error)
      console.error('Error submitting form:', error) // Log the error for debugging
      setLoading(false) // Ensure loading state is reset in case of failure
      // Optionally, handle the error with a notification, alert, or another UI response
    }
  }

  const hanndleWarningClose = () => {
    setWarningModal(false)
    close()
  }
  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          !isView ? openWarningModal() : close()
        }}
        sx={{ px: '12px' }}
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: '586px',
            minHeight: editId && !isView ? '512px' : '441px',
            boxShadow: 'none',
            position: 'relative',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        disableScrollLock
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            color: '#212121',
            py: '19px !important',
            px: '43px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 700,
          }}
        >
          {editId && !isView ? 'Edit Client User' : 'User Details'}
          <span onClick={close} style={{ cursor: 'pointer' }}>
            <img src="/icons/closeIcon.svg" alt="close" />
          </span>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: '34px 43px', height: '100%' }}>
          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0, // Full height and width
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional: add a semi-transparent background
              }}
            >
              <CircularProgress />
            </div>
          )}
          <Box sx={{ filter: loading ? 'blur(5px)' : 'none' }}>
            <Box sx={{ p: 0 }}>
              <Grid container spacing={1} sx={{ m: 0, p: 0 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          value={value}
                          label="First Name"
                          onChange={onChange}
                          disabled={editId && isView}
                          error={!!errors.firstName}
                        />
                      )}
                    />
                    {errors.firstName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          value={value}
                          label="Last Name"
                          onChange={onChange}
                          disabled={editId && isView}
                          error={!!errors.lastName}
                        />
                      )}
                    />
                    {errors.lastName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          type="email"
                          value={value}
                          label="Email"
                          disabled={editId && isView}
                          onChange={onChange}
                          error={!!errors.email}
                        />
                      )}
                    />
                    {errors.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: editId ? '20px' : '32px' }}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <AutoCompleteMenu
                          value={selectedStatus}
                          setValue={(newValue) => {
                            onChange(newValue?.value || null)
                            setSelectedStatus(newValue)
                          }}
                          isEnabled
                          // isEnabled={editId && isView}
                          option={statuses}
                          placeHolder="Select"
                          label="Status"
                          width="100%"
                          error={!!errors.status}
                        />
                      )}
                    />
                    {errors.status && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                {editId && !isView && (
                  <Grid size={12}>
                    <Button
                      variant="outlined"
                      sx={{
                        mb: '40px',
                        textTransform: 'capitalize',
                        color: '#4489FE',
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                      fullWidth
                      onClick={() => passwordModalOpen(editId)}
                    >
                      Generate new password
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'capitalize',
                  width: '200px',
                  color: '#757575',
                  height: '50px',
                  borderRadius: '4px',
                  border: '1px solid #DEE0E4',
                  fontWeight: 700,
                  lineHeight: 'normal',
                }}
                onClick={close}
              >
                Cancel
              </Button>
              {!isView && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'capitalize',
                    width: '200px',
                    height: '50px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontWeight: 700,
                    lineHeight: 'normal',
                  }}
                  disabled={editId && isView}
                  onClick={handleSubmit(onSubmit)}
                >
                  {editId && !isView ? 'Update' : 'Submit'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={hanndleWarningClose} />
      )}
    </>
  )
}

export default UserAddModal
