import formatPrice from '@/hooks/priceCommas'
import { Box, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'

const OrderPartPriceCalculation = ({ orderParts, activeTab, setOrderParts, service, addOns, setInitialState }) => {
  const [discountType, setDiscountType] = useState(() => {
    const savedDiscount = orderParts.find((part) => part.id === activeTab)?.manualDiscount
    return savedDiscount?.toString().endsWith('%') ? 'percentage' : 'fixed'
  })

  const previousValues = useRef({
    baseRate: null,
    files: null,
    addOns: null,
    discount: null,
  })
  const currentOrderPart = orderParts?.find((part) => part.id === activeTab)

  const parseTimeFromMask = (maskedValue) => {
    if (!maskedValue) return 0

    const [hrs, mins, secs] = maskedValue.split(':').map(Number)
    return hrs * 3600 + mins * 60 + secs
  }
  const calculateFileQuantity = useCallback(
    (file) => {
      const isMediaFile =
        file?.orderPartFile?.mediaType?.startsWith('AUDIO') || file?.orderPartFile?.mediaType?.startsWith('VIDEO')

      if (
        ((service?.unit === 'perSecond' || service?.unit === 'perMinute') && !service?.isFiles) ||
        ((service?.unit !== 'perSecond' || service?.unit !== 'perMinute') && !service?.isFiles)
      ) {
        return Number(
          currentOrderPart?.unitQuantities && currentOrderPart?.unitQuantities[0]?.quantity
            ? currentOrderPart?.unitQuantities[0]?.quantity
            : 0
        ).toFixed(2)
      }

      // For media files with segments
      if (isMediaFile) {
        const segments = file?.fileSegments || []
        const validSegments = segments.filter((segment) => {
          if (segment.durationStart === '00:00:00' && segment.durationEnd === '00:00:00') {
            return false
          }
          const start = parseTimeFromMask(segment.durationStart)
          const end = parseTimeFromMask(segment.durationEnd)
          return end > start
        })

        const totalSegmentsDuration = validSegments.reduce((total, segment) => {
          const startSeconds = parseTimeFromMask(segment.durationStart)
          const endSeconds = parseTimeFromMask(segment.durationEnd)
          return total + (endSeconds - startSeconds)
        }, 0)

        if (totalSegmentsDuration > 0) {
          return (totalSegmentsDuration / 60).toFixed(2)
        }
      }

      if (file?.unitQuantities && file?.unitQuantities[0]?.quantity) {
        return Number(file?.unitQuantities[0]?.quantity).toFixed(2)
      } else {
        return (parseFloat(file?.orderPartFile?.duration || 0) / 60).toFixed(2)
      }
    },
    [
      service?.unit,
      service?.isFiles,
      currentOrderPart?.unitQuantities,
      currentOrderPart?.orderPartFiles,
      // Add dependencies for segments and duration
      JSON.stringify(currentOrderPart?.orderPartFiles?.map((file) => file.fileSegments)),
      JSON.stringify(currentOrderPart?.orderPartFiles?.map((file) => file.orderPartFile?.duration)),
    ]
  )

  const calculateFileTotalPrice = (file) => {
    const quantity = calculateFileQuantity(file)
    const basePrice = service?.baseRate ? service.baseRate * quantity : 0

    // Calculate add-ons price for the file
    const addOnsPrice = (file?.fileSelectedOptions || []).reduce((total, option) => {
      if (option.linkType === 'ADDON') {
        return total + parseFloat(option.baseRate || 0) * quantity
      }
      return total
    }, 0)

    const totalBeforeDiscount = basePrice + addOnsPrice
    const discountValue = file?.manualDiscount?.replace('%', '') || '0'
    const discountAmount = file?.manualDiscount?.includes('%')
      ? (totalBeforeDiscount * parseFloat(discountValue)) / 100
      : parseFloat(discountValue)

    return {
      total: totalBeforeDiscount,
      final: totalBeforeDiscount - discountAmount,
    }
  }

  const calculateTotalPrice = () => {
    // Calculate total from files
    const filesTotal =
      currentOrderPart?.orderPartFiles?.reduce((total, file) => {
        return total + parseFloat(file.totalPriceForFile || 0)
      }, 0) || 0

    // Calculate total from order part add-ons
    const partAddOnsTotal =
      currentOrderPart?.orderPartSelectedOptions?.reduce((total, option) => {
        if (option.linkType === 'ADDON') {
          return total + parseFloat(option.baseRate || 0) * calculateTotalQuantity()
        }
        return total
      }, 0) || 0

    return filesTotal + partAddOnsTotal
  }

  const calculateTotalQuantity = () => {
    const total =
      currentOrderPart?.orderPartFiles?.reduce((total, file) => {
        return total + parseFloat(calculateFileQuantity(file))
      }, 0) || 0

    return total // This will ensure we return a number
  }

  const handleDiscountChange = (value) => {
    let numericValue = value.replace(/[^\d.]/g, '')

    // Validate percentage cannot exceed 100
    if (discountType === 'percentage' && parseFloat(numericValue) > 100) {
      numericValue = '100'
    }

    // Validate fixed amount cannot exceed total price
    if (discountType === 'fixed') {
      const totalPrice = calculateTotalPrice()
      if (parseFloat(numericValue) > totalPrice) {
        numericValue = totalPrice.toString()
      }
    }

    const newTotalPrice = calculateTotalPrice()
    const discountAmount =
      discountType === 'percentage'
        ? (newTotalPrice * parseFloat(numericValue || 0)) / 100
        : parseFloat(numericValue || 0)
    const newFinalPrice = newTotalPrice - discountAmount

    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              manualDiscount: discountType === 'percentage' ? `${numericValue}%` : numericValue,
              totalPrice: newTotalPrice.toString(),
              finalPrice: newFinalPrice.toString(),
            }
          : part
      )
    )
  }

  const calculateDiscount = (discountValue) => {
    const totalPrice = calculateTotalPrice()
    if (discountType === 'percentage') {
      return (totalPrice * parseFloat(discountValue || 0)) / 100
    }
    return parseFloat(discountValue || 0)
  }

  const calculateFinalPrice = (discountValue) => {
    const totalPrice = calculateTotalPrice()
    const discountAmount = calculateDiscount(discountValue)
    return totalPrice - discountAmount
  }

  useEffect(() => {
    if (!currentOrderPart) return

    // Check if we need to update
    const currentValues = {
      baseRate: service?.baseRate,
      files: JSON.stringify(currentOrderPart.orderPartFiles),
      addOns: JSON.stringify(currentOrderPart.orderPartSelectedOptions),
      discount: currentOrderPart.manualDiscount,
      unitQuantities: JSON.stringify(currentOrderPart.unitQuantities),
    }

    // Compare with previous values
    if (JSON.stringify(currentValues) === JSON.stringify(previousValues.current)) {
      return
    }
    // Update previous values
    previousValues.current = currentValues

    const calculateTotalPrices = () => {
      // Calculate file prices with discounts
      const updatedFiles =
        currentOrderPart.orderPartFiles?.map((file) => {
          const prices = calculateFileTotalPrice(file)
          return {
            ...file,
            totalPriceForFile: prices.total.toString(),
            finalFilePrice: prices.final.toString(),
          }
        }) || []

      // Calculate files total including file-level discounts
      const filesTotal = updatedFiles.reduce((sum, file) => sum + parseFloat(file.finalFilePrice || 0), 0)

      // Calculate add-ons total
      const totalQuantity = calculateTotalQuantity()
      const addOnsTotal =
        currentOrderPart.orderPartSelectedOptions?.reduce((total, option) => {
          if (option.linkType === 'ADDON') {
            return total + parseFloat(option.baseRate || 0) * totalQuantity
          }
          return total
        }, 0) || 0

      // Calculate final totals
      const totalPrice = filesTotal + addOnsTotal
      let finalPrice = totalPrice

      // Apply part-level discount if exists
      if (currentOrderPart.manualDiscount) {
        const discountValue = currentOrderPart.manualDiscount.replace('%', '')
        const discountAmount = currentOrderPart.manualDiscount.includes('%')
          ? (totalPrice * parseFloat(discountValue)) / 100
          : parseFloat(discountValue)

        finalPrice = totalPrice - discountAmount
      }

      return {
        updatedFiles,
        totalPrice: totalPrice.toString(),
        finalPrice: finalPrice.toString(),
      }
    }

    const { updatedFiles, totalPrice, finalPrice } = calculateTotalPrices()

    const updatedOrderParts = orderParts.map((part) =>
      part.id === activeTab
        ? {
            ...part,
            orderPartFiles: updatedFiles,
            totalPrice,
            finalPrice,
          }
        : part
    )

    setOrderParts(updatedOrderParts)

    // Update initial state
    setInitialState((prevState) => ({
      ...prevState,
      orderParts: prevState?.orderParts?.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: updatedFiles,
              totalPrice,
              finalPrice,
            }
          : part
      ),
    }))
  }, [
    activeTab,
    service?.baseRate,
    currentOrderPart?.orderPartFiles,
    currentOrderPart?.orderPartSelectedOptions,
    currentOrderPart?.manualDiscount,
    currentOrderPart?.unitQuantities,
    discountType,
  ])

  const handleDiscountTypeChange = (e) => {
    const newType = e.target.value
    setDiscountType(newType)

    // Convert the current discount value to the new type
    const currentValue = currentOrderPart?.manualDiscount?.replace('%', '') || '0'
    const totalPrice = calculateTotalPrice()

    let newValue
    if (newType === 'percentage') {
      // Convert fixed amount to percentage
      newValue = ((parseFloat(currentValue) / totalPrice) * 100).toFixed(2)
      if (parseFloat(newValue) > 100) newValue = '100'
      newValue = `${newValue}%`
    } else {
      // Convert percentage to fixed amount
      newValue = ((parseFloat(currentValue) / 100) * totalPrice).toFixed(2)
      if (parseFloat(newValue) > totalPrice) newValue = totalPrice.toString()
    }

    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              manualDiscount: newValue,
              finalPrice: (totalPrice - parseFloat(newValue.replace('%', ''))).toString(),
            }
          : part
      )
    )
  }

  return (
    <Box sx={{ mt: 3 }}>
      {currentOrderPart?.orderPartFiles?.length === 0 ? (
        <Grid container sx={{ py: 1 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>There is no file in this job</Typography>
        </Grid>
      ) : (
        <>
          <Grid container sx={{ py: 1 }} style={{ background: '#dddddd', paddingLeft: '10px' }}>
            <Grid item xs={5.5}>
              <Typography sx={{ fontSize: '14px' }}>Item</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ fontSize: '14px' }}>Quantity</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ fontSize: '14px' }}>Price</Typography>
            </Grid>
            <Grid item xs={2.5}>
              <Typography sx={{ fontSize: '14px' }}>Amount</Typography>
            </Grid>
          </Grid>
          {currentOrderPart?.orderPartFiles?.map((file) => (
            <Grid container key={file.orderPartFile.fileId} sx={{ py: 1 }} style={{ paddingLeft: '10px' }}>
              {/* <Grid item xs={2}>
                                <Typography sx={{ fontSize: '14px' }}>File</Typography>
                            </Grid> */}
              <Grid item xs={5.5}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    overflow: 'hidden',
                    width: '90%',
                    wordBreak: 'break-all',
                  }}
                >
                  {file.orderPartFile.fileName}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography sx={{ fontSize: '14px' }}>
                  {calculateFileQuantity(file)}
                  {!service
                    ? ''
                    : service?.unit === 'perMinute' || service?.unit === 'perSecond'
                      ? ' m'
                      : ` ${service?.unit}`}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontSize: '14px' }}>${service?.baseRate || 0}</Typography>
              </Grid>
              <Grid item xs={2.5}>
                <Typography sx={{ fontSize: '14px' }}>
                  ${formatPrice(parseFloat(file?.finalFilePrice || 0).toFixed(2))}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </>
      )}

      {/* Add-ons Table */}
      {currentOrderPart?.orderPartSelectedOptions?.length > 0 && (
        <>
          {currentOrderPart?.orderPartSelectedOptions?.map((option) => (
            <Grid container key={option.linkId} sx={{ py: 1 }} style={{ paddingLeft: '10px' }}>
              <Grid item xs={5.5}>
                <Typography sx={{ fontSize: '14px' }}>
                  {addOns?.find((addOn) => addOn?.addonId === option?.linkId)?.addonName}, {option.linkName}
                </Typography>
              </Grid>
              {/* <Grid item xs={3}>
                                <Typography sx={{ fontSize: '14px' }}>{option.linkName}</Typography>
                            </Grid> */}

              <Grid item xs={2}>
                <Typography sx={{ fontSize: '14px' }}>
                  {calculateTotalQuantity().toFixed(2)}
                  {option?.unitName === 'perMinute' || option?.unitName === 'perSecond' ? ' m' : ` ${option?.unitName}`}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontSize: '14px' }}>${option.baseRate || 0}</Typography>
              </Grid>
              <Grid item xs={2.5}>
                <Typography sx={{ fontSize: '14px' }}>
                  ${formatPrice((option.baseRate * calculateTotalQuantity()).toFixed(2))}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </>
      )}

      {/* Subtotal */}
      <Grid container sx={{ py: 1, borderTop: '1px solid #E0E0E0' }} style={{ paddingLeft: '10px' }}>
        <Grid item xs={9.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Subtotal</Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            ${formatPrice(parseFloat(currentOrderPart?.totalPrice || 0).toFixed(2))}
          </Typography>
        </Grid>
      </Grid>

      {/* Discount Section */}
      <Grid container sx={{ py: 1 }} alignItems="center" style={{ paddingLeft: '10px' }}>
        <Grid item xs={1.7}>
          <Typography sx={{ fontSize: '14px' }}>Discount</Typography>
        </Grid>
        <Grid item xs={3.8}>
          <Box
            sx={{
              '@media (min-width: 991px) and (max-width: 1100px)': {
                display: 'none',
              },
              '@media (max-width: 730px)': {
                display: 'none',
              },
            }}
          >
            <Select size="small" value={discountType} onChange={handleDiscountTypeChange} sx={{ minWidth: '90%' }}>
              <MenuItem value="percentage">Percentage (%)</MenuItem>
              <MenuItem value="fixed">Fixed ($)</MenuItem>
            </Select>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              '@media (min-width: 991px) and (max-width: 1100px)': {
                display: 'none',
              },
              '@media (max-width: 730px)': {
                display: 'none',
              },
            }}
          >
            <TextField
              sx={{
                minWidth: '90%',
              }}
              size="small"
              type="number"
              value={currentOrderPart?.manualDiscount?.replace('%', '') || ''}
              onChange={(e) => handleDiscountChange(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{discountType === 'percentage' ? '%' : '$'}</InputAdornment>
                ),
                inputProps: {
                  min: 0,
                  max: discountType === 'percentage' ? 100 : calculateTotalPrice(),
                  step: '0.01',
                },
              }}
              error={
                discountType === 'percentage' &&
                parseFloat(currentOrderPart?.manualDiscount?.replace('%', '') || 0) > 100
              }
              helperText={
                discountType === 'percentage' &&
                parseFloat(currentOrderPart?.manualDiscount?.replace('%', '') || 0) > 100
                  ? 'Percentage cannot exceed 100%'
                  : ''
              }
            />
          </Box>
        </Grid>
        <Grid item xs={2.5}>
          <Typography sx={{ fontSize: '14px', color: '#F44336' }}>
            -$
            {formatPrice(
              (discountType === 'percentage'
                ? (calculateTotalPrice() * parseFloat(currentOrderPart?.manualDiscount?.replace('%', '') || 0)) / 100
                : parseFloat(currentOrderPart?.manualDiscount || 0)
              ).toFixed(2)
            )}
          </Typography>
        </Grid>
        {/* gggggg-- */}
        <Grid
          sx={{
            display: 'none',
            '@media (min-width: 991px) and (max-width: 1100px)': {
              display: 'block',
            },
            '@media (max-width: 730px)': {
              display: 'block',
            },
          }}
          item
          xs={6}
        >
          <Select size="small" value={discountType} onChange={handleDiscountTypeChange} sx={{ minWidth: '90%' }}>
            <MenuItem value="percentage">Percentage (%)</MenuItem>
            <MenuItem value="fixed">Fixed ($)</MenuItem>
          </Select>
        </Grid>

        <Grid
          sx={{
            display: 'none',
            '@media (min-width: 991px) and (max-width: 1100px)': {
              display: 'block',
            },
            '@media (max-width: 730px)': {
              display: 'block',
            },
          }}
          item
          xs={6}
        >
          <TextField
            sx={{
              minWidth: '90%',
            }}
            size="small"
            type="number"
            value={currentOrderPart?.manualDiscount?.replace('%', '') || ''}
            onChange={(e) => handleDiscountChange(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">{discountType === 'percentage' ? '%' : '$'}</InputAdornment>,
              inputProps: {
                min: 0,
                max: discountType === 'percentage' ? 100 : calculateTotalPrice(),
                step: '0.01',
              },
            }}
            error={
              discountType === 'percentage' && parseFloat(currentOrderPart?.manualDiscount?.replace('%', '') || 0) > 100
            }
            helperText={
              discountType === 'percentage' && parseFloat(currentOrderPart?.manualDiscount?.replace('%', '') || 0) > 100
                ? 'Percentage cannot exceed 100%'
                : ''
            }
          />
        </Grid>
        {/* gggggg-- */}
      </Grid>

      <Grid container sx={{ py: 1, borderTop: '1px solid #E0E0E0' }} style={{ paddingLeft: '10px' }}>
        <Grid item xs={9.5}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Total</Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            ${formatPrice(parseFloat(currentOrderPart?.finalPrice || 0).toFixed(2))}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OrderPartPriceCalculation
