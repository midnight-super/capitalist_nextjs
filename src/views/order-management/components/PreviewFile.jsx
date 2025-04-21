import CustomSelectField from '@/components/customSelectField'
import CustomTextField from '@/components/customTextField'
import FallbackSpinner from '@/components/spinner'
import { getAddOnsByServiceId } from '@/services/addon.service'
import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'
import { IMaskInput } from 'react-imask'
import WaveSurfer from 'wavesurfer.js'
import PriceCalculation from './PriceCalculation'

import '@coreui/coreui/dist/css/coreui.min.css'

const PreviewFile = ({
  file,
  onClose,
  serviceId,
  service,
  orderParts,
  activeTab,
  setOrderParts,
  setPreviewFile,
  isPreviewing,
  setInitialState,
  generalInformationFields,
}) => {
  const formatTimeToMask = (seconds) => {
    if (!seconds) return '00:00:00'

    const totalSeconds = Math.round(parseFloat(seconds))
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = Math.floor(totalSeconds % 60)

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  const [addOns, setAddOns] = useState([])
  const isMediaFile = file?.file?.mediaType?.startsWith('AUDIO') || file?.file?.mediaType?.startsWith('VIDEO')
  const [durationCheck, setDurationCheck] = useState('' || formatTimeToMask(file?.file?.duration || '0'))

  // Get current file data helper
  const getCurrentFileData = useCallback(() => {
    const currentOrderPart = orderParts?.find((part) => part.id === activeTab)
    return currentOrderPart?.orderPartFiles?.find(
      (f) => f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId
    )
  }, [orderParts, activeTab, file])

  // Fetch add-ons
  useEffect(() => {
    const fetchAddOns = async () => {
      if (serviceId) {
        const response = await getAddOnsByServiceId(serviceId)
        if (Array.isArray(response)) {
          const fileAddOns = response.filter((addon) => addon.type === 'FILES' && addon.status === 'ACTIVE')
          setAddOns(fileAddOns)
        }
      }
    }
    fetchAddOns()
  }, [serviceId])

  // Initialize empty segment if none exists
  useEffect(() => {
    const currentFile = getCurrentFileData()
    if (!currentFile?.fileSegments || currentFile.fileSegments.length === 0) {
      setOrderParts((prev) => {
        const updatedParts = prev?.map((part) =>
          part.id === activeTab
            ? {
                ...part,
                orderPartFiles: part.orderPartFiles.map((f) =>
                  f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId
                    ? {
                        ...f,
                        fileSegments: [
                          {
                            durationStart: '00:00:00',
                            durationEnd: '00:00:00',
                          },
                        ],
                      }
                    : f
                ),
              }
            : part
        )

        // Update initial state to prevent unnecessary modals
        setInitialState((prevState) => ({
          ...prevState,
          orderParts: prevState?.orderParts?.map((part) =>
            part.id === activeTab
              ? {
                  ...part,
                  orderPartFiles: part?.orderPartFiles.map((f) =>
                    f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId
                      ? {
                          ...f,
                          fileSegments: [
                            {
                              durationStart: '00:00:00',
                              durationEnd: '00:00:00',
                            },
                          ],
                        }
                      : f
                  ),
                }
              : part
          ),
        }))

        return updatedParts
      })
    }
  }, [activeTab, file])

  // Add helper to get original duration from orderParts
  const getOriginalDuration = useCallback(() => {
    const currentFile = getCurrentFileData()
    return parseFloat(currentFile?.orderPartFile?.duration || '0')
  }, [getCurrentFileData])

  const calculateDurationFromSegments = useCallback(() => {
    const currentFile = getCurrentFileData()
    const segments = currentFile?.fileSegments || []
    const defaultDuration = parseFloat(file?.file?.duration || '0')

    // Return manually entered duration for non-media files
    if (!isMediaFile) {
      return file?.file?.duration || '0'
    }

    // Return default duration if only one empty segment exists
    if (segments.length === 1 && segments[0].durationStart === '00:00:00' && segments[0].durationEnd === '00:00:00') {
      return defaultDuration.toString()
    }

    // Get valid segments (both times filled and end > start)
    const validSegments = segments.filter((segment) => {
      if (segment.durationStart === '00:00:00' && segment.durationEnd === '00:00:00') {
        return false
      }
      const start = parseTimeFromMask(segment.durationStart)
      const end = parseTimeFromMask(segment.durationEnd)
      return end > start
    })

    // Return default duration if no valid segments
    if (validSegments.length === 0) {
      return defaultDuration.toString()
    }

    const totalDuration = validSegments.reduce((total, segment) => {
      const startSeconds = parseTimeFromMask(segment.durationStart)
      const endSeconds = parseTimeFromMask(segment.durationEnd)
      return total + (endSeconds - startSeconds)
    }, 0)

    return totalDuration.toString()
  }, [getCurrentFileData, isMediaFile, file?.file?.duration])

  const validateSegment = (segments, currentIndex) => {
    const currentSegment = segments[currentIndex]
    const start = parseTimeFromMask(currentSegment.durationStart)
    const end = parseTimeFromMask(currentSegment.durationEnd)
    const currentDuration = parseFloat(file?.file?.duration || '0')

    // Skip validation if both times are 00:00:00
    if (currentSegment.durationStart === '00:00:00' && currentSegment.durationEnd === '00:00:00') {
      return true
    }

    // Validate end time is greater than start time
    if (start >= end) {
      toast.error('Start time must be less than end time')
      return false
    }

    // Validate segment doesn't exceed current duration
    // if (end > currentDuration) {
    //   toast.error(`End time cannot exceed current duration (${formatTimeToMask(currentDuration)})`);
    //   return false;
    // }

    // Calculate total duration of all valid segments
    const totalDuration = segments.reduce((total, segment, idx) => {
      if (segment.durationStart === '00:00:00' && segment.durationEnd === '00:00:00') {
        return total
      }

      const segStart = parseTimeFromMask(segment.durationStart)
      const segEnd = parseTimeFromMask(segment.durationEnd)

      if (segEnd > segStart) {
        if (idx === currentIndex) {
          return total + (end - start)
        }
        return total + (segEnd - segStart)
      }
      return total
    }, 0)

    // Validate total duration doesn't exceed current duration
    if (totalDuration > currentDuration) {
      toast.error(
        `Total segments duration (${formatTimeToMask(totalDuration)}) cannot exceed current duration (${formatTimeToMask(currentDuration)})`
      )
      return false
    }

    // Check for overlaps with other valid segments
    const hasOverlap = segments.some((segment, idx) => {
      if (idx === currentIndex) return false
      if (segment.durationStart === '00:00:00' && segment.durationEnd === '00:00:00') return false

      const segStart = parseTimeFromMask(segment.durationStart)
      const segEnd = parseTimeFromMask(segment.durationEnd)

      if (segEnd <= segStart) return false

      return (
        (start >= segStart && start < segEnd) ||
        (end > segStart && end <= segEnd) ||
        (start <= segStart && end >= segEnd)
      )
    })

    if (hasOverlap) {
      toast.error('Segments cannot overlap with each other')
      return false
    }

    return true
  }

  // Update duration when segments change
  React.useEffect(() => {
    if (activeTab !== 'general') {
      // Only update duration from segments if we're not in a media file
      if (!isMediaFile) {
        const duration = calculateDurationFromSegments()
        setPreviewFile((prev) => ({
          ...prev,
          file: {
            ...prev?.file,
            duration,
          },
        }))
      }
    }
  }, [orderParts, activeTab]) // Update dependencies to watch orderParts changes

  // Update handleSegmentChange to use current duration
  const handleSegmentChange = (index, field) => (e) => {
    if (!isMediaFile) return

    let value = e.target.value
    value = value.replace(/[^\d:]/g, '')

    const parts = value.split(':')
    if (parts.length === 3) {
      const hrs = Math.min(parseInt(parts[0]) || 0, 99)
      const mins = Math.min(parseInt(parts[1]) || 0, 59)
      const secs = Math.min(parseInt(parts[2]) || 0, 59)

      // Check if input would exceed current duration
      const totalSeconds = hrs * 3600 + mins * 60 + secs
      const currentDuration = parseFloat(file?.file?.duration || '0')

      if (totalSeconds > currentDuration) {
        value = formatTimeToMask(currentDuration)
      } else {
        value = formatTimeToMask(totalSeconds)
      }
    } else {
      const totalSeconds = Math.min(parseInt(value) || 0, parseFloat(file?.file?.duration || '0'))
      value = formatTimeToMask(totalSeconds)
    }

    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part.orderPartFiles.map((f) => {
                if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                  const segments = [...(f.fileSegments || [])]
                  if (field === 'start') {
                    segments[index] = { ...segments[index], durationStart: value }
                  } else {
                    segments[index] = { ...segments[index], durationEnd: value }
                  }
                  return { ...f, fileSegments: segments }
                }
                return f
              }),
            }
          : part
      )
    )
  }

  const handleSegmentBlur = (index) => (e) => {
    const targetSegmentIndex = e.relatedTarget?.getAttribute('data-segment-index')
    const targetField = e.relatedTarget?.getAttribute('data-field')
    const currentField = e.target.getAttribute('data-field')

    // Skip validation if moving between start/end fields of same segment
    if (targetSegmentIndex === index.toString() && targetField !== currentField) {
      return
    }

    const currentFile = getCurrentFileData()
    if (!currentFile) return

    const segments = currentFile.fileSegments || []
    const currentSegment = segments[index]

    // Only validate when both fields are filled
    const bothFieldsFilled = currentSegment.durationEnd !== '00:00:00'

    // If not both fields filled, just allow the change without validation
    if (!bothFieldsFilled) {
      return
    }

    // Now validate since both fields are filled
    if (!validateSegment(segments, index)) {
      resetSegment(index)
      return
    }
  }

  const resetSegment = (index) => {
    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part.orderPartFiles.map((f) => {
                if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                  const segments = [...(f.fileSegments || [])]
                  segments[index] = {
                    durationStart: '00:00:00',
                    durationEnd: '00:00:00',
                  }
                  return { ...f, fileSegments: segments }
                }
                return f
              }),
            }
          : part
      )
    )
  }

  const addEmptySegment = () => {
    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part.orderPartFiles.map((f) => {
                if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                  return {
                    ...f,
                    fileSegments: [...(f.fileSegments || []), { durationStart: '00:00:00', durationEnd: '00:00:00' }],
                  }
                }
                return f
              }),
            }
          : part
      )
    )
  }

  const handleDeleteSegment = (indexToDelete) => {
    setOrderParts((prev) =>
      prev.map((part) =>
        part.id === activeTab
          ? {
              ...part,
              orderPartFiles: part.orderPartFiles.map((f) => {
                if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                  const segments = (f.fileSegments || []).filter((_, index) => index !== indexToDelete)

                  // If all segments are deleted or only one empty segment remains
                  if (segments.length === 0) {
                    segments.push({ durationStart: '00:00:00', durationEnd: '00:00:00' })
                  }

                  // Update preview file duration to default if only empty segment remains
                  if (
                    segments.length === 1 &&
                    segments[0].durationStart === '00:00:00' &&
                    segments[0].durationEnd === '00:00:00'
                  ) {
                    setPreviewFile((prev) => ({
                      ...prev,
                      file: {
                        ...prev?.file,
                        duration: file?.file?.duration,
                      },
                    }))
                  }

                  return { ...f, fileSegments: segments }
                }
                return f
              }),
            }
          : part
      )
    )
  }

  const getFileType = () => {
    const fileType = file?.file?.mediaType
    if (fileType?.startsWith('AUDIO')) return 'audio'
    if (fileType?.startsWith('VIDEO')) return 'video'
    if (fileType?.startsWith('image/')) return 'image'
    if (fileType === 'application/pdf') return 'pdf'
    if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') return 'zip'
    return 'unknown'
  }

  const renderPreviewContent = () => {
    const fileType = getFileType()

    switch (fileType) {
      case 'audio':
        return <AudioPreview file={file} />
      case 'video':
        return <VideoPreview file={file} />
      case 'image':
        return <ImagePreview file={file} />
      case 'pdf':
        return <PDFPreview file={file} />
      case 'zip':
        return <ZipPreview file={file} />
      default:
        return <Typography>Unsupported file type</Typography>
    }
  }

  const parseTimeFromMask = (maskedValue) => {
    if (!maskedValue) return 0

    const [hrs, mins, secs] = maskedValue.split(':').map(Number)
    return hrs * 3600 + mins * 60 + secs
  }

  const calculateQuantity = () => {
    return (parseFloat(file?.file?.duration || 0) / 60).toFixed(2)
  }
  useEffect(() => {
    const handleDurationChange = (e) => {
      // if (!e) return;
      let value = e
      value = value.replace(/[^\d:]/g, '')

      // Split the value into parts
      const parts = value.split(':')

      // Calculate total seconds
      let totalSeconds = 0
      if (parts.length === 3) {
        const hrs = parseInt(parts[0]) || 0
        const mins = parseInt(parts[1]) || 0
        const secs = parseInt(parts[2]) || 0
        totalSeconds = hrs * 3600 + mins * 60 + secs
      } else if (parts.length === 2) {
        const mins = parseInt(parts[0]) || 0
        const secs = parseInt(parts[1]) || 0
        totalSeconds = mins * 60 + secs
      } else {
        totalSeconds = parseInt(value) || 0
      }

      // Update preview file state with seconds
      setPreviewFile((prev) => ({
        ...prev,
        file: {
          ...prev.file,
          duration: totalSeconds.toString(),
        },
      }))

      // Reset segments when duration changes
      setOrderParts((prev) =>
        prev.map((part) =>
          part.id === activeTab
            ? {
                ...part,
                orderPartFiles: part.orderPartFiles.map((f) => {
                  if (f.orderPartFile?.fileId === file?.fileId || f.orderPartFile?.fileId === file?.file?.fileId) {
                    return {
                      ...f,
                      fileSegments: [
                        {
                          durationStart: '00:00:00',
                          durationEnd: '00:00:00',
                        },
                      ],
                    }
                  }
                  return f
                }),
              }
            : part
        )
      )
    }

    handleDurationChange(durationCheck)
  }, [durationCheck])

  const getTotalSegmentsDuration = useCallback(() => {
    const currentFile = getCurrentFileData()
    const segments = currentFile?.fileSegments || []

    // Get valid segments (both times filled and end > start)
    const validSegments = segments.filter((segment) => {
      if (segment.durationStart === '00:00:00' && segment.durationEnd === '00:00:00') {
        return false
      }
      const start = parseTimeFromMask(segment.durationStart)
      const end = parseTimeFromMask(segment.durationEnd)
      return end > start
    })

    const totalDuration = validSegments.reduce((total, segment) => {
      const startSeconds = parseTimeFromMask(segment.durationStart)
      const endSeconds = parseTimeFromMask(segment.durationEnd)
      return total + (endSeconds - startSeconds)
    }, 0)

    return totalDuration
  }, [getCurrentFileData])

  const validateAndAddSegment = () => {
    const currentFile = getCurrentFileData()
    if (!currentFile) return

    const segments = currentFile.fileSegments || []
    const lastSegmentIndex = segments.length - 1

    // Skip if last segment is empty
    // if (segments[lastSegmentIndex].durationStart === '00:00:00' &&
    //   segments[lastSegmentIndex].durationEnd === '00:00:00') {
    //   toast.error('Please fill the current segment before adding a new one');
    //   return;
    // }

    // Validate last segment before adding new one
    if (!validateSegment(segments, lastSegmentIndex)) {
      resetSegment(lastSegmentIndex)
      return
    }

    // Add new empty segment
    addEmptySegment()
  }

  // const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  //   <CFormInput  {...props} ref={inputRef} />
  // ))

  const renderQuantityFields = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ mb: 1 }}>File Duration</Typography>
            <Typography sx={{ mb: 1 }}>
              {isMediaFile && (
                <>
                  Duration: {formatTimeToMask(getCurrentFileData()?.orderPartFile?.duration)}
                  <span style={{ marginLeft: '10px', color: '#666' }}>
                    (Segments: {formatTimeToMask(getTotalSegmentsDuration())})
                  </span>
                </>
              )}
            </Typography>
          </Box>
          <IMaskInput
            style={{
              width: '100%', // Full width
              padding: '8px', // Optional padding for better appearance
              fontSize: '16px', // Readable font size
              border: '1px solid #E0E0E0', // 1px solid black border
              borderRadius: '4px', // Optional: rounded corners
              outline: 'none', // Removes default focus outline
            }}
            value={durationCheck}
            onAccept={(value) => setDurationCheck(value)}
            placeholder="00:00:00"
            mask={'00:00:00'}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          {getCurrentFileData()?.fileSegments.map(
            (segment, index) =>
              isMediaFile && (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ mb: 2 }}
                  alignItems="center"
                  data-segment-index={index}
                  className="segment-controls"
                >
                  <Grid item xs={5}>
                    <IMaskInput
                      style={{
                        width: '100%', // Full width
                        padding: '8px', // Optional padding for better appearance
                        fontSize: '16px', // Readable font size
                        border: '1px solid #E0E0E0', // 1px solid black border
                        borderRadius: '4px', // Optional: rounded corners
                        outline: 'none', // Removes default focus outline
                      }}
                      mask="00:00:00"
                      value={segment.durationStart}
                      onAccept={(value) => {
                        setOrderParts((prev) =>
                          prev.map((part) =>
                            part.id === activeTab
                              ? {
                                  ...part,
                                  orderPartFiles: part.orderPartFiles.map((f) => {
                                    if (
                                      f.orderPartFile?.fileId === file?.fileId ||
                                      f.orderPartFile?.fileId === file?.file?.fileId
                                    ) {
                                      const segments = [...(f.fileSegments || [])]
                                      segments[index] = {
                                        ...segments[index],
                                        durationStart: value,
                                      }
                                      return { ...f, fileSegments: segments }
                                    }
                                    return f
                                  }),
                                }
                              : part
                          )
                        )
                      }}
                      onBlur={handleSegmentBlur(index)}
                      placeholder="00:00:00"
                      inputProps={{
                        'data-segment-index': index,
                        'data-field': 'start',
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <IMaskInput
                      style={{
                        width: '100%', // Full width
                        padding: '8px', // Optional padding for better appearance
                        fontSize: '16px', // Readable font size
                        border: '1px solid #E0E0E0', // 1px solid black border
                        borderRadius: '4px', // Optional: rounded corners
                        outline: 'none', // Removes default focus outline
                      }}
                      mask="00:00:00"
                      value={segment.durationEnd}
                      onAccept={(value) => {
                        setOrderParts((prev) =>
                          prev.map((part) =>
                            part.id === activeTab
                              ? {
                                  ...part,
                                  orderPartFiles: part.orderPartFiles.map((f) => {
                                    if (
                                      f.orderPartFile?.fileId === file?.fileId ||
                                      f.orderPartFile?.fileId === file?.file?.fileId
                                    ) {
                                      const segments = [...(f.fileSegments || [])]
                                      segments[index] = {
                                        ...segments[index],
                                        durationEnd: value,
                                      }
                                      return { ...f, fileSegments: segments }
                                    }
                                    return f
                                  }),
                                }
                              : part
                          )
                        )
                      }}
                      onBlur={handleSegmentBlur(index)}
                      placeholder="00:00:00"
                      inputProps={{
                        'data-segment-index': index,
                        'data-field': 'end',
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {getCurrentFileData()?.fileSegments.length > 1 && (
                      <Button
                        onClick={() => handleDeleteSegment(index)}
                        size="small"
                        className="segment-controls"
                        sx={{
                          width: 'fit-content',
                          color: '#F44336',
                          backgroundColor: 'transparent',
                          border: '1px solid #F44336',
                          cursor: 'pointer',
                          height: '100%',
                          padding: '8px 5px',
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
          )}

          {/* Add Segment Button */}
          {isMediaFile && (
            <Typography
              variant="outlined"
              size="small"
              onClick={validateAndAddSegment}
              sx={{ mt: 1, color: '#4489FE', textDecoration: 'underline', cursor: 'pointer' }}
              fullWidth
            >
              Add more duration
            </Typography>
          )}
        </Box>
      </>
    )
  }

  useEffect(() => {
    if (
      service &&
      (((service?.unit === 'perMinute' || service?.unit === 'perSecond') && service?.isFiles === true) ||
        (service?.unit !== 'perMinute' && service?.unit !== 'perSecond' && service?.isFiles === true))
    ) {
      setOrderParts((prev) => {
        return prev?.map((part) => {
          if (part?.id === activeTab) {
            return {
              ...part,
              orderPartFiles: part?.orderPartFiles?.map((f) => {
                if (f?.orderPartFile?.fileId === file?.fileId || f?.orderPartFile?.fileId === file?.file?.fileId) {
                  return {
                    ...f,
                    unitQuantities: [
                      {
                        unitId: service?.unitId,
                        unitName: service?.unit,
                        quantity:
                          service?.unit !== 'perMinute' && service?.unit !== 'perSecond' && service?.isFiles === true
                            ? f?.unitQuantities?.length > 0
                              ? f?.unitQuantities[0]?.quantity
                              : '0'
                            : calculateQuantity(),
                      },
                    ],
                  }
                }
                return f
              }),
            }
          }
          return part
        })
      })

      setInitialState((prev) => ({
        ...prev,
        orderParts: prev?.orderParts?.map((part) => {
          if (part?.id === activeTab) {
            return {
              ...part,
              orderPartFiles: part?.orderPartFiles?.map((f) => {
                if (f?.orderPartFile?.fileId === file?.fileId || f?.orderPartFile?.fileId === file?.file?.fileId) {
                  return {
                    ...f,
                    unitQuantities: [
                      {
                        unitId: service?.unitId,
                        unitName: service?.unit,
                        quantity:
                          service?.unit !== 'perMinute' && service?.unit !== 'perSecond' && service?.isFiles === true
                            ? f?.unitQuantities?.length > 0
                              ? f?.unitQuantities[0]?.quantity
                              : '0'
                            : calculateQuantity(),
                      },
                    ],
                  }
                }
                return f
              }),
            }
          }
          return part
        }),
      }))
    }
  }, [service, file?.file?.duration])

  return (
    <>
      <Box sx={{ mb: 2, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h4" sx={{ fontSize: '24px', mb: 0.5 }}>
          Preview & Settings
        </Typography>

        <IoClose
          onClick={onClose}
          style={{ position: 'absolute', right: '0', top: '-20px', cursor: 'pointer' }}
          size={20}
        />
      </Box>

      {isPreviewing ? (
        <FallbackSpinner />
      ) : (
        <>
          {renderPreviewContent()}
          {activeTab !== 'general' &&
            !generalInformationFields?.resourceFileIds?.includes(file?.fileId) &&
            // create new block for check condition and render one qunatity input field
            service?.unit !== 'perMinute' &&
            service?.unit !== 'perSecond' &&
            service?.isFiles && (
              <>
                <Box sx={{ mb: 2 }}>
                  <CustomTextField
                    label={
                      service?.unit === 'perMinute' || service?.unit === 'perSecond'
                        ? 'Quantity Minutes'
                        : service?.unit?.toUpperCase()
                    }
                    type="number"
                    fullWidth
                    value={
                      getCurrentFileData()?.unitQuantities?.length > 0
                        ? getCurrentFileData()?.unitQuantities[0]?.quantity
                        : ''
                    }
                    onChange={(e) => {
                      setOrderParts((prev) =>
                        prev.map((part) =>
                          part.id === activeTab
                            ? {
                                ...part,
                                orderPartFiles: part?.orderPartFiles?.map((f) => {
                                  if (
                                    f?.orderPartFile?.fileId === file?.fileId ||
                                    f?.orderPartFile?.fileId === file?.file?.fileId
                                  ) {
                                    return {
                                      ...f,
                                      unitQuantities: [
                                        { unitId: service?.unitId, unitName: service?.unit, quantity: e.target.value },
                                      ],
                                    }
                                  }
                                  return f
                                }),
                              }
                            : part
                        )
                      )
                    }}
                  />
                </Box>
              </>
            )}
          {activeTab !== 'general' &&
            !generalInformationFields?.resourceFileIds?.includes(file?.fileId) &&
            (((service?.unit === 'perMinute' || service?.unit === 'perSecond') && service?.isFiles === true) ||
              (service?.unit !== 'perMinute' && service?.unit !== 'perSecond' && service?.isFiles === true)) && (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#212121',
                      mb: 2,
                    }}
                  >
                    Add-Ons
                  </Typography>
                  {!service ? (
                    <Grid container sx={{ py: 1 }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                        There is no service selected
                      </Typography>
                    </Grid>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {addOns?.map((addon) => (
                        <Box key={addon.addonId} sx={{ flex: 1 }}>
                          <CustomSelectField
                            label={addon.addonName}
                            placeholder="Select"
                            value={
                              orderParts
                                ?.find((ele) => ele?.id === activeTab)
                                ?.orderPartFiles?.find((ele) => ele?.orderPartFile?.fileId === file?.fileId)
                                ?.fileSelectedOptions?.find((ele) => ele?.linkId === addon?.addonId)?.linkName
                            }
                            onChange={(e) =>
                              setOrderParts((prev) =>
                                prev.map((part) =>
                                  part.id === activeTab
                                    ? {
                                        ...part,
                                        orderPartFiles: part?.orderPartFiles?.map((ele) => {
                                          if (ele?.orderPartFile?.fileId === file?.fileId) {
                                            const tempAddons = [...ele?.fileSelectedOptions]
                                            const findIndex = tempAddons?.findIndex(
                                              (item) => item?.linkId === addon?.addonId
                                            )
                                            const findOptions = addon?.options?.find(
                                              (item) => item?.optionName === e.target.value
                                            )
                                            if (findIndex === -1) {
                                              tempAddons.push({
                                                linkType: 'ADDON',
                                                linkId: addon?.addonId,
                                                linkName: e.target.value,
                                                quantity: calculateQuantity(),
                                                discount: 'string',
                                                unit: findOptions?.unit,
                                                unitName: findOptions?.unitName,
                                                baseRate: findOptions?.baseRate,
                                                minimumBillableLengthPerFile: findOptions?.minimumBillableLengthPerFile,
                                                minimumPricePerProject: findOptions?.minimumPricePerProject,
                                                startOfDay: findOptions?.startOfDay,
                                                endOfDay: findOptions?.endOfDay,
                                                activeDaysOfWeek: findOptions?.activeDaysOfWeek,
                                                manEffort: findOptions?.manEffort,
                                                manEffortUnit: findOptions?.manEffortUnit,
                                              })
                                            } else {
                                              tempAddons.splice(findIndex, 1, {
                                                linkType: 'ADDON',
                                                linkId: addon?.addonId,
                                                linkName: e.target.value,
                                                quantity: calculateQuantity(),
                                                discount: 'string',
                                                unit: findOptions?.unit,
                                                unitName: findOptions?.unitName,
                                                baseRate: findOptions?.baseRate,
                                                minimumBillableLengthPerFile: findOptions?.minimumBillableLengthPerFile,
                                                minimumPricePerProject: findOptions?.minimumPricePerProject,
                                                startOfDay: findOptions?.startOfDay,
                                                endOfDay: findOptions?.endOfDay,
                                                activeDaysOfWeek: findOptions?.activeDaysOfWeek,
                                                manEffort: findOptions?.manEffort,
                                                manEffortUnit: findOptions?.manEffortUnit,
                                              })
                                            }
                                            return {
                                              ...ele,
                                              fileSelectedOptions: tempAddons,
                                            }
                                          } else {
                                            return ele
                                          }
                                        }),
                                      }
                                    : part
                                )
                              )
                            }
                            options={addon.options.map((option) => ({
                              label: `${option.optionName}`,
                              value: option.optionName,
                            }))}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                {service &&
                  (service?.unit === 'perMinute' || service?.unit === 'perSecond') &&
                  service?.isFiles === true && <>{renderQuantityFields()}</>}

                <PriceCalculation
                  file={file}
                  selectedAddOns={
                    orderParts
                      ?.find((ele) => ele?.id === activeTab)
                      ?.orderPartFiles?.find((ele) => ele?.orderPartFile?.fileId === file?.fileId)
                      ?.fileSelectedOptions?.reduce(
                        (acc, { linkId, optionName }) => ({ ...acc, [linkId]: optionName }),
                        {}
                      ) || {}
                  }
                  addOns={addOns}
                  service={service}
                  isMediaFile={isMediaFile}
                  orderParts={orderParts}
                  activeTab={activeTab}
                  setOrderParts={setOrderParts}
                  setInitialState={setInitialState}
                  getTotalSegmentsDuration={getTotalSegmentsDuration}
                />
              </>
            )}
        </>
      )}
    </>
  )
}

const AudioPreview = ({ file }) => {
  const waveformRef = useRef(null)
  const wavesurfer = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [volume, setVolume] = useState(1)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#E0E0E0',
        progressColor: '#4489FE',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 2,
        barRadius: 3,
        height: 60,
        normalize: true,
      })

      wavesurfer.current.on('ready', () => {
        setDuration(formatTime(wavesurfer.current.getDuration()))
        setIsReady(true)
      })

      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(formatTime(wavesurfer.current.getCurrentTime()))
      })

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false)
      })

      wavesurfer.current.loadBlob(file?.imageUrl)
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy()
        wavesurfer.current = null
      }
    }
  }, [file])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (wavesurfer.current && isReady) {
      wavesurfer.current.playPause()
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (wavesurfer.current && isReady) {
      wavesurfer.current.setVolume(newVolume)
    }
  }

  const handleBackward = () => {
    if (wavesurfer.current && isReady) {
      const currentTime = wavesurfer.current.getCurrentTime()
      wavesurfer.current.seekTo((currentTime - 5) / wavesurfer.current.getDuration())
    }
  }

  const handleForward = () => {
    if (wavesurfer.current && isReady) {
      const currentTime = wavesurfer.current.getCurrentTime()
      wavesurfer.current.seekTo((currentTime + 5) / wavesurfer.current.getDuration())
    }
  }

  return (
    <Box sx={{ mb: 4, textAlign: 'center', marginTop: '20px' }}>
      <Typography
        sx={{
          color: '#212121',
          fontSize: '15px',
          mb: '25px',
          fontWeight: 500,
        }}
      >
        {file.name}
      </Typography>

      <Box sx={{ position: 'relative', mb: 3 }}>
        <Typography
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#757575',
            fontSize: '13px',
          }}
        >
          {currentTime}
        </Typography>

        <Box
          ref={waveformRef}
          sx={{
            mx: '40px',
            '& wave': {
              overflow: 'hidden',
            },
          }}
        />

        <Typography
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#757575',
            fontSize: '13px',
          }}
        >
          {duration}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '22px',
          mt: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: '120px',
            position: 'absolute',
            left: '0',
            gap: '10px',
          }}
        >
          <Image src="/icons/volume.svg" alt="Volume_low" width={16} height={16} />
          <Box
            component="input"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            sx={{
              flex: 1,
              height: '3px',
              borderRadius: '2px',
              WebkitAppearance: 'none',
              background: '#E0E0E0',
              '&::-webkit-slider-thumb': {
                WebkitAppearance: 'none',
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                background: '#4489FE',
                cursor: 'pointer',
              },
            }}
          />

          <Image src="/icons/volume_high.svg" alt="Volume_high" width={20} height={20} />
        </Box>

        <IconButton
          onClick={handleBackward}
          sx={{
            p: 1,
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          <Image src="/icons/backward_audio.svg" alt="Backward" width={24} height={24} />
        </IconButton>

        <IconButton
          onClick={handlePlayPause}
          sx={{
            bgcolor: '#4489FE',
            '&:hover': { bgcolor: '#3371db' },
            width: '50px',
            height: '50px',
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={isPlaying ? '/icons/pause.svg' : '/icons/audio_play.svg'}
            alt={isPlaying ? 'Pause' : 'Play'}
            width={14}
            height={14}
          />
        </IconButton>

        <IconButton
          onClick={handleForward}
          sx={{
            p: 1,
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          <Image src="/icons/forward_audio.svg" alt="Forward" width={24} height={24} />
        </IconButton>
      </Box>
    </Box>
  )
}

const VideoPreview = ({ file }) => {
  const [videoSrc, setVideoSrc] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    // Clean up previous video source if exists
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc)
    }

    if (file?.imageUrl) {
      // For blob URLs, use them directly
      if (file.imageUrl.startsWith('blob:')) {
        setVideoSrc(file.imageUrl)
      } else {
        // For other URLs, create a new blob URL
        fetch(file.imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob)
            setVideoSrc(url)
          })
          .catch((error) => {})
      }
    }

    // Cleanup function
    return () => {
      if (videoSrc && !videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(videoSrc)
      }
    }
  }, [file?.imageUrl])

  // Force video reload when src changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [videoSrc])

  return (
    <Box sx={{ mb: 4, textAlign: 'center', marginTop: '20px' }}>
      <Typography
        sx={{
          color: '#212121',
          fontSize: '15px',
          mb: '25px',
          fontWeight: 500,
        }}
      >
        {file?.name}
      </Typography>

      {videoSrc ? (
        <video ref={videoRef} controls style={{ maxWidth: '100%', maxHeight: '400px' }}>
          <source src={videoSrc} type={file?.file?.type || 'video/mp4'} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )}
    </Box>
  )
}

const PDFPreview = ({ file }) => {
  const handleOpenPDF = () => {
    const url = file?.imageUrl
    window.open(url, '_blank')
  }

  return (
    <Box sx={{ mb: 4, textAlign: 'center', marginTop: '20px' }}>
      <Typography
        sx={{
          color: '#212121',
          fontSize: '15px',
          mb: '25px',
          fontWeight: 500,
        }}
      >
        {file?.name}
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: '200px',
          bgcolor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpenPDF}
          sx={{
            width: 'fit-content',
            bgcolor: '#4489FE',
            '&:hover': { bgcolor: '#3371db' },
          }}
        >
          Open PDF in Browser
        </Button>
      </Box>
    </Box>
  )
}

const ZipPreview = ({ file }) => {
  const handleDownload = () => {
    const url = file?.imageUrl
    const a = document.createElement('a')
    a.href = url
    a.download = file?.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Box sx={{ mb: 4, textAlign: 'center', marginTop: '20px' }}>
      <Typography
        sx={{
          color: '#212121',
          fontSize: '15px',
          mb: '25px',
          fontWeight: 500,
        }}
      >
        {file?.name}
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: '200px',
          bgcolor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleDownload}
          sx={{
            width: 'fit-content',
            bgcolor: '#4489FE',
            '&:hover': { bgcolor: '#3371db' },
          }}
        >
          Download ZIP
        </Button>
      </Box>
    </Box>
  )
}

const ImagePreview = ({ file }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <Box sx={{ mb: 4, textAlign: 'center', marginTop: '20px' }}>
      <Typography
        sx={{
          color: '#212121',
          fontSize: '15px',
          mb: '25px',
          fontWeight: 500,
        }}
      >
        {file?.name}
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxHeight: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        {!imageError ? (
          <img
            // src={URL.createObjectURL(file?.file)}
            src={file?.imageUrl}
            alt={file?.name}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography color="error">Error loading image preview</Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={() => window.open(file?.imageUrl, '_blank')}
        sx={{
          width: 'fit-content',
          mt: 2,
          bgcolor: '#4489FE',
          '&:hover': { bgcolor: '#3371db' },
        }}
      >
        Open Full Image
      </Button>
    </Box>
  )
}

export default PreviewFile
