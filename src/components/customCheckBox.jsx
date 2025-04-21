import { Checkbox } from '@mui/material';
import React from 'react';

const CustomCheckBox = (props) => {
  return (
    <Checkbox
      {...props}
      disableRipple
      icon={<img src="/icons/globalCheckBox.svg" alt="" />}
      checkedIcon={<img src="/icons/globalChecked.svg" alt="" />}
      sx={{
        padding: 0,
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
    />
  );
};

export default CustomCheckBox;
