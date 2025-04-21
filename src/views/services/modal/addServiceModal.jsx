import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
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
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import CustomTextField from '@/components/customTextField'
import WarningModal from '@/views/componenets/warningModal'
import toast from 'react-hot-toast'
import { addServiceCategStyles } from '@/styles/add-modals-styles'
import CustomSelectField from '@/components/customSelectField'
import { createService, getServiceByID, updateService } from '@/services/services.service'
import { getAllServiceCategories } from '@/services/service.category'
import { getAllUnits } from '@/services/unit.service'
import SearchableSelectField from '@/components/searchableSelectField'
import AddServiceCategoryModal from '@/views/service-categories/modal/addServiceCategoryModal'
import CustomTextArea from '@/components/customTextArea'

const defaultValues = {
  name: '',
  serviceCode: '',
  serviceCategory: '',
  unit: '',
  status: '',
  description: '',
  baseRate: '',
  minimumBillableLengthPerFile: '',
  isFiles: false,
  quantityBelongTo: false,
}

const AddServiceModal = ({ open, close, editId, isView, fetchServices }) => {
  const {
    dialogContainer,
    dialogPaperProps,
    dialogBackdropProps,
    dialogTitle,
    dialogContent,
    dialogContentContainer,
    dialogSubTitle,
    loader,
    inputContainer,
    gridContainer,
    nameInput,
    buttonContainer,
    button,
    descriptionInput,
    typeTitle,
  } = addServiceCategStyles

  const [loading, setLoading] = useState(false)
  const [serviceData, setServiceData] = useState(null)
  const [serviceCategories, setServiceCategories] = useState([])
  const [units, setUnits] = useState([])
  const [warningOpen, setWarningModal] = useState(false)
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [isChanged, setIsChanged] = useState(false)

  const handleAddOpen = () => {
    setAddCategoryOpen(true)
  }
  const handleAddClose = () => {
    setAddCategoryOpen(false)
  }

  const openWarningModal = () => {
    setWarningModal(true)
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    serviceCode: Yup.string().trim().required('Service code is required'),
    serviceCategory: Yup.string().trim().required('Service category is required'),
    unit: Yup.string().trim().required('Unit is required'),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const serviceDetail = async () => {
    setLoading(true)
    const res = await getServiceByID(editId)
    if (res) {
      setServiceData(res)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  // Submit Handler
  const onSubmit = async () => {
    const values = getValues()

    try {
      const createData = {
        serviceName: values?.name,
        shortCode: values?.serviceCode,
        serviceCategoryId: values?.serviceCategory,
        unitId: values?.unit,
        status: values?.status,
        baseRate: values?.baseRate,
        minimumBillableLengthPerFile: values?.minimumBillableLengthPerFile,
        description: values?.description,
        isFiles: values?.isFiles,
        quantityBelongTo: values?.quantityBelongTo,
      }
      const editData = {
        serviceId: editId,
        serviceName: values?.name,
        shortCode: values?.serviceCode,
        serviceCategoryId: values?.serviceCategory,
        unitId: values?.unit,
        status: values?.status,
        baseRate: values?.baseRate,
        minimumBillableLengthPerFile: values?.minimumBillableLengthPerFile,
        description: values?.description,
        isFiles: values?.isFiles,
        quantityBelongTo: values?.quantityBelongTo,
      }
      setLoading(true)
      if (editId && !isView) {
        const res = await updateService(editData)
        if (res && res !== 'RECORD_DUPLICATE') {
          toast.success('Service updated Successfully.')
          setLoading(false)
          fetchServices()
          close()
        } else {
          toast.error('Duplicate record. Change name to update')
          setLoading(false)
        }
      } else {
        const res = await createService(createData)
        if (res) {
          toast.success('Service added Successfully.')
          setLoading(false)
          fetchServices && fetchServices()
          close()
        }
      }
    } catch (error) {
      toast.error(error)
      setLoading(false)
    }
  }

  const hanndleWarningClose = () => {
    setWarningModal(false)
    close()
  }

  const fetchCategories = async () => {
    const res = await getAllServiceCategories()
    if (res?.success) {
      setServiceCategories(
        res.data?.map((item) => {
          return {
            label: item?.serviceCategoryName,
            value: item?.serviceCategoryId,
          }
        })
      )
    } else {
      toast.error(res || 'Server Error: Failed to fetch')
    }
  }
  const fetchUnits = async () => {
    const res = await getAllUnits()
    if (res) {
      setUnits(
        res?.map((item) => {
          return {
            label: item?.unitName,
            value: item?.unitId,
          }
        })
      )
    } else {
      toast.error(res || 'Server Error: Failed to fetch')
    }
  }

  useEffect(() => {
    if (editId) {
      serviceDetail()
    }
    fetchCategories()
    fetchUnits()
  }, [editId])

  useEffect(() => {
    if (serviceData) {
      setValue('name', serviceData?.serviceName)
      setValue('serviceCode', serviceData?.shortCode)
      setValue('serviceCategory', serviceData?.serviceCategoryId)
      setValue('unit', serviceData?.unitId)
      setValue('status', serviceData?.status ? serviceData?.status : 'ACTIVE')
      setValue('minimumBillableLengthPerFile', serviceData?.minimumBillableLengthPerFile)
      setValue('description', serviceData?.description)
      setValue('isFiles', serviceData?.isFiles)
      setValue('quantityBelongTo', serviceData?.quantityBelongTo)
      setValue('baseRate', serviceData?.baseRate)
    }
  }, [serviceData])

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
        <DialogTitle sx={dialogTitle}>Service</DialogTitle>
        <Divider />
        <DialogContent sx={dialogContent}>
          {loading && (
            <div style={loader}>
              <CircularProgress />
            </div>
          )}
          <Box sx={{ ...dialogContentContainer, filter: loading ? 'blur(5px)' : 'none' }}>
            <Box sx={{ ...inputContainer, width: '100%' }}>
              <Typography sx={dialogSubTitle}>Main Information</Typography>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={gridContainer}>
                {/* First Column */}
                <Grid item size={6}>
                  <FormControl fullWidth sx={nameInput}>
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
                            setIsChanged(serviceData?.serviceName !== newValue)
                          }}
                          error={!!errors.name}
                          workflow={true}
                        />
                      )}
                    />
                    {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                  </FormControl>
                  <FormControl fullWidth sx={{ ...nameInput, mt: 1 }}>
                    <Controller
                      name="serviceCategory"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <SearchableSelectField
                            value={value}
                            label="Service Category"
                            onChange={(event) => {
                              const newValue = event
                              onChange(newValue)
                              setIsChanged(serviceData?.serviceCategoryId !== newValue)
                            }}
                            error={!!errors.serviceCategory}
                            options={serviceCategories}
                            handleCategoryOpen={handleAddOpen}
                            add={true}
                          />
                        )
                      }}
                    />
                    {errors.serviceCategory && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.serviceCategory.message}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth sx={{ ...nameInput, mt: 1 }}>
                    <Controller
                      name="unit"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomSelectField
                          value={value}
                          label="Unit"
                          onChange={(event) => {
                            const newValue = event
                            onChange(newValue)
                            setIsChanged(serviceData?.unit !== newValue)
                          }}
                          error={!!errors.unit}
                          options={units}
                        />
                      )}
                    />
                    {errors.unit && <FormHelperText sx={{ color: 'error.main' }}>{errors.unit.message}</FormHelperText>}
                  </FormControl>
                  <FormControl fullWidth sx={{ ...nameInput, mt: 1 }}>
                    <Controller
                      name="minimumBillableLengthPerFile"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          type="name"
                          value={value}
                          label="Minimum Billable Length Per File"
                          disabled={editId && isView}
                          onChange={(event) => {
                            const newValue = event.target.value
                            onChange(newValue)
                            setIsChanged(serviceData?.minimumBillableLengthPerFile !== newValue)
                          }}
                          error={!!errors.minimumBillableLengthPerFile}
                        />
                      )}
                    />
                    {errors.minimumBillableLengthPerFile && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.minimumBillableLengthPerFile.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <DialogTitle sx={typeTitle}>Pricing Basis:</DialogTitle>
                  <FormControl component="fieldset" sx={{ ...nameInput, height: '60px' }}>
                    <Controller
                      name="isFiles"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                field.onChange(newValue)
                                setIsChanged(serviceData?.isFiles !== newValue)
                              }}
                            />
                          }
                          label="Per Project File"
                        />
                      )}
                    />
                    {errors.isFiles && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.isFiles.message}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl component="fieldset" sx={{ ...nameInput, height: '60px' }}>
                    <Controller
                      name="quantityBelongTo"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                field.onChange(newValue)
                                setIsChanged(serviceData?.quantityBelongTo !== newValue)
                              }}
                            />
                          }
                          label="Per Service"
                        />
                      )}
                    />
                    {errors.quantityBelongTo && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.quantityBelongTo.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Second Column */}
                <Grid item size={6}>
                  <FormControl fullWidth sx={nameInput}>
                    <Controller
                      name="serviceCode"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          type="text"
                          value={value}
                          label="Service Code"
                          disabled={editId && isView}
                          onChange={(event) => {
                            const newValue = event.target.value
                            onChange(newValue)
                            setIsChanged(serviceData?.serviceCode !== newValue)
                          }}
                          error={!!errors.serviceCode}
                          serviceCode={true}
                        />
                      )}
                    />
                    {errors.serviceCode && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.serviceCode.message}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth sx={{ ...nameInput, mt: 1 }}>
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
                            setIsChanged(serviceData?.status !== newValue)
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
                  <FormControl fullWidth sx={{ ...nameInput, mt: 1 }}>
                    <Controller
                      name="baseRate"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          type="name"
                          value={value}
                          label="Base Rate"
                          disabled={editId && isView}
                          onChange={(event) => {
                            const newValue = event.target.value
                            onChange(newValue)
                            setIsChanged(serviceData?.baseRate !== newValue)
                          }}
                          error={!!errors.baseRate}
                        />
                      )}
                    />
                    {errors.baseRate && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.baseRate.message}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth sx={{ ...descriptionInput, mt: 1 }}>
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
                            setIsChanged(serviceData?.description !== newValue)
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
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ ...buttonContainer, pb: '40px' }}>
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
                  {editId && !isView ? 'Update' : 'Add Service'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={hanndleWarningClose} />
      )}
      {addCategoryOpen && (
        <AddServiceCategoryModal
          open={addCategoryOpen}
          close={handleAddClose}
          fetchServiceCategories={fetchCategories}
        />
      )}
    </>
  )
}

export default AddServiceModal
