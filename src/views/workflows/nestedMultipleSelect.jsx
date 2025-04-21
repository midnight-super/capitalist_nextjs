import { addServiceCategStyles, fieldStyles } from '@/styles/add-modals-styles';
import {
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import React from 'react';
const NestedMultipleSelect = ({
  label,
  options,
  selectedSubOption,
  setSelectedSubOption,
  propIndex,
  workflowConnections,
  selectedItemId,
}) => {
  const { selectLabel } = addServiceCategStyles;
  const { selectStyle, menuProps, menuItems } = fieldStyles;

  const handleOptionChange = (inputValue, taskId) => {
    setSelectedSubOption((prev) => {
      const updatedSelections = { ...prev };
      const selectedValues = updatedSelections[propIndex]?.[taskId] || [];

      const isSelected = selectedValues.includes(inputValue);
      const updatedValues = isSelected
        ? selectedValues.filter((val) => val !== inputValue)
        : [...selectedValues, inputValue];

      return {
        ...prev,
        [propIndex]: {
          ...updatedSelections[propIndex],
          [taskId]: updatedValues,
        },
      };
    });
  };

  const handleDelete = (event, key, optionValue) => {
    event.stopPropagation(); // Prevent dropdown from opening

    setSelectedSubOption((prev) => ({
      ...prev,
      [propIndex]: {
        ...prev[propIndex],
        [optionValue]: prev[propIndex]?.[optionValue]?.filter(
          (item) => item !== key
        ),
      },
    }));
  };

  return (
    <>
      <InputLabel id="grouped-select-label" sx={selectLabel}>
        {label}
      </InputLabel>
      <Select
        multiple
        value={
          Object.values(selectedSubOption?.[propIndex] || {})?.flat() || []
        }
        renderValue={(selected) => {
          if (!selected || selected.length === 0) return 'Select Tasks';

          const selectedLabels = options?.flatMap((option) =>
            option?.inputs
              ?.filter((input) =>
                selectedSubOption?.[propIndex]?.[option.value]?.includes(
                  input?.value
                )
              )
              ?.map((input) => ({
                key: input.value,
                label: `${input?.label} - ${option?.label}`,
                optionValue: option.value,
              }))
          );

          return (
            <Box
              sx={{
                display: 'flex',
                overflowX: 'scroll',
                whiteSpace: 'nowrap',
                gap: 0.5,
                paddingBottom: 0.5,
                maxWidth: '100%',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                '-ms-overflow-style': 'none',
              }}
              onMouseDown={(event) => event.stopPropagation()} // Block click from triggering dropdown
            >
              {selectedLabels?.map((item, index) => (
                <Chip
                  key={index}
                  label={item.label}
                  onDelete={(event) =>
                    handleDelete(event, item.key, item.optionValue)
                  }
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          );
        }}
        sx={{
          ...selectStyle,
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #ccc',
            borderRadius: '4px',
          },
          '& .MuiSelect-select': {
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4489FE',
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
        {options?.map((option, index) => (
          <div key={index}>
            <MenuItem disabled sx={{ fontWeight: 'bold', fontSize: '14px' }}>
              {option?.label}
            </MenuItem>
            {option?.inputs?.map((input, i) => (
              <MenuItem
                key={`${index}-${i}`}
                value={input?.value}
                onClick={() => handleOptionChange(input?.value, option?.value)}
                sx={menuItems}
                disabled={
                  workflowConnections?.some(
                    (connection) =>
                      connection?.inputId === input?.value &&
                      connection?.inputWorkflowTaskId === option.value &&
                      connection?.outputWorkflowTaskId !== selectedItemId // Don't disable if it's the selected item
                  ) ||
                  Object.entries(selectedSubOption || {}).some(
                    ([index, selectedValues]) =>
                      index !== String(propIndex) && // Ensure we are checking other dropdowns
                      selectedValues?.[option.value]?.includes(input.value)
                  )
                }
              >
                <Checkbox
                  checked={
                    selectedSubOption?.[propIndex]?.[option.value]?.includes(
                      input.value
                    ) || false
                  }
                />
                <ListItemText primary={input?.label} />
              </MenuItem>
            ))}
          </div>
        ))}
      </Select>
    </>
  );
};

export default NestedMultipleSelect;
