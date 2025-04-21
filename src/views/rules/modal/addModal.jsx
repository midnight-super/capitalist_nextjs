import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Typography,
  IconButton,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import CustomTextField from '@/components/customTextField'
import AutoCompleteMenu from '@/components/customDropdown'
import {
  getAvailableRuleObjects,
  getRuleEventsByObjectId,
  getRuleMutationActions,
  getRuleQueryActions,
  getRuleConditionsByRuleId,
  createRule,
  updateRule,
  getRuleById,
  updateCondition,
  createCondition,
  deleteCondition,
} from '@/services/rule.service'
import toast from 'react-hot-toast'
import WarningModal from '@/views/componenets/warningModal'
import ObjectSelector from './ruleForm/inputs/ObjectSelector'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'

import FileNameModal from './ruleForm/modals/FileNameModal'
import FolderNameModal from './ruleForm/modals/FolderNameModal'
import FileTypeModal from './ruleForm/modals/FileTypeModal'
import FileDurationModal from './ruleForm/modals/FileDurationModal'
import ObjectChangeWarningModal from './ruleForm/modals/ObjectChangeWarningModal'

import { useAuth } from '@/hooks/useAuth'
import { TextField50 } from './ruleForm/inputs/TextField50'
import { QueryActionInput } from './ruleForm/inputs/QueryActionInput'
import { ruleValidationSchema } from './ruleForm/validateSchema'
import UpdateWarningModal from '@/views/componenets/updateWarningModal'

const defaultValues = {
  ruleName: '',
  selectedObject: null,
  selectedEvent: null,
  selectedQueryActions: [],
  selectedMutationActions: [],
  status: '',
}

const RuleAddModal = ({ open, close, editId, fetchAllRules, isView }) => {
  const [selectedStatus, setSelectedStatus] = useState({ value: '', label: '', status: 'ACTIVE' })
  const [loading, setLoading] = useState(false)
  const [warningOpen, setWarningModal] = useState(false)
  const [objectOptions, setObjectOptions] = useState([])
  const [selectedObject, setSelectedObject] = useState(null)
  const [eventOptions, setEventOptions] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [availableQueryActions, setAvailableQueryActions] = useState([])
  const [availableMutationActions, setAvailableMutationActions] = useState([])
  const [modalOpenReady, setModalOpenReady] = useState(false)
  const [queryActionValues, setQueryActionValues] = useState({})
  const [deletedConditions, setDeletedConditions] = useState([])
  const [objectChangeWarningOpen, setObjectChangeWarningOpen] = useState(false)
  const [pendingObjectChange, setPendingObjectChange] = useState(null)

  // Modal states
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [fileModalOpen, setFileModalOpen] = useState(false)
  const [fileTypeModalOpen, setFileTypeModalOpen] = useState(false)
  const [fileDurationModalOpen, setFileDurationModalOpen] = useState(false)
  const [currentQueryActionId, setCurrentQueryActionId] = useState(null)

  const auth = useAuth()

  const validationSchema = ruleValidationSchema

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const selectedQueryActions = watch('selectedQueryActions')
  const selectedMutationActions = watch('selectedMutationActions')
  const statuses = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'InActive' },
  ]

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const objects = await getAvailableRuleObjects()
        setObjectOptions(objects)

        if (editId) {
          await fetchRuleDetails(objects)
        }

        setModalOpenReady(true)
      } catch (error) {
        console.error('Error fetching initial data:', error)
        toast.error('Failed to load initial data')
        setModalOpenReady(true)
      }
    }

    fetchInitialData()
  }, [editId])

  const fetchRuleDetails = async (objects) => {
    setLoading(true)
    try {
      const res = await getRuleById(editId)
      if (res) {
        const matchedObject = objects.find((obj) => obj.objectId === res.objectId)
        if (matchedObject) {
          setSelectedObject(matchedObject)
          setValue('selectedObject', matchedObject)

          const events = await getRuleEventsByObjectId(matchedObject.objectId)
          setEventOptions(events)

          const matchedEvent = events.find((evt) => evt.eventId === res.eventId)
          if (matchedEvent) {
            setSelectedEvent(matchedEvent)
            setValue('selectedEvent', matchedEvent)
          }

          const queryActions = await getRuleQueryActions(matchedObject.objectId)
          setAvailableQueryActions(queryActions)

          const mutationActions = await getRuleMutationActions(matchedObject.objectId)
          setAvailableMutationActions(mutationActions)

          // Fetch conditions for this rule
          const conditions = await getRuleConditionsByRuleId(editId)

          if (conditions && conditions.length > 0) {
            const _selectedQueryActions = queryActions
              .filter((action) => conditions.some((cond) => cond.actionId === action.actionId))
              .map((action) => {
                const condition = conditions.find((cond) => cond.actionId === action.actionId)
                return {
                  ...action,
                  conditionId: condition.conditionId,
                }
              })

            setValue('selectedQueryActions', _selectedQueryActions)

            const initialValues = {}
            conditions.forEach((condition) => {
              initialValues[condition.actionId] = condition.value || ''
            })
            setQueryActionValues(initialValues)
          }

          if (res.mutationActions) {
            const selectedIds = res.mutationActions.map((a) => a.mutationActionId)
            const _selectedMutationActions = mutationActions.filter((a) => selectedIds.includes(a.actionId))
            setValue('selectedMutationActions', _selectedMutationActions)
          }

          setSelectedStatus({
            value: res.status,
            label: res.status === 'ACTIVE' ? 'Active' : 'InActive',
            status: res.status,
          })
          setValue('status', res.status)
        }
        setValue('ruleName', res.ruleName)
      }
    } catch (error) {
      console.error('Error fetching rule details:', error)
      toast.error('Failed to load rule details')
    } finally {
      setLoading(false)
    }
  }

  const fetchActionOptions = useCallback(async () => {
    if (!selectedObject?.objectId) return

    try {
      const queryActions = await getRuleQueryActions(selectedObject.objectId)
      setAvailableQueryActions(queryActions)

      const mutationActions = await getRuleMutationActions(selectedObject.objectId)
      setAvailableMutationActions(mutationActions)
    } catch (error) {
      console.error('Error fetching actions:', error)
      toast.error('Failed to load actions for rules')
    }
  }, [selectedObject?.objectId])

  useEffect(() => {
    fetchActionOptions()
  }, [fetchActionOptions])

  const handleObjectSelect = async (object) => {
    if (isView) return

    if (editId && selectedObject && selectedObject.objectId !== object.objectId) {
      setPendingObjectChange(object)
      setObjectChangeWarningOpen(true)
    } else {
      proceedWithObjectChange(object)
    }
  }

  const proceedWithObjectChange = async (object) => {
    // Batch all state updates together
    React.startTransition(() => {
      setSelectedObject(object)
      setValue('selectedObject', object, { shouldValidate: true })
      setValue('selectedQueryActions', [], { shouldValidate: false })
      setValue('selectedMutationActions', [], { shouldValidate: false })
      setQueryActionValues({})
      setSelectedEvent(null)
      setValue('selectedEvent', null)
    })

    try {
      const eventResponse = await getRuleEventsByObjectId(object?.objectId)
      setEventOptions(eventResponse)
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events for selected object')
    }
  }

  const handleConfirmObjectChange = () => {
    if (!pendingObjectChange) return
    setValue('selectedObject', pendingObjectChange, { shouldValidate: true })
    setSelectedObject(pendingObjectChange)
    proceedWithObjectChange(pendingObjectChange)
    setPendingObjectChange(null)
    setObjectChangeWarningOpen(false)
  }

  const handleCancelObjectChange = () => {
    setPendingObjectChange(null)
    setObjectChangeWarningOpen(false)
  }

  // Query Actions Handlers
  const handleAddQueryAction = () => {
    if (availableQueryActions.length > 0) {
      const firstAvailableAction = availableQueryActions.find(
        (action) => !selectedQueryActions.some((a) => a?.actionId === action.actionId)
      )
      if (firstAvailableAction) {
        setValue('selectedQueryActions', [...selectedQueryActions, firstAvailableAction], { shouldValidate: true })
        setQueryActionValues((prev) => ({
          ...prev,
          [firstAvailableAction.actionId]: '',
        }))
      }
    }
  }

  const handleRemoveQueryAction = (index) => {
    const actionToRemove = selectedQueryActions[index]
    const updatedActions = [...selectedQueryActions]
    updatedActions.splice(index, 1)
    setValue('selectedQueryActions', updatedActions, { shouldValidate: true })

    // If this action had a conditionId, mark it for deletion
    if (actionToRemove?.conditionId) {
      setDeletedConditions((prev) => [...prev, actionToRemove.conditionId])
    }

    setQueryActionValues((prev) => {
      const newValues = { ...prev }
      delete newValues[actionToRemove.actionId]
      return newValues
    })
  }

  const handleQueryActionChange = (index, newValue) => {
    const updatedActions = [...selectedQueryActions]
    updatedActions[index] = newValue
    setValue('selectedQueryActions', updatedActions, { shouldValidate: true })

    const oldActionId = selectedQueryActions[index]?.actionId
    const newActionId = newValue?.actionId

    setQueryActionValues((prev) => {
      const newValues = { ...prev }
      if (oldActionId) {
        delete newValues[oldActionId]
      }
      newValues[newActionId] = ''
      return newValues
    })
  }

  const handleQueryActionInputChange = (actionId, value) => {
    setQueryActionValues((prev) => ({
      ...prev,
      [actionId]: value,
    }))
  }

  const filteredAvailableQueryActions = useMemo(() => {
    return (currentIndex) =>
      availableQueryActions.filter(
        (action) => !selectedQueryActions.some((a, i) => i !== currentIndex && a?.actionId === action.actionId)
      )
  }, [availableQueryActions, selectedQueryActions])

  // Mutation Actions Handlers
  const handleAddMutationAction = () => {
    if (availableMutationActions.length > 0) {
      const firstAvailableAction = availableMutationActions.find(
        (action) => !selectedMutationActions.some((a) => a?.actionId === action.actionId)
      )
      if (firstAvailableAction) {
        setValue('selectedMutationActions', [...selectedMutationActions, firstAvailableAction], {
          shouldValidate: true,
        })
      }
    }
  }

  const handleRemoveMutationAction = (index) => {
    const updatedActions = [...selectedMutationActions]
    updatedActions.splice(index, 1)
    setValue('selectedMutationActions', updatedActions, { shouldValidate: true })
  }

  const handleMutationActionChange = (index, newValue) => {
    const updatedActions = [...selectedMutationActions]
    updatedActions[index] = newValue
    setValue('selectedMutationActions', updatedActions, { shouldValidate: true })
  }

  const filteredAvailableMutationActions = (currentIndex) => {
    return availableMutationActions.filter(
      (action) => !selectedMutationActions.some((a, i) => i !== currentIndex && a?.actionId === action.actionId)
    )
  }

  // Modal handlers for query actions
  const handleOpenFolderModal = (actionId) => {
    setCurrentQueryActionId(actionId)
    setFolderModalOpen(true)
  }

  const handleOpenFileModal = (actionId) => {
    setCurrentQueryActionId(actionId)
    setFileModalOpen(true)
  }

  const handleOpenFileTypeModal = (actionId) => {
    setCurrentQueryActionId(actionId)
    setFileTypeModalOpen(true)
  }

  const handleOpenFileDurationModal = (actionId) => {
    setCurrentQueryActionId(actionId)
    setFileDurationModalOpen(true)
  }

  const handleSelectFolder = (folderName) => {
    if (currentQueryActionId) {
      setQueryActionValues((prev) => ({
        ...prev,
        [currentQueryActionId]: folderName,
      }))
    }
  }

  const handleSelectFile = (fileName) => {
    if (currentQueryActionId) {
      setQueryActionValues((prev) => ({
        ...prev,
        [currentQueryActionId]: fileName,
      }))
    }
  }

  const handleSelectFileType = (type) => {
    if (currentQueryActionId) {
      setQueryActionValues((prev) => ({
        ...prev,
        [currentQueryActionId]: type,
      }))
    }
  }

  const handleSelectFileDuration = (duration) => {
    if (currentQueryActionId) {
      setQueryActionValues((prev) => ({
        ...prev,
        [currentQueryActionId]: duration,
      }))
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const { userId, fullName } = auth.user || {}

      const rulePayload = {
        ruleName: data.ruleName,
        objectId: data.selectedObject.objectId,
        objectName: data.selectedObject.objectName,
        eventId: data.selectedEvent.eventId,
        eventName: data.selectedEvent.eventName,
        mutationActions: data.selectedMutationActions.map(({ actionId, mutationData }, idx) => ({
          mutationActionId: actionId,
          mutationData: mutationData || null,
          priority: idx,
        })),
        status: data.status,
        ...(editId && { ruleId: editId }),
        createdAt: new Date(),
        lastActivity: {
          userId,
          userName: fullName,
          executionTime: new Date(),
        },
      }

      // Create/Update rule
      const ruleId = editId && !isView ? (await updateRule(rulePayload)) && editId : await createRule(rulePayload)

      if (!ruleId) throw new Error('Rule operation failed')

      // Process conditions in parallel
      const conditionPromises = data.selectedQueryActions.map(({ actionId, actionName, conditionId }) => {
        const conditionPayload = {
          ruleId,
          ruleName: data.ruleName,
          actionId,
          actionName,
          value: queryActionValues[actionId] || '',
          status: 'ACTIVE',
          operator: 'EQUAL',
          isOrOperand: true,
          ...(conditionId && { conditionId }),
        }

        return conditionId ? updateCondition(conditionPayload) : createCondition(conditionPayload)
      })

      // Add delete operations for any deleted conditions
      if (deletedConditions.length > 0) {
        deletedConditions.forEach((conditionId) => {
          conditionPromises.push(deleteCondition(conditionId))
        })
      }

      await Promise.all(
        conditionPromises.map((p) =>
          p.catch((e) => {
            console.error('Condition operation failed:', e)
            return null // Continue even if some operations fail
          })
        )
      )

      toast.success(`Rule ${editId ? 'Updated' : 'Created'} Successfully`)
      fetchAllRules()
      close()
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const openWarningModal = () => {
    setWarningModal(true)
  }

  const hanndleWarningClose = () => {
    setWarningModal(false)
    close()
  }

  useEffect(() => {
    if (!open) {
      reset(defaultValues)
      setSelectedObject(null)
      setSelectedEvent(null)
      setSelectedStatus({ value: '', label: '', status: 'ACTIVE' })
      setQueryActionValues({})
      setDeletedConditions([])
      setPendingObjectChange(null)
    }
  }, [open, reset])

  return (
    <>
      <Dialog
        fullWidth
        open={open && modalOpenReady}
        onClose={() => {
          !isView ? openWarningModal() : close()
        }}
        sx={{ px: '12px' }}
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: '900px',
            minHeight: editId && !isView ? '650px' : '550px',
            boxShadow: 'none',
            position: 'relative',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        disableScrollLock
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            color: '#212121',
            py: '19px !important',
            px: '43px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 700,
          }}
        >
          {editId && !isView ? 'Edit Rule' : isView ? 'Rule Details' : 'Create New Rule'}
          <span onClick={close} style={{ cursor: 'pointer' }}>
            <img src="/icons/closeIcon.svg" alt="close" />
          </span>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: '30px 50px', height: '100%' }}>
          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <CircularProgress />
            </div>
          )}
          <Box sx={{ filter: loading ? 'blur(5px)' : 'none' }}>
            <Box sx={{ p: 0 }}>
              <Grid container spacing={1}>
                <Grid size={12}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    Create rule name:
                  </Typography>

                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Controller
                      name="ruleName"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          value={value}
                          label="Rule Name"
                          onChange={onChange}
                          disabled={isView}
                          error={!!errors.ruleName}
                        />
                      )}
                    />
                    {errors.ruleName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.ruleName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    Choose which part of the system the rules will apply to:
                  </Typography>

                  <Grid container spacing={1} sx={{ mb: '20px' }}>
                    {objectOptions.map((object) => (
                      <ObjectSelector
                        key={object.objectId}
                        object={object}
                        isView={isView}
                        selected={selectedObject?.objectId === object.objectId}
                        handleObjectSelect={handleObjectSelect}
                      />
                    ))}
                  </Grid>
                  {errors.selectedObject && (
                    <FormHelperText sx={{ color: 'error.main', mb: 2 }}>{errors.selectedObject.message}</FormHelperText>
                  )}
                </Grid>

                <Grid size={12}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    Select an event from proposed list:
                  </Typography>
                  <FormControl fullWidth sx={{ mb: editId ? '20px' : '32px' }}>
                    <Controller
                      name="selectedEvent"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <AutoCompleteMenu
                          value={selectedEvent}
                          setValue={(newValue) => {
                            onChange(newValue)
                            setSelectedEvent(newValue)
                          }}
                          option={eventOptions}
                          placeHolder="Select Event"
                          label="Event"
                          width="100%"
                          error={!!errors.selectedEvent}
                          isEnabled={isView}
                        />
                      )}
                    />
                    {errors.selectedEvent && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.selectedEvent.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Query Action Selection UI */}
                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h2">Select a condition:</Typography>
                    <IconButton
                      variant="addAction"
                      onClick={handleAddQueryAction}
                      disabled={isView || availableQueryActions.length === 0}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Stack spacing={2}>
                      {selectedQueryActions.length === 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <AutoCompleteMenu
                              value={null}
                              setValue={(newValue) => {
                                if (newValue) {
                                  setValue('selectedQueryActions', [newValue], { shouldValidate: true })
                                  setQueryActionValues((prev) => ({
                                    ...prev,
                                    [newValue.actionId]: '',
                                  }))
                                }
                              }}
                              option={availableQueryActions}
                              placeHolder="Select condition"
                              label="Condition"
                              width="100%"
                              error={!!errors.selectedActions}
                              isEnabled={isView}
                            />
                          </Box>

                          <TextField50 value="" placeholder="Enter text" />
                          <IconButton variant="deleteAction" disabled={true}>
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        selectedQueryActions
                          .filter((action) => !deletedConditions.includes(action?.conditionId))
                          .map((action, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ flexGrow: 1 }}>
                                <AutoCompleteMenu
                                  value={action}
                                  setValue={(newValue) => handleQueryActionChange(index, newValue)}
                                  option={filteredAvailableQueryActions(index)}
                                  placeHolder="Select condition"
                                  label={`Condition ${index + 1}`}
                                  width="100%"
                                  isEnabled={isView}
                                />
                              </Box>
                              <QueryActionInput
                                isView={isView}
                                action={action}
                                selectedObject={selectedObject}
                                queryActionValues={queryActionValues}
                                handleOpenFolderModal={handleOpenFolderModal}
                                handleOpenFileModal={handleOpenFileModal}
                                handleOpenFileTypeModal={handleOpenFileTypeModal}
                                handleOpenFileDurationModal={handleOpenFileDurationModal}
                                handleQueryActionInputChange={handleQueryActionInputChange}
                              />
                              <IconButton
                                variant="deleteAction"
                                onClick={() => handleRemoveQueryAction(index)}
                                disabled={isView}
                              >
                                <ClearIcon />
                              </IconButton>
                            </Box>
                          ))
                      )}
                    </Stack>
                  </FormControl>
                </Grid>

                {/* Mutation Action Selection UI */}
                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h2">Select an action:</Typography>
                    <IconButton
                      variant="addAction"
                      onClick={handleAddMutationAction}
                      disabled={selectedMutationActions.length >= availableMutationActions.length}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth sx={{ mb: '20px' }}>
                    <Stack spacing={2}>
                      {selectedMutationActions.length === 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <AutoCompleteMenu
                              value={null}
                              setValue={(newValue) => {
                                if (newValue) {
                                  setValue('selectedMutationActions', [newValue], { shouldValidate: true })
                                }
                              }}
                              option={availableMutationActions}
                              placeHolder="Select Action"
                              label="Action"
                              width="100%"
                              error={!!errors.selectedMutationActions}
                              isEnabled={isView}
                            />
                          </Box>
                          <IconButton variant="deleteAction" disabled={true}>
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        selectedMutationActions.map((action, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <AutoCompleteMenu
                                value={action}
                                setValue={(newValue) => handleMutationActionChange(index, newValue)}
                                option={filteredAvailableMutationActions(index)}
                                placeHolder="Select Action"
                                label={`Action ${index + 1}`}
                                width="100%"
                                isEnabled={isView}
                              />
                            </Box>
                            <IconButton
                              variant="deleteAction"
                              onClick={() => handleRemoveMutationAction(index)}
                              disabled={isView}
                            >
                              <ClearIcon />
                            </IconButton>
                          </Box>
                        ))
                      )}
                    </Stack>

                    {errors.selectedMutationActions && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.selectedMutationActions.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={12}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    Set status:
                  </Typography>
                  <FormControl fullWidth sx={{ mb: '32px' }}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <AutoCompleteMenu
                          value={selectedStatus}
                          setValue={(newValue) => {
                            onChange(newValue?.value || null)
                            setSelectedStatus(newValue)
                          }}
                          option={statuses}
                          placeHolder="Select"
                          label="Status"
                          width="100%"
                          error={!!errors.status}
                          isEnabled={isView}
                        />
                      )}
                    />
                    {errors.status && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="outlined" onClick={close}>
                Cancel
              </Button>
              {!isView && (
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                  {editId && !isView ? 'Update Rule' : 'Create Rule'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modals for Query Actions */}
      <FolderNameModal open={folderModalOpen} onClose={() => setFolderModalOpen(false)} onSelect={handleSelectFolder} />
      <FileNameModal open={fileModalOpen} onClose={() => setFileModalOpen(false)} onSelect={handleSelectFile} />
      <FileTypeModal
        open={fileTypeModalOpen}
        onClose={() => setFileTypeModalOpen(false)}
        onSelect={handleSelectFileType}
      />
      <FileDurationModal
        open={fileDurationModalOpen}
        onClose={() => setFileDurationModalOpen(false)}
        onSelect={handleSelectFileDuration}
      />

      {/* Warning modals */}
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={hanndleWarningClose} />
      )}

      <UpdateWarningModal
        title={'Changing the object will reset all related fields. Are you sure you want to continue?'}
        open={objectChangeWarningOpen}
        close={handleCancelObjectChange}
        closeAll={handleConfirmObjectChange}
      />
    </>
  )
}

export default RuleAddModal
