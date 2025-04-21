import moment from 'moment'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import FallbackSpinner from '@/components/spinner'
import { getAddOnsByServiceId } from '@/services/addon.service'
import { applyWorkflowToOrderPart, getOrderPartTasks, getWorkflowsByService } from '@/services/workflow.service'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import WarningModal from '../modal/WarningModal/WarningModal'
import OrderGeneralPriceCalculation from './OrderGeneralPriceCalculation'
import OrderPartPriceCalculation from './OrderPartPriceCalculation'
import CustomSelectField from '@/components/customSelectField'
import CustomTextField from '@/components/customTextField'

const OrderInformation = ({
  taskTypeData,
  activeTab,
  service,
  orderParts,
  setOrderParts,
  isTask,
  allClients,
  setGeneralInformationFields = () => {},
  generalInformationFields,
  allServices,
  handleOnSave,
  isPreviewing,
  setInitialState = () => {},
  onServiceChange,
  setSelectedWorkflow,
  selectedTask,
  selectedPartId,
  selectedWorkflow,
  onInputChange,
  workflowInputData,
}) => {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(false)
  const [partAddOns, setPartAddOns] = useState([])
  const [addToPartAnchorEl, setAddToPartAnchorEl] = useState(null)
  const [workflowName, setWorkflowName] = useState(null)
  const [warningModalOpen, setWarningModalOpen] = useState(false)
  const [serviceData, setServiceData] = useState(null)

  const handleAddToPartClose = () => {
    setAddToPartAnchorEl(null)
  }
  const handleAddToPartClick = (event) => {
    setAddToPartAnchorEl(event.currentTarget)
  }

  const currentPart = orderParts.find((part) => part.id === activeTab)

  // Fetch workflows when service changes

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (currentPart?.serviceName) {
        try {
          setLoading(true)

          if (service?.serviceId) {
            const response = await getWorkflowsByService(service?.serviceId)
            if (response) {
              setWorkflows(response || [])
            }
          }
        } catch (error) {
          toast.error('Failed to fetch workflows')
        } finally {
          setLoading(false)
        }
      } else {
        setWorkflows([])
      }
    }

    fetchWorkflows()
  }, [service])

  useEffect(() => {
    const fetchAddOns = async () => {
      if (currentPart?.serviceId && activeTab !== 'general') {
        const response = await getAddOnsByServiceId(currentPart?.serviceId)
        if (Array.isArray(response)) {
          // Filter for PART type add-ons only
          const partTypeAddOns = response?.filter((addon) => addon?.type === 'PARTS' && addon.status === 'ACTIVE')
          setPartAddOns(partTypeAddOns)
        }
      }
    }
    fetchAddOns()
  }, [currentPart?.serviceId, activeTab])

  useEffect(() => {
    if (currentPart?.serviceId && service) {
      setOrderParts((prev) => {
        const updatedParts = prev?.map((part) => {
          if (part?.id === activeTab) {
            return {
              ...part,
              unitQuantities: [
                {
                  unitId: service?.unitId,
                  unitName: service?.unit,
                  ...(((service?.unit === 'perMinute' || service?.unit === 'perSecond') &&
                    service?.isFiles === false) ||
                  ((service?.unit !== 'perMinute' || service?.unit !== 'perSecond') && service?.isFiles === false)
                    ? {
                        quantity: currentPart?.unitQuantities ? currentPart?.unitQuantities[0]?.quantity : '0',
                      }
                    : {
                        quantity:
                          currentPart?.orderPartFiles[0]?.unitQuantities &&
                          currentPart?.orderPartFiles[0]?.unitQuantities[0]?.quantity
                            ? currentPart?.orderPartFiles[0]?.unitQuantities[0]?.quantity
                            : '0',
                      }),
                },
              ],
            }
          }
          return part
        })

        // Update initial state to prevent unnecessary modals
        setInitialState((prevState) => ({
          ...prevState,
          orderParts: prevState?.orderParts?.map((part) =>
            part.id === activeTab
              ? {
                  ...part,
                  unitQuantities: [
                    {
                      unitId: service?.unitId,
                      unitName: service?.unit,
                      ...(((service?.unit === 'perMinute' || service?.unit === 'perSecond') &&
                        service?.isFiles === false) ||
                      ((service?.unit !== 'perMinute' || service?.unit !== 'perSecond') && service?.isFiles === false)
                        ? {
                            quantity: currentPart?.unitQuantities ? currentPart?.unitQuantities[0]?.quantity : '0',
                          }
                        : {
                            quantity:
                              currentPart?.orderPartFiles[0]?.unitQuantities &&
                              currentPart?.orderPartFiles[0]?.unitQuantities[0]?.quantity
                                ? currentPart?.orderPartFiles[0]?.unitQuantities[0]?.quantity
                                : '0',
                          }),
                    },
                  ],
                }
              : part
          ),
        }))

        return updatedParts
      })
    }
  }, [currentPart?.orderPartFiles, currentPart?.serviceId, service])

  const handleWorkflowSelect = async (workflow) => {
    setSelectedWorkflow((prev) => ({ ...prev, [activeTab]: workflow }))
    setAddToPartAnchorEl(null)
    return
    try {
      setLoading(true)
      await handleOnSave()
      const response = await applyWorkflowToOrderPart(activeTab, workflow?.workflowId)

      if (response === 'OPERATION_SUCCESS') {
        // Get updated tasks after workflow assignment
        const tasksResponse = await getOrderPartTasks(activeTab)

        // Update job with workflow and tasks
        setOrderParts((prev) =>
          prev?.map((part) =>
            part?.id === activeTab
              ? {
                  ...part,
                  steps: {
                    ...workflow,
                    tasks: tasksResponse?.data || [],
                  },
                }
              : part
          )
        )

        toast.success('Workflow assigned successfully')
      } else {
        throw new Error('Failed to assign workflow')
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to assign workflow')
    } finally {
      setLoading(false)
      handleAddToPartClose()
    }
  }

  const handleServiceSelect = (e) => {
    onServiceChange(activeTab, e.target.value)
  }

  const renderStepContent = () => {
    return (
      <>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: '24px', mb: 0.5 }}>
            Order Information
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Please enter all information
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography sx={{ mb: 1, color: '#666', fontSize: '14px' }}>Product Instructions</Typography>
          <TextField
            multiline
            rows={8}
            fullWidth
            placeholder="Write here"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
              },
            }}
          />
        </Box>
      </>
    )
  }

  const renderQuantityFields = () => {
    const currentPart = orderParts.find((part) => part.id === activeTab)
    // Get service data from allServices using serviceId
    const currentService = allServices?.find((service) => service?.serviceId === currentPart?.serviceId)
    // Case 2: If service unit is per minute/second and job based
    if (currentPart?.serviceId) {
      if (
        ((currentService?.unit === 'perSecond' || currentService?.unit === 'perMinute') && !currentService?.isFiles) ||
        ((currentService?.unit !== 'perSecond' || currentService?.unit !== 'perMinute') && !currentService?.isFiles)
      ) {
        return (
          <>
            <Grid item xs={12}>
              <CustomTextField
                label={
                  currentService?.unit === 'perMinute' || currentService?.unit === 'perSecond'
                    ? 'Quantity Minutes'
                    : currentService?.unit?.toUpperCase()
                }
                type="number"
                fullWidth
                value={currentPart?.unitQuantities[0]?.quantity || ''}
                onChange={(e) => {
                  setOrderParts((prev) =>
                    prev.map((part) =>
                      part.id === activeTab
                        ? {
                            ...part,
                            unitQuantities: [
                              {
                                unitId: service?.unitId,
                                unitName: service?.unit,
                                quantity: e.target.value,
                              },
                            ],
                          }
                        : part
                    )
                  )
                }}
              />
            </Grid>
          </>
        )
      }
    }

    return null // For file-based services, quantity fields appear in PreviewFile
  }

  const renderOrderPartContent = () => {
    if (currentPart && !isTask) {
      return (
        <>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontSize: '24px', mb: 0.5 }}>
              Order Information
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Please enter all information
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomTextField
                  label="Job Name"
                  placeholder="Name here"
                  value={currentPart?.label}
                  onChange={(e) => {
                    setOrderParts((prev) =>
                      prev?.map((it) => (it?.id === activeTab ? { ...it, label: e.target.value } : it))
                    )
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <CustomSelectField
                  customStyle={{
                    '& .MuiOutlinedInput-root': {
                      height: '44px !important',
                    },
                  }}
                  label="Service"
                  placeholder="Select Service"
                  value={currentPart?.serviceId || ''}
                  onChange={(e) => {
                    if (currentPart?.orderPartSelectedOptions?.length > 0) {
                      setWarningModalOpen(true)
                      setServiceData(e)
                      return
                    }
                    handleServiceSelect(e)
                  }}
                  options={allServices.map((service) => ({
                    label: service.serviceName,
                    value: service.serviceId,
                  }))}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {renderQuantityFields()}
            </Grid>
            {currentPart?.serviceId && (
              <Grid container spacing={2}>
                {partAddOns?.map((addon) => (
                  <Grid key={addon.addonId} item xs={6}>
                    <CustomSelectField
                      // disabled={orderParts?.find((ele) => ele?.id === activeTab)?.orderPartFiles?.length === 0}
                      label={addon.addonName}
                      placeholder="Select"
                      value={
                        orderParts
                          ?.find((ele) => ele?.id === activeTab)
                          ?.orderPartSelectedOptions?.find((ele) => ele?.linkId === addon?.addonId)?.linkName
                      }
                      onChange={(e) =>
                        setOrderParts((prev) =>
                          prev.map((part) => {
                            if (part.id === activeTab) {
                              const tempAddons = [...part?.orderPartSelectedOptions]
                              const findIndex = tempAddons?.findIndex((item) => item?.linkId === addon?.addonId)
                              const findOptions = addon?.options?.find((item) => item?.optionName === e.target.value)
                              if (findIndex === -1) {
                                tempAddons.push({
                                  linkType: 'ADDON',
                                  linkId: addon?.addonId,
                                  linkName: e.target.value,
                                  quantity: '1',
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
                                  quantity: '1',
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
                                ...part,
                                orderPartSelectedOptions: tempAddons,
                              }
                            } else {
                              return part
                            }
                          })
                        )
                      }
                      options={addon.options.map((option) => ({
                        label: `${option.optionName}`,
                        value: option.optionName,
                      }))}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomTextField
                  label="Date Created"
                  type="text"
                  value={moment(new Date()).format('MM/DD/YYYY')}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  label="Due Date"
                  inputLabelProps={{ shrink: true }}
                  type="datetime-local"
                  value={currentPart?.dueDate}
                  onChange={(e) => {
                    setOrderParts((prev) =>
                      prev?.map((it) => (it?.id === activeTab ? { ...it, dueDate: e.target.value } : it))
                    )
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                {/* <Typography sx={{ mb: 1, color: '#666', fontSize: '14px' }}>
                  Instruction
                </Typography> */}
                <TextField
                  label="Instruction"
                  multiline
                  rows={8}
                  fullWidth
                  value={currentPart?.instructions}
                  onChange={(e) => {
                    setOrderParts((prev) =>
                      prev?.map((it) => (it?.id === activeTab ? { ...it, instructions: e.target.value } : it))
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E0E0E0 !important',
                    },
                    '& .MuiInputLabel-shrink': {
                      color: '#666',
                      fontSize: '14px',
                    },
                  }}
                />
              </Grid>
            </Grid>
            {/* Configure workflows-- */}
            {currentPart?.serviceName && generalInformationFields?.status === 'APPROVED' && (
              <div style={{ position: 'relative' }}>
                <Button
                  variant="contained"
                  onClick={handleAddToPartClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    width: 'fit-content',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    bgcolor: '#4489FE',
                    border: '1px solid #4489FE',
                    borderRadius: '6px',
                    padding: '10px 25px',
                    boxShadow: 'none',
                  }}
                  disabled={loading}
                >
                  {loading
                    ? 'Loading Workflows...'
                    : workflowName && workflowName[activeTab]
                      ? workflowName[activeTab]
                      : 'Configure Workflows'}
                </Button>
                <Menu
                  anchorEl={addToPartAnchorEl}
                  open={Boolean(addToPartAnchorEl)}
                  onClose={handleAddToPartClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                      '& .MuiMenuItem-root': {
                        fontSize: '14px',
                        color: '#212121',
                        py: 1,
                        width: '100%',
                      },
                    },
                  }}
                >
                  {workflows?.length > 0 ? (
                    workflows?.map((workflow, index) => (
                      <MenuItem
                        key={workflow?.workflowId || index}
                        onClick={() => {
                          handleWorkflowSelect(workflow)
                          setWorkflowName((prev) => ({ ...prev, [activeTab]: workflow?.workflowName }))
                        }}
                        disabled={loading}
                      >
                        {workflow?.workflowName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>{loading ? 'Loading...' : 'No workflows available'}</MenuItem>
                  )}
                </Menu>
              </div>
            )}

            <OrderPartPriceCalculation
              orderParts={orderParts}
              activeTab={activeTab}
              setOrderParts={setOrderParts}
              service={allServices?.find((s) => s.serviceId === currentPart.serviceId)}
              addOns={partAddOns}
              setInitialState={setInitialState}
            />
          </Box>
          <WarningModal
            setShow={setWarningModalOpen}
            show={warningModalOpen}
            handleServiceSelect={handleServiceSelect}
            serviceData={serviceData}
          />
        </>
      )
    }

    if (currentPart && isTask) {
      return (
        <>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontSize: '24px', mb: 0.5 }}>
              Order Information
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Please enter all information
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography sx={{ mb: 1, color: '#666', fontSize: '14px' }}>Product Instructions</Typography>
            <TextField
              multiline
              rows={8}
              fullWidth
              placeholder="Write here"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                },
              }}
            />
          </Box>
        </>
      )
    }
    return renderGeneralContent()
  }

  const renderGeneralContent = () => {
    return (
      <>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" sx={{ fontSize: '24px', mb: 0.7 }}>
            Order Information
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Please enter all information
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            marginTop: '32px',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} md={12}>
              <CustomSelectField
                label="Client"
                options={allClients?.map((ele) => ({ label: ele?.admin?.fullName, value: ele?.clientId }))}
                fullWidth
                sx={{ width: '100%' }}
                onChange={(e) => {
                  setGeneralInformationFields((prev) => ({ ...prev, clientId: e.target.value }))
                }}
                value={generalInformationFields?.clientId}
              />
            </Grid>
            <Grid item xs={12} lg={6} md={12}>
              <CustomSelectField
                disabled={true}
                label="Status"
                value="draft"
                options={[
                  { label: 'Approved', value: 'approved' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Rejected', value: 'rejected' },
                  { label: 'Draft', value: 'draft' },
                ]}
                // onChange={(e) => {
                //   setGeneralInformationFields((prev) => ({ ...prev, status: e.target.value }))
                // }}
                // value={generalInformationFields?.status}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} md={12}>
              <CustomTextField
                label="Date Created"
                value={moment(new Date()).format('MM-DD-YYYY')}
                disabled
                fullWidth
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} lg={6} md={12}>
              <CustomTextField
                onChange={(e) => {
                  setGeneralInformationFields((prev) => ({ ...prev, dueDate: e.target.value }))
                }}
                label="Due Date"
                type="datetime-local"
                value={generalInformationFields?.dueDate}
                fullWidth
                sx={{ width: '100%' }}
                inputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Grid container sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                label="Instruction"
                placeholder="Write Instructions Here"
                multiline
                rows={8}
                // defaultValue="Without Instruction"
                fullWidth
                onChange={(e) => {
                  setGeneralInformationFields((prev) => ({ ...prev, instructions: e.target.value }))
                }}
                value={generalInformationFields?.instructions}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0 !important',
                  },
                  '& .MuiInputLabel-shrink': {
                    color: '#666',
                    fontSize: '14px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <OrderGeneralPriceCalculation
          orderParts={orderParts}
          setOrderParts={setOrderParts}
          setGeneralInformationFields={setGeneralInformationFields}
          generalInformationFields={generalInformationFields}
          setInitialState={setInitialState}
        />
      </>
    )
  }

  const renderConfigureWorkflowContent = () => {
    const renderDataInput = (input) => {
      // Find the workflow task for this input
      const currentWorkflow = selectedWorkflow[selectedPartId]
      const connection = currentWorkflow?.workflowConnections?.find((conn) => conn.inputId === input.taskIoputId)

      // If input type is FILE, just show the label
      if (input.mappingType === 'FILE') {
        return (
          <Typography sx={{ color: '#666', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px', lineHeight: '0px' }}>•</span>{' '}
            {input.name}
          </Typography>
        )
      }

      // Get current value from workflowInputData
      // Match both taskTypeInputId AND workflowTaskId to ensure we get the right value
      const currentValue =
        workflowInputData[selectedPartId]?.find(
          (item) => item.taskTypeInputId === input.taskIoputId && item.workflowTaskId === selectedTask.workflowTaskId
        )?.data || ''

      switch (input.selectedOption) {
        case 'Boolean (Yes/No)':
          return (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {' '}
                <span style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px', lineHeight: '0px' }}>
                  •
                </span>{' '}
                {input.name}
              </FormLabel>
              <RadioGroup
                row
                name={`${selectedTask.workflowTaskId}-${input.taskIoputId}`} // Use combined name to ensure uniqueness
                value={currentValue}
                onChange={(e) =>
                  onInputChange(selectedPartId, input.taskIoputId, selectedTask.workflowTaskId, e.target.value)
                }
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          )

        case 'Number':
          return (
            <CustomTextField
              label={input.name}
              type="number"
              fullWidth
              value={currentValue}
              onChange={(e) =>
                onInputChange(selectedPartId, input.taskIoputId, selectedTask.workflowTaskId, e.target.value)
              }
            />
          )

        default:
          return (
            <CustomTextField
              label={input.name}
              fullWidth
              value={currentValue}
              onChange={(e) =>
                onInputChange(selectedPartId, input.taskIoputId, selectedTask.workflowTaskId, e.target.value)
              }
            />
          )
      }
    }

    return (
      <>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: '24px', mb: 0.5 }}>
            Configure Workflow
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Please enter all required information
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 4 }}>
          {taskTypeData?.inputs?.map((input, index) => (
            <Grid item xs={12} key={input.taskIoputId || index}>
              {renderDataInput(input)}
            </Grid>
          ))}
        </Box>
      </>
    )
  }

  const renderContent = () => {
    if (activeTab === 'general') {
      return renderGeneralContent()
    }

    if (activeTab === 'configure-workflow') {
      return renderConfigureWorkflowContent()
    }

    // if (activeTab === 'first-order') {
    //   return renderStepContent();
    // }

    // if (activeTab === 'second-order') {
    //   return renderStepContent();
    // }

    return renderOrderPartContent()
  }

  return <Box>{isPreviewing ? <FallbackSpinner /> : renderContent()}</Box>
}

export default OrderInformation
