import CustomSelectField from '@/components/customSelectField';
import CustomTextField from '@/components/customTextField';
import { addOnsStyles } from '@/styles/add-modals-styles';
import { Box, Button, FormControl, FormHelperText } from '@mui/material';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd';
import { Controller } from 'react-hook-form';

const DraggableOption = ({ item, index, moveOption, control, errors, length, editId, isView, units, removeField, addOnsData, setIsChanged }) => {

    const {
        addOptionButton,
        optionContainer,
        firstContainer,
        secondContainer,
        removeButton,
        optionDivider,
        optionDividerNum,
    } = addOnsStyles;

    const dragRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const [{ isDragging }, drag] = useDrag({
        type: "OPTION",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "OPTION",
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveOption(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    drag(drop(dragRef));

    return (
        <Box
            ref={dragRef}
            key={item.id}
            sx={{ ...optionContainer, opacity: isDragging ? 0.5 : 1, cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={(e) => e.currentTarget.style.cursor = "grabbing"}
            onMouseUp={(e) => e.currentTarget.style.cursor = "grab"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {
                index < length && (
                    <Box
                        sx={optionDivider}
                    >
                        <Box
                            sx={optionDividerNum}
                        >
                            Option {index + 1}
                        </Box>
                        <Box sx={{
                            width: "100%",
                            textAlign: "center",
                            position: "absolute",
                            display: isHovered ? "block" : "none"
                        }}>
                            <Image src={"/icons/dragIcon.svg"} alt='drag' width={20} height={20} />
                        </Box>
                    </Box>
                )
            }

            <Box sx={{ ...firstContainer, height: "60px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <Controller
                        name={`options[${index}].optionName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <CustomTextField
                                type="optionName"
                                value={value}
                                label="Name"
                                disabled={editId && isView}
                                onChange={(event) => {
                                    const newValue = event.target.value;
                                    onChange(newValue);
                                    setIsChanged(addOnsData?.options?.[index] !== newValue);
                                }}
                                error={!!errors.optionName}
                            />
                        )}
                    />
                    {errors?.options?.[index]?.optionName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.options[index].optionName.message}</FormHelperText>
                    )}

                </Box>
                <FormControl fullWidth>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Controller
                            name={`options[${index}].unit`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CustomSelectField
                                    value={value}
                                    label="Unit"
                                    onChange={(event) => {
                                        const newValue = event;
                                        onChange(newValue);
                                        setIsChanged(addOnsData?.options?.[index] !== newValue);
                                    }}
                                    error={!!errors.serviceCode}
                                    options={units?.map(item => ({
                                        label: item?.unitName,
                                        value: item?.unitId
                                    }))}
                                />
                            )}
                        />

                        {errors?.options?.[index]?.unit && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.options[index].unit.message}</FormHelperText>
                        )}
                    </Box>
                </FormControl>
            </Box>

            <Box sx={secondContainer}>
                <Controller
                    name={`options[${index}].baseRate`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <CustomTextField
                            type="baseRate"
                            value={value}
                            label="Base Price"
                            disabled={editId && isView}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                onChange(newValue);
                                setIsChanged(addOnsData?.options?.[index] !== newValue);
                            }}
                            error={!!errors.baseRate}
                            workflow={true}
                        />
                    )}
                />

                <Controller
                    name={`options[${index}].minimumPricePerProject`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <CustomTextField
                            value={value}
                            label="Minimum Price / Project"
                            disabled={editId && isView}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                onChange(newValue);
                                setIsChanged(addOnsData?.options?.[index] !== newValue);
                            }}
                            error={!!errors.minimumPricePerProject}
                            workflow={true}
                        />
                    )}
                />

                <Controller
                    name={`options[${index}].minimumBillableLengthPerFile`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <CustomTextField
                            value={value}
                            label="Minimum Price / File"
                            disabled={editId && isView}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                onChange(newValue);
                                setIsChanged(addOnsData?.options?.[index] !== newValue);
                            }}
                            error={!!errors.minimumBillableLengthPerFile}
                            workflow={true}
                        />
                    )}
                />

            </Box>

            {index > 1 &&
                <Box item xs={12} md={4}
                    sx={removeButton}>
                    <Button
                        color="error"
                        variant="text"
                        onClick={() => removeField(index)}
                        sx={addOptionButton}
                        size='small'
                    >
                        Remove
                    </Button>
                </Box>
            }
        </Box>
    );
};

export default DraggableOption