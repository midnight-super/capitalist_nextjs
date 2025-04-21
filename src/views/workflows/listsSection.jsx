import { Box, Button } from '@mui/material';
import Image from 'next/image';
import React, { useRef } from 'react';
import DraggableItem from './draggableItem';
import TasktypeModal from './modal/tasktypeModal';
import { addWorkflowStyles } from '@/styles/add-workflow-styles';
import ListHeader from './listHeader';
import { useDrop } from 'react-dnd';

const ListsSection = ({
    list,
    listIndex,
    listContainers,
    setListContainers,
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
    editingDescription,
    toggleEditDescription,
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
    handleDeleteItem,
    toggleInputModal,
    toggleOutputModal,
    inputRefs,
    descRefs,
    taskTypeOpen,
    taskTypeList,
    handleTasktypeCancel,
    handleTasktypeClose,
    handleAddItemClick,
    control,
    setSelectedType,
    taskError,
    selectedType,
    nameError
}) => {
    const { listContainer, addItemButton, threeDotIcon } = addWorkflowStyles;
    const listRef = useRef(null); // Define ref for the list container

    const [, drop] = useDrop({
        accept: 'ITEM',
        hover: (draggedItem, monitor) => {
            if (!monitor.isOver() || !listRef.current) return;

            const updatedLists = [...listContainers];
            const draggedList = updatedLists[draggedItem.listIndex];
            const dropList = updatedLists[listIndex];

            if (!draggedList || !dropList) return;

            // Get the current hover position
            const clientOffset = monitor.getClientOffset();
            const hoverBoundingRect = listRef.current.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Calculate the drop index based on mouse position
            let dropIndex = Math.floor(
                (hoverClientY / hoverBoundingRect.height) * dropList.items.length
            );
            dropIndex = Math.max(0, Math.min(dropList.items.length, dropIndex));

            if (
                draggedItem.listIndex === listIndex &&
                draggedItem.itemIndex === dropIndex
            )
                return;

            // Remove the item from the original position
            const [movedItem] = draggedList.items.splice(draggedItem.itemIndex, 1);

            // Insert the item at the correct index
            dropList.items.splice(dropIndex, 0, movedItem);

            setListContainers(updatedLists);

            // Update dragged item details
            draggedItem.listIndex = listIndex;
            draggedItem.itemIndex = dropIndex;
        },
    });

    drop(listRef); // Attach drop to the ref

    return (
        <Box ref={listRef} sx={listContainer}>
            <ListHeader
                listContainers={listContainers}
                list={list}
                listIndex={listIndex}
                editingItem={editingItem}
                listInputRefs={listInputRefs}
                handleListNameChange={handleListNameChange}
                toggleEditItem={toggleEditItem}
                handleMenuOpen={handleMenuOpen}
                anchorEl={anchorEl}
                menuListIndex={menuListIndex}
                handleMenuClose={handleMenuClose}
                handleDuplicateList={handleDuplicateList}
                handelMoveRight={handelMoveRight}
                handelMoveLeft={handelMoveLeft}
                openWarningModal={openWarningModal}
                nameError={nameError}
            />
            {list?.items?.map((item, itemIndex) => (
                <DraggableItem
                    key={itemIndex}
                    item={item}
                    itemIndex={itemIndex}
                    listIndex={listIndex}
                    listContainers={listContainers}
                    setListContainers={setListContainers}
                    editingItem={editingItem}
                    editingDescription={editingDescription}
                    toggleEditItem={toggleEditItem}
                    toggleEditDescription={toggleEditDescription}
                    handleItemChange={handleItemChange}
                    handleDescriptionChange={handleDescriptionChange}
                    handleItemMenuOpen={handleItemMenuOpen}
                    handleItemMenuClose={handleItemMenuClose}
                    selectedItem={selectedItem}
                    itemMenu={itemMenu}
                    itemListIndex={itemListIndex}
                    handleAddDescription={handleAddDescription}
                    handleDuplicateItem={handleDuplicateItem}
                    handelMoveUp={handelMoveUp}
                    handelMoveDown={handelMoveDown}
                    handleDeleteItem={handleDeleteItem}
                    toggleInputModal={toggleInputModal}
                    toggleOutputModal={toggleOutputModal}
                    inputRefs={inputRefs}
                    descRefs={descRefs}
                    openWarningModal={openWarningModal}
                    taskError={taskError}
                />
            ))}

            <Button
                variant="text"
                sx={addItemButton}
                onClick={() => handleAddItemClick(listIndex)}
            >
                <Image
                    src="/icons/circularPlusIcon.svg"
                    alt="plus"
                    style={{ ...threeDotIcon, marginRight: '6px' }}
                    width={24}
                    height={24}
                />{' '}
                Add item
            </Button>
            {taskTypeOpen && (
                <TasktypeModal
                    open={taskTypeOpen}
                    close={handleTasktypeCancel}
                    closeAll={() => handleTasktypeClose(menuListIndex)}
                    taskTypeList={taskTypeList}
                    control={control}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                />
            )}
        </Box>
    );
};

export default ListsSection;
