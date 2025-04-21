import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosWithAuth from '@/services/index'
import toast from 'react-hot-toast'
import { getStaffByID, updateStaff } from '@/services/staff.service'
import PasswordFields from '@/components/PasswordFields'
import CustomTextField from '@/components/customTextField'
import WarningModal from '@/views/componenets/warningModal'
import ErrorModal from '@/components/ErrorModal'

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().when('$isEdit', {
    is: false,
    then: () =>
      yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    otherwise: () => yup.string().optional(),
  }),
  confirmPassword: yup.string().when('$isEdit', {
    is: false,
    then: () =>
      yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    otherwise: () => yup.string().optional(),
  }),
  contactNumber: yup.string().required('Contact number is required'),
  address: yup.string().optional(),
  Gender: yup.string().required('Gender is required'),
  resellerId: yup.string().required('Reseller is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  emergencyContactPerson: yup.string().optional(),
  emergencyContactNumber: yup.string().optional(),
})

export default function AddSubUserModal({ open, close, resellers, editId, fetchResellerData }) {
  const [loading, setLoading] = useState(false)
  const [selectedReseller, setSelectedReseller] = useState(null)
  const [warningOpen, setWarningModal] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [adminResellers, setAdminResellers] = useState([])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      contactNumber: '',
      address: '',
      Gender: '',
      resellerId: '',
      dateOfBirth: '',
      emergencyContactPerson: '',
      emergencyContactNumber: '',
      language: 'en',
      timeZone: 'UTC',
      emailNotification: true,
      status: 'ACTIVE',
    },
    context: { isEdit: !!editId },
  })

  // Watch resellerId for changes
  const resellerId = watch('resellerId')

  // Filter resellers to only show admin resellers
  useEffect(() => {
    if (resellers) {
      const adminOnly = resellers.filter((reseller) => reseller.admin && reseller.admin.status === 'ACTIVE')
      setAdminResellers(adminOnly)
    }
  }, [resellers])

  // Fetch sub-user data for edit
  useEffect(() => {
    if (editId) {
      const fetchSubUserData = async () => {
        try {
          const data = await getStaffByID(editId)

          // Find the reseller that owns this sub-user
          const owningReseller = resellers.find((reseller) =>
            reseller.subUsers?.some((subUser) => subUser.staffId === editId)
          )

          if (owningReseller) {
            setSelectedReseller(owningReseller)
            setValue('resellerId', owningReseller.resellerId)
          }

          // Set form values
          setValue('firstName', data.firstName || '')
          setValue('lastName', data.lastName || '')
          setValue('email', data.email || '')
          setValue('contactNumber', data.contactNumber || '')
          setValue('address', data.address || '')
          setValue('Gender', data.Gender || '')
          setValue('dateOfBirth', data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '')
          setValue('emergencyContactPerson', data.emergencyContactPerson || '')
          setValue('emergencyContactNumber', data.emergencyContactNumber || '')
        } catch (error) {
          console.error('Error fetching sub-user details:', error)
          toast.error('Failed to fetch sub-user details')
        }
      }
      fetchSubUserData()
    }
  }, [editId, setValue, resellers])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        contactNumber: data.contactNumber,
        address: data.address,
        Gender: data.Gender,
        dateOfBirth: data.dateOfBirth,
        emergencyContactPerson: data.emergencyContactPerson,
        emergencyContactNumber: data.emergencyContactNumber,
        language: 'en',
        timeZone: 'UTC',
        emailNotification: true,
        status: 'ACTIVE',
        permissions: {
          p_order: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_staff: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_file: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_directory: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_util: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_client: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_service: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_task: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_taskType: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_workflow: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_reseller: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_designation: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
        },
      }

      if (editId) {
        const response = await updateStaff(editId, payload)
        if (response === 'OPERATION_SUCCESS') {
          toast.success('Sub-user updated successfully')
          await fetchResellerData()
          handleCloseModal()
        } else {
          toast.error('Failed to update sub-user')
        }
      } else {
        const response = await axiosWithAuth.post(`/staff/reseller/create/${data.resellerId}`, payload)

        if (response?.data === 'STAFF_ALREADY_EXISTS_EMAIL') {
          setErrorMessage('This email is already registered. Please use a different email address.')
          setErrorModalOpen(true)
          return
        }

        if (response?.data && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(response.data)) {
          toast.success('Sub-user created successfully')
          await fetchResellerData()
          handleCloseModal()
        } else {
          toast.error('Failed to create sub-user')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    reset()
    close()
  }

  const openWarningModal = () => {
    setWarningModal(true)
  }

  const handleWarningClose = () => {
    setWarningModal(false)
  }

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          isDirty ? openWarningModal() : close()
        }}
        sx={{ px: '12px' }}
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: '586px',
            minHeight: editId ? '512px' : '441px',
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
          {editId ? 'Edit Sub-user' : 'Add New Sub-user'}
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
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <CircularProgress />
            </div>
          )}
          <Box sx={{ filter: loading ? 'blur(5px)' : 'none' }}>
            <Box sx={{ p: 0 }}>
              <Grid container spacing={1} sx={{ m: 0, p: 0 }}>
                {/* Reseller Selection */}
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="resellerId"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel>Select Reseller *</InputLabel>
                          <Select {...field} label="Select Reseller *" disabled={!!editId} error={!!errors.resellerId}>
                            {adminResellers?.map((reseller) => (
                              <MenuItem key={reseller.resellerId} value={reseller.resellerId}>
                                {reseller.resellerCategory === 'COMPANY'
                                  ? reseller.company?.title || 'Unknown Company'
                                  : reseller.admin?.fullName || 'Unknown Reseller'}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.resellerId && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.resellerId.message}</FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* First Name and Last Name */}
                <Grid size={6}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} label="First Name *" error={!!errors.firstName} />
                      )}
                    />
                    {errors.firstName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} label="Last Name *" error={!!errors.lastName} />
                      )}
                    />
                    {errors.lastName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Email */}
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} type="email" label="Email *" error={!!errors.email} />
                      )}
                    />
                    {errors.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Password Fields */}
                {!editId && (
                  <Grid size={12}>
                    <FormControl fullWidth sx={{ mb: '20px' }}>
                      <PasswordFields
                        control={control}
                        errors={errors}
                        watch={watch}
                        setIsPasswordValid={setIsPasswordValid}
                      />
                    </FormControl>
                  </Grid>
                )}

                {/* Contact Number */}
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="contactNumber"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} label="Contact Number *" error={!!errors.contactNumber} />
                      )}
                    />
                    {errors.contactNumber && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.contactNumber.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Gender */}
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="Gender"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel>Gender *</InputLabel>
                          <Select {...field} label="Gender *" error={!!errors.Gender}>
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="FEMALE">Female</MenuItem>
                          </Select>
                          {errors.Gender && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.Gender.message}</FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Date of Birth */}
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Date of Birth *"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.dateOfBirth}
                          fullWidth
                        />
                      )}
                    />
                    {errors.dateOfBirth && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.dateOfBirth.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Address */}
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Address" multiline rows={4} error={!!errors.address} />
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Emergency Contact Person and Number */}
                <Grid size={6}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="emergencyContactPerson"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Emergency Contact Person"
                          error={!!errors.emergencyContactPerson}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="emergencyContactNumber"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Emergency Contact Number"
                          error={!!errors.emergencyContactNumber}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Buttons */}
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
              <Button
                type="submit"
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
                disabled={loading || (!editId && !isPasswordValid)}
                onClick={handleSubmit(onSubmit)}
              >
                {loading ? 'Saving...' : editId ? 'Update' : 'Create Sub-user'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <ErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="Email Already Exists"
        message={errorMessage}
      />
      <WarningModal open={warningOpen} handleClose={handleWarningClose} onConfirm={close} />
    </>
  )
}
