import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

const CustomTableHeaderTitle = ({
  title,
  colSorting,
  setColSorting,
  colDef,
}) => {
  const handleSort = (order, key) => {
    setColSorting((prev) => {
      return {
        [key]: prev[key] !== order ? order : '',
      };
    });
  };
  const getSortValue = (key) => {
    switch (colSorting?.[key]) {
      case '':
        return 'asc';
      case 'asc':
        return 'desc';

      case 'desc':
        return '';

      default:
        return 'asc';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'relative',
        '&:hover .icon-button': {
          opacity: 1,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: '12px',
          color: '#212121',
          fontWeight: '500',
          lineHeight: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {title}
      </Typography>

      <Typography
        className="icon-button"
        sx={{
          opacity:
            colSorting?.[colDef?.field] === 'asc' ||
            colSorting?.[colDef?.field] === 'desc'
              ? 1
              : 0,
          transition: 'opacity 0.2s ease-in-out',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'inherit',
          },
          '&:active': {
            backgroundColor: 'transparent',
          },
        }}
        onClick={() => handleSort(getSortValue(colDef?.field), colDef?.field)}
        size="small"
      >
        <img
          src={
            colSorting?.[colDef?.field] === 'asc'
              ? '/icons/sorting_up.svg'
              : colSorting?.[colDef?.field] === 'desc'
                ? '/icons/sorting_down.svg'
                : '/icons/sorting_clear.svg'
          }
          alt="sorting"
        />
      </Typography>
    </Box>
  );
};

export default CustomTableHeaderTitle;
