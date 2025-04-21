import { addWorkflowStyles } from '@/styles/add-workflow-styles';
import { Box, Menu, MenuItem, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import DuplicateModal from '../componenets/duplicateModal';

const ListHeader = ({
  list,
  listIndex,
  editingItem,
  listInputRefs,
  handleListNameChange,
  toggleEditItem,
  handleMenuOpen,
  anchorEl,
  menuListIndex,
  handleMenuClose,
  handleDuplicateList,
  handelMoveRight,
  handelMoveLeft,
  openWarningModal,
  nameError,
}) => {
  const {
    itemCard,
    itemInput,
    listName,
    menuContainer,
    menuItem,
    threeDotIcon,
  } = addWorkflowStyles;

  const [warningOpen, setWarningModal] = useState({
    warning: false,
    update: false,
    item: false,
  });

  return (
    <Box
      sx={{
        ...itemCard,
        backgroundColor: '#F2F2F2',
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
      }}
    >
      {editingItem.listIndex === listIndex && editingItem.itemIndex === null ? (
        <TextField
          inputRef={(el) => (listInputRefs.current[listIndex] = el)}
          value={list.name}
          onChange={(e) => handleListNameChange(listIndex, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !nameError) {
              toggleEditItem(listIndex, null);
            } else if (e.key === 'Enter' && nameError) {
              setWarningModal((prev) => ({ ...prev, warning: true }));
            }
          }}
          size="small"
          onBlur={() => {
            if (nameError) {
              setWarningModal((prev) => ({ ...prev, warning: true }));
            } else {
              toggleEditItem(listIndex, null);
            }
          }}
          error={nameError}
          sx={{
            ...itemInput,
            '& input::selection': {
              backgroundColor: '#4489FE',
              color: 'white',
            },
          }}
          inputProps={{ maxLength: 22 }}
        />
      ) : (
        <Typography onClick={() => toggleEditItem(listIndex)} sx={listName}>
          {list.name || 'Enter name'}
        </Typography>
      )}

      <Image
        src="/icons/horizontalThreeDot.svg"
        alt="menu"
        width={30}
        height={30}
        onClick={(e) => handleMenuOpen(e, listIndex)}
        style={threeDotIcon}
      />
      <Menu
        anchorEl={anchorEl}
        open={menuListIndex === listIndex && Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={menuContainer}
      >
        <MenuItem onClick={() => handleDuplicateList(listIndex)}>
          <Typography sx={menuItem}>Duplicate</Typography>
        </MenuItem>
        <MenuItem onClick={() => handelMoveRight(listIndex)}>
          <Typography sx={menuItem}>Move Right</Typography>
        </MenuItem>
        <MenuItem onClick={() => handelMoveLeft(listIndex)}>
          <Typography sx={menuItem}>Move Left</Typography>
        </MenuItem>
        <MenuItem onClick={() => toggleEditItem(listIndex)}>
          <Typography sx={menuItem}>Rename</Typography>
        </MenuItem>
        <MenuItem onClick={() => openWarningModal('list', listIndex)}>
          <Typography sx={{ ...menuItem, color: 'red' }}>Delete</Typography>
        </MenuItem>
      </Menu>

      {warningOpen?.warning && (
        <DuplicateModal
          open={warningOpen?.warning}
          item={false}
          close={() => setWarningModal((prev) => ({ ...prev, warning: false }))}
        />
      )}
    </Box>
  );
};

export default ListHeader;
