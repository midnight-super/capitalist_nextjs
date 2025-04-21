import CopyIconSVG from '@/menu-icons/copyIcon'
import { TextField, InputAdornment, Typography, IconButton } from '@mui/material'
import React from 'react'

const CustomTextField = ({
  onChange,
  disabled,
  value,
  label,
  type,
  fieldName,
  passwordShow,
  show,
  isPasswordValid,
  props,
  error,
  copyLink,
  serviceCode,
  workflow,
  taskType,
  onBlur,
  inputLabelProps = {},
  inputPropsTime,
  ref = null,
}) => {
  const handleKeyDown = (e) => {
    if (fieldName === 'fontSize' || fieldName === 'lineSpacing') {
      const numericValue =
        fieldName === 'fontSize' && type === 'text'
          ? parseInt((value || '0').replace(/\D/g, ''), 10)
          : parseInt(value || 0, 10) || 0

      // Allow arrow up (increase) and down (decrease) keys
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        // Increment font size by 1
        onChange({
          target: {
            value: fieldName === 'fontSize' && type === 'text' ? `${numericValue + 1}px` : `${numericValue + 1}`,
          },
        })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        // Decrement font size by 1, ensuring it does not go below 0
        onChange({
          target: {
            value:
              fieldName === 'fontSize' && type === 'text'
                ? `${Math.max(0, numericValue - 1)}px`
                : `${Math.max(0, numericValue - 1)}`,
          },
        })
      }
    }
  }

  // Handle the click for the up arrow
  // Handle the click for the up arrow
  const handleArrowUpClick = () => {
    // Ensure the value is a string and parse it correctly
    const numericValue =
      fieldName === 'fontSize' && type === 'text'
        ? parseInt((value || '0').replace(/\D/g, ''), 10)
        : parseInt(value || 0, 10) || 0
    onChange({
      target: {
        value: fieldName === 'fontSize' && type === 'text' ? `${numericValue + 1}px` : `${numericValue + 1}`,
      },
    })
  }

  // Handle the click for the down arrow
  const handleArrowDownClick = () => {
    // Ensure the value is a string and parse it correctly
    const numericValue =
      fieldName === 'fontSize' && type === 'text'
        ? parseInt((value || '0').replace(/\D/g, ''), 10)
        : parseInt(value || 0, 10) || 0
    onChange({
      target: {
        value:
          fieldName === 'fontSize' && type === 'text'
            ? `${Math.max(0, numericValue - 1)}px`
            : `${Math.max(0, numericValue - 1)}`,
      },
    })
  }

  const InputProps = {
    ...(type === 'password' && {
      endAdornment: (
        <InputAdornment position="end">
          {isPasswordValid && (
            <Typography
              sx={{
                cursor: 'pointer',
                mr: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src="/icons/greenTick.svg" alt="valid password" />
            </Typography>
          )}
          <Typography
            sx={{
              cursor: 'pointer',
              mr: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={passwordShow}
          >
            <img src={!show ? '/icons/visibility_off.svg' : '/icons/visibility.svg'} alt="toggle visibility" />
          </Typography>
        </InputAdornment>
      ),
    }),
    ...((fieldName === 'fontSize' || fieldName === 'lineSpacing' || type === 'number') && {
      endAdornment: (
        <InputAdornment position="end">
          <Typography
            sx={{
              cursor: 'pointer',
              mr: '12px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <img
              style={{
                rotate: '180deg',
                marginBottom: '-8px',
              }}
              src={'/icons/arrowDown.svg'}
              alt="up"
              onClick={handleArrowUpClick}
            />
            <img src={'/icons/arrowDown.svg'} alt="down" onClick={handleArrowDownClick} />
          </Typography>
        </InputAdornment>
      ),
    }),
    ...((fieldName === 'streamKey' || fieldName === 'uniqueURL') && {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={copyLink}
            disableRipple
            sx={{
              cursor: 'pointer',
              mr: '12px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <CopyIconSVG color={'#212121'} />
          </IconButton>
        </InputAdornment>
      ),
    }),
    ...(type === 'number' && {
      inputProps: {
        min: 0,
      },
    }),
    ...(inputPropsTime && {
      inputProps: inputPropsTime,
    }),
  }

  return (
    <TextField
      {...props}
      slotProps={{
        inputLabel: inputLabelProps,
        input: InputProps,
      }}
      ref={ref}
      error={error}
      fullWidth
      label={label || ''}
      value={value || ''}
      variant="outlined"
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled || false}
      inputMode={fieldName === 'fontSize' || fieldName === 'lineSpacing' || type === 'number' ? 'numeric' : 'text'}
      type={type === 'password' && !show ? 'password' : type === 'password' && show ? 'text' : type || 'text'}
      input={serviceCode ? { maxLength: 3 } : workflow ? { maxLength: 50 } : taskType ? { maxLength: 50 } : {}}
      sx={{
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        '& .MuiOutlinedInput-input': {
          color: '#212121 !important',
          textTransform: serviceCode ? 'uppercase' : 'none',
        },
        '& .MuiOutlinedInput-root': {
          height: '44px',
          fontSize: '14px',
          textAlign: 'center',
          fontWeight: 400,
          borderRadius: '4px',
          padding: '0 !important',
          display: 'flex',
          alignItems: 'center',
          borderColor: 'red !important',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E0E0E0 !important',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          outline: 'none',
          boxShadow: 'unset',
        },
        '& .MuiInputLabel-root': {
          color: '#757575 !important',
          fontSize: '14px',
          fontWeight: 400,
        },
        '& .MuiOutlinedInput-input.Mui-disabled': {
          WebkitTextFillColor: '#212121',
          fontSize: '14px',
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
          display: 'none', // Hides spinner in Chrome and Edge
        },
      }}
    />
  )
}

export default CustomTextField
