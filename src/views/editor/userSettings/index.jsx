import React, { useEffect, useState } from 'react'
import ColorPicker from 'react-pick-color'
import CustomSwitch from '@/components/CustomSwitch'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Grid2'
import { Box, Button, FormControl, FormHelperText, IconButton, TextField } from '@mui/material'
import CustomTextField from '@/components/customTextField'
import AutoCompleteMenu from '@/components/customDropdown'
import BoxSvg from '@/menu-icons/box'
import { themes } from '../theme'
const themeList = [
  {
    id: 1,
    value: 1,
    label: 'Custom',
    fontFamily: '"Roboto", Arial, sans-serif',
    fontSize: '',
    fontColor: '',
    backgroundColor: '',
    titleClr: '#000000',
    restClrs: '#4489FE',
  },
  {
    id: 2,
    value: 2,
    label: 'Classic Light',
    fontFamily: '"Roboto", Arial, sans-serif',
    fontSize: '16px',
    fontColor: '#000000',
    backgroundColor: '#FFFFFF',
    titleClr: '#000000',
    restClrs: '#4489FE',
  },
  {
    id: 3,
    value: 3,
    label: 'Midnight Dark',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '16px',
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    titleClr: '#0000CC',
    restClrs: '#4489FE',
  },
  {
    id: 4,
    value: 4,
    label: 'High Contrast',
    fontFamily: 'Verdana, Geneva, sans-serif',
    fontSize: '18px',
    fontColor: '#FFFF00',
    backgroundColor: '#000000',
    titleClr: '#0000CC',
    restClrs: '#4489FE',
  },
  {
    id: 5,
    value: 5,
    label: 'Sunny Day',
    fontFamily: '"Roboto", Arial, sans-serif',
    fontSize: '16px',
    fontColor: '#0000CC',
    backgroundColor: '#FFFF99',
    titleClr: '#0000CC',
    restClrs: '#000000',
  },
  {
    id: 6,
    value: 6,
    label: 'Cool Breeze',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '16px',
    fontColor: '#990000',
    backgroundColor: '#CCFFFF',
    titleClr: '#0000CC',
    restClrs: '#000000',
  },
  {
    id: 7,
    value: 7,
    label: 'Monochrome',
    fontFamily: 'Verdana, Geneva, sans-serif',
    fontSize: '16px',
    fontColor: '#000000',
    backgroundColor: '#FFFFFF',
    titleClr: '#000000',
    restClrs: '#4489FE',
  },
  {
    id: 8,
    value: 8,
    label: 'Gentle Gray',
    fontFamily: '"Roboto", Arial, sans-serif',
    fontSize: '16px',
    fontColor: '#000000',
    backgroundColor: '#D3D3D3',
    titleClr: '#000000',
    restClrs: '#0000CC',
  },
  {
    id: 9,
    value: 9,
    label: 'Dyslexia-Friendly',
    fontFamily: '"OpenDyslexic", Arial, sans-serif',
    fontSize: '16px',
    fontColor: '#333333',
    backgroundColor: '#F5F5DC',
    titleClr: '#000000',
    restClrs: '#4489FE',
  },
]
const lineSpaceList = [
  { label: '1', value: 1 },
  { label: '1.15', value: 1.15 },
  { label: '1.5', value: 1.5 },
  { label: '2', value: 2 },
]

const fontStyleList = [
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Roboto', value: '"Roboto", Arial, sans-serif' },
  { label: 'Calibri', value: '"Calibri", Candara, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'OpenDyslexic', value: '"OpenDyslexic", Arial, sans-serif' },
]

const UserSettings = ({ editId, close }) => {
  const [selectedFontStyle, setSelectedFontStyle] = useState({
    value: fontStyleList?.[0]?.value,
    label: fontStyleList?.[0]?.label,
  })
  const [selectedLineSpace, setSelectedLineSpace] = useState({
    value: lineSpaceList[1].value,
    label: lineSpaceList[1].label,
  })
  const [selectedTheme, setSelectedTheme] = useState({
    value: themeList[1]?.value,
    label: themeList[1]?.label,
  })
  const [selectedTheme2, setSelectedTheme2] = useState({
    value: themeList[1]?.value,
    label: themeList[1]?.label,
  })

  const [otherClrs, setOtherClrs] = useState({
    titleClr: themeList[0]?.titleClr,
    restClrs: themeList[0]?.restClrs,
  })
  const [ffontSize, setFontSize] = useState('16px')
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [color, setColor] = useState('')
  const [isColorPickerOpen2, setIsColorPickerOpen2] = useState(false)
  const [color2, setColor2] = useState('')
  const schema = yup.object().shape({
    label: yup.string().required('Theme name is required'),
    // label: yup.string().optional(),
    fontSize: yup
      .string()
      .required('Font Size is required')
      .matches(/^\d+px$/, 'Font size must be a valid size ending with "px" (e.g., 10px)')
      .test('min-font-size', 'Font size must be at least 10px', (value) => {
        const size = parseInt(value, 10)
        return size >= 10
      })
      .test('max-font-size', 'Font size must be at most 64px', (value) => {
        const size = parseInt(value, 10)
        return size <= 64
      }),
    lineSpacing: yup.string().required('Line Spacing is required'),
    fontStyle: yup.string().required('Font Style is required'),
    // color: yup.string().required('Text Color is required'),
    // backgroundColor: yup.string().required('Background Color is required'),
  })
  const defaultValue = {
    label: null,
    fontSize: null,
    fontStyle: null,
    lineSpacing: lineSpaceList[1].value,
    color: color,
    backgroundColor: color2,
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
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  useEffect(() => {
    const accessibilitySetting = localStorage.getItem('accessibilitySetting')
      ? JSON.parse(localStorage.getItem('accessibilitySetting'))
      : null

    if (accessibilitySetting) {
      // Load accessibility settings
      reset(accessibilitySetting)
      setColor(accessibilitySetting.color || '#4489FE')
      setColor2(accessibilitySetting.backgroundColor || '#20C26D')
      setValue('backgroundColor', accessibilitySetting.backgroundColor)
      setValue('color', accessibilitySetting.color)
      setValue('fontSize', accessibilitySetting.fontSize)
      setValue(
        'lineSpacing',
        accessibilitySetting.lineSpacing ? accessibilitySetting.lineSpacing : lineSpaceList[1].value
      )

      if (accessibilitySetting?.lineSpacing)
        setSelectedLineSpace({
          value: accessibilitySetting.lineSpacing,
          label: accessibilitySetting.lineSpacing,
        })

      setValue('label', accessibilitySetting.label)
      const fnt = fontStyleList?.find((font) => font?.value === accessibilitySetting?.fontStyle) || null
      setSelectedFontStyle({ value: fnt?.value, label: fnt?.label })
      setSelectedTheme(themeList?.find((theme) => theme?.value === accessibilitySetting?.label) || null)
      setFontSize(accessibilitySetting.fontSize)
    } else {
      // Set default theme if no accessibility settings
      reset(defaultValue)
      setColor('#4489FE')
      setColor2('#20C26D')
      setSelectedFontStyle(null)
    }
  }, []) // Runs once on mount

  useEffect(() => {
    const accessibilitySetting = localStorage.getItem('accessibilitySetting')
      ? JSON.parse(localStorage.getItem('accessibilitySetting'))
      : null

    if (selectedTheme?.value !== 1) {
      const theme = themeList.find((theme) => theme.value === selectedTheme?.value)
      if (theme) {
        // Apply selected theme
        setSelectedTheme2({
          value: theme?.value,
          label: theme?.label,
        })

        const findFont = fontStyleList.find((font) => font.value === theme?.fontFamily)
        setOtherClrs({
          titleClr: theme?.titleClr,
          restClrs: theme?.restClrs,
        })
        setSelectedFontStyle({
          value: findFont?.value,
          label: findFont?.label,
        })
        setValue('backgroundColor', theme?.backgroundColor)
        setValue('color', theme?.fontColor)
        if (accessibilitySetting?.label === selectedTheme.value && accessibilitySetting?.fontSize) {
          setValue('fontSize', accessibilitySetting?.fontSize)
          setFontSize(accessibilitySetting?.fontSize)
        } else {
          setValue('fontSize', theme?.fontSize)
          setFontSize(theme?.fontSize)
        }
        setValue('label', theme?.label)
        setValue('fontStyle', theme?.fontFamily)
        setColor(theme?.fontColor)
        setColor2(theme?.backgroundColor)
      }
    }
  }, [selectedTheme])

  const handleColorPickerToggle = () => {
    setIsColorPickerOpen(!isColorPickerOpen)
  }

  const handleColorPickerToggled = () => {
    if (isColorPickerOpen === true) setIsColorPickerOpen(!isColorPickerOpen)
  }

  const handleColorChange = (newColor) => {
    setColor(newColor.hex)
  }

  const handleColorPickerClick = (e) => {
    e.stopPropagation()
  }

  const handleColorPickerToggle2 = () => {
    setIsColorPickerOpen2(!isColorPickerOpen2)
  }

  const handleColorPickerToggled2 = () => {
    if (isColorPickerOpen2 === true) setIsColorPickerOpen2(!isColorPickerOpen2)
  }

  const handleColorChange2 = (newColor) => {
    setColor2(newColor.hex)
  }

  const submitData = (data) => {
    try {
      const formData = {
        label: selectedTheme2.value,
        fontSize: data?.fontSize,
        fontStyle: selectedFontStyle?.value,
        lineSpacing: selectedLineSpace?.value,
        color: color,
        backgroundColor: color2,
        titleClr: otherClrs?.titleClr,
        restClrs: otherClrs?.restClrs,
      }

      localStorage.setItem('accessibilitySetting', JSON.stringify(formData))
      close()
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }

  return (
    <>
      <div
        style={{
          height: '100%',
        }}
        onClick={() => {
          handleColorPickerToggled(), handleColorPickerToggled2()
        }}
      >
        <form onSubmit={handleSubmit(submitData)}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="label"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <AutoCompleteMenu
                      value={selectedTheme2}
                      setValue={(newValue) => {
                        onChange(newValue?.value || null)
                        setSelectedTheme(newValue)
                        setSelectedTheme2(newValue)
                      }}
                      option={themeList}
                      placeHolder={'Select'}
                      label={'Select Theme'}
                      width={'100%'}
                    />
                  )}
                />
                {errors.label && <FormHelperText sx={{ color: 'error.main' }}>{errors.label.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
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
                        setSelectedTheme({
                          value: themeList?.[0]?.value,
                          label: themeList?.[0]?.label,
                        })
                      }}
                      option={fontStyleList}
                      placeHolder={'Select'}
                      label={'Font Family'}
                      width={'100%'}
                    />
                  )}
                />
                {errors.fontStyle && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.fontStyle.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="fontSize"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fieldName="fontSize"
                      type={'text'}
                      value={ffontSize}
                      label={'Font Size'}
                      onChange={(e) => {
                        setSelectedTheme({
                          value: themeList?.[0]?.value,
                          label: themeList?.[0]?.label,
                        })
                        const inputValue = String(e.target.value || '') // Convert value to a string
                        const numericValue = inputValue.replace(/\D/g, '') // Remove non-numeric characters
                        setFontSize(`${numericValue}px`)
                        onChange(`${numericValue}px`) // Add 'px' suffix
                      }}
                    />
                  )}
                />
                {errors.fontSize && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.fontSize.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="lineSpacing"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    // <CustomTextField
                    //   type={'number'}
                    //   value={value}
                    //   label={'Line Spacing'}
                    //   onChange={(e) => {
                    //     onChange(e.target.value);
                    //     setSelectedTheme({
                    //       value: themeList?.[0]?.value,
                    //       label: themeList?.[0]?.label,
                    //     });
                    //   }}
                    // />
                    <AutoCompleteMenu
                      value={selectedLineSpace}
                      setValue={(newValue) => {
                        onChange(newValue?.value || null)
                        setSelectedLineSpace(newValue)
                      }}
                      option={lineSpaceList}
                      placeHolder={'Select'}
                      label={'Line Spacing'}
                      width={'100%'}
                    />
                  )}
                />
                {errors.lineSpacing && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.lineSpacing.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="color"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={color}
                      label="Text Color"
                      onChange={(e) => {
                        setSelectedTheme({
                          value: themeList?.[0]?.value,
                          label: themeList?.[0]?.label,
                        })
                      }}
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
                      top: '35%', // Position the color picker above the input field
                    }}
                    className="colorPick"
                    onClick={handleColorPickerClick}
                  >
                    <ColorPicker
                      color={color}
                      onChange={(e) => {
                        handleColorChange(e)
                        setSelectedTheme({
                          value: themeList?.[0]?.value,
                          label: themeList?.[0]?.label,
                        })
                      }}
                    />
                  </Box>
                )}
                {errors.color && <FormHelperText sx={{ color: 'error.main' }}>{errors.color.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="backgroundColor"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={color2}
                      label="Background Color"
                      onChange={(e) => {
                        setSelectedTheme({
                          value: themeList?.[0]?.value,
                          label: themeList?.[0]?.label,
                        })
                      }}
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
                            <BoxSvg height={'22'} width={'22'} color={color2} />
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
                    onClick={handleColorPickerClick}
                  >
                    <ColorPicker
                      color={color2}
                      onChange={(e) => {
                        handleColorChange2(e)
                        setSelectedTheme({
                          value: themeList?.[0]?.value,
                          label: themeList?.[0]?.label,
                        })
                      }}
                    />
                  </Box>
                )}
                {errors.backgroundColor && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.backgroundColor.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: '10px',
              alignItems: 'end',
              mt: '110px',
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
    </>
  )
}

export default UserSettings
