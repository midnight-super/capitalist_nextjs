import CustomTextField from '@/components/customTextField'
import { getAllDesignation } from '@/services/designation.service'
import { createReseller, getResellerByID, updateReseller } from '@/services/reseller.service'
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
  MenuItem,
  InputLabel,
  Grid2 as Grid,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import PasswordFields from '@/components/PasswordFields'
import { Global } from '@emotion/react'
import ErrorModal from '@/components/ErrorModal'

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

const AddResellerModal = ({ open, close, editId, isView, fetchResellerData }) => {
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

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [resellerData, setResellerData] = useState(null)
  const [warningOpen, setWarningModal] = useState(false)
  const [resellerType, setResellerType] = useState('INDIVIDUAL')
  const [updateType, setUpdateType] = useState(null)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First Name is required'),
    secondName: Yup.string().trim().required('Second Name is required'),
    email: Yup.string().email('Invalid email address').trim().required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    ...(!editId ? { password: Yup.string().required('Password is required') } : {}),
    contactNumber: Yup.string().required('Contact Number is required'),
    address: Yup.string().required('Address is required'),
    emergencyContactPerson: Yup.string().nullable(),
    emergencyContactNumber: Yup.string().nullable(),
    ...(resellerType === 'COMPANY'
      ? {
          companyTitle: Yup.string().required('Company title is required'),
          companyDomain: Yup.string(),
          companyPhone: Yup.string().required('Company phone is required'),
          companyEmail: Yup.string().email('Invalid email format').required('Company email is required'),
          companyAddress: Yup.string().required('Company address is required'),
          dateEstablished: Yup.string().required('Date established is required'),
        }
      : {}),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
    reset,
    watch,
    isDirty,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const fetchResellerDetails = async () => {
    setLoading(true)
    try {
      const res = await getResellerByID(editId)
      if (res) {
        setResellerData(res)
        setResellerType(res.resellerCategory || 'INDIVIDUAL')
        let formattedDate = ''
        if (res.admin?.dateOfBirth) {
          try {
            const date = new Date(res.admin.dateOfBirth)
            if (!isNaN(date.getTime())) {
              formattedDate = date.toISOString().split('T')[0]
            } else {
              formattedDate = res.admin.dateOfBirth.split('T')[0]
            }
          } catch (e) {
            console.error('Error formatting date:', e)
            formattedDate = ''
          }
        }
        let formattedCompanyDate = ''
        if (res.company?.dateEstablished) {
          try {
            const date = new Date(res.company.dateEstablished)
            if (!isNaN(date.getTime())) {
              formattedCompanyDate = date.toISOString().split('T')[0]
            } else {
              formattedCompanyDate = res.company.dateEstablished.split('T')[0]
            }
          } catch (e) {
            console.error('Error formatting company date:', e)
            formattedCompanyDate = ''
          }
        }
        reset({
          firstName: res.admin?.firstName || '',
          secondName: res.admin?.lastName || '',
          email: res.admin?.email || '',
          password: res.admin?.password || '',
          gender: res.admin?.Gender || '',
          dateOfBirth: formattedDate,
          contactNumber: res.admin?.contactNumber || '',
          address: res.admin?.address || '',
          designation: res.admin?.designation || '',
          emergencyContactPerson: res.admin?.emergencyContactPerson || '',
          emergencyContactNumber: res.admin?.emergencyContactNumber || '',
          companyTitle: res.company?.title || '',
          companyDomain: res.company?.domain || '',
          companyPhone: res.company?.phone || '',
          companyEmail: res.company?.officialEmail || '',
          companyAddress: res.company?.address || '',
          dateEstablished: formattedCompanyDate,
        })
      }
    } catch (error) {
      console.error('Error fetching reseller details:', error)
      toast.error('Failed to fetch reseller details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (editId) {
      fetchResellerDetails()
    } else {
      reset(defaultValues)
      setResellerType('INDIVIDUAL')
    }
  }, [editId, reset])

  const onSubmit = async () => {
    const values = getValues()
    console.log('Submitted Values:', values)

    try {
      setLoading(true)
      const formattedData = {
        admin: {
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
            p_file: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
            p_directory: {
              permissionRead: false,
              permissionWrite: false,
              permissionDelete: false,
              permissionCreate: false,
            },
            p_util: { permissionRead: false, permissionWrite: false, permissionDelete: false, permissionCreate: false },
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
        },
        resellerCategory: resellerType,
        lastActivity: new Date().toISOString(),
        status: 'ACTIVE',
        company:
          resellerType === 'COMPANY'
            ? {
                title: values.companyTitle,
                domain: values.companyDomain,
                phone: values.companyPhone,
                officialEmail: values.companyEmail,
                address: values.companyAddress,
                dateEstablished: values.dateEstablished,
              }
            : undefined,
      }

      if (editId && !isView) {
        const updatePayload = { resellerId: editId, ...formattedData }
        const response = await updateReseller(updatePayload)
        console.log('Update Reseller Response:', response)
        if (response === 'OPERATION_SUCCESS') {
          toast.success('Reseller updated successfully.')
          fetchResellerData()
          close()
        } else if (response === 'STAFF_ALREADY_EXISTS_EMAIL') {
          setErrorMessage('An account with this email address already exists. Please use a different email address.')
          setErrorModalOpen(true)
        } else {
          throw new Error(`Failed to update reseller: ${JSON.stringify(response) || 'Unknown error'}`)
        }
      } else {
        const response = await createReseller(formattedData)
        console.log('Create Reseller Response:', response)
        if (
          response &&
          typeof response === 'string' &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(response)
        ) {
          toast.success('Reseller added successfully.')
          fetchResellerData && fetchResellerData()
          close()
        } else if (response === 'STAFF_ALREADY_EXISTS_EMAIL') {
          setErrorMessage('An account with this email address already exists. Please use a different email address.')
          setErrorModalOpen(true)
        } else {
          throw new Error(`Failed to create reseller: ${JSON.stringify(response) || 'Unknown error'}`)
        }
      }
    } catch (error) {
      console.error('Error in onSubmit:', error)
      setErrorMessage('An error occurred while processing your request. Please try again.')
      setErrorModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminUpdate = async () => {
    const values = getValues()
    console.log('Admin Update Values:', values)
    try {
      setLoading(true)
      const updatePayload = {
        resellerId: editId,
        admin: {
          ...resellerData.admin, // Preserve existing admin data
          firstName: values.firstName,
          lastName: values.secondName,
          fullName: `${values.firstName} ${values.secondName}`,
          email: values.email,
          contactNumber: values.contactNumber,
          address: values.address,
          Gender: values.gender,
          designation: values.designation,
          emergencyContactNumber: values.emergencyContactNumber || '',
          emergencyContactPerson: values.emergencyContactPerson || '',
          dateOfBirth: values.dateOfBirth,
        },
        resellerCategory: resellerData.resellerCategory,
        lastActivity: resellerData.lastActivity || new Date().toISOString(),
        status: resellerData.status || 'ACTIVE',
        company: resellerData.company, // Keep existing company data
      }
      const response = await updateReseller(updatePayload)
      console.log('Admin Update Response:', response)
      if (response === 'OPERATION_SUCCESS') {
        toast.success('Admin details updated successfully.')
        fetchResellerData()
        close()
      } else {
        throw new Error(`Failed to update admin: ${JSON.stringify(response) || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Admin Update Error:', error)
      toast.error(error.message || 'Failed to update admin')
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyUpdate = async () => {
    const values = getValues()
    console.log('Company Update Values:', values)
    try {
      setLoading(true)
      const updatePayload = {
        resellerId: editId,
        admin: resellerData.admin, // Keep existing admin data
        resellerCategory: resellerType,
        lastActivity: resellerData.lastActivity || new Date().toISOString(),
        status: resellerData.status || 'ACTIVE',
        company: {
          title: values.companyTitle,
          domain: values.companyDomain,
          phone: values.companyPhone,
          officialEmail: values.companyEmail,
          address: values.companyAddress,
          dateEstablished: values.dateEstablished,
        },
      }
      const response = await updateReseller(updatePayload)
      console.log('Company Update Response:', response)
      if (response === 'OPERATION_SUCCESS') {
        toast.success('Company details updated successfully.')
        fetchResellerData()
        close()
      } else {
        throw new Error(`Failed to update company: ${JSON.stringify(response) || 'Unknown error'}`)
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

  const fetchAllDesignation = async () => {
    try {
      const res = await getAllDesignation()
      const formattedOptions = res?.data?.map((item) => ({
        label: item.designationName,
        value: item.designationName,
      }))
      setOptions(formattedOptions)
    } catch (error) {
      console.error('Error fetching designations:', error)
    }
  }

  useEffect(() => {
    if (editId) fetchResellerDetails()
    fetchAllDesignation()
  }, [editId])

  return (
    <>
      <Global
        styles={{
          '.MuiDialog-root': {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          body: {
            overflow: open ? 'hidden' : 'auto',
            paddingRight: '0px !important',
          },
        }}
      />
      <Dialog
        open={open}
        onClose={() => {
          isDirty ? openWarningModal() : close()
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
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        sx={{
          '& .MuiDialog-paper': {
            position: 'relative',
            zIndex: 1,
          },
          '& .MuiDialog-container': {
            height: '100%',
          },
        }}
        disableScrollLock={true}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
      >
        <DialogTitle>{editId ? (isView ? 'View Reseller' : 'Edit Reseller') : 'Add Reseller'}</DialogTitle>
        <DialogContent>
          <form>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1, color: '#666666', fontSize: '14px' }}>Reseller Category</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={resellerType === 'INDIVIDUAL' ? 'contained' : 'outlined'}
                  onClick={() => setResellerType('INDIVIDUAL')}
                  sx={{
                    minWidth: '120px',
                    height: '40px',
                    textTransform: 'none',
                    backgroundColor: resellerType === 'INDIVIDUAL' ? '#4489FE' : 'transparent',
                    color: resellerType === 'INDIVIDUAL' ? '#fff' : '#666666',
                    '&:hover': {
                      backgroundColor: resellerType === 'INDIVIDUAL' ? '#4489FE' : 'transparent',
                    },
                  }}
                >
                  Individual
                </Button>
                <Button
                  variant={resellerType === 'COMPANY' ? 'contained' : 'outlined'}
                  onClick={() => setResellerType('COMPANY')}
                  sx={{
                    minWidth: '120px',
                    height: '40px',
                    textTransform: 'none',
                    backgroundColor: resellerType === 'COMPANY' ? '#4489FE' : 'transparent',
                    color: resellerType === 'COMPANY' ? '#fff' : '#666666',
                    '&:hover': {
                      backgroundColor: resellerType === 'COMPANY' ? '#4489FE' : 'transparent',
                    },
                  }}
                >
                  Company
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#212121' }}>
                  {resellerType === 'INDIVIDUAL' ? 'Personal Information' : 'Point of Contact Information'}
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

              {resellerType === 'COMPANY' && (
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
                        onClick={handleSubmit(handleAdminUpdate)}
                      >
                        Update Admin
                      </Button>
                      {resellerType === 'COMPANY' && (
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
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || (!editId && !isPasswordValid)}
                      sx={{
                        minWidth: '160px',
                        height: '42px',
                        color: '#fff',
                        backgroundColor: '#4489FE',
                        '&:hover': {
                          backgroundColor: '#4489FE',
                        },
                      }}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Create Reseller
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
        title="Reseller Creation Error"
        message={errorMessage}
      />
    </>
  )
}

AddResellerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  editId: PropTypes.string,
  isView: PropTypes.bool,
  fetchResellerData: PropTypes.func,
}

export default AddResellerModal
