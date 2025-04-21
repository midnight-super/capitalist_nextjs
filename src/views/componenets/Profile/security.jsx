'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  FormHelperText,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { updateStaffPassword } from '@/services/staff.service'
import axiosWithAuth from '@/services/index'
import SuccessModal from '@/components/SuccessModal'
import PasswordFields from '@/components/PasswordFields'
import { useRouter } from 'next/router'

const SettingsSidebar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: 240,
  position: 'sticky',
  top: theme.spacing(2),
  height: 'fit-content',
  boxShadow: 'none',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}))

const ContentArea = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  boxShadow: 'none',
}))

export default function Security({ data, onSave, staffId }) {
  const [selectedSetting, setSelectedSetting] = useState('security')
  const [formData, setFormData] = useState(data)
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('UTC-03:30, Nepal Standard')
  const [emailNotification, setEmailNotification] = useState(true)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    confirmCurrentPassword: '',
    newPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    confirmCurrentPassword: '',
    newPassword: '',
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()

  // Check user role from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const userRole = user?.role
    setIsAdmin(userRole === 'ENTERPRISEADMIN' || userRole === 'CLIENTADMIN')
  }, [])

  // First, add a function to get staff details
  const getStaffDetails = async () => {
    try {
      const response = await axiosWithAuth.get(`/staff/${staffId}`)
      if (response.data) {
        // Update form data with staff details
        setFormData(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch staff details')
    }
  }

  // Add useEffect to fetch staff details when component mounts
  useEffect(() => {
    if (staffId) {
      getStaffDetails()
    }
  }, [staffId])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(formData)
  }

  const handlePasswordChange = (field) => (event) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const validatePasswords = () => {
    const errors = {}
    const passwordRequirements = [
      { test: (pwd) => pwd.length >= 8, message: 'Password must be at least 8 characters' },
      { test: (pwd) => /[A-Z]/.test(pwd), message: 'Password must contain an uppercase letter' },
      { test: (pwd) => /[a-z]/.test(pwd), message: 'Password must contain a lowercase letter' },
      { test: (pwd) => /[0-9]/.test(pwd), message: 'Password must contain a number' },
      { test: (pwd) => /[!@#$%^&*]/.test(pwd), message: 'Password must contain a special character' },
    ]

    if (!isAdmin) {
      // Regular user validation
      if (!passwordData.currentPassword) {
        errors.currentPassword = 'Current password is required'
      }
      if (!passwordData.confirmCurrentPassword) {
        errors.confirmCurrentPassword = 'Please confirm your current password'
      }
      if (passwordData.currentPassword !== passwordData.confirmCurrentPassword) {
        errors.confirmCurrentPassword = 'Current passwords do not match'
      }
    }

    // Validate new password against all requirements
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required'
    } else {
      const failedRequirements = passwordRequirements.find((req) => !req.test(passwordData.newPassword))
      if (failedRequirements) {
        errors.newPassword = failedRequirements.message
      }
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdatePassword = async () => {
    if (!staffId) {
      toast.error('Staff ID is missing')
      return
    }

    const isValid = validatePasswords()
    if (!isValid) {
      return
    }

    try {
      setLoading(true)
      let response

      if (isAdmin) {
        response = await axiosWithAuth.post(`/staff/resetPasswordByAdmin?staffId=${staffId}`, {
          password: passwordData.newPassword,
        })

        if (response?.data === 'OPERATION_SUCCESS') {
          // toast.success('Password reset successfully');
          handleClosePasswordModal()
          setShowSuccessModal(true)
        } else {
          toast.error('Failed to reset password')
        }
      } else {
        response = await updateStaffPassword({
          staffId: staffId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })

        if (response === 'OPERATION_SUCCESS') {
          toast.success('Password updated successfully')
          handleClosePasswordModal()
          setShowSuccessModal(true)
        } else {
          toast.error('Failed to update password')
        }
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${isAdmin ? 'reset' : 'update'} password`)
    } finally {
      setLoading(false)
    }
  }

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false)
    setPasswordData({
      currentPassword: '',
      confirmCurrentPassword: '',
      newPassword: '',
    })
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const renderSettingsContent = () => {
    switch (selectedSetting) {
      case 'security':
        return (
          <Stack spacing={4} component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>
              Password & Security
            </Typography>
            {/* password field */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                disabled
                value="••••••••••••••"
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: '#666666',
                    '&.Mui-focused': {
                      color: '#666666',
                    },
                  },
                }}
                sx={{
                  width: '400px',
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextSecurity: 'disc',
                    color: '#666',
                    fontSize: '14px',
                    padding: '16.5px 14px',
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '48px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                    transform: 'translate(14px, -9px) scale(0.75)',
                    '&.Mui-disabled': {
                      color: '#666666',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#DEE0E4',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => setPasswordModalOpen(true)}
                sx={{
                  width: '168px',
                  height: '48px',
                  borderRadius: '4px',
                  textTransform: 'none',
                  backgroundColor: '#4489FE',
                  '&:hover': {
                    backgroundColor: '#4489FE',
                  },
                }}
              >
                Edit
              </Button>
            </Box>
            {/* email field */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: '#666666',
                    '&.Mui-focused': {
                      color: '#666666',
                    },
                  },
                }}
                sx={{
                  width: '400px',
                  '& .MuiOutlinedInput-root': {
                    height: '48px',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '16.5px 14px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#DEE0E4',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: '168px',
                  height: '48px',
                  borderRadius: '4px',
                  textTransform: 'none',
                  backgroundColor: '#4489FE',
                  '&:hover': {
                    backgroundColor: '#4489FE',
                  },
                }}
              >
                Edit
              </Button>
            </Box>
          </Stack>
        )
      case 'language':
        return (
          <Stack spacing={4}>
            <Typography variant="h5" gutterBottom>
              Language & Timezone
            </Typography>
            {/* language field */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl
                fullWidth
                sx={{
                  width: '400px',
                  height: '63px',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '16.41px',
                }}
              >
                <InputLabel>Language</InputLabel>
                <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)}>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{
                  width: '168px',
                  height: '50px',
                  borderRadius: '4px',
                }}
              >
                Save
              </Button>
            </Box>
            {/* timezone field */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl
                fullWidth
                sx={{
                  width: '400px',
                  height: '63px',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '16.41px',
                }}
              >
                <InputLabel>Timezone</InputLabel>
                <Select value={timezone} label="Timezone" onChange={(e) => setTimezone(e.target.value)}>
                  <MenuItem value="UTC-03:30, Nepal Standard">UTC-03:30, Nepal Standard</MenuItem>
                  <MenuItem value="UTC+00:00, London">UTC+00:00, London</MenuItem>
                  <MenuItem value="UTC-08:00, Pacific">UTC-08:00, Pacific</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{
                  width: '168px',
                  height: '50px',
                  borderRadius: '4px',
                }}
              >
                Save
              </Button>
            </Box>
          </Stack>
        )
      case 'notification':
        return (
          <Stack spacing={4}>
            <Typography variant="h5" gutterBottom>
              Notification
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'start',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    fontSize: '15px',
                    lineHeight: '20px',
                    color: '#212121',
                    marginBottom: '15px',
                  }}
                >
                  E-mail Notification
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '18px',
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                </Typography>
              </Box>
              <Switch
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
                sx={{
                  marginLeft: '20px',
                  width: '65px',
                  height: '45px',
                  gap: 2,
                  padding: 1,
                  '& .MuiSwitch-switchBase': {
                    padding: 1,
                    '&.Mui-checked': {
                      transform: 'translateX(20px)',
                      '& .MuiSwitch-thumb': {
                        backgroundColor: '#FFFFFF',
                      },
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#4489FE',
                      },
                    },
                  },
                  '& .MuiSwitch-thumb': {
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#FFFFFF',
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: '15.5px',
                    backgroundColor: '#ccc',
                    opacity: 1,
                    transition: 'background-color 0.3s',
                  },
                }}
              />
            </Box>
          </Stack>
        )
      default:
        return null
    }
  }

  // Update the success modal content based on user type
  const getSuccessModalContent = () => ({
    title: isAdmin ? 'Password Reset Successfully' : 'Password Updated Successfully',
    message: isAdmin
      ? 'The password has been successfully reset. The user will need to use this new password for their next login.'
      : 'Your password has been successfully updated. Next time you login, please use the new password, as the old password will no longer be valid.',
    buttonText: 'Got it',
  })

  return (
    <Box
      sx={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: '400px', mx: 'auto' }}>
        {/* Password field - disabled, no edit button */}
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          disabled
          value="••••••••••••••"
          InputLabelProps={{
            shrink: true,
            sx: {
              color: '#666666',
              '&.Mui-focused': {
                color: '#666666',
              },
            },
          }}
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextSecurity: 'disc',
              color: '#666',
              fontSize: '14px',
              padding: '16.5px 14px',
            },
            '& .MuiOutlinedInput-root': {
              height: '48px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              transform: 'translate(14px, -9px) scale(0.75)',
              '&.Mui-disabled': {
                color: '#666666',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#DEE0E4',
            },
          }}
        />

        {/* Email field - disabled */}
        <TextField
          fullWidth
          label="Email"
          value={formData?.email || ''}
          disabled
          InputLabelProps={{
            shrink: true,
            sx: {
              color: '#666666',
              '&.Mui-focused': {
                color: '#666666',
              },
            },
          }}
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              color: '#666',
              fontSize: '14px',
            },
            '& .MuiOutlinedInput-root': {
              height: '48px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              transform: 'translate(14px, -9px) scale(0.75)',
              '&.Mui-disabled': {
                color: '#666666',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#DEE0E4',
            },
          }}
        />

        {/* Update Password Button - centered at bottom */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => setPasswordModalOpen(true)}
            sx={{
              width: '200px',
              height: '50px',
              borderRadius: '4px',
              textTransform: 'none',
              backgroundColor: '#4489FE',
              '&:hover': {
                backgroundColor: '#4489FE',
              },
            }}
          >
            Update Password
          </Button>
        </Box>
      </Stack>

      {/* Keep existing Dialog for password update */}
      <Dialog
        open={passwordModalOpen}
        onClose={handleClosePasswordModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: '586px',
            padding: '24px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            color: '#212121',
            fontWeight: 700,
            pb: 2,
          }}
        >
          {isAdmin ? 'Reset Password' : 'Change Password'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              {!isAdmin && (
                <>
                  <FormControl fullWidth error={!!passwordErrors.currentPassword}>
                    <TextField
                      label="Current Password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange('currentPassword')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                              {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {passwordErrors.currentPassword && (
                      <FormHelperText>{passwordErrors.currentPassword}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth error={!!passwordErrors.confirmCurrentPassword}>
                    <TextField
                      label="Confirm Current Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmCurrentPassword}
                      onChange={handlePasswordChange('confirmCurrentPassword')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {passwordErrors.confirmCurrentPassword && (
                      <FormHelperText>{passwordErrors.confirmCurrentPassword}</FormHelperText>
                    )}
                  </FormControl>
                </>
              )}

              <PasswordFields
                control={{
                  register: () => ({
                    value: passwordData.newPassword,
                    onChange: (e) => handlePasswordChange('newPassword')(e),
                  }),
                }}
                errors={passwordErrors}
                watch={() => passwordData.newPassword}
                hideConfirmPassword={true}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClosePasswordModal}
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
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  sx={{
                    textTransform: 'capitalize',
                    width: '200px',
                    height: '50px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    backgroundColor: '#4489FE',
                    '&:hover': {
                      backgroundColor: '#4489FE',
                    },
                  }}
                >
                  {loading ? 'Updating...' : isAdmin ? 'Reset Password' : 'Update Password'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      {showSuccessModal && (
        <SuccessModal
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          {...getSuccessModalContent()}
        />
      )}
    </Box>
  )
}
