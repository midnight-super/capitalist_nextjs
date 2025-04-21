import formatPrice from '@/hooks/priceCommas'
import { Box, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'

const PriceCalculation = ({
  file,
  addOns,
  service,
  orderParts,
  activeTab,
  setOrderParts,
  isMediaFile,
  setPreviewFile,
  setInitialState,
  getTotalSegmentsDuration,
}) => {
  const [discountType, setDiscountType] = useState(() => {
    const currentFile = orderParts
      ?.find((part) => part.id === activeTab)
      ?.orderPartFiles?.find(
        (f) => f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId
      )

    // Check if the discount includes a % symbol
    return currentFile?.manualDiscount?.includes('%') ? 'percentage' : 'fixed'
  })

  const totalSegmentsDuration = getTotalSegmentsDuration()

  const [isInitialCalculation, setIsInitialCalculation] = useState(true)
  const previousValues = useRef({
    baseRate: null,
    unitQuantities: null,
    addOns: null,
    discount: null,
  })

  const parseTimeFromMask = (maskedValue) => {
    if (!maskedValue) return 0

    const [hrs, mins, secs] = maskedValue.split(':').map(Number)
    return hrs * 3600 + mins * 60 + secs
  }

  const getCurrentFileData = useCallback(() => {
    const currentOrderPart = orderParts?.find((part) => part.id === activeTab)
    return currentOrderPart?.orderPartFiles?.find(
      (f) => f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId
    )
  }, [orderParts, activeTab, file?.fileId, file?.file?.fileId])

  const calculateFileQuantity = useCallback(() => {
    const currentFile = getCurrentFileData()
    const currentOrderPart = orderParts?.find((part) => part.id === activeTab)

    // For non-minute/second based services
    if (service?.unit !== 'perMinute' && service?.unit !== 'perSecond' && service?.isFiles === true) {
      const quantity =
        currentFile?.unitQuantities?.length > 0
          ? currentFile?.unitQuantities[0]?.quantity
          : currentOrderPart?.unitQuantities?.[0]?.quantity || '0'
      return quantity === '' ? '0' : quantity
    }

    // For media files with segments
    if (isMediaFile) {
      const segments = currentFile?.fileSegments || []
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

    // Default case: use file duration
    if (currentFile?.unitQuantities?.length > 0) {
      const quantity = currentFile?.unitQuantities[0]?.quantity
      return quantity === '' ? '0' : quantity
    }

    return (parseFloat(file?.file?.duration || 0) / 60).toFixed(2)
  }, [
    getCurrentFileData,
    service?.unit,
    service?.isFiles,
    isMediaFile,
    file?.file?.duration,
    orderParts,
    activeTab,
    getCurrentFileData()?.fileSegments,
  ])

  const calculateBasePrice = useCallback(() => {
    const quantity = parseFloat(calculateFileQuantity() || 0)
    return service?.baseRate ? service.baseRate * quantity : 0
  }, [service?.baseRate, calculateFileQuantity])

  const calculateAddOnPrices = useCallback(() => {
    const currentFile = getCurrentFileData()
    const quantity = parseFloat(calculateFileQuantity() || 0)

    return (currentFile?.fileSelectedOptions || []).reduce((total, option) => {
      if (option.linkType === 'ADDON') {
        const addonPrice = parseFloat(option.baseRate || 0) * quantity
        return total + addonPrice
      }
      return total
    }, 0)
  }, [getCurrentFileData, calculateFileQuantity])

  const calculateTotalPrice = useCallback(() => {
    const basePrice = calculateBasePrice()
    const addOnPrice = calculateAddOnPrices()
    return basePrice + addOnPrice
  }, [calculateBasePrice, calculateAddOnPrices])

  const calculateDiscount = useCallback(
    (value) => {
      const totalPrice = calculateTotalPrice()
      if (discountType === 'percentage') {
        return (totalPrice * parseFloat(value || 0)) / 100
      }
      return parseFloat(value || 0)
    },
    [discountType, calculateTotalPrice]
  )

  const handleDiscountTypeChange = (e) => {
    const newType = e.target.value
    setDiscountType(newType)

    const currentFile = getCurrentFileData()
    // Convert the current discount value to the new type
    const currentValue = currentFile?.manualDiscount?.replace('%', '') || '0'
    const totalPrice = parseFloat(currentFile?.totalPriceForFile || 0)

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
              orderPartFiles: part.orderPartFiles.map((f) => {
                if (f.orderPartFile.fileId === file.fileId || f.orderPartFile.fileId === file.file.fileId) {
                  return {
                    ...f,
                    manualDiscount: newValue,
                    finalFilePrice: (totalPrice - parseFloat(newValue.replace('%', ''))).toString(),
                  }
                }
                return f
              }),
            }
          : part
      )
    )
  }

  const handleDiscountChange = (event) => {
    let value = event.target.value

    // Remove leading zeros but keep single zero
    if (value.length > 1) {
      value = value.replace(/^0+/, '')
    }

    // Handle empty input
    if (value === '') {
      setOrderParts((prev) =>
        prev.map((part) =>
          part.id === activeTab
            ? {
                ...part,
                orderPartFiles: part.orderPartFiles.map((f) => {
                  if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                    return {
                      ...f,
                      manualDiscount: discountType === 'percentage' ? '0%' : '0',
                      finalFilePrice: f.totalPriceForFile,
                    }
                  }
                  return f
                }),
              }
            : part
        )
      )
      return
    }

    // Validate input
    if (discountType === 'percentage' && parseFloat(value) > 100) {
      value = '100'
    } else if (discountType === 'fixed') {
      const currentFile = getCurrentFileData()
      const totalPrice = parseFloat(currentFile?.totalPriceForFile || 0)
      if (parseFloat(value) > totalPrice) {
        value = totalPrice.toString()
      }
    }

    const currentFile = getCurrentFileData()
    const totalPrice = parseFloat(currentFile?.totalPriceForFile || 0)
    const discountAmount = calculateDiscount(value)
    const finalPrice = totalPrice - discountAmount

    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part.orderPartFiles.map((f) => {
                if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                  return {
                    ...f,
                    manualDiscount: discountType === 'percentage' ? `${value}%` : value,
                    finalFilePrice: finalPrice.toString(),
                  }
                }
                return f
              }),
            }
          : part
      )
    )
  }

  const updatePrices = (discountValue, discountType) => {
    const totalPrice = calculateTotalPrice()
    const discountAmount = calculateDiscount(discountValue)
    const finalPrice = totalPrice - discountAmount

    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part.orderPartFiles.map((f) => {
                if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                  return {
                    ...f,
                    totalPriceForFile: totalPrice.toString(),
                    manualDiscount: discountType === 'percentage' ? `${discountValue}%` : discountValue,
                    finalFilePrice: finalPrice.toString(),
                  }
                }
                return f
              }),
            }
          : part
      )
    )
  }

  const handleDurationChange = (e) => {
    const value = e.target.value

    setPreviewFile((prev) => ({
      ...prev,
      file: {
        ...prev.file,
        duration: value,
      },
    }))
  }

  useEffect(() => {
    const currentFile = getCurrentFileData()
    if (!currentFile) return

    const currentValues = {
      baseRate: service?.baseRate,
      unitQuantities: JSON.stringify(currentFile?.unitQuantities),
      addOns: JSON.stringify(currentFile?.fileSelectedOptions),
      discount: currentFile?.manualDiscount,
    }

    // Compare with previous values
    if (JSON.stringify(currentValues) === JSON.stringify(previousValues.current)) {
      return
    }

    // Update previous values
    previousValues.current = currentValues

    const quantity = parseFloat(calculateFileQuantity() || 0)
    const basePrice = service?.baseRate ? service.baseRate * quantity : 0
    const addOnsPrice = calculateAddOnPrices()
    const totalPrice = basePrice + addOnsPrice
    const discountValue = currentFile?.manualDiscount?.replace('%', '') || '0'
    const discountAmount = calculateDiscount(discountValue || 0)
    const finalPrice = totalPrice - discountAmount

    setOrderParts((prev) =>
      prev?.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part?.orderPartFiles?.map((f) => {
                if (f?.orderPartFile?.fileId === file?.fileId || f?.orderPartFile?.fileId === file?.file?.fileId) {
                  return {
                    ...f,
                    totalPriceForFile: totalPrice.toString(),
                    finalFilePrice: finalPrice.toString(),
                  }
                }
                return f
              }),
            }
          : part
      )
    )

    setInitialState((prevState) => ({
      ...prevState,
      orderParts: prevState?.orderParts?.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part?.orderPartFiles?.map((f) => {
                if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                  return {
                    ...f,
                    totalPriceForFile: totalPrice.toString(),
                    finalFilePrice: finalPrice.toString(),
                  }
                }
                return f
              }),
            }
          : part
      ),
    }))
  }, [
    service?.baseRate,
    file?.file?.duration,
    activeTab,
    getCurrentFileData()?.unitQuantities,
    getCurrentFileData()?.fileSelectedOptions,
    getCurrentFileData()?.manualDiscount,
    orderParts?.find((part) => part.id === activeTab)?.unitQuantities, // Add this dependency
  ])

  // Add useEffect to update discountType when file changes
  useEffect(() => {
    const currentFile = getCurrentFileData()
    if (currentFile?.manualDiscount) {
      setDiscountType(currentFile.manualDiscount.includes('%') ? 'percentage' : 'fixed')
    }
  }, [getCurrentFileData])

  const renderAddOns = () => {
    const currentFile = getCurrentFileData()
    return (currentFile?.fileSelectedOptions || []).map((option) => {
      if (option.linkType !== 'ADDON') return null

      const quantity = parseFloat(calculateFileQuantity())
      const addonTotal = parseFloat(option.baseRate || 0) * quantity

      return (
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
              {quantity}{' '}
              {option?.unitName === 'perMinute' || option?.unitName === 'perSecond' ? ' m' : ` ${option?.unitName}`}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: '14px' }}>${option.baseRate || 0}</Typography>
          </Grid>

          <Grid item xs={2.5}>
            <Typography sx={{ fontSize: '14px' }}>${addonTotal.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      )
    })
  }

  const currentFile = getCurrentFileData()
  const basePrice = calculateBasePrice()
  const addOnsPrice = calculateAddOnPrices()
  const totalPrice = basePrice + addOnsPrice
  const quantity = calculateFileQuantity()
  const discountValue = currentFile?.manualDiscount?.replace('%', '') || '0'
  const discountAmount = calculateDiscount(discountValue)
  const finalPrice = totalPrice - discountAmount

  return (
    <Box sx={{ mt: 3 }}>
      {!service ? (
        <Grid container sx={{ py: 1 }}>
          {/* <Typography sx={{ fontSize: '14px', fontWeight: "bold" }}>There is no service selected</Typography> */}
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
          {/* Default file row */}
          <Grid container sx={{ py: 1 }} style={{ paddingLeft: '10px' }}>
            <Grid item xs={5.5}>
              <Typography sx={{ fontSize: '14px' }}>{service?.serviceName}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ fontSize: '14px' }}>
                {parseFloat(calculateFileQuantity() || 0).toFixed(2)}{' '}
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
              <Typography sx={{ fontSize: '14px' }}>${formatPrice(basePrice.toFixed(2))}</Typography>
            </Grid>
          </Grid>

          {/* Add-on rows */}
          {renderAddOns()}
        </>
      )}

      {/* Subtotal */}
      <Grid container sx={{ py: 1, borderTop: '1px solid #E0E0E0' }} style={{ paddingLeft: '10px' }}>
        <Grid item xs={9.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Subtotal</Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>${formatPrice(totalPrice.toFixed(2))}</Typography>
        </Grid>
      </Grid>

      {/* Discount */}
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
              value={currentFile?.manualDiscount?.replace('%', '') || ''}
              onChange={(e) => handleDiscountChange(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{discountType === 'percentage' ? '%' : '$'}</InputAdornment>
                ),
                inputProps: {
                  min: 0,
                  max: discountType === 'percentage' ? 100 : parseFloat(currentFile?.totalPriceForFile || 0),
                  step: '0.01',
                },
              }}
              error={
                discountType === 'percentage' && parseFloat(currentFile?.manualDiscount?.replace('%', '') || 0) > 100
              }
              helperText={
                discountType === 'percentage' && parseFloat(currentFile?.manualDiscount?.replace('%', '') || 0) > 100
                  ? 'Percentage cannot exceed 100%'
                  : ''
              }
            />
          </Box>
        </Grid>
        <Grid item xs={2.5}>
          <Typography sx={{ fontSize: '14px', color: '#F44336' }}>
            -${formatPrice(discountAmount.toFixed(2))}
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
            value={currentFile?.manualDiscount?.replace('%', '') || ''}
            onChange={(e) => handleDiscountChange(e)}
            InputProps={{
              endAdornment: <InputAdornment position="end">{discountType === 'percentage' ? '%' : '$'}</InputAdornment>,
              inputProps: {
                min: 0,
                max: discountType === 'percentage' ? 100 : parseFloat(currentFile?.totalPriceForFile || 0),
                step: '0.01',
              },
            }}
            error={
              discountType === 'percentage' && parseFloat(currentFile?.manualDiscount?.replace('%', '') || 0) > 100
            }
            helperText={
              discountType === 'percentage' && parseFloat(currentFile?.manualDiscount?.replace('%', '') || 0) > 100
                ? 'Percentage cannot exceed 100%'
                : ''
            }
          />
        </Grid>
        {/* gggggg-- */}
      </Grid>

      {/* Total */}
      <Grid container sx={{ py: 1, borderTop: '1px solid #E0E0E0' }} style={{ paddingLeft: '10px' }}>
        <Grid item xs={9.5}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Total</Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>${formatPrice(finalPrice.toFixed(2))}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PriceCalculation
