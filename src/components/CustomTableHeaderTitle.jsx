import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomTableHeaderTitle = ({ title, colDef, colSorting, setColSorting, onSortModelChange }) => {
  const field = colDef?.field;
  const currentSort = colSorting[field];

  const handleSort = () => {
    if (!field) return;

    let newSort;
    if (!currentSort || currentSort === '') {
      newSort = 'desc';
    } else if (currentSort === 'desc') {
      newSort = 'asc';
    } else {
      newSort = '';
    }

    setColSorting(prev => ({
      ...prev,
      [field]: newSort
    }));

    if (onSortModelChange) {
      onSortModelChange([{ field, sort: newSort }]);
    }
  };

  const renderSortIcon = () => {
    return (
      <Box sx={{ position: 'relative', ml: 1, height: 12, width: 8 }}>
        {/* Up Arrow */}
        <Box
          component="img"
          src="/icons/arrow-up.svg"
          alt="up"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: !currentSort ? 0.5 : currentSort === 'asc' ? 1 : 0.5,
            color: currentSort === 'asc' ? '#4489FE' : '#757575'
          }}
        />
        {/* Down Arrow */}
        <Box
          component="img"
          src="/icons/arrow-down.svg"
          alt="down"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: !currentSort ? 0.5 : currentSort === 'desc' ? 1 : 0.5,
            color: currentSort === 'desc' ? '#4489FE' : '#757575'
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: currentSort ? '#4489FE' : '#212121',
        fontSize: '14px',
        fontWeight: 500,
        '&:hover': { color: '#4489FE' }
      }}
      onClick={handleSort}
    >
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: '500',
          lineHeight: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          color: 'inherit'
        }}
      >
        {title}
      </Typography>
      {renderSortIcon()}
    </Box>
  );
};

export default CustomTableHeaderTitle; 