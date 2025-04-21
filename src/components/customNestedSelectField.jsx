import { addServiceCategStyles, fieldStyles } from '@/styles/add-modals-styles';
import {
  Select,
  MenuItem,
  InputLabel,
  Typography,
  ListSubheader,
  IconButton,
} from '@mui/material';
import React, { useMemo, useEffect, useState } from 'react';

const CustomNestedSelectField = ({
  label,
  options,
  setSelectedSubOption,
  propIndex,
  selectedSubOption,
  workflowConnections,
  inputId,
}) => {
  const { selectLabel } = addServiceCategStyles;
  const { selectStyle, menuProps, menuItems } = fieldStyles;

  // **Transform options into a grouped structure**
  const groupedOptions = useMemo(() => {
    return options?.flatMap((option) => [
      { isGroupLabel: true, label: option.label },
      ...(option?.inputs?.map((input) => ({
        ...input,
        taskValue: option.value, // Store task ID for reference
        taskLabel: option.label, // Store task label for display
      })) || []),
    ]);
  }, [options]);

  // **Get pre-selected value based on selectedSubOption**
  const getPreSelectedValue = useMemo(() => {
    if (
      !workflowConnections ||
      !selectedSubOption?.length ||
      !groupedOptions?.length
    ) {
      return null;
    }

    // Find the matching selection from selectedSubOption where inputId matches the prop inputId
    const validSelection = selectedSubOption.find(
      (option) => option?.inputId === inputId
    );

    if (!validSelection) {
      return null;
    }

    const { outputId, taskId } = validSelection;

    // Find the corresponding option in groupedOptions
    const matchingOption = groupedOptions.find(
      (option) =>
        option.value === outputId &&
        option.taskValue === taskId &&
        validSelection.inputId === inputId
    );

    if (matchingOption) {
      return {
        taskLabel: matchingOption.taskLabel,
        inputLabel: matchingOption.label,
        value: matchingOption.value,
        inputId, // Ensure inputId is correctly set
      };
    }

    return null;
  }, [groupedOptions, selectedSubOption, inputId, workflowConnections]);

  // **State to manage selection**
  const [selectedValue, setSelectedValue] = useState(getPreSelectedValue);

  useEffect(() => {
    if (getPreSelectedValue !== null) {
      setSelectedValue(getPreSelectedValue);
    }
  }, [getPreSelectedValue]);

  // **Handle Option Click**
  const handleOptionClick = (task, input, inputId) => {
    setSelectedSubOption((prev) => {
      const updated = [...prev];

      // **Ensure only the selected index is updated**
      updated[propIndex] = {
        outputId: input.value,
        taskId: input.taskValue,
        inputId, // Ensure inputId is stored correctly
      };

      return updated;
    });

    setSelectedValue({
      taskLabel: task.label,
      inputLabel: input.label,
      value: input.value,
      inputId,
    });
  };
  const handleClearSelection = () => {
    setSelectedSubOption((prev) =>
      prev.filter((option) => option.inputId !== inputId)
    );
    setSelectedValue(null);
  };

  return (
    <>
      <InputLabel id="custom-select-label" sx={selectLabel}>
        {label}
      </InputLabel>
      <Select
        value={inputId === selectedValue?.inputId ? selectedValue?.value : ''}
        renderValue={() =>
          selectedValue
            ? `${selectedValue.taskLabel} - ${selectedValue.inputLabel}`
            : 'Select Tasks'
        }
        endAdornment={
          selectedValue && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection();
              }}
              sx={{ mr: "10px" }}
            >
              <img src='/icons/closeIcon.svg' alt='close' />
            </IconButton>
          )
        }
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
        {groupedOptions?.map((item, index) => {
          if (item?.isGroupLabel) {
            return <ListSubheader key={index}>{item?.label}</ListSubheader>;
          } else {
            const isDisabled = selectedSubOption.some(
              (sel) => sel.inputId !== inputId && sel.outputId === item.value
            );
            return (
              <MenuItem
                key={index}
                value={String(item.value)}
                sx={menuItems}
                onClick={() =>
                  handleOptionClick(
                    options.find((task) => task.value === item.taskValue),
                    item,
                    inputId
                  )
                }
                disabled={isDisabled}
              >
                <Typography>{item?.label}</Typography>
              </MenuItem>
            );
          }
        })}
      </Select>
    </>
  );
};

export default CustomNestedSelectField;
