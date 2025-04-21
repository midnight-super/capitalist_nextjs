import React, { useState, useCallback, useEffect } from 'react';
import { Box, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import formatPrice from '@/hooks/priceCommas';

const OrderGeneralPriceCalculation = ({ orderParts, setGeneralInformationFields, generalInformationFields, setInitialState }) => {
    const [discountType, setDiscountType] = useState(() => {
        return generalInformationFields?.manualDiscount?.toString().endsWith('%') ? 'percentage' : 'fixed';
    });
    const [localDiscount, setLocalDiscount] = useState(
        generalInformationFields?.manualDiscount?.replace('%', '') || '0'
    );

    const calculateTotalPrice = useCallback(() => {
        return orderParts.reduce((total, part) => {
            return total + parseFloat(part.finalPrice || 0);
        }, 0);
    }, [orderParts]);

    const calculateDiscount = useCallback((discountValue) => {
        const totalPrice = calculateTotalPrice();
        if (discountType === 'percentage') {
            return (totalPrice * parseFloat(discountValue || 0)) / 100;
        }
        return parseFloat(discountValue || 0);
    }, [discountType, calculateTotalPrice]);

    const handleDiscountChange = (value) => {
        let numericValue = value.replace(/[^\d.]/g, '');

        // Validate percentage cannot exceed 100
        if (discountType === 'percentage' && parseFloat(numericValue) > 100) {
            numericValue = '100';
        }

        // Validate fixed amount cannot exceed total price
        if (discountType === 'fixed') {
            const totalPrice = calculateTotalPrice();
            if (parseFloat(numericValue) > totalPrice) {
                numericValue = totalPrice.toString();
            }
        }

        setLocalDiscount(numericValue);

        const totalPrice = calculateTotalPrice();
        const discountAmount = calculateDiscount(numericValue);
        const finalPrice = totalPrice - discountAmount;

        setGeneralInformationFields(prev => ({
            ...prev,
            manualDiscount: discountType === 'percentage' ? `${numericValue}%` : numericValue,
            totalPrice: totalPrice.toString(),
            finalPrice: finalPrice.toString()
        }));
    };

    const handleDiscountTypeChange = (e) => {
        const newType = e.target.value;
        const totalPrice = calculateTotalPrice();
        const currentValue = localDiscount;

        let newValue;
        if (newType === 'percentage') {
            newValue = ((parseFloat(currentValue) / totalPrice) * 100).toFixed(2);
            if (parseFloat(newValue) > 100) newValue = '100';
        } else {
            newValue = ((parseFloat(currentValue) / 100) * totalPrice).toFixed(2);
            if (parseFloat(newValue) > totalPrice) newValue = totalPrice.toString();
        }

        setDiscountType(newType);
        setLocalDiscount(newValue);

        const discountAmount = calculateDiscount(newValue);
        const finalPrice = totalPrice - discountAmount;

        setGeneralInformationFields(prev => ({
            ...prev,
            manualDiscount: newType === 'percentage' ? `${newValue}%` : newValue,
            totalPrice: totalPrice.toString(),
            finalPrice: finalPrice.toString()
        }));
    };

    // Update prices when orderParts change
    useEffect(() => {
        const totalPrice = calculateTotalPrice();
        const discountAmount = calculateDiscount(localDiscount);
        const finalPrice = totalPrice - discountAmount;

        setGeneralInformationFields(prev => ({
            ...prev,
            totalPrice: totalPrice.toString(),
            finalPrice: finalPrice.toString()
        }));
        setInitialState((prev) => ({
            ...prev,
            generalInformation: {
                ...prev?.generalInformation,
                totalPrice: totalPrice?.toString(),
                finalPrice: finalPrice?.toString(),
            }
        }))
    }, [orderParts, calculateTotalPrice, calculateDiscount, localDiscount]);

    return (
        <Box sx={{ mt: 3 }}>
            {/* Order Parts Table */}
            {orderParts?.length === 0 && (
                <Box sx={{ py: 1 }}>
                    <Typography sx={{ fontSize: '14px' }}>
                        There is no job in this order.
                    </Typography>
                </Box>
            )}
            {orderParts.map((part, index) => (
                <Grid container key={part.id} sx={{ py: 1 }}>
                    <Grid item xs={2}>
                        <Typography sx={{ fontSize: '14px' }}>Job</Typography>
                    </Grid>
                    <Grid item xs={7.5}>
                        <Typography sx={{ fontSize: '14px', textAlign: "center" }}>{part.label || `Job ${index + 1}`}</Typography>
                    </Grid>
                    <Grid item xs={2.5} sx={{ textAlign: 'left' }}>
                        <Typography sx={{ fontSize: '14px' }}>
                            ${formatPrice(parseFloat(part.finalPrice || 0).toFixed(2))}
                        </Typography>
                    </Grid>
                </Grid>
            ))}

            {/* Subtotal */}
            <Grid container sx={{ py: 1, borderTop: '1px solid #E0E0E0' }}>
                <Grid item xs={9.5}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Subtotal</Typography>
                </Grid>
                <Grid item xs={2.5}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                        ${formatPrice(parseFloat(generalInformationFields?.totalPrice || 0).toFixed(2))}
                    </Typography>
                </Grid>
            </Grid>

            {/* Discount Section */}
            <Grid container sx={{ py: 1, mt: 2 }} alignItems="center">
                <Grid item xs={1.7}>
                    <Typography sx={{ fontSize: '14px' }}>Discount</Typography>
                </Grid>
                <Grid item xs={3.8}>
                    <Box sx={{
                        "@media (min-width: 991px) and (max-width: 1100px)": {
                            display: "none"
                        },
                        "@media (max-width: 730px)": {
                            display: "none"
                        }
                    }}>
                        <Select

                            size="small"
                            value={discountType}
                            onChange={handleDiscountTypeChange}
                            sx={{ minWidth: "90%" }}
                        >
                            <MenuItem value="percentage">Percentage (%)</MenuItem>
                            <MenuItem value="fixed">Fixed ($)</MenuItem>
                        </Select>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{
                        "@media (min-width: 991px) and (max-width: 1100px)": {
                            display: "none"
                        },
                        "@media (max-width: 730px)": {
                            display: "none"
                        }
                    }}>
                        <TextField
                            sx={{
                                minWidth: "90%"
                            }}
                            size="small"
                            type="number"
                            value={localDiscount}
                            onChange={(e) => handleDiscountChange(e.target.value)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    {discountType === 'percentage' ? '%' : '$'}
                                </InputAdornment>,
                                inputProps: {
                                    min: 0,
                                    max: discountType === 'percentage' ? 100 : calculateTotalPrice(),
                                    step: "0.01"
                                }
                            }}
                            error={discountType === 'percentage' && parseFloat(localDiscount) > 100}
                            helperText={
                                discountType === 'percentage' && parseFloat(localDiscount) > 100
                                    ? 'Percentage cannot exceed 100%'
                                    : ''
                            }
                        />
                    </Box>
                </Grid>
                <Grid item xs={2.5}>
                    <Typography sx={{ fontSize: '14px', color: '#F44336' }}>
                        -${formatPrice(calculateDiscount(localDiscount).toFixed(2))}
                    </Typography>
                </Grid>

                {/* ggggg---- */}

                <Grid
                    sx={{
                        display: "none",
                        "@media (min-width: 991px) and (max-width: 1100px)": {
                            display: "block"
                        },
                        "@media (max-width: 730px)": {
                            display: "block"
                        }
                    }}
                    item xs={6}>
                    <Select

                        size="small"
                        value={discountType}
                        onChange={handleDiscountTypeChange}
                        sx={{ minWidth: "90%" }}
                    >
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="fixed">Fixed ($)</MenuItem>
                    </Select>
                </Grid>
                <Grid
                    sx={{
                        display: "none",
                        "@media (min-width: 991px) and (max-width: 1100px)": {
                            display: "block"
                        },
                        "@media (max-width: 730px)": {
                            display: "block"
                        }
                    }}
                    item xs={6}>
                    <TextField
                        sx={{
                            minWidth: "90%"
                        }}
                        size="small"
                        type="number"
                        value={localDiscount}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                {discountType === 'percentage' ? '%' : '$'}
                            </InputAdornment>,
                            inputProps: {
                                min: 0,
                                max: discountType === 'percentage' ? 100 : calculateTotalPrice(),
                                step: "0.01"
                            }
                        }}
                        error={discountType === 'percentage' && parseFloat(localDiscount) > 100}
                        helperText={
                            discountType === 'percentage' && parseFloat(localDiscount) > 100
                                ? 'Percentage cannot exceed 100%'
                                : ''
                        }
                    />
                </Grid>

                {/* ggggg---- */}
            </Grid>



            {/* Total */}
            <Grid container sx={{ py: 1, borderTop: '1px solid #E0E0E0' }}>
                <Grid item xs={9.5}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Total</Typography>
                </Grid>
                <Grid item xs={2.5}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                        ${formatPrice(parseFloat(generalInformationFields?.finalPrice || 0).toFixed(2))}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderGeneralPriceCalculation; 