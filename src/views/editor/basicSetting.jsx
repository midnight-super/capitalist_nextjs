import ColorPicker from 'react-pick-color'
import CustomSwitch from '@/components/CustomSwitch'
import BoxSvg from '@/menu-icons/box'
import {
  Box,
  Button,
  FormControl,
  Grid2 as Grid,
  InputAdornment,
  Radio,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { routeName } from '@/utils'
//
// const colorList = [
//   {
//     value: '#FF9500',
//     label: '#FF9500',
//   },
//
//   {
//     value: '#FFC26B',
//     label: '#FFC26B',
//   },
//   {
//     value: '#FFDBA8',
//     label: '#FFDBA8',
//   },
// ];
const BasicSettings = ({ close, confidenceClrs, setConfidenceClrs }) => {
  const router = useRouter()
  const route = routeName(router?.pathname)
  const [selectedValue, setSelectedValue] = useState('vertical')
  // const [selectedColor, setSelectedColor] = useState({
  //   value: colorList?.[2]?.value,
  //   label: colorList?.[2]?.label,
  // });
  // const [selectedColor2, setSelectedColor2] = useState({
  //   value: colorList?.[1]?.value,
  //   label: colorList?.[1]?.label,
  // });
  // const [selectedColor3, setSelectedColor3] = useState({
  //   value: colorList?.[0]?.value,
  //   label: colorList?.[0]?.label,
  // });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [isColorPickerOpen2, setIsColorPickerOpen2] = useState(false)
  const [isColorPickerOpen3, setIsColorPickerOpen3] = useState(false)

  const [color, setColor] = useState('#FFFFFF')
  const [colorMd, setColorMd] = useState('#FFFFFF')
  const [colorHigh, setColorHigh] = useState('#FFFFFF')

  const [isSwitchOn, setIsSwitchOn] = useState(false)

  const handleSwitchChange = (event) => {
    setIsSwitchOn(event.target.checked)
  }
  const handleChange = (event) => {
    setSelectedValue(event.target.value)
  }

  // const schema = yup.object().shape({
  //   lowConfidence: yup.string().required('Low confidence is required'),
  //   mediumConfidence: yup.string().required('Medium confidence is required'),
  //   highConfidence: yup.string().required('High confidence is required'),
  // });
  const defaultValue = {
    // lowConfidence: colorList?.[2]?.value,
    // mediumConfidence: colorList?.[1]?.value,
    // highConfidence: colorList?.[0]?.value,
    timer: false,
    orientation: null,
  }
  const {
    reset,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValue,
    // resolver: yupResolver(schema),
    mode: 'onChange',
  })
  useEffect(() => {
    const basicSett = localStorage.getItem('adminBasicSetting')
      ? JSON.parse(localStorage.getItem('adminBasicSetting'))
      : null
    if (basicSett) {
      // setSelectedColor({
      //   value: basicSett?.lowConfidence,
      //   label: basicSett?.lowConfidence,
      // });
      // setSelectedColor2({
      //   value: basicSett?.mediumConfidence,
      //   label: basicSett?.mediumConfidence,
      // });
      // setSelectedColor3({
      //   value: basicSett?.highConfidence,
      //   label: basicSett?.highConfidence,
      // });
      setColor(basicSett?.lowConfidence)
      setColorMd(basicSett?.mediumConfidence)
      setColorHigh(basicSett?.highConfidence)
      setSelectedValue(basicSett?.orientation)
      setIsSwitchOn(basicSett?.timer)
      setConfidenceClrs({
        lowConfidence: basicSett?.lowConfidence || '#FFFFFF',
        mediumConfidence: basicSett?.mediumConfidence || '#FFFFFF',
        highConfidence: basicSett?.highConfidence || '#FFFFFF',
      })
      setValue('timeDuration', basicSett?.timeDuration)
    } else {
      reset(defaultValue)
      setValue('language', null)
    }
  }, [])

  const handleColorPickerToggle = () => {
    setIsColorPickerOpen(!isColorPickerOpen)
  }
  const handleColorPickerToggle2 = () => {
    setIsColorPickerOpen2(!isColorPickerOpen2)
  }
  const handleColorPickerToggle3 = () => {
    setIsColorPickerOpen3(!isColorPickerOpen3)
  }

  const submitData = (data) => {
    try {
      const payload = {
        ...data,
        lowConfidence: color,
        mediumConfidence: colorMd,
        highConfidence: colorHigh,
        timer: isSwitchOn,
        orientation: selectedValue,
        timeDuration: isSwitchOn ? data?.timeDuration : null,
      }
      setConfidenceClrs({
        lowConfidence: color,
        mediumConfidence: colorMd,
        highConfidence: colorHigh,
      })
      localStorage.setItem('adminBasicSetting', JSON.stringify(payload))
      close()
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }
  return (
    <div
      onClick={() => {
        isColorPickerOpen && handleColorPickerToggle()
        isColorPickerOpen2 && handleColorPickerToggle2()
        isColorPickerOpen3 && handleColorPickerToggle3()
      }}
    >
      <Box>
        <Typography
          sx={{
            color: '#212121',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
          }}
        >
          Confidence Colors
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(submitData)}>
        <Box
          sx={{
            pt: '17px',
          }}
        >
          <Grid container spacing={1} sx={{ m: 0, p: 0 }}>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: errors.lowConfidence ? '10px' : '20px' }}>
                {/* <Controller
                  name="lowConfidence"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <ColorAutoComplete
                      value={selectedColor}
                      setValue={(newValue) => {
                        onChange(newValue?.value || null);
                        setSelectedColor(newValue);
                      }}
                      option={colorList}
                      placeHolder="Select"
                      label="Low Confidence"
                      width="100%"
                      error={!!errors.lowConfidence}
                    />
                  )}
                />
                {errors.lowConfidence && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.lowConfidence.message}
                  </FormHelperText>
                )} */}
                <Controller
                  name="lowConfidence"
                  control={control}
                  // rules={{ required: true }}
                  render={() => (
                    <TextField
                      value={color}
                      label="Low Confidence"
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
                            <BoxSvg height={'22'} width={'22'} color={color} />
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
                      top: '35%',
                    }}
                    className="colorPick"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ColorPicker color={color} onChange={(e) => setColor(e.hex)} />
                  </Box>
                )}
                {/* {errors.lowConfidence && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.lowConfidence.message}
                  </FormHelperText>
                )} */}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: errors.mediumConfidence ? '10px' : '20px' }}>
                {/* <Controller
                  name="mediumConfidence"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <ColorAutoComplete
                      value={selectedColor2}
                      setValue={(newValue) => {
                        onChange(newValue?.value || null);
                        setSelectedColor2(newValue);
                      }}
                      option={colorList}
                      placeHolder="Select"
                      label="Medium Confidence"
                      width="100%"
                      error={!!errors.lowConfidence}
                    />
                  )}
                /> */}
                <Controller
                  name="mediumConfidence"
                  control={control}
                  // rules={{ required: true }}
                  render={() => (
                    <TextField
                      value={colorMd}
                      label="Medium Confidence"
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
                            <BoxSvg height={'22'} width={'22'} color={colorMd} />
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
                      top: '35%',
                    }}
                    className="colorPick"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ColorPicker color={colorMd} onChange={(e) => setColorMd(e.hex)} />
                  </Box>
                )}
                {/* {errors.mediumConfidence && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.mediumConfidence.message}
                  </FormHelperText>
                )} */}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: errors.highConfidence ? '10px' : '20px' }}>
                <Controller
                  name="highConfidence"
                  control={control}
                  render={() => (
                    //     <ColorAutoComplete
                    //       value={selectedColor3}
                    //       setValue={(newValue) => {
                    //         onChange(newValue?.value || null);
                    //         setSelectedColor3(newValue);
                    //       }}
                    //       option={colorList}
                    //       placeHolder="Select"
                    //       label="High Confidence"
                    //       width="100%"
                    //       error={!!errors.lowConfidence}
                    //     />
                    //   )}
                    // />
                    <TextField
                      value={colorHigh}
                      label="High Confidence"
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
                          <IconButton onClick={() => handleColorPickerToggle3()}>
                            <img src="/icons/colorPicker.svg" alt="color" />
                          </IconButton>
                        ),
                        startAdornment: (
                          <IconButton
                            sx={{
                              p: 0,
                              mr: 1,
                            }}
                            onClick={() => handleColorPickerToggle3()}
                          >
                            <BoxSvg height={'22'} width={'22'} color={colorHigh} />
                          </IconButton>
                        ),
                      }}
                    />
                  )}
                />
                {isColorPickerOpen3 && (
                  <Box
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      right: 0,
                      top: '35%',
                    }}
                    className="colorPick"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ColorPicker color={color} onChange={(e) => setColorHigh(e.hex)} />
                  </Box>
                )}
                {/* {errors.highConfidence && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.highConfidence.message}
                  </FormHelperText>
                )} */}
              </FormControl>
            </Grid>
          </Grid>
          {route === 'admin' && (
            <>
              <Typography
                sx={{
                  color: '#212121',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '24px',
                }}
              >
                Set Time
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    mt: '12px',
                    color: '#212121',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  {'Set inactivity timer to gray out text after 30 seconds.'}
                </Typography>
                <CustomSwitch
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={isSwitchOn}
                  onChange={handleSwitchChange}
                />
              </Box>
            </>
          )}
          {isSwitchOn && (
            <Box
              sx={{
                mt: '12px',
              }}
            >
              <FormControl
                sx={{
                  width: '82px',
                }}
              >
                <Controller
                  name="timeDuration"
                  control={control}
                  defaultValue={1} // Set default value
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value || 1} // Ensure value defaults to 1
                      variant="outlined"
                      onChange={(e) => {
                        let newValue = Number(e.target.value) // Convert input to number
                        if (newValue < 1 || isNaN(newValue)) {
                          newValue = 1 // Enforce minimum value
                        }
                        onChange(newValue)
                      }}
                      type="number"
                      inputMode="numeric"
                      sx={{
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        '& .MuiOutlinedInput-input': {
                          padding: '9px 0px 9px 9px',
                          color: '#212121 !important',
                          MozAppearance: 'textfield',
                        },
                        '& .MuiOutlinedInput-root': {
                          height: '34px',
                          fontSize: '16px',
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
                          fontWeight: 400,
                        },
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          display: 'none',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              sx={{
                                color: '#6D6D6D',
                                fontSize: '10px',
                                fontWeight: 400,
                                lineHeight: '16px',
                                padding: '9px 9px 9px 0px',
                              }}
                            >
                              seconds
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: '1', // Prevents entering values less than 1
                      }}
                    />
                  )}
                />
              </FormControl>
            </Box>
          )}
          <Typography
            sx={{
              mt: '20px',
              color: '#212121',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px',
            }}
          >
            {'Speaker Name Orientation'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Radio
                disableRipple
                icon={<img src="/icons/unCheck.svg" alt="" />}
                checkedIcon={<img src="/icons/checkedRadio.svg" alt="" />}
                value="horizontal"
                checked={selectedValue === 'horizontal'}
                onChange={handleChange}
                name="layout"
              />
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                {'Horizontal'}
                <img style={{ paddingLeft: '7px' }} src="/icons/horizontal.svg" alt="" />
              </Typography>
            </Box>
            <Box sx={{ ml: '40px', display: 'flex', alignItems: 'center' }}>
              <Radio
                disableRipple
                icon={<img src="/icons/unCheck.svg" alt="" />}
                checkedIcon={<img src="/icons/checkedRadio.svg" alt="" />}
                value="vertical"
                checked={selectedValue === 'vertical'}
                onChange={handleChange}
                name="layout"
              />
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                {'Vertical'}
                <img style={{ paddingLeft: '7px' }} src="/icons/verticle.svg" alt="" />
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            gap: '10px',
            mt: isSwitchOn && route === 'admin' ? '4px' : !isSwitchOn && route === 'admin' ? '50px' : '115px',
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: 'capitalize',
              width: '192px',
              height: '50px',
              borderRadius: '4px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: 'normal',
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'capitalize',
              width: '192px',
              color: '#757575',
              height: '50px',
              borderRadius: '4px',
              fontSize: '14px',
              border: '1px solid #DEE0E4',
              fontWeight: 700,
              lineHeight: 'normal',
            }}
            onClick={close}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default BasicSettings
