import React, { useState } from 'react'
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

const ThemeModal = ({ editId, close }) => {
  const [selectedFontStyle, setSelectedFontStyle] = useState(null)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [color, setColor] = useState('#4489FE')
  const [isColorPickerOpen2, setIsColorPickerOpen2] = useState(false)
  const [color2, setColor2] = useState('#20C26D')

  const schema = yup.object().shape({
    themeName: yup.string().required('Theme name is required'),
    fontSize: yup.string().required('Font Size is required'),
    fontStyle: yup.string().required('Font Style is required'),
    textColor: yup.string().required('Text Color is required'),
    backgroundColor: yup.string().required('Background Color is required'),
  })
  const defaultValue = {
    themeName: null,
    fontSize: null,
    fontStyle: null,
    textColor: color,
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

  const fontStyleList = [
    { value: 'timesNewRoman', label: 'Times New Roman' },
    { value: 'arial', label: 'Arial' },
    { value: 'calibri', label: 'Calibri' },
    { value: 'verdana', label: 'Verdana' },
    { value: 'georgia', label: 'Georgia' },
  ]
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
    console.log(data, 'data')
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
                  name="themeName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField value={value} label={'Write Theme Name'} onChange={onChange} />
                  )}
                />
                {errors.themeName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.themeName.message}</FormHelperText>
                )}
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
                      value={value}
                      label={'Fontsize'}
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
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="textColor"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={color}
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
                    <ColorPicker color={color2} onChange={handleColorChange2} />
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
              mt: '98px',
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
              {editId ? 'Edit' : 'Add'} Theme
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

export default ThemeModal
