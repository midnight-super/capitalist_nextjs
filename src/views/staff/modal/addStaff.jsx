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
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import CustomTextField from '@/components/customTextField'
import { getAllDesignation } from '@/services/designation.service'
import { createStaff } from '@/services/staff.service'
import toast from 'react-hot-toast'
import WarningModal from '@/views/componenets/warningModal'
import PasswordFields from '@/components/PasswordFields'
import ErrorModal from '@/components/ErrorModal'

const defaultValues = {
  firstName: '',
  secondName: '',
  designation: '',
  email: '',
  gender: '',
  dateOfBirth: '',
  password: '',
  confirmPassword: '',
  contactNumber: '',
  address: '',
  emergencyContactPerson: '',
  emergencyContactNumber: '',
}

const AddStaff = ({ open, close, fetchStaffData }) => {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [warningOpen, setWarningModal] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First Name is required'),
    secondName: Yup.string().trim().required('Second Name is required'),
    designation: Yup.string().required('Designation is required'),
    email: Yup.string().email('Invalid email address').trim().required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    contactNumber: Yup.string().required('Contact Number is required'),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const payload = {
        firstName: values.firstName,
        lastName: values.secondName,
        fullName: `${values.firstName} ${values.secondName}`,
        email: values.email,
        password: values.password,
        contactNumber: values.contactNumber,
        address: values.address,
        Gender: values.gender,
        designation: values.designation,
        emergencyContactNumber: values.emergencyContactNumber || '',
        emergencyContactPerson: values.emergencyContactPerson || '',
        dateOfBirth: values.dateOfBirth,
        status: 'ACTIVE',
        emailNotification: true,
        language: 'English',
        timeZone: 'UTC',
        permissions: {
          p_order: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
          p_staff: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
          p_file: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
          p_directory: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_util: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
          p_client: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
          p_service: {
            permissionRead: false,
            permissionWrite: false,
            permissionDelete: false,
            permissionCreate: false,
          },
          p_task: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
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

      const response = await createStaff(payload)

      if (response === 'STAFF_ALREADY_EXISTS_EMAIL') {
        setErrorMessage('An account with this email address already exists. Please use a different email address.')
        setErrorModalOpen(true)
      } else if (
        response &&
        typeof response === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(response)
      ) {
        toast.success('Staff member created successfully')
        fetchStaffData()
        close()
      } else {
        throw new Error('Failed to create staff member')
      }
    } catch (error) {
      console.error('Error creating staff:', error)
      setErrorMessage('An error occurred while creating the staff member. Please try again.')
      setErrorModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const openWarningModal = () => {
    setWarningModal(true)
  }

  const handleWarningClose = () => {
    setWarningModal(false)
    close()
  }

  const fetchAllDesignation = async () => {
    const res = await getAllDesignation()
    const formattedOptions = res?.data?.map((item) => ({
      label: item.designationName,
      value: item.designationName,
    }))
    setOptions(formattedOptions)
  }

  useEffect(() => {
    fetchAllDesignation()
  }, [])

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
            minHeight: '441px',
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
          Add Staff
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
                {/* First Name */}
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

                {/* Last Name */}
                <Grid size={6}>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="secondName"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} label="Last Name *" error={!!errors.secondName} />
                      )}
                    />
                    {errors.secondName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.secondName.message}</FormHelperText>
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

                {/* Designation */}
                <Grid size={12}>
                  <FormControl fullWidth sx={{ mb: '20px' }} error={!!errors.designation}>
                    <InputLabel>Designation *</InputLabel>
                    <Controller
                      name="designation"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="Designation *" error={!!errors.designation}>
                          {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.designation && <FormHelperText>{errors.designation.message}</FormHelperText>}
                  </FormControl>
                </Grid>

                {/* Contact Number */}
                <Grid size={6}>
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
                <Grid size={6}>
                  <FormControl fullWidth sx={{ mb: '20px' }} error={!!errors.gender}>
                    <InputLabel>Gender *</InputLabel>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="Gender *" error={!!errors.gender}>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
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
                          type="date"
                          label="Date of Birth *"
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

                {/* Emergency Contact Person */}
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

                {/* Emergency Contact Number */}
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
                disabled={loading || !isPasswordValid}
                onClick={handleSubmit(onSubmit)}
              >
                {loading ? 'Saving...' : 'Create Staff'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={handleWarningClose} />
      )}
      <ErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="Staff Creation Error"
        message={errorMessage}
      />
    </>
  )
}

export default AddStaff
