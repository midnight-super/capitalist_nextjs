import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import AutoCompleteMenu from '@/components/customDropdown'
import { Box, Button, FormControl, FormHelperText } from '@mui/material'

const languageList = [
  {
    value: 'en-US',
    label: 'English',
  },
  {
    value: 'es-US',
    label: 'Spanish',
  },
]

const OutputLanguage = ({ close, editId }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  const schema = yup.object().shape({
    language: yup.string().required('Output language is required'),
  })
  const defaultValue = {
    language: null,
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
    const languageSetting = localStorage.getItem('languageSetting')
      ? JSON.parse(localStorage.getItem('languageSetting'))
      : null
    if (languageSetting) {
      const lang = languageList.find((lng) => lng.value === languageSetting?.language)
      reset(languageSetting)
      setValue('language', languageSetting.language)
      setSelectedLanguage({ value: lang.value, label: lang.label })
    } else {
      reset(defaultValue)
      setValue('language', null)
    }
  }, []) // Runs once on mount

  const submitData = () => {
    try {
      const payload = {
        language: selectedLanguage?.value,
      }
      localStorage.setItem('languageSetting', JSON.stringify(payload))
      window.location.reload()
      close()
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }
  return (
    <form onSubmit={handleSubmit(submitData)}>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="language"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <AutoCompleteMenu
                    value={selectedLanguage}
                    setValue={(newValue) => {
                      onChange(newValue?.value || null)
                      setSelectedLanguage(newValue)
                    }}
                    option={languageList}
                    placeHolder={'Select'}
                    label={'Select Language'}
                    width={'100%'}
                  />
                )}
              />
              {errors.language && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.language.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            gap: '10px',
            mt: '277px',
            alignItems: 'end',
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
            Save{' '}
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
      </Box>
    </form>
  )
}

export default OutputLanguage
