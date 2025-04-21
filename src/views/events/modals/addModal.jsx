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
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '@/components/customTextField'
import AutoCompleteMenu from '@/components/customDropdown'
import moment from 'moment'
import ColorPicker from 'react-pick-color'
import CustomSwitch from '@/components/CustomSwitch'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { create, update } from '@/services/event.service'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import BoxFileSvg from '@/menu-icons/boxFileSvg'
import WarningModal from '@/views/componenets/warningModal'

const platforms = [
  {
    value: 'zoom',
    label: 'Zoom',
  },
  {
    value: 'teams',
    label: 'Teams',
  },
  {
    value: 'google Meet',
    label: 'Google Meet',
  },
]
const inputlanguages = [
  {
    value: 'en-US',
    label: 'English',
  },
  {
    value: 'es-US',
    label: 'Spanish',
  },
]
const outputlanguages = [
  {
    value: 'en-US',
    label: 'English',
  },
  {
    value: 'es-US',
    label: 'Spanish',
  },
]

const modalTypes = [
  {
    value: 'general',
    label: 'General',
  },
]

const formatList = [
  {
    value: 'json',
    label: 'JSON',
  },
  {
    value: 'text',
    label: 'Text',
  },
]
const translationType = [
  {
    value: 'caption',
    label: 'Real-Time Captions',
  },
]
const fontStyleList = [
  { value: 'arial', label: 'Arial' },
  { value: 'timesNewRoman', label: 'Times New Roman' },
  { value: 'calibri', label: 'Calibri' },
  { value: 'verdana', label: 'Verdana' },
  { value: 'georgia', label: 'Georgia' },
]
const AddModal = ({
  open,
  close,
  setSuccess,
  editData,
  viewId,
  fetchData,
  isFromHeader,
  handleBack,
  savedData,
  advanceData,
  basicData,
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState({
    value: inputlanguages?.[0]?.value,
    label: inputlanguages?.[0]?.label,
  })
  const [selectedOutputLanguage, setSelectedOutputLanguage] = useState({
    value: outputlanguages?.[0]?.value,
    label: outputlanguages?.[0]?.label,
  })
  const [selectedModalType, setSelectedModalType] = useState({
    value: modalTypes?.[0]?.value,
    label: modalTypes?.[0]?.label,
  })
  const [selectedFormat, setSelectedFormat] = useState({
    value: formatList?.[0]?.value,
    label: formatList?.[0]?.label,
  })
  const [selectedTranslation, setSelectedTranslation] = useState({
    value: translationType?.[0]?.value,
    label: translationType?.[0]?.label,
  })
  const [selectedFontStyle, setSelectedFontStyle] = useState({
    value: fontStyleList?.[0]?.value,
    label: fontStyleList?.[0]?.label,
  })
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [color, setColor] = useState('#FFFFFF')
  const [isColorPickerOpen2, setIsColorPickerOpen2] = useState(false)
  const [color2, setColor2] = useState('#212121')
  const [isEnabled, setIsEnabled] = useState(true)
  const [isIndetificationEnabled, setIsIdentificationEnabled] = useState(true)
  const [punctuationEnabled, setPunctuationEnabled] = useState(true)
  const [warningOpen, setWarningModal] = useState(false)
  const openWarningModal = () => {
    setWarningModal(true)
  }

  const auth = useAuth()
  const router = useRouter()

  const handleSwitchChange = (event) => {
    setIsEnabled(event.target.checked)
  }
  const handleSwitchPunctuationChange = (event) => {
    setPunctuationEnabled(event.target.checked)
  }
  const handleIdentificationSwitchChange = (event) => {
    setIsIdentificationEnabled(event.target.checked)
  }
  const schema = yup.object().shape({
    // transcription configuration
    inputLanguage: yup.string().required('Input Language is required'),
    modelType: yup.string().required('Model Type is required'),
    maxSpeakerCount: yup.number().required('Max Speaker Count is required'),
    SpeakerIdFormat: yup.string().required('Output Format is required'),

    // translation & caption settings
    outputLanguage: yup.string().required('Output language is required'),
    translationType: yup.string().required('Translation Type is required'),
    maxCharactersPerLine: yup.number().required('Max Characters Per Line is required'),
    maxLinesPerFrame: yup.number().required('Max Lines Per Frame is required'),
    fontStyle: yup.string().required('Font Style is required'),
    fontSize: yup.string().required('Font Size is required'),
    textColor: yup.string().required('Text Color is required'),
    backgroundColor: yup.string().required('Background Color is required'),
  })

  const defaultValue = {
    outputLanguage: outputlanguages?.[0]?.value,
    speakerIdentification: true,
    maxCharactersPerLine: 42,
    maxLinesPerFrame: 2,
    inputLanguage: inputlanguages?.[0]?.value,
    modelType: modalTypes?.[0]?.value,
    maxSpeakerCount: 3,
    translationType: translationType?.[0]?.value,
    fontStyle: fontStyleList?.[0]?.value,
    fontSize: '28px',
    textColor: color,
    backgroundColor: color2,
    SpeakerIdFormat: formatList?.[0]?.value,
    profanityFilter: true,
    punctuation: true,
  }
  const {
    reset,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValue,
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const handleColorPickerToggle = () => {
    !viewId && setIsColorPickerOpen(!isColorPickerOpen)
  }

  const handleColorPickerToggled = () => {
    if (isColorPickerOpen === true) setIsColorPickerOpen(!isColorPickerOpen)
  }

  const handleColorChange = (newColor) => {
    !viewId && setColor(newColor.hex)
  }

  const handleColorPickerClick = (e) => {
    !viewId && e.stopPropagation()
  }

  const handleColorPickerToggle2 = () => {
    !viewId && setIsColorPickerOpen2(!isColorPickerOpen2)
  }

  const handleColorPickerToggled2 = () => {
    if (isColorPickerOpen2 === true && !viewId) setIsColorPickerOpen2(!isColorPickerOpen2)
  }

  const handleColorChange2 = (newColor) => {
    !viewId && setColor2(newColor.hex)
  }

  useEffect(() => {
    if (editData) {
      setValue('outputLanguage', editData?.outputLanguage)
      setValue('speakerIdentification', editData?.speakerIdentification)
      setValue('maxCharactersPerLine', editData?.maxCharactersPerLine)
      setValue('maxLinesPerFrame', editData?.maxLinesPerFrame)
      setValue('inputLanguage', editData?.inputLanguage)
      setValue('modelType', editData?.modelType)
      setValue('maxSpeakerCount', editData?.maxSpeakerCount)
      setValue('translationType', editData?.translationType)
      setValue('fontStyle', editData?.fontStyle)
      setValue('fontSize', editData?.fontSize)
      setValue('textColor', editData?.textColor || '#FFFFFF')
      setValue('backgroundColor', editData?.backgroundColor || '#212121')
      setValue('SpeakerIdFormat', editData?.SpeakerIdFormat)
      setValue('profanityFilter', editData?.profanityFilter)
      setValue('punctuation', editData?.punctuation)

      const selectedOutPutLanguage = outputlanguages.find((output) => output.value === editData?.outputLanguage)
      setSelectedOutputLanguage(selectedOutPutLanguage || null)

      const selectedPLanguage = inputlanguages.find((lang) => lang.value === editData?.inputLanguage)
      setSelectedLanguage(selectedPLanguage || null)

      const selectedModal = modalTypes.find((modal) => modal.value === editData?.modelType)
      setSelectedModalType(selectedModal || null)

      const selectedFormat = formatList.find((format) => format.value === editData?.SpeakerIdFormat)
      setSelectedFormat(selectedFormat || null)

      const selectedTranslation = translationType.find((trans) => trans.value === editData?.translationType)
      setSelectedTranslation(selectedTranslation || null)

      const selectedFontList = fontStyleList.find((font) => font.value === editData?.fontStyle)
      setSelectedFontStyle(selectedFontList || null)

      setColor(editData?.textColor || '#FFFFFF')
      setColor2(editData?.backgroundColor || '#212121')
      setIsIdentificationEnabled(editData?.speakerIdentification || true)
      setPunctuationEnabled(editData?.punctuation || true)
      setIsEnabled(editData?.profanityFilter || true)
    }
  }, [editData])

  useEffect(() => {
    if (advanceData) {
      setValue('outputLanguage', advanceData?.outputLanguage)
      setValue('speakerIdentification', advanceData?.speakerIdentification)
      setValue('maxCharactersPerLine', advanceData?.maxCharactersPerLine)
      setValue('maxLinesPerFrame', advanceData?.maxLinesPerFrame)
      setValue('inputLanguage', advanceData?.inputLanguage)
      setValue('modelType', advanceData?.modelType)
      setValue('maxSpeakerCount', advanceData?.maxSpeakerCount)
      setValue('translationType', advanceData?.translationType)
      setValue('fontStyle', advanceData?.fontStyle)
      setValue('fontSize', advanceData?.fontSize)
      setValue('textColor', advanceData?.textColor || '#FFFFFF')
      setValue('backgroundColor', advanceData?.backgroundColor || '#212121')
      setValue('SpeakerIdFormat', advanceData?.SpeakerIdFormat)
      setValue('profanityFilter', advanceData?.profanityFilter)
      setValue('punctuation', advanceData?.punctuation)

      const selectedOutPutLanguage = outputlanguages.find((output) => output.value === advanceData?.outputLanguage)
      setSelectedOutputLanguage(selectedOutPutLanguage || null)

      const selectedPLanguage = inputlanguages.find((lang) => lang.value === advanceData?.inputLanguage)
      setSelectedLanguage(selectedPLanguage || null)

      const selectedModal = modalTypes.find((modal) => modal.value === advanceData?.modelType)
      setSelectedModalType(selectedModal || null)

      const selectedFormat = formatList.find((format) => format.value === advanceData?.SpeakerIdFormat)
      setSelectedFormat(selectedFormat || null)

      const selectedTranslation = translationType.find((trans) => trans.value === advanceData?.translationType)
      setSelectedTranslation(selectedTranslation || null)

      const selectedFontList = fontStyleList.find((font) => font.value === advanceData?.fontStyle)
      setSelectedFontStyle(selectedFontList || null)

      setColor(advanceData?.textColor || '#FFFFFF')
      setColor2(advanceData?.backgroundColor || '#212121')
      setIsIdentificationEnabled(advanceData?.speakerIdentification || true)
      setPunctuationEnabled(advanceData?.punctuation || true)
      setIsEnabled(advanceData?.profanityFilter || true)
    }
  }, [advanceData])

  const handleBackForm = (data) => {
    const finalData = {
      ...data,
      fontSize: data?.fontSize ? `${data?.fontSize}` : null,
      eventId: editData?.eventId || null,
      profanityFilter: isEnabled,
      punctuation: punctuationEnabled,
      speakerIdentification: isIndetificationEnabled,
      textColor: color,
      backgroundColor: color2,
    }
    handleBack()
    savedData(finalData)
    reset()
    return
  }
  const submitData = async (data) => {
    try {
      const finalData = {
        ...(basicData && basicData),
        ...data,
        passKey: basicData?.isSecure ? basicData?.passKey : null,
        fontSize: `${data?.fontSize}`,
        eventId: editData?.eventId || null,
        profanityFilter: isEnabled,
        punctuation: punctuationEnabled,
        speakerIdentification: isIndetificationEnabled,
        textColor: color,
        backgroundColor: color2,
      }
      setLoading(true)
      if (editData?.eventId) {
        const res = await update(finalData)
        if (res === 'OPERATION_SUCCESS') {
          toast.success('Event Update Successfully.')
          setLoading(false)
          fetchData()
          close()
        }
      } else {
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
  const hanndleWarningClose = () => {
    setWarningModal(false)
    close()
  }

  return (
    <>
      <div
        onClick={() => {
          handleColorPickerToggled(), handleColorPickerToggled2()
        }}
      >
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
              height: '979px',
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
              // py: '19px !important',
              px: '27px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 700,
              backgroundColor: '##FFF',
            }}
          >
            {'Advanced Settings'}
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
            <DialogContent sx={{ p: '0px 27px 46px 27px' }}>
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
              {/* <Box sx={{ border: '1px solid #DEE0E4', px: '16px', pt: "21px", pb: "28px", borderRadius: '4px' }}>
                                <Typography sx={{ color: '#757575', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>Basic Event Details</Typography>
                                <Grid container spacing={2} sx={{ m: '20px 8px' }}>
                                    <Grid size={6}>
                                                                            <FormControl fullWidth sx={{ height: '70px' }}>
                                        
                                            <Controller
                                                name='eventName'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomTextField value={value} label={"Event Name"} onChange={onChange} disabled={viewId} />
                                                )}
                                            />
                                        </FormControl>
                                        {errors.eventName && <FormHelperText sx={{ color: 'error.main' }}>{errors.eventName.message}</FormHelperText>}
                                    </Grid>
                                    <Grid size={6}>
                                                                            <FormControl fullWidth sx={{ height: '70px' }}>

                                            <Controller
                                                name="platform"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <AutoCompleteMenu
                                                        value={selectedPlatform}
                                                        setValue={newValue => {
                                                            onChange(newValue?.value || null)
                                                            setSlectedPlatform(newValue)
                                                        }}
                                                        option={platforms}
                                                        placeHolder={'Select'}
                                                        label={'Platform'}
                                                        width={'100%'}
                                                        isEnabled={viewId}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                        {errors.platform && <FormHelperText sx={{ color: 'error.main' }}>{errors.platform.message}</FormHelperText>}
                                    </Grid>
                                    <Grid size={6}>
                                                                            <FormControl fullWidth sx={{ height: '70px' }}>

                                            <Controller
                                                name="startDate"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => {
                                                    return (
                                                        <CustomTextField disabled={viewId} type={'datetime-local'} value={value} label={"Start Date"} onChange={onChange} />
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        {errors.startDate && <FormHelperText sx={{ color: 'error.main' }}>{errors.startDate.message}</FormHelperText>}
                                    </Grid>
                                    <Grid size={6}>
                                                                            <FormControl fullWidth sx={{ height: '70px' }}>

                                            <Controller
                                                name="endDate"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => {
                                                    return (
                                                        <CustomTextField disabled={viewId} type={'datetime-local'} value={value} label={"End Date"} onChange={onChange} />
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        {errors.endDate && <FormHelperText sx={{ color: 'error.main' }}>{errors.endDate.message}</FormHelperText>}
                                    </Grid>
                                    <Grid size={6}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name='createdBy'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomTextField value={auth?.user?.fullName || ""} disabled={true} label={"Created By"} onChange={onChange} />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box> */}
              <Box sx={{ filter: loading ? 'blur(5px)' : 'none', mt: '23px', height: '100%', overflowY: 'auto' }}>
                <Button
                  variant="text"
                  onClick={() => handleBackForm(getValues())}
                  sx={{
                    mb: '23px',
                    textTransform: 'capitalize',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    color: '#6D6D6D',
                  }}
                >
                  <img
                    src="/icons/arrowBack.svg"
                    alt=""
                    style={{
                      marginRight: '4px',
                    }}
                  />
                  Back
                </Button>
                <Box sx={{ px: '16px' }}>
                  <Typography
                    sx={{
                      color: '#757575',
                      fontSize: '14px',
                      fontWeight: 600,
                      textAlign: 'start',
                    }}
                  >
                    Transcription Configuration
                  </Typography>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      m: '20px 0px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="inputLanguage"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <AutoCompleteMenu
                              value={selectedLanguage}
                              setValue={(newValue) => {
                                onChange(newValue?.value || null)
                                setSelectedLanguage(newValue)
                              }}
                              option={inputlanguages}
                              placeHolder={'Select'}
                              label={'Input Language'}
                              width={'100%'}
                              isEnabled={viewId}
                              error={!!errors.inputLanguage}
                            />
                          )}
                        />
                        {errors.inputLanguage && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.inputLanguage.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="modelType"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <AutoCompleteMenu
                              value={selectedModalType}
                              setValue={(newValue) => {
                                onChange(newValue?.value || null)
                                setSelectedModalType(newValue)
                              }}
                              option={modalTypes}
                              placeHolder={'Select'}
                              label={'Modal Type'}
                              width={'100%'}
                              isEnabled={viewId}
                              error={!!errors.modelType}
                            />
                          )}
                        />
                        {errors.modelType && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.modelType.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="profanityFilter"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              fullWidth
                              disabled={viewId}
                              label="Profanity Filtering"
                              value={isEnabled ? 'Enabled' : 'Disabled'}
                              onChange={onChange}
                              type="text"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <CustomSwitch
                                      disabled={viewId}
                                      checked={isEnabled}
                                      onChange={handleSwitchChange}
                                      color="primary"
                                      sx={{ mr: '10px' }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              variant="outlined"
                              sx={{
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                '& .MuiOutlinedInput-input': {
                                  color: '#212121 !important',
                                },
                                '& .MuiOutlinedInput-root': {
                                  height: '50px',
                                  fontSize: '14px',
                                  textAlign: 'center',
                                  fontWeight: 400,
                                  borderRadius: '4px',
                                  padding: '0 !important',
                                  display: 'flex',
                                  alignItems: 'center',
                                },
                                '& .MuiInputLabel-root': {
                                  color: '#757575 !important',
                                  fontSize: '14px',
                                },
                                '& .MuiOutlinedInput-input.Mui-disabled': {
                                  WebkitTextFillColor: '#212121',
                                  fontSize: '14px',
                                },
                              }}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="punctuation"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              fullWidth
                              label="Punctuation"
                              value={punctuationEnabled ? 'Enabled' : 'Disabled'}
                              onChange={onChange}
                              type="text"
                              disabled={viewId}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <CustomSwitch
                                      disabled={viewId}
                                      checked={punctuationEnabled}
                                      onChange={handleSwitchPunctuationChange}
                                      color="primary"
                                      sx={{ mr: '10px' }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              variant="outlined"
                              sx={{
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                '& .MuiOutlinedInput-input': {
                                  color: '#212121 !important',
                                },
                                '& .MuiOutlinedInput-root': {
                                  height: '50px',
                                  fontSize: '14px',
                                  textAlign: 'center',
                                  fontWeight: 400,
                                  borderRadius: '4px',
                                  padding: '0 !important',
                                  display: 'flex',
                                  alignItems: 'center',
                                },
                                '& .MuiInputLabel-root': {
                                  color: '#757575 !important',
                                  fontSize: '14px',
                                },
                                '& .MuiOutlinedInput-input.Mui-disabled': {
                                  WebkitTextFillColor: '#212121',
                                  fontSize: '14px',
                                },
                              }}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{
                          position: 'relative',
                          border: '2px solid #DEE0E4',
                          borderRadius: '4px',
                          padding: '16px 0px 0px 12px',
                          minHeight: '50px',
                          width: '100%',
                        }}
                      >
                        <Typography
                          sx={{
                            position: 'absolute',
                            top: '-10px',
                            left: '10px',
                            backgroundColor: '#fff',
                            padding: '0 8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#757575',
                          }}
                        >
                          Speaker Identification
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography>{isIndetificationEnabled ? 'Enabled' : 'Disabled'}</Typography>
                          <Box>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <Controller
                                name="speakerIdentification"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <CustomSwitch
                                    checked={isIndetificationEnabled}
                                    name="speakerIdentification"
                                    disabled={viewId}
                                    onChange={(e) => {
                                      handleIdentificationSwitchChange(e), onChange()
                                    }}
                                    color="primary"
                                    sx={{ mr: '10px' }}
                                  />
                                )}
                              />
                            </FormControl>
                          </Box>
                        </Box>
                        <Box sx={{ mr: '14px', mt: '12px' }}>
                          <FormControl fullWidth sx={{ height: '80px' }}>
                            <Controller
                              name="maxSpeakerCount"
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomTextField
                                  error={!!errors.maxSpeakerCount}
                                  disabled={viewId}
                                  type={'number'}
                                  value={value}
                                  label={'Max Speaker Count'}
                                  onChange={onChange}
                                />
                              )}
                            />
                            {errors.maxSpeakerCount && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.maxSpeakerCount.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="SpeakerIdFormat"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <AutoCompleteMenu
                              value={selectedFormat}
                              setValue={(newValue) => {
                                onChange(newValue?.value || null)
                                setSelectedFormat(newValue)
                              }}
                              option={formatList}
                              placeHolder={'Select'}
                              label={'Output Format'}
                              width={'100%'}
                              isEnabled={viewId}
                              error={!!errors.SpeakerIdFormat}
                            />
                          )}
                        />
                        {errors.SpeakerIdFormat && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.SpeakerIdFormat.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ px: '16px' }}>
                  <Typography
                    sx={{
                      color: '#757575',
                      fontSize: '14px',
                      fontWeight: 600,
                      textAlign: 'start',
                    }}
                  >
                    {'Translation & Caption Settings'}
                  </Typography>
                  <Grid container spacing={2} sx={{ m: '20px 0px' }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="outputLanguage"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <AutoCompleteMenu
                              value={selectedOutputLanguage}
                              setValue={(newValue) => {
                                onChange(newValue?.value || null)
                                setSelectedOutputLanguage(newValue)
                              }}
                              option={outputlanguages}
                              placeHolder={'Select'}
                              label={'Output Language'}
                              width={'100%'}
                              isEnabled={viewId}
                              error={!!errors.outputLanguage}
                            />
                          )}
                        />
                        {errors.outputLanguage && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.outputLanguage.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="translationType"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <AutoCompleteMenu
                              value={selectedTranslation}
                              setValue={(newValue) => {
                                onChange(newValue?.value || null)
                                setSelectedTranslation(newValue)
                              }}
                              option={translationType}
                              placeHolder={'Select'}
                              label={'Translation Type'}
                              width={'100%'}
                              isEnabled={viewId}
                              error={!!errors.translationType}
                            />
                          )}
                        />
                        {errors.translationType && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.translationType.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="maxCharactersPerLine"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              error={!!errors.maxCharactersPerLine}
                              disabled={viewId}
                              type={'number'}
                              value={value}
                              label={'Max Characters per Line'}
                              onChange={onChange}
                            />
                          )}
                        />
                        {errors.maxCharactersPerLine && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.maxCharactersPerLine.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="maxLinesPerFrame"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              error={!!errors.maxLinesPerFrame}
                              disabled={viewId}
                              type={'number'}
                              value={value}
                              label={'Max Lines per Frame'}
                              onChange={onChange}
                            />
                          )}
                        />
                        {errors.maxLinesPerFrame && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.maxLinesPerFrame.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="fontStyle"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <AutoCompleteMenu
                              value={selectedFontStyle}
                              setValue={(newValue) => {
                                onChange(newValue?.value || null)
                                setSelectedFontStyle(newValue)
                              }}
                              option={fontStyleList}
                              placeHolder={'Select'}
                              label={'Font Style'}
                              width={'100%'}
                              isEnabled={viewId}
                              error={!!errors.fontStyle}
                            />
                          )}
                        />
                        {errors.fontStyle && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.fontStyle.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="fontSize"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              error={!!errors.fontSize}
                              disabled={viewId}
                              fieldName="fontSize"
                              type={'text'}
                              value={value}
                              label={'Font Size'}
                              onChange={(e) => {
                                const inputValue = e.target.value
                                const numericValue = inputValue.replace(/\D/g, '')
                                onChange(`${numericValue}px`)
                              }}
                            />
                          )}
                        />
                        {errors.fontSize && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.fontSize.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="textColor"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              error={!!errors.textColor}
                              value={color}
                              disabled={viewId}
                              label="Text Color"
                              onChange={onChange}
                              placeholder="Select Color"
                              sx={{
                                '& .MuiInputLabel-root': {
                                  color: '#757575 !important',
                                  fontSize: '14px',
                                  fontWeight: 400,
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <IconButton onClick={() => handleColorPickerToggle()}>
                                    <img src="/icons/colorPicker.svg" alt="color" />
                                  </IconButton>
                                ),
                                startAdornment: (
                                  <IconButton
                                    sx={{
                                      p: 0,
                                      mr: 1,
                                    }}
                                    onClick={() => handleColorPickerToggle()}
                                  >
                                    <BoxFileSvg height={'22'} width={'22'} color={color} />
                                  </IconButton>
                                ),
                              }}
                            />
                          )}
                        />
                        {isColorPickerOpen && (
                          <Box
                            style={{
                              position: 'absolute',
                              zIndex: 10,
                              right: 0,
                              bottom: '35%', // Position the color picker above the input field
                            }}
                            className="colorPick"
                            disabled={viewId}
                            onClick={handleColorPickerClick}
                          >
                            <ColorPicker color={color} onChange={handleColorChange} />
                          </Box>
                        )}
                        {errors.textColor && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.textColor.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={{ height: '70px' }}>
                        <Controller
                          name="backgroundColor"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              error={!!errors.backgroundColor}
                              disabled={viewId}
                              value={color2}
                              label="Background Color"
                              onChange={onChange}
                              placeholder="Select Color"
                              sx={{
                                '& .MuiInputLabel-root': {
                                  color: '#757575 !important',
                                  fontSize: '14px',
                                  fontWeight: 400,
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <IconButton onClick={() => handleColorPickerToggle2()}>
                                    <img src="/icons/colorPicker.svg" alt="color" />
                                  </IconButton>
                                ),
                                startAdornment: (
                                  <IconButton
                                    sx={{
                                      p: 0,
                                      mr: 1,
                                    }}
                                    onClick={() => handleColorPickerToggle2()}
                                  >
                                    <BoxFileSvg height={'22'} width={'22'} color={color2} />
                                  </IconButton>
                                ),
                              }}
                            />
                          )}
                        />
                        {isColorPickerOpen2 && (
                          <Box
                            style={{
                              position: 'absolute',
                              zIndex: 10,
                              right: 0,
                              bottom: '35%',
                            }}
                            disabled={viewId}
                            className="colorPick"
                            onClick={handleColorPickerClick}
                          >
                            <ColorPicker color={color2} onChange={handleColorChange2} />
                          </Box>
                        )}
                        {errors.backgroundColor && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.backgroundColor.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
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
      </div>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={hanndleWarningClose} />
      )}
    </>
  )
}

export default AddModal
