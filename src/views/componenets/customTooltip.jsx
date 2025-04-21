import React from 'react';
import { Tooltip, styled } from '@mui/material';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#414651',
    textAlign: 'center',
    boxShadow:
      '0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03)',
    fontSize: '0.875rem',
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#ffffff',
  },
}));

export default CustomTooltip;
