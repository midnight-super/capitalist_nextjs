import { addWorkflowStyles } from '@/styles/add-workflow-styles';
import { Box, Menu, MenuItem, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import DuplicateModal from '../componenets/duplicateModal';

const DraggableItem = ({
  item,
  listIndex,
  itemIndex,
  editingItem,
  editingDescription,
  toggleEditItem,
  toggleEditDescription,
  listContainers,
  handleItemChange,
  handleDescriptionChange,
  handleItemMenuOpen,
  handleItemMenuClose,
  selectedItem,
  itemMenu,
  itemListIndex,
  handleAddDescription,
  handleDuplicateItem,
  handelMoveUp,
  handelMoveDown,
  toggleInputModal,
  toggleOutputModal,
  inputRefs,
  descRefs,
  openWarningModal,
  taskError,
}) => {
  const {
    itemCard,
    itemInput,
    itemName,
    menuContainer,
    menuItem,
    threeDotIcon,
    itemFieldsContainer,
  } = addWorkflowStyles;

  const [isHovered, setIsHovered] = useState(false);

  const [warningOpen, setWarningModal] = useState({
    warning: false,
    update: false,
    item: false,
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: () => {
      // Capture the latest index when the drag starts
      const index = listContainers?.[listIndex]?.items.findIndex(
        (i) => i === item
      );
      return { listIndex, itemIndex: index, item };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Box
      ref={drag}
      key={itemIndex}
      sx={{
        ...itemCard,
        minHeight: item?.description ? '86px' : '52px',
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: isDragging ? 'none' : 'auto',
      }}
      onMouseDown={(e) => (e.currentTarget.style.cursor = 'grabbing')}
      onMouseUp={(e) => (e.currentTarget.style.cursor = 'grab')}
      onMouseEnter={() => !isDragging && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          ...itemFieldsContainer,
          justifyContent: item?.description ? 'space-between' : 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: '60%',
            height: '80%',
            marginLeft: '35%',
            textAlign: 'center',
            position: 'absolute',
            display: isHovered && !isDragging ? 'block' : 'none',
          }}
        >
          <Image
            src={'/icons/dragIcon.svg'}
            alt="drag"
            width={20}
            height={20}
          />
        </Box>
        {editingItem?.listIndex === listIndex &&
          editingItem?.itemIndex === itemIndex ? (
          <TextField
            inputRef={(el) =>
              (inputRefs.current[`${listIndex}-${itemIndex}`] = el)
            }
            value={item?.name}
            onChange={(e) =>
              handleItemChange(listIndex, itemIndex, e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !taskError) {
                toggleEditItem(listIndex, itemIndex);
              } else if (e.key === 'Enter' && taskError) {
                setWarningModal((prev) => ({ ...prev, warning: true }));
              }
            }}
            onBlur={() => {
              if (taskError) {
                setWarningModal((prev) => ({ ...prev, warning: true }));
              } else {
                toggleEditItem(
                  selectedItem?.listIndex,
                  selectedItem?.itemIndex
                );
              }
            }}
            error={taskError}
            sx={{
              ...itemInput,
              '& input::selection': {
                backgroundColor: '#4489FE',
                color: 'white',
              },
            }}
            inputProps={{ maxLength: 50 }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              onClick={() => toggleEditItem(listIndex, itemIndex)}
              sx={itemName}
            >
              {item?.name || 'Enter name'}
            </Typography>
            {item?.taskType && (
              <Typography
                onClick={() => toggleEditItem(listIndex, itemIndex)}
                sx={{
                  ...itemName,
                  color: '#757575',
                  fontSize: '10px',
                  marginLeft: '10px',
                }}
              >
                ({item?.taskType})
              </Typography>
            )}
          </Box>
        )}

        {editingDescription?.listIndex === listIndex &&
          editingDescription?.itemIndex === itemIndex ? (
          <TextField
            inputRef={(el) =>
              (descRefs.current[`${listIndex}-${itemIndex}`] = el)
            }
            value={item?.description || ''}
            onChange={(e) =>
              handleDescriptionChange(listIndex, itemIndex, e.target.value)
            }
            onKeyDown={(e) =>
              e.key === 'Enter' && toggleEditDescription(listIndex, itemIndex)
            }
            onBlur={() =>
              toggleEditDescription(
                selectedItem?.listIndex,
                selectedItem?.itemIndex
              )
            }
            size="small"
            sx={{ ...itemInput, mt: '6px' }}
            inputProps={{ maxLength: 50 }}
          />
        ) : item?.description ? (
          <Typography
            onClick={() => toggleEditDescription(listIndex, itemIndex)}
            sx={{ ...itemName, color: '#757575', fontSize: '12px' }}
          >
            {item?.description || 'Description'}
          </Typography>
        ) : null}
      </Box>
      <Image
        src="/icons/horizontalThreeDot.svg"
        alt="menu"
        width={30}
        height={30}
        onClick={(e) => {
          setIsHovered(false);
          handleItemMenuOpen(e, listIndex, itemIndex, item?.id, item?.taskType);
        }}
        style={threeDotIcon}
      />
      <Menu
        anchorEl={itemMenu}
        open={itemListIndex === itemIndex && Boolean(itemMenu)}
        onClose={handleItemMenuClose}
        sx={menuContainer}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() =>
            toggleInputModal(selectedItem.listIndex, selectedItem.itemIndex)
          }
        >
          <Typography sx={menuItem}>Configure Inputs</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            toggleOutputModal(selectedItem.listIndex, selectedItem.itemIndex)
          }
        >
          <Typography sx={menuItem}>Configure Outputs</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleAddDescription(selectedItem.listIndex, selectedItem.itemIndex)
          }
        >
          <Typography sx={menuItem}>Add Description</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleDuplicateItem(selectedItem.listIndex, selectedItem.itemIndex)
          }
        >
          <Typography sx={menuItem}>Duplicate</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handelMoveUp(selectedItem.listIndex, selectedItem.itemIndex)
          }
        >
          <Typography sx={menuItem}>Move Up</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handelMoveDown(selectedItem.listIndex, selectedItem.itemIndex)
          }
        >
          <Typography sx={menuItem}>Move Down</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            toggleEditItem(selectedItem.listIndex, selectedItem.itemIndex)
          }
        >
          <Typography sx={menuItem}>Rename</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            openWarningModal(
              'item',
              selectedItem?.listIndex,
              selectedItem?.itemIndex
            )
          }
        >
          <Typography sx={{ ...menuItem, color: 'red' }}>Delete</Typography>
        </MenuItem>
      </Menu>

      {warningOpen?.warning && (
        <DuplicateModal
          open={warningOpen?.warning}
          item={true}
          close={() => setWarningModal((prev) => ({ ...prev, warning: false }))}
        />
      )}
    </Box>
  );
};

export default DraggableItem;
