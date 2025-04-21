import {
  Box,
  Button,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormHelperText,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { getAllDesignation } from '@/services/designation.service'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { getStaffByID, updateStaff } from '@/services/staff.service'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function MainInformation({ gender, setGender, designation, setDesignation }) {
  const router = useRouter()
  const { staffId } = router.query
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState([])
  const [tabValue, setTabValue] = useState(0)

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  useEffect(() => {
    const fetchAllDesignation = async () => {
      try {
        const res = await getAllDesignation()
        setOptions(
          res?.data?.map((item) => ({
            label: item.designationName,
            value: item.designationName,
          }))
        )
      } catch (error) {
        console.error('Error fetching designations:', error)
      }
    }

    fetchAllDesignation()
  }, [])

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      designation: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      address: '',
      emergencyContactPerson: '',
      emergencyContactNumber: '',
    },
  })

  useEffect(() => {
    if (staffId) {
      console.log('Fetching staff details for ID:', staffId)
      const fetchData = async () => {
        setLoading(true)
        try {
          const data = await getStaffByID(staffId)
          console.log('Fetched Staff Data:', data)
          if (data) {
            // Update React Hook Form values
            setValue('firstName', data.firstName || '')
            setValue('lastName', data.lastName || '')
            setValue('secondName', data.lastName || '')
            setValue('designation', data.designation || '')
            setValue('gender', data.Gender || '')
            setValue('dateOfBirth', data.dateOfBirth || '')
            setValue('contactNumber', data.contactNumber || '')
            setValue('address', data.address || '')
            setValue('emergencyContactPerson', data.emergencyContactPerson || '')
            setValue('emergencyContactPerson', data.emergencyContactPerson || 'N/A')
          }
        } catch (error) {
          console.error('Error fetching staff data:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [staffId, setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formattedData = {
        staffId: staffId,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        contactNumber: data.contactNumber,
        address: data.address,
        Gender: data.gender,
        designation: data.designation,
        emergencyContactNumber: data.emergencyContactNumber || '',
        emergencyContactPerson: data.emergencyContactPerson || '',
        dateOfBirth: data.dateOfBirth,
        status: 'ACTIVE',
        emailNotification: true,
      }

      const response = await updateStaff(formattedData)
      if (response === 'OPERATION_SUCCESS') {
        toast.success('Staff updated Successfully.')
        // Navigate back to the staff list
        router.push('/user-management/staff')
      } else if (response === 'RECORD_DUPLICATE') {
        toast.error('Staff with this name already exists')
      } else {
        throw new Error('Failed to update staff')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <Grid container spacing={3}>
        {/* First Name and Last Name */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="First Name" variant="outlined" />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Second Name" variant="outlined" />}
          />
        </Grid>

        {/* Designation and Gender */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Designation</InputLabel>
            <Controller
              name="designation"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Designation" fullWidth>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.designation && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.designation.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select {...field} label="Gender">
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* Date of Birth and Contact Number */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="contactNumber"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Contact Number" variant="outlined" />}
          />
        </Grid>

        {/* Emergency Contact Person and Number */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="emergencyContactPerson"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Emergency Contact Person" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="emergencyContactNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Emergency Contact Number" variant="outlined" />
            )}
          />
        </Grid>

        {/* Address - Full Width */}
        <Grid item xs={12}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Address" multiline rows={4} variant="outlined" />
            )}
          />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 10 }}>
        <Button
          variant="outlined"
          color="inherit"
          sx={{ width: '200px', height: '50px', borderRadius: '4px' }}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: '200px', height: '50px', borderRadius: '4px' }}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  )
}
