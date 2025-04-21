import CustomSelectField from '@/components/customSelectField'
import CustomTextArea from '@/components/customTextArea'
import CustomTextField from '@/components/customTextField'
import AddOnSvg from '@mui/icons-material/AddToPhotosOutlined'
import { createAddOns, getAddOnsById, updateAddOns } from '@/services/addOns.service'
import { getAllServices } from '@/services/services.service'
import { getAllUnits } from '@/services/unit.service'
import { addOnsStyles } from '@/styles/add-modals-styles'
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
  Radio,
  RadioGroup,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import DraggableOption from './draggableOption'

const defaultValues = {
  name: '',
  description: '',
  service: '',
  addOnType: '',
  options: [
    { optionName: '', unit: '', baseRate: '', minimumPricePerProject: '', minimumBillableLengthPerFile: '' },
    { optionName: '', unit: '', baseRate: '', minimumPricePerProject: '', minimumBillableLengthPerFile: '' },
  ],
  status: '',
}

const AddAddOnsModal = ({ open, close, editId, isView, fetchAddOns }) => {
  const {
    formTitle,
    typeTitle,
    dialogContainer,
    dialogPaperProps,
    addOptionButton,
    headerContainer,
    fullHeightWidth,
    dialogBackdropProps,
    dialogTitle,
    dialogContent,
    loader,
    inputContainer,
    nameInput,
    formContainer,
    buttonContainer,
    button,
    descriptionInput,
  } = addOnsStyles

  const [loading, setLoading] = useState(false)
  const [addOnsData, setAddOnsData] = useState(null)
  const [warningOpen, setWarningModal] = useState(false)
  const [services, setServices] = useState([])
  const [units, setUnits] = useState([])
  const [isChanged, setIsChanged] = useState(false)

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    description: Yup.string().trim().required('Description is required'),
    service: Yup.string().required('Service is required'),
    addOnType: Yup.string().required('Add-on Type is required'),
    options: Yup.array().of(
      Yup.object().shape({
        optionName: Yup.string()
          .required('Name is required')
          .test('unique', 'Option name must be unique', function (value) {
            const { options } = this.from[1].value
            return options.filter((option) => option.optionName === value).length === 1
          }),
        unit: Yup.string().required('Unit is required'),
      })
    ),
  })

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  })

  const fetchAddOnsById = async () => {
    setLoading(true)
    const res = await getAddOnsById(editId)
    if (res) {
      setAddOnsData(res)
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

    const service = Object.values(services || {})
      .flat()
      .find((item) => item?.value === values?.service)

    const options = values?.options?.map((item) => {
      const unit = units?.find((p) => p?.unitId === item?.unit)

      return {
        optionName: item.optionName,
        unit: unit?.unitId,
        unitName: unit?.unitName,
        baseRate: item?.baseRate,
        minimumBillableLengthPerFile: item?.minimumBillableLengthPerFile,
        minimumPricePerProject: item?.minimumPricePerProject,
      }
    })

    try {
      const createData = {
        addonId: 'string',
        addonName: values?.name,
        description: values?.description,
        serviceDescription: service?.description || '',
        serviceName: service?.label || '',
        type: values?.addOnType,
        serviceId: service?.value || '',
        options: options,
        status: values?.status,
      }
      const editData = {
        addonId: editId,
        addonName: values?.name,
        description: values?.description,
        serviceDescription: service?.description || '',
        serviceName: service?.label || '',
        type: values?.addOnType,
        serviceId: service?.value || '',
        options: options,
        status: values?.status,
      }

      setLoading(true)
      if (editId && !isView) {
        const res = await updateAddOns(editData)
        if (res === 'OPERATION_SUCCESS') {
          toast.success('Add-ons Updated Successfully.')
          fetchAddOns()
          setLoading(false)
          close()
        }
      } else {
        const res = await createAddOns(createData)
        if (res && res !== 'ADDONTYPE_NOT_SUPPORTED') {
          toast.success('Add-ons added Successfully.')
          setLoading(false)
          fetchAddOns && fetchAddOns()
          close()
        } else {
          toast.error('Add on type not supported')
          setLoading(false)
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

  const getServices = async () => {
    try {
      const res = await getAllServices()
      const groupedServices = res?.data?.reduce((acc, service) => {
        const { serviceCategoryName } = service
        if (!acc[serviceCategoryName]) {
          acc[serviceCategoryName] = []
        }
        acc[serviceCategoryName].push({
          label: service.serviceName,
          value: service.serviceId,
        })
        return acc
      }, {})

      setServices(groupedServices)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUnits = async () => {
    try {
      const res = await getAllUnits()
      setUnits(res)
    } catch (error) {
      console.error(error)
    }
  }

  const moveOption = (fromIndex, toIndex) => {
    setValue(
      'options',
      update(watch('options'), {
        $splice: [
          [fromIndex, 1],
          [toIndex, 0, watch('options')[fromIndex]],
        ],
      })
    )
  }

  useEffect(() => {
    if (editId) fetchAddOnsById()
  }, [editId])

  useEffect(() => {
    if (addOnsData) {
      setValue('name', addOnsData?.addonName)
      setValue('description', addOnsData?.description)
      setValue('service', addOnsData?.serviceId)
      setValue('addOnType', addOnsData?.type)
      setValue('options', addOnsData?.options || defaultValues?.options)
      setValue('status', addOnsData?.status ? addOnsData?.status : 'ACTIVE')
    }
  }, [addOnsData])

  useEffect(() => {
    fetchUnits()
    getServices()
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
        <DialogTitle sx={dialogTitle}>{editId && !isView ? 'Edit Add Ons' : 'Add-on Details'}</DialogTitle>

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
              <Box>
                <Box sx={formContainer}>
                  <Box sx={headerContainer}>
                    <FormControl fullWidth sx={{ ...nameInput, height: '78px' }}>
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
                              setIsChanged(addOnsData?.addonName !== newValue)
                            }}
                            error={!!errors.name}
                            workflow={true}
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth sx={{ ...nameInput, height: '78px' }}>
                      <Controller
                        name="service"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomSelectField
                            value={value}
                            label="Service"
                            onChange={(event) => {
                              const newValue = event
                              onChange(newValue)
                              setIsChanged(addOnsData?.serviceId !== newValue)
                            }}
                            error={!!errors.service}
                            options={services}
                            addOns={true}
                          />
                        )}
                      />
                      {errors.service && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.service.message}</FormHelperText>
                      )}
                    </FormControl>
                    <FormControl fullWidth sx={nameInput}>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomSelectField
                            value={value}
                            label="Status"
                            onChange={(event) => {
                              const newValue = event
                              onChange(newValue)
                              setIsChanged(addOnsData?.status !== newValue)
                            }}
                            error={!!errors.status}
                            options={[
                              { label: 'ACTIVE', value: 'ACTIVE' },
                              { label: 'INACTIVE', value: 'INACTIVE' },
                            ]}
                          />
                        )}
                      />
                      {errors.status && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  {/* Description */}
                  <Box sx={fullHeightWidth}>
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
                              setIsChanged(addOnsData?.description !== newValue)
                            }}
                            error={!!errors.description}
                            minRows={4.4}
                            maxRows={4.4}
                          />
                        )}
                      />
                      {errors.description && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>

                <DialogTitle sx={typeTitle}>Add-Ons Type</DialogTitle>

                <Box>
                  <FormControl component="fieldset" sx={{ ...nameInput, height: '60px' }}>
                    <Controller
                      name="addOnType"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel value="PART" control={<Radio />} label="Service Add-on" />
                          <FormControlLabel value="FILES" control={<Radio />} label="File Add-on" />
                        </RadioGroup>
                      )}
                    />
                    {errors.addOnType && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.addOnType.message}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <DndProvider backend={HTML5Backend}>
                  <Box sx={{ ...fullHeightWidth, position: 'relative' }}>
                    {fields.map((item, index) => (
                      <DraggableOption
                        key={item.id}
                        index={index}
                        item={item}
                        moveOption={moveOption}
                        control={control}
                        errors={errors}
                        length={fields?.length}
                        editId={editId}
                        isView={isView}
                        units={units}
                        removeField={remove}
                        addOnsData={addOnsData}
                        setIsChanged={setIsChanged}
                      />
                    ))}

                    <Button
                      startIcon={<AddOnSvg />}
                      onClick={() =>
                        append({
                          optionName: '',
                          unit: '',
                          baseRate: '',
                          minimumPricePerProject: '',
                          minimumBillableLengthPerFile: '',
                        })
                      }
                      sx={{
                        ...addOptionButton,
                        textTransform: 'none',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#4489FE',
                        mt: fields?.length > 2 ? '-10px' : '10px',
                      }}
                    >
                      Add Another Option
                    </Button>
                  </Box>
                </DndProvider>
              </Box>
            </Box>

            <Box sx={{ ...buttonContainer, marginTop: '44px', marginBottom: '12px' }}>
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
                  {editId && !isView ? 'Update Add-on' : 'Add Add-on'}
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

export default AddAddOnsModal
