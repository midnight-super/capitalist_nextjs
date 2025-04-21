import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import moment from 'moment'
import * as yup from 'yup'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '@/components/customTextField'
import AutoCompleteMenu from '@/components/customDropdown'
import { yupResolver } from '@hookform/resolvers/yup'
import { create, update } from '@/services/event.service'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { generateRandomString } from '@/utils'
import WarningModal from '@/views/componenets/warningModal'

const platforms = [
  {
    value: 'zoom',
    label: 'Zoom',
  },
  // {
  //   value: 'teams',
  //   label: 'Teams',
  // },
  // {
  //   value: 'google Meet',
  //   label: 'Google Meet',
  // },
]
const AddBasicModal = ({
  open,
  close,
  editData,
  viewId,
  fetchData,
  isFromHeader,
  handleAdvanceAddOpen,
  savedData,
  basicData,
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedPlatform, setSlectedPlatform] = useState({
    value: platforms?.[0]?.value,
    label: platforms?.[0]?.label,
  })
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(null)
  const [checked, setChecked] = useState(false)
  const [warningOpen, setWarningModal] = useState(false)
  const openWarningModal = () => {
    setWarningModal(true)
  }

  const handleChange = (event) => {
    setChecked(event.target.checked)
  }
  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }
  const auth = useAuth()
  const router = useRouter()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isMedium = useMediaQuery('(min-width:600px)')

  const schema = yup.object().shape({
    eventName:
      !viewId && yup.string().max(65, 'Event name cannot exceed 65 characters').required('Event name is required'),
    platform: !viewId && yup.string().required('Platform is required'),
    meetingId:
      !viewId &&
      yup
        .string()
        .matches(/^\d{10,11}$/, 'Meeting ID must be 10 or 11 digits with no spaces')
        .required('Meeting ID is required'),
    zoomCCEndpoint:
      !viewId &&
      yup
        .string()
        .notRequired()
        .matches(
          /^https:\/\/.*\.zoom\.us(\/.*)?$/,
          "Zoom CC Endpoint must start with 'https://' and be a valid 'zoom.us' URL"
        ),
    passKey:
      checked &&
      !viewId &&
      yup
        .string()
        .matches(/^\S{6}$/, 'PassKey must be exactly 6 characters with no spaces')
        .required('PassKey is required'),
    startDate:
      !viewId && yup.date().required('Start Date is required').min(today, 'Start Date cannot be earlier than today'),
    endDate:
      !viewId &&
      yup
        .date()
        .required('End Date is required')
        .min(today, 'End Date cannot be earlier than today')
        .test('is-valid-difference', 'Difference can’t be more than 30 hours', function (value) {
          const { startDate } = this.parent
          if (startDate && value) {
            const start = new Date(startDate)
            const end = new Date(value)
            const differenceInHours = (end - start) / (1000 * 60 * 60)
            return differenceInHours <= 30
          }
          return true
        })
        .test('is-after-start', 'End Date can’t be before Start Date', function (value) {
          const { startDate } = this.parent
          if (startDate && value) {
            return new Date(value) >= new Date(startDate)
          }
          return true
        }),
  })

  const defaultValue = {
    eventName: null,
    platform: platforms?.[0]?.value,
    zoomCCEndpoint: null,
    streamKey: null,
    startDate: moment().format('YYYY-MM-DDTHH:mm'),
    endDate: moment().format('YYYY-MM-DDTHH:mm'),
    isSecure: false,
    passKey: null,
    meetingId: null,
  }
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValue,
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  // const streamList = [
  //     { value: 'RMTP', label: 'RMTP' },
  //     { value: 'Bot', label: 'Bot' }
  // ];

  useEffect(() => {
    if (editData) {
      setValue('eventName', editData?.eventName)
      setValue('platform', editData?.platform)
      setValue('startDate', editData?.startDate)
      setValue('endDate', editData?.endDate)
      setValue('zoomCCEndpoint', editData?.zoomCCEndpoint)
      setValue('streamKey', editData?.streamKey)
      setValue('passKey', editData?.passKey)
      setValue('isSecure', editData?.isSecure)
      setValue('meetingId', editData?.meetingId)
      setChecked(editData?.isSecure)

      const selectedPlatform = platforms.find((platform) => platform.value === editData?.platform)
      setSlectedPlatform(selectedPlatform || null)
    }
  }, [editData])
  useEffect(() => {
    if (basicData) {
      setValue('eventName', basicData?.eventName)
      setValue('platform', basicData?.platform)
      setValue('startDate', basicData?.startDate)
      setValue('endDate', basicData?.endDate)
      setValue('zoomCCEndpoint', basicData?.zoomCCEndpoint)
      setValue('streamKey', basicData?.streamKey)
      setValue('passKey', basicData?.passKey)
      setValue('isSecure', basicData?.isSecure)
      setValue('meetingId', basicData?.meetingId)
      setChecked(basicData?.isSecure)
      const selectedPlatform = platforms.find((platform) => platform.value === basicData?.platform)
      setSlectedPlatform(selectedPlatform || null)
    }
  }, [basicData])

  useEffect(() => {
    const value = generateRandomString()

    if (!basicData?.streamKey && !viewId && !editData?.eventId) {
      setValue('streamKey', value)
    }
    if (!viewId && editData?.eventId && !basicData?.streamKey && !editData?.streamKey) {
      setValue('streamKey', value)
    }
  }, [viewId, editData, basicData])

  const handleNext = (data) => {
    handleAdvanceAddOpen()
    savedData(data)
    return
  }

  const submitData = async (data) => {
    try {
      let finalData = {
        ...(basicData && basicData),
        ...data,
        eventId: editData?.eventId || null,
        passKey: checked ? data?.passKey : null,
      }
      setLoading(true)
      if (editData?.eventId) {
        finalData = {
          ...(basicData && basicData),
          ...data,
          eventId: editData?.eventId || null,
          passKey: checked ? data?.passKey : null,
          outputLanguage: editData?.outputLanguage,
          speakerIdentification: editData?.speakerIdentification,
          maxCharactersPerLine: editData?.maxCharactersPerLine,
          maxLinesPerFrame: editData?.maxLinesPerFrame,
          inputLanguage: editData?.inputLanguage,
          modelType: editData?.modelType,
          maxSpeakerCount: editData?.maxSpeakerCount,
          translationType: editData?.translationType,
          fontStyle: editData?.fontStyle,
          fontSize: editData?.fontSize,
          textColor: editData?.textColor,
          backgroundColor: editData?.backgroundColor,
          SpeakerIdFormat: editData?.SpeakerIdFormat,
          profanityFilter: editData?.profanityFilter,
          punctuation: editData?.punctuation,
        }
        const res = await update(finalData)
        if (res === 'OPERATION_SUCCESS') {
          toast.success('Event Updated Successfully.')
          setLoading(false)
          fetchData()
          close()
        }
      } else {
        finalData = {
          ...(basicData && basicData),
          ...data,
          passKey: checked ? data?.passKey : null,
          eventId: editData?.eventId || null,
          outputLanguage: 'en-US',
          speakerIdentification: true,
          maxCharactersPerLine: 42,
          maxLinesPerFrame: 2,
          inputLanguage: 'en-US',
          modelType: 'general',
          maxSpeakerCount: 3,
          translationType: 'caption',
          fontStyle: 'arial',
          fontSize: '28px',
          textColor: '#FFFFFF',
          backgroundColor: '#212121',
          SpeakerIdFormat: 'json',
          profanityFilter: true,
          punctuation: true,
        }

        const res = await create(finalData)
        if (res === 'OPERATION_SUCCESS') {
          toast.success('Event Created Successfully.')
          setLoading(false)
          if (!isFromHeader) {
            fetchData()
          } else if (auth?.user?.role === 'ENTERPRISEADMIN' || auth?.user?.role === 'ENTERPRISESTAFF') {
            router.push('/admin/manage-events')
          }
          close()
        }
      }
    } catch (error) {
      toast.error(error)
      console.error('Error submitting form:', error)
      setLoading(false)
    }
  }

  const handleCopyClick = (textToCopy, field) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success(`${field} Copied!`, {
          position: 'top-right',
          duration: 2000,
        })
      })
      .catch((error) => {
        toast.error(`Failed to Copy ${field}`, {
          position: 'top-right',
          duration: 2000,
        })
      })
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
          viewId ? close() : openWarningModal()
        }}
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: '1094px !important',
            height: '553px',
            boxShadow: 'none',
            // overflow: 'hidden'
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        disableScrollLock={true}
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            color: '#212121',
            px: '27px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 700,
            backgroundColor: '##FFF',
            height: '60px',
          }}
        >
          {'Event Details'}
          <span
            onClick={close}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img src="/icons/closeIcon.svg" alt="close" />
          </span>
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit(submitData)}>
          <DialogContent sx={{ p: '46px 27px' }}>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <CircularProgress />
              </div>
            )}
            <Box sx={{ px: '16px', height: '100%', overflowY: 'auto' }}>
              <Typography sx={{ color: '#757575', fontSize: '14px', fontWeight: 600 }}>Basic Event Details</Typography>
              <Grid container spacing={2} sx={{ m: '20px 0px 0px 0px' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ height: '70px' }}>
                    <Controller
                      name="eventName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          error={!!errors.eventName}
                          value={value}
                          label={'Event Name'}
                          onChange={onChange}
                          disabled={viewId}
                        />
                      )}
                    />
                    {errors.eventName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.eventName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ height: '70px' }}>
                    <Controller
                      name="platform"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <AutoCompleteMenu
                          value={selectedPlatform}
                          setValue={(newValue) => {
                            onChange(newValue?.value || null)
                            setSlectedPlatform(newValue)
                          }}
                          option={platforms}
                          placeHolder={'Select'}
                          label={'Platform'}
                          width={'100%'}
                          isEnabled={viewId}
                          error={!!errors.platform}
                        />
                      )}
                    />
                    {errors.platform && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.platform.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ height: '70px' }}>
                    <Controller
                      name="zoomCCEndpoint"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CustomTextField
                            handleBlur={handleBlur}
                            handleFocus={handleFocus}
                            disabled={viewId}
                            type={'text'}
                            value={value}
                            label={
                              isFocused || inputValue ? (
                                <>
                                  Caption URL
                                  <Tooltip
                                    PopperProps={{
                                      sx: {
                                        color: '#FFFFFF',
                                        '& .MuiTooltip-arrow': {
                                          marginLeft: '12px',
                                        },
                                      },
                                    }}
                                    slotProps={{
                                      tooltip: {
                                        sx: {
                                          marginLeft: '-20px',
                                          width: '424px !important',
                                          height: '96px',
                                          minWidth: '400px !important',
                                          borderRadius: '8px',
                                          background: '#FFFFFF',
                                          color: '#5D5D5D',
                                          padding: '8px px',
                                          lineHeight: '20px',
                                          textAlign: 'center',
                                          fontSize: '14px',
                                          fontWeight: 400,
                                          boxShadow: '0px 4px 6px rgba(231, 231, 231, 1)',
                                        },
                                      },
                                      arrow: {
                                        sx: {
                                          color: '#FFFFFF',
                                        },
                                      },
                                    }}
                                    arrow
                                    title={`In the control toolbar of your Zoom meeting, click the up arrow next to "Show Captions" and select "Set up manual captioner." Then  click "Copy the API token" to copy the token to your clipboard. `}
                                    placement="top-start"
                                  >
                                    <img
                                      style={{
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        marginLeft: '4px',
                                      }}
                                      src="/icons/help.svg"
                                      alt=""
                                    />
                                  </Tooltip>
                                </>
                              ) : (
                                'Caption URL'
                              )
                            }
                            onChange={(e) => {
                              onChange(e.target.value)
                              setInputValue(e.target.value)
                            }}
                          />
                        )
                      }}
                    />
                    {errors.zoomCCEndpoint && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.zoomCCEndpoint.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ height: '70px' }}>
                    <Controller
                      name="streamKey"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          copyLink={() => handleCopyClick(value, 'Streaming Key')}
                          fieldName={'streamKey'}
                          value={value}
                          label={'Streaming Key'}
                          type={'text'}
                          disabled={true}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth sx={{ height: '40px' }}>
                    <Controller
                      name="isSecure"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <FormControlLabel
                            sx={{
                              color: '#757575',
                              '& .MuiTypography-root': {
                                color: '#757575',
                                lineHeight: '20px',
                                fontSize: '14px',
                                fontWeight: 400,
                              },
                            }}
                            control={
                              <Checkbox
                                disableRipple
                                checked={checked}
                                onChange={(e) => {
                                  onChange(e.target.checked)
                                  handleChange(e)
                                }}
                                icon={<img src="/icons/globalCheckBox.svg" alt="" />}
                                checkedIcon={<img src="/icons/globalChecked.svg" alt="" />}
                                sx={{
                                  width: '45px',
                                  padding: 0,
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  },
                                }}
                              />
                            }
                            label="Check for secure, Private Meeting (Password Protected)"
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>

                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth sx={{ height: '70px' }}>
                      <Controller
                        name="meetingId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fieldName={'meetingId'}
                            error={!!errors.meetingId}
                            value={value}
                            label={'Meeting ID'}
                            onChange={onChange}
                            disabled={viewId}
                          />
                        )}
                      />
                      {errors.meetingId && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.meetingId.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {!checked && <Grid size={6}></Grid>}
                </>

                {checked && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="passKey"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fieldName={'passKey'}
                              error={!!errors.passKey}
                              value={value}
                              label={'Security Key'}
                              type={'text'}
                              onChange={onChange}
                            />
                          )}
                        />
                        {errors.passKey && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.passKey.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ height: '70px' }}>
                    <Controller
                      name="startDate"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CustomTextField
                            disabled={viewId}
                            type={'datetime-local'}
                            value={value}
                            label={'Start Date'}
                            onChange={onChange}
                          />
                        )
                      }}
                    />
                    {errors.startDate && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.startDate.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth sx={{ height: '70px' }}>
                    <Controller
                      name="endDate"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CustomTextField
                            disabled={viewId}
                            type={'datetime-local'}
                            value={value}
                            label={'End Date'}
                            onChange={onChange}
                          />
                        )
                      }}
                    />
                    {errors.endDate && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.endDate.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Button
                    onClick={handleSubmit(handleNext)}
                    variant="outlined"
                    sx={{
                      textTransform: 'capitalize',
                      width: isMedium ? '168px' : '100%',
                      height: '40px',
                      borderRadius: '4px',
                      border: '1px solid #4489FE',
                      color: '#4489FE',
                      fontWeight: 500,
                      lineHeight: '16.41px',
                      fontSize: '14px',
                    }}
                  >
                    Advanced Settings
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                mt: '24px',
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'capitalize',
                  width: '175px',
                  color: '#757575',
                  height: '50px',
                  borderRadius: '4px',
                  border: '1px solid #4489FE',
                  color: '#4489FE',
                  fontWeight: 500,
                  lineHeight: '16.41px',
                  fontSize: '14px',
                }}
                onClick={close}
              >
                Cancel
              </Button>
              {!viewId && (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    textTransform: 'capitalize',
                    width: '175px',
                    height: '50px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontWeight: 500,
                    lineHeight: '16.41px',
                    fontSize: '14px',
                  }}
                  fullWidth
                >
                  {editData ? 'Update' : 'Submit'}
                </Button>
              )}
            </Box>
          </DialogContent>
        </form>
      </Dialog>

      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={hanndleWarningClose} />
      )}
    </>
  )
}

export default AddBasicModal
