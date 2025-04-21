import CustomTextField from '@/components/customTextField'
import { createClient, getClientByID, updateClient } from '@/services/client.service'
import { staffStyles } from '@/styles/add-modals-styles'
import WarningModal from '@/views/componenets/warningModal'
import { yupResolver } from '@hookform/resolvers/yup'
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
  InputLabel,
  MenuItem,
  Grid2 as Grid,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { updateStaff } from '@/services/staff.service'
import PasswordFields from '@/components/PasswordFields'
import ErrorModal from '@/components/ErrorModal'

const AddClientModal = ({ open, close, editId, isView, fetchClientData }) => {
  const {
    dialogContainer,
    dialogPaperProps,
    dialogBackdropProps,
    dialogTitle,
    dialogContent,
    loader,
    inputContainer,
    formContainer,
    nameInput,
    buttonContainer,
    button,
  } = staffStyles

  const [loading, setLoading] = useState(false)
  const [clientData, setClientData] = useState(null)
  const [warningOpen, setWarningModal] = useState(false)
  const [clientType, setClientType] = useState('INDIVIDUAL')
  const [showPassword, setShowPassword] = useState(false)
  const [updateType, setUpdateType] = useState(null)
  const [passwordErrors, setPasswordErrors] = useState({})
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
    secondName: Yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    ...(!editId
      ? {
          password: Yup.string()
            .required('Password is required')
            .min(8)
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
        }
      : {}),
    gender: Yup.string(),
    dateOfBirth: Yup.string(),
    address: Yup.string(),
    emergencyContactPerson: Yup.string(),
    emergencyContactNumber: Yup.string(),
    ...(clientType === 'COMPANY'
      ? {
          companyTitle: Yup.string(),
          companyDomain: Yup.string(),
          companyPhone: Yup.string(),
          companyEmail: Yup.string().email('Invalid email format'),
          companyAddress: Yup.string(),
          dateEstablished: Yup.string(),
        }
      : {}),
  })

  const defaultValues = {
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    address: '',
    emergencyContactPerson: '',
    emergencyContactNumber: '',
    companyTitle: '',
    companyDomain: '',
    companyPhone: '',
    companyEmail: '',
    companyAddress: '',
    dateEstablished: '',
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    getValues,
    reset,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    console.log('Form Errors:', errors)
  }, [errors])

  const fetchClientDetails = async () => {
    try {
      const response = await getClientByID(editId)
      if (response) {
        console.log('Fetched Client Data:', response)
        setClientData(response)
        setClientType(response.clientCategory || 'INDIVIDUAL')

        // Set form values
        const admin = response.admin || {}
        const company = response.company || {}

        reset({
          firstName: admin.firstName || '',
          secondName: admin.lastName || '',
          email: admin.email || '',
          gender: admin.Gender || '',
          dateOfBirth: admin.dateOfBirth || '',
          contactNumber: admin.contactNumber || '',
          address: admin.address || '',
          emergencyContactPerson: admin.emergencyContactPerson || '',
          emergencyContactNumber: admin.emergencyContactNumber || '',
          companyTitle: company.title || '',
          companyDomain: company.domain || '',
          companyPhone: company.phone || '',
          companyEmail: company.officialEmail || '',
          companyAddress: company.address || '',
          dateEstablished: company.dateEstablished || '',
        })
      }
    } catch (error) {
      console.error('Error fetching client details:', error)
      toast.error('Failed to fetch client details')
    }
  }

  useEffect(() => {
    if (editId) {
      fetchClientDetails()
    } else {
      reset(defaultValues)
      setClientType('INDIVIDUAL')
    }
  }, [editId, reset])

  useEffect(() => {
    if (clientData && editId) {
      const admin = clientData.admin || {}
      const company = clientData.company || {}

      reset({
        firstName: admin.firstName || '',
        secondName: admin.lastName || '',
        email: admin.email || '',
        gender: admin.Gender || '',
        dateOfBirth: admin.dateOfBirth || '',
        contactNumber: admin.contactNumber || '',
        address: admin.address || '',
        emergencyContactPerson: admin.emergencyContactPerson || '',
        emergencyContactNumber: admin.emergencyContactNumber || '',
        companyTitle: company.title || '',
        companyDomain: company.domain || '',
        companyPhone: company.phone || '',
        companyEmail: company.officialEmail || '',
        companyAddress: company.address || '',
        dateEstablished: company.dateEstablished || '',
      })

      setClientType(clientData.clientCategory || 'INDIVIDUAL')
    }
  }, [clientData, editId, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (editId && !isView) {
        console.log('Updating client with ID:', editId)

        try {
          if (updateType === 'admin' || !updateType) {
            // Update POC/admin details
            const staffUpdatePayload = {
              staffId: clientData.admin.staffId,
              firstName: data.firstName,
              lastName: data.secondName,
              fullName: `${data.firstName} ${data.secondName}`,
              email: data.email,
              Gender: data.gender,
              dateOfBirth: data.dateOfBirth,
              contactNumber: data.contactNumber,
              address: data.address,
              emergencyContactPerson: data.emergencyContactPerson || '',
              emergencyContactNumber: data.emergencyContactNumber || '',
              status: 'ACTIVE',
              designation: clientData.admin.designation,
              permissions: clientData.admin.permissions,
              emailNotification: clientData.admin.emailNotification || true,
            }

            const staffResponse = await updateStaff(staffUpdatePayload)
            if (staffResponse === 'OPERATION_SUCCESS') {
              toast.success('POC details updated successfully')
              if (!updateType) close()
            } else {
              throw new Error('Failed to update POC details')
            }
          }

          if (updateType === 'company' || !updateType) {
            // Update client/company details
            const clientUpdatePayload = {
              clientId: editId,
              admin: clientData.admin,
              clientCategory: clientType,
              status: clientData.status || 'ACTIVE',
              company:
                clientType === 'COMPANY'
                  ? {
                      ...clientData.company,
                      title: data.companyTitle,
                      domain: data.companyDomain,
                      phone: data.companyPhone,
                      officialEmail: data.companyEmail,
                      address: data.companyAddress,
                      dateEstablished: data.dateEstablished,
                    }
                  : undefined,
            }

            const clientResponse = await updateClient(clientUpdatePayload)
            if (clientResponse === 'OPERATION_SUCCESS') {
              toast.success('Company details updated successfully')
              if (!updateType) close()
            } else {
              throw new Error('Failed to update company details')
            }
          }

          // Close modal after successful update
          if (updateType) {
            close()
          }
        } catch (error) {
          throw new Error(`Update failed: ${error.message}`)
        }
      } else {
        const finalData = {
          admin: {
            firstName: data.firstName,
            lastName: data.secondName,
            fullName: `${data.firstName} ${data.secondName}`,
            email: data.email,
            password: data.password,
            Gender: data.gender,
            dateOfBirth: data.dateOfBirth,
            contactNumber: data.contactNumber,
            address: data.address,
            emergencyContactPerson: data.emergencyContactPerson || '',
            emergencyContactNumber: data.emergencyContactNumber || '',
            status: 'ACTIVE',
            emailNotification: true,
            language: 'English',
            timeZone: 'UTC',
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
          },
          clientCategory: clientType,
          lastActivity: new Date().toISOString(),
          status: 'ACTIVE',
          company:
            clientType === 'COMPANY'
              ? {
                  title: data.companyTitle,
                  domain: data.companyDomain,
                  phone: data.companyPhone,
                  officialEmail: data.companyEmail,
                  address: data.companyAddress,
                  dateEstablished: data.dateEstablished,
                }
              : undefined,
        }

        const response = await createClient(finalData)
        if (response === 'STAFF_ALREADY_EXISTS_EMAIL') {
          setErrorMessage('An account with this email address already exists. Please use a different email address.')
          setErrorModalOpen(true)
        } else if (response && typeof response === 'string') {
          await fetchClientData()
          close()
          toast.success('Client created successfully')
        } else {
          throw new Error('Failed to create client')
        }
      }
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        error,
      })
      setErrorMessage('An error occurred while creating the client. Please try again.')
      setErrorModalOpen(true)
    } finally {
      setLoading(false)
      setUpdateType(null)
    }
  }

  const handlePOCUpdate = async (data) => {
    try {
      setLoading(true)

      if (!clientData?.admin?.staffId) {
        throw new Error('Staff ID is missing')
      }

      // Prepare the staff update payload
      const staffUpdatePayload = {
        staffId: clientData.admin.staffId,
        firstName: data.firstName,
        lastName: data.secondName,
        fullName: `${data.firstName} ${data.secondName}`,
        email: data.email,
        Gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        contactNumber: data.contactNumber,
        address: data.address,
        emergencyContactPerson: data.emergencyContactPerson || '',
        emergencyContactNumber: data.emergencyContactNumber || '',
        status: clientData.admin.status || 'ACTIVE',
        // Keep existing values for these fields
        designation: clientData.admin.designation,
        permissions: clientData.admin.permissions,
        emailNotification: clientData.admin.emailNotification,
        // Add any missing required fields from the original staff data
        role: clientData.admin.role || 'CLIENT',
        profileImage: clientData.admin.profileImage || '',
        createdAt: clientData.admin.createdAt,
        updatedAt: new Date().toISOString(),
      }

      console.log('Staff Update Payload:', staffUpdatePayload)

      const staffResponse = await updateStaff(staffUpdatePayload)

      if (staffResponse === 'OPERATION_SUCCESS') {
        toast.success('POC details updated successfully')
        await fetchClientData()
        close()
      } else {
        throw new Error('Failed to update POC details')
      }
    } catch (error) {
      console.error('POC Update Error:', error)
      toast.error(error.message || 'Failed to update POC')
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyUpdate = async (data) => {
    try {
      setLoading(true)
      // Update client/company details
      const clientUpdatePayload = {
        clientId: editId,
        admin: clientData.admin,
        clientCategory: clientType,
        status: clientData.status || 'ACTIVE',
        company: {
          ...clientData.company,
          title: data.companyTitle,
          domain: data.companyDomain,
          phone: data.companyPhone,
          officialEmail: data.companyEmail,
          address: data.companyAddress,
          dateEstablished: data.dateEstablished,
        },
      }

      const clientResponse = await updateClient(clientUpdatePayload)
      if (clientResponse === 'OPERATION_SUCCESS') {
        toast.success('Company details updated successfully')
        await fetchClientData()
        close()
      } else {
        throw new Error('Failed to update company details')
      }
    } catch (error) {
      console.error('Company Update Error:', error)
      toast.error(error.message || 'Failed to update company')
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

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          isDirty && !isView ? openWarningModal() : close()
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            maxHeight: '95vh',
            minHeight: '80vh',
            margin: '16px',
            '& .MuiDialogContent-root': {
              paddingTop: '20px',
              paddingBottom: '24px',
            },
          },
        }}
      >
        <DialogTitle>{editId ? (isView ? 'View Client' : 'Edit Client') : 'Add Client'}</DialogTitle>
        <DialogContent>
          <form>
            {/* Client Category Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1, color: '#666666', fontSize: '14px' }}>Client Category</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={clientType === 'INDIVIDUAL' ? 'contained' : 'outlined'}
                  onClick={() => setClientType('INDIVIDUAL')}
                  sx={{
                    minWidth: '120px',
                    height: '40px',
                    textTransform: 'none',
                    backgroundColor: clientType === 'INDIVIDUAL' ? '#4489FE' : 'transparent',
                    color: clientType === 'INDIVIDUAL' ? '#fff' : '#666666',
                    '&:hover': {
                      backgroundColor: clientType === 'INDIVIDUAL' ? '#4489FE' : 'transparent',
                    },
                  }}
                >
                  Individual
                </Button>
                <Button
                  variant={clientType === 'COMPANY' ? 'contained' : 'outlined'}
                  onClick={() => setClientType('COMPANY')}
                  sx={{
                    minWidth: '120px',
                    height: '40px',
                    textTransform: 'none',
                    backgroundColor: clientType === 'COMPANY' ? '#4489FE' : 'transparent',
                    color: clientType === 'COMPANY' ? '#fff' : '#666666',
                    '&:hover': {
                      backgroundColor: clientType === 'COMPANY' ? '#4489FE' : 'transparent',
                    },
                  }}
                >
                  Company
                </Button>
              </Box>
            </Box>

            {/* Rest of your form fields */}
            <Grid container spacing={2}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#212121' }}>
                  {clientType === 'INDIVIDUAL' ? 'Personal Information' : 'Point of Contact Information'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label="First Name *"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="secondName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label="Last Name *"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField {...field} label="Email *" error={!!error} helperText={error?.message} fullWidth />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label="Contact Number *"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {!editId && (
                <Grid item xs={12} md={12}>
                  <PasswordFields
                    control={control}
                    errors={errors}
                    watch={watch}
                    passwordErrors={passwordErrors}
                    setPasswordErrors={setPasswordErrors}
                    setIsPasswordValid={setIsPasswordValid}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label="Address"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Gender</InputLabel>
                      <Select {...field} label="Gender">
                        <MenuItem value="MALE">Male</MenuItem>
                        <MenuItem value="FEMALE">Female</MenuItem>
                      </Select>
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Date of Birth"
                      type="date"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        max: new Date().toISOString().split('T')[0],
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="emergencyContactPerson"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label="Emergency Contact Person"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="emergencyContactNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label="Emergency Contact Number"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Company Details Section */}
              {clientType === 'COMPANY' && (
                <>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                        Company Details
                      </Typography>
                      <Divider />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="companyTitle"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label="Company Name"
                          error={!!error}
                          helperText={error?.message}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="companyDomain"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label="Company Domain"
                          error={!!error}
                          helperText={error?.message}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="companyEmail"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label="Company Email"
                          error={!!error}
                          helperText={error?.message}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="companyPhone"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label="Company Phone"
                          error={!!error}
                          helperText={error?.message}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="companyAddress"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label="Company Address"
                          error={!!error}
                          helperText={error?.message}
                          fullWidth
                          multiline
                          rows={3}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="dateEstablished"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Date Established"
                          type="date"
                          error={!!error}
                          helperText={error?.message}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            max: new Date().toISOString().split('T')[0],
                          }}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              {/* Submit button section */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    borderTop: '1px solid #DEE0E4',
                    pt: 2,
                    mx: -3,
                    px: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={close}
                    disabled={loading}
                    sx={{
                      color: '#757575',
                      border: '1px solid #DEE0E4',
                      minWidth: '160px',
                      height: '42px',
                    }}
                  >
                    Cancel
                  </Button>

                  {editId ? (
                    // Show separate update buttons when editing
                    <>
                      <Button
                        variant="contained"
                        disabled={loading}
                        sx={{
                          minWidth: '160px',
                          height: '42px',
                          color: '#fff',
                          backgroundColor: '#4489FE',
                          '&:hover': {
                            backgroundColor: '#4489FE',
                          },
                        }}
                        onClick={handleSubmit(handlePOCUpdate)}
                      >
                        Update POC
                      </Button>
                      {clientType === 'COMPANY' && (
                        <Button
                          variant="contained"
                          disabled={loading}
                          sx={{
                            minWidth: '160px',
                            height: '42px',
                            color: '#fff',
                            backgroundColor: '#4489FE',
                            '&:hover': {
                              backgroundColor: '#4489FE',
                            },
                          }}
                          onClick={handleSubmit(handleCompanyUpdate)}
                        >
                          Update Company
                        </Button>
                      )}
                    </>
                  ) : (
                    // Show single create button for new clients
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        minWidth: '160px',
                        height: '42px',
                        color: '#fff',
                        backgroundColor: '#4489FE',
                        '&:hover': {
                          backgroundColor: '#4489FE',
                        },
                      }}
                      disabled={loading || (!editId && !isPasswordValid)}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Create Client
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={handleWarningClose} />
      )}
      <ErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="Client Creation Error"
        message={errorMessage}
      />
    </>
  )
}

AddClientModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  editId: PropTypes.string,
  isView: PropTypes.bool,
  fetchClientData: PropTypes.func.isRequired,
}

export default AddClientModal
