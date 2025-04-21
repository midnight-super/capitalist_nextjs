import CustomSelectField from '@/components/customSelectField'
import CustomTextArea from '@/components/customTextArea'
import CustomTextField from '@/components/customTextField'
import SearchableSelectField from '@/components/searchableSelectField'
import { getAllIoPut } from '@/services/ioput.service'
import { getAllServices } from '@/services/services.service'
import { createTaskType, getTaskTypeById, updateTaskType } from '@/services/taskType.service'
import { taskTypeStyles } from '@/styles/add-modals-styles'
import WarningModal from '@/views/componenets/warningModal'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2 as Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { v4 as uuidv4 } from 'uuid'

const defaultValues = {
  name: '',
  description: '',
  service: '',
  inputs: [{ ioputId: '', selectedOption: '', taskIoputId: '', name: '' }],
  outputs: [{ ioputId: '', selectedOption: '', taskIoputId: '', name: '' }],
}
const AddTaskTypeModal = ({ open, close, editId, isView, fetchAddOns, taskTypeName }) => {
  const {
    formTitle,
    typeTitle,
    dialogContainer,
    optionsMargin,
    dialogPaperProps,
    addOptionButton,
    optionsContainer,
    headerContainer,
    fullHeightWidth,
    dialogBackdropProps,
    dialogTitle,
    dialogContent,
    loader,
    inputContainer,
    nameInput,
    buttonContainer,
    button,
    descriptionInput,
    removeButtonContainer,
  } = taskTypeStyles

  const [loading, setLoading] = useState(false)
  const [taskTypeData, setTaskTypeData] = useState(null)
  const [warningOpen, setWarningModal] = useState(false)
  const [ioPutData, setIoPutData] = useState([])
  const [services, setServices] = useState([])
  const [isChanged, setIsChanged] = useState(false)

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    service: Yup.string().trim().required('Service is required'),
    description: Yup.string().trim().required('Description is required'),
    inputs: Yup.array().of(
      Yup.object().shape({
        ioputId: Yup.string(),
        selectedOption: Yup.string().required('File required'),
        taskIoputId: Yup.string(),
        name: Yup.string()
          .required('Name is required')
          .test('unique', 'Input names must be unique and not match any output name', function (value) {
            const { inputs, outputs } = this.from[1].value
            const inputNames = inputs.map((input) => input.name)
            const outputNames = outputs.map((output) => output.name)

            return inputNames.filter((name) => name === value).length === 1 && !outputNames.includes(value)
          }),
      })
    ),
    outputs: Yup.array().of(
      Yup.object().shape({
        ioputId: Yup.string(),
        selectedOption: Yup.string().required('File required'),
        taskIoputId: Yup.string(),
        name: Yup.string()
          .required('Name is required')
          .test('unique', 'Output names must be unique and not match any input name', function (value) {
            const { inputs, outputs } = this.from[1].value
            const inputNames = inputs.map((input) => input.name)
            const outputNames = outputs.map((output) => output.name)

            return outputNames.filter((name) => name === value).length === 1 && !inputNames.includes(value)
          }),
      })
    ),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const {
    fields: inputFields,
    append: appendInput,
    remove: removeInput,
  } = useFieldArray({
    control,
    name: 'inputs',
  })

  const {
    fields: outputFields,
    append: appendOutput,
    remove: removeOutput,
  } = useFieldArray({
    control,
    name: 'outputs',
  })

  const fetchTaskTypeById = async () => {
    setLoading(true)
    const res = await getTaskTypeById(editId)
    if (res) {
      setTaskTypeData(res)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const openWarningModal = () => {
    setWarningModal(true)
  }

  const onSubmit = async () => {
    const values = getValues()

    const inputOptions = values?.inputs?.map((item) => {
      const input = ioPutData?.find((p) => p?.ioputId === item?.ioputId)

      return {
        ioputId: input?.ioputId,
        selectedOption: item?.selectedOption,
        taskIoputId: uuidv4(),
        name: item?.name,
      }
    })

    const outOptions = values?.outputs?.map((item) => {
      const input = ioPutData?.find((p) => p?.ioputId === item?.ioputId)

      return {
        ioputId: input?.ioputId,
        selectedOption: item?.selectedOption,
        taskIoputId: uuidv4(),
        name: item?.name,
      }
    })

    try {
      const createData = {
        taskTypeId: 'string',
        taskTypeName: values?.name,
        serviceId: values?.service,
        taskTypeCategoryId: '7efc0c31-bde9-4525-a839-1c979b641968',
        taskTypeCategoryName: 'DEFAULTCATEGORY',
        description: values?.description,
        inputs: inputOptions,
        outputs: outOptions,
        workflows: [
          {
            workflowId: 'string',
            workflowName: 'string',
          },
        ],
      }

      const editData = {
        taskTypeId: editId,
        taskTypeName: values?.name,
        serviceId: values?.service,
        taskTypeCategoryId: '7efc0c31-bde9-4525-a839-1c979b641968',
        taskTypeCategoryName: 'DEFAULTCATEGORY',
        description: values?.description,
        inputs: inputOptions,
        outputs: outOptions,
        workflows: [
          {
            workflowId: 'string',
            workflowName: 'string',
          },
        ],
      }

      setLoading(true)
      if (editId && !isView) {
        const res = await updateTaskType(editData)
        if (res === 'OPERATION_SUCCESS') {
          toast.success('Task Type Updated Successfully.')
          fetchAddOns()
          setLoading(false)
          close()
        }
      } else {
        const res = await createTaskType(createData)
        if (res) {
          toast.success('Task Type added Successfully.')
          setLoading(false)
          fetchAddOns && fetchAddOns()
          close()
        }
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong.')
      setLoading(false)
    }
  }

  const handleWarningClose = () => {
    setWarningModal(false)
    close()
  }

  const fetchServices = async () => {
    const res = await getAllServices()
    if (res?.success) {
      setServices(
        res.data?.map((item) => {
          return {
            label: item?.serviceName,
            value: item?.serviceId,
          }
        })
      )
    } else {
      toast.error(res || 'Server Error: Failed to fetch')
    }
  }

  const fetchIoPut = async () => {
    try {
      const res = await getAllIoPut()
      setIoPutData(res)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (editId) {
      fetchTaskTypeById()
    }
    fetchServices()
  }, [editId])

  useEffect(() => {
    if (taskTypeData) {
      setValue('name', taskTypeData?.taskTypeName)
      setValue('description', taskTypeData?.description)
      setValue('inputs', taskTypeData?.inputs)
      setValue('outputs', taskTypeData?.outputs)
      setValue('service', taskTypeData?.serviceId)
    }
  }, [taskTypeData, setValue])

  useEffect(() => {
    fetchIoPut()
  }, [])

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          !isView && isChanged ? openWarningModal() : close()
        }}
        sx={dialogContainer}
        maxWidth="lg"
        PaperProps={{
          sx: {
            ...dialogPaperProps,
            minHeight: editId && !isView ? '512px' : '441px',
          },
        }}
        BackdropProps={{
          sx: { dialogBackdropProps },
        }}
        disableScrollLock
      >
        <DialogTitle sx={dialogTitle}>{editId && !isView ? `Edit ${taskTypeName}` : 'Add Task Type'}</DialogTitle>

        <Divider />
        <DialogContent sx={dialogContent}>
          {loading && (
            <div style={loader}>
              <CircularProgress />
            </div>
          )}
          <Box sx={{ filter: loading ? 'blur(5px)' : 'none' }}>
            <DialogTitle sx={formTitle}>Main Information</DialogTitle>
            <Box sx={inputContainer}>
              <Box sx={headerContainer}>
                <FormControl fullWidth sx={{ ...nameInput, height: '72px' }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        type="name"
                        value={value}
                        label="Name"
                        disabled={editId && isView}
                        onChange={(event) => {
                          const newValue = event.target.value
                          onChange(newValue)
                          setIsChanged(taskTypeData?.taskTypeName !== newValue)
                        }}
                        error={!!errors.name}
                        taskType={true}
                      />
                    )}
                  />
                  {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth sx={{ ...nameInput, mt: 1, height: '78px' }}>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <SearchableSelectField
                        value={value}
                        label="Service"
                        onChange={(event) => {
                          const newValue = event
                          onChange(newValue)
                          setIsChanged(taskTypeData?.serviceId !== newValue)
                        }}
                        error={!!errors.service}
                        options={services}
                        add={false}
                      />
                    )}
                  />
                  {errors.service && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.service.message}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={descriptionInput}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextArea
                        type="description"
                        value={value}
                        label="Description"
                        disabled={editId && isView}
                        onChange={(event) => {
                          const newValue = event.target.value
                          onChange(newValue)
                          setIsChanged(taskTypeData?.description !== newValue)
                        }}
                        error={!!errors.description}
                        minRows={4}
                        maxRows={4}
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <DialogTitle sx={typeTitle}>Inputs/Outputs Settings</DialogTitle>

              <Box sx={optionsContainer}>
                <Box sx={fullHeightWidth}>
                  {inputFields.map((item, index) => (
                    <>
                      <Grid container spacing={2} key={item.id} sx={optionsMargin}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`inputs[${index}].name`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                type="text"
                                value={value}
                                label="Input ( Optional )"
                                disabled={editId && isView}
                                onChange={(event) => {
                                  const newValue = event.target.value
                                  onChange(newValue)
                                  setIsChanged(taskTypeData?.inputs?.[index]?.name !== newValue)
                                }}
                                error={!!errors.inputs?.[index]?.name}
                                workflow={true}
                              />
                            )}
                          />
                          {errors.inputs?.[index]?.name && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.inputs?.[index]?.name.message}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth sx={nameInput}>
                            <Controller
                              name={`inputs[${index}].selectedOption`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomSelectField
                                  value={value}
                                  label=".File"
                                  onChange={(event) => {
                                    const newValue = event
                                    onChange(newValue)
                                    setIsChanged(taskTypeData?.inputs?.[index] !== newValue)
                                  }}
                                  error={!!errors.inputs?.[index]?.selectedOption}
                                  taskType={true}
                                  options={ioPutData
                                    ?.map((item) => {
                                      if (item?.type === 'INPUT') {
                                        setValue(`inputs[${index}].ioputId`, item?.ioputId)
                                        return item.options?.map((option) => {
                                          return {
                                            label: option,
                                            value: option,
                                          }
                                        })
                                      }
                                      return null
                                    })
                                    .filter((option) => option !== null)
                                    .flat()}
                                />
                              )}
                            />
                            {errors.inputs?.[index]?.selectedOption && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.inputs[index].selectedOption.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                      {index !== inputFields?.length - 1 && <Divider />}
                      {index > 0 && (
                        <Box sx={removeButtonContainer}>
                          <Button
                            color="error"
                            variant="text"
                            onClick={() => removeInput(index)}
                            sx={{ ...addOptionButton, mt: 0 }}
                            size="small"
                          >
                            Remove
                          </Button>
                        </Box>
                      )}
                    </>
                  ))}

                  <Button
                    onClick={() => {
                      appendInput({ ioputId: '', selectedOption: '', taskIoputId: '', name: '' })
                      setIsChanged(true)
                    }}
                    sx={{
                      ...addOptionButton,
                      fontSize: '14px',
                      fontWeight: '400',
                      textTransform: 'none',
                      py: 0,
                      mt: 0,
                    }}
                  >
                    Add One More Input
                  </Button>
                </Box>

                <Box sx={fullHeightWidth}>
                  {outputFields.map((item, index) => (
                    <>
                      <Grid container spacing={2} key={item.id} sx={optionsMargin}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`outputs[${index}].name`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                type="name"
                                value={value}
                                label="Output ( Optional )"
                                disabled={editId && isView}
                                onChange={(event) => {
                                  const newValue = event.target.value
                                  onChange(newValue)
                                  setIsChanged(taskTypeData?.outputs?.[index]?.name !== newValue)
                                }}
                                error={!!errors.outputs?.[index]?.name}
                                workflow={true}
                              />
                            )}
                          />
                          {errors.outputs?.[index]?.name && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.outputs?.[index]?.name.message}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth sx={nameInput}>
                            <Controller
                              name={`outputs[${index}].selectedOption`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomSelectField
                                  value={value}
                                  label=".File"
                                  onChange={(event) => {
                                    const newValue = event
                                    onChange(newValue)
                                    setIsChanged(taskTypeData?.outputs?.[index] !== newValue)
                                  }}
                                  error={!!errors.outputs?.[index]?.selectedOption}
                                  taskType={true}
                                  options={ioPutData
                                    ?.map((item) => {
                                      if (item?.type === 'OUTPUT') {
                                        setValue(`outputs[${index}].ioputId`, item?.ioputId)
                                        return item.options?.map((option) => {
                                          return {
                                            label: option,
                                            value: option,
                                          }
                                        })
                                      }
                                      return null
                                    })
                                    .filter((option) => option !== null)
                                    .flat()}
                                />
                              )}
                            />
                            {errors.outputs?.[index]?.selectedOption && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.outputs[index].selectedOption.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                      {index !== outputFields?.length - 1 && <Divider />}
                      {index > 0 && (
                        <Box sx={removeButtonContainer}>
                          <Button
                            color="error"
                            variant="text"
                            onClick={() => removeOutput(index)}
                            sx={{ ...addOptionButton, mt: 0 }}
                            size="small"
                          >
                            Remove
                          </Button>
                        </Box>
                      )}
                    </>
                  ))}

                  <Button
                    onClick={() => {
                      appendOutput({ ioputId: '', selectedOption: '', taskIoputId: '', name: '' })
                      setIsChanged(true)
                    }}
                    sx={{
                      ...addOptionButton,
                      fontSize: '14px',
                      fontWeight: '400',
                      textTransform: 'none',
                      py: 0,
                      mt: 0,
                    }}
                  >
                    Add One More Output
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={buttonContainer}>
              <Button
                variant="outlined"
                sx={{
                  ...button,
                  color: '#757575',
                  border: '1px solid #DEE0E4',
                }}
                onClick={close}
              >
                Cancel
              </Button>
              {!isView && (
                <Button
                  variant="contained"
                  sx={{
                    ...button,
                    color: '#fff',
                  }}
                  disabled={editId && isView}
                  onClick={handleSubmit(onSubmit)}
                >
                  {editId && !isView ? 'Update' : 'Add Task Type'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={handleWarningClose} />
      )}
    </>
  )
}

export default AddTaskTypeModal
