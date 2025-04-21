import { addServiceCategStyles, fieldStyles } from '@/styles/add-modals-styles'
import { Select, MenuItem, InputLabel, ListSubheader } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import { usePathname } from 'next/navigation'
import React from 'react'

const CustomSelectField = ({ value, onChange, label, options, addOns, taskType, customStyle = {} }) => {
  const { selectLabel } = addServiceCategStyles
  const { selectStyle, menuProps, menuItems, listSubHeader } = fieldStyles
  const currentPath = usePathname()?.startsWith('/order-management/order')
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label" sx={selectLabel}>
        {label}
      </InputLabel>
      <Select
        value={value || ''}
        onChange={onChange}
        label={label}
        renderValue={(selected) => {
          let selectedOption = null

          if (addOns) {
            for (const categoryOptions of Object.values(options)) {
              selectedOption = categoryOptions?.find((option) => option?.value === selected)
              if (selectedOption) {
                break
              }
            }
          } else {
            selectedOption = options?.find((option) => option?.value === selected)
          }
          const displayText = selectedOption ? selectedOption.label : ''
          return displayText.length > 15 && taskType ? `${displayText.substring(0, 15)}...` : displayText
        }}
        sx={{
          // ...customStyle,
          ...selectStyle,
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #E0E0E0',
            borderRadius: '4px',
            ...(currentPath && { height: '50px !important' }),
          },

          '& .MuiSelect-select': {
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0',
          },
          '& .MuiSvgIcon-root': {
            color: 'rgba(0, 0, 0, 0.54)',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: menuProps,
          },
        }}
      >
        {addOns
          ? Object.entries(options).map(([category, services]) => [
              <ListSubheader key={category} sx={listSubHeader}>
                {category}
              </ListSubheader>,
              ...services.map((service) => (
                <MenuItem key={service.value} value={service.value}>
                  {service.label}
                </MenuItem>
              )),
            ])
          : !!options &&
            options.map((option, index) => (
              <MenuItem key={index} value={option?.value} sx={menuItems}>
                {option?.label}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  )
}

export default CustomSelectField
