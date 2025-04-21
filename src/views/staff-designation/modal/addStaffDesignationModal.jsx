import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import CustomTextField from '@/components/customTextField'
import WarningModal from '@/views/componenets/warningModal'
import CustomTextArea from '@/components/customTextArea'
import toast from 'react-hot-toast'
import { addServiceCategStyles } from '@/styles/add-modals-styles'
import { createDesignation, getDesignationByID, updateDesignation } from '@/services/designation.service'

const defaultValues = {
  name: '',
  description: '',
}

const AddStaffDesignationModal = ({ open, close, editId, isView, fetchStaffDesignation }) => {
  const {
    dialogContainer,
    dialogPaperProps,
    dialogBackdropProps,
    dialogTitle,
    dialogContent,
    loader,
    inputContainer,
    gridContainer,
    nameInput,
    descriptionInput,
    buttonContainer,
    button,
  } = addServiceCategStyles
  const [loading, setLoading] = useState(false)
  const [designationData, setDesignationData] = useState(null)
  const [warningOpen, setWarningModal] = useState(false)
  const [isChanged, setIsChanged] = useState(false)

  const openWarningModal = () => {
    setWarningModal(true)
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    description: Yup.string().trim().required('Description is required'),
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

  const onSubmit = async () => {
    const values = getValues()
    try {
      const createData = {
        designationName: values?.name,
        description: values?.description,
      }
      const editData = {
        designationId: editId,
        designationName: values?.name,
        description: values?.description,
      }
      setLoading(true)
      if (editId && !isView) {
        const res = await updateDesignation(editData)
        if (res && res !== 'RECORD_DUPLICATE') {
          toast.success('Staff Designation Updated Successfully.')
          setLoading(false)
          fetchStaffDesignation()
          close()
        } else {
          toast.error('Duplicate record. Change name to update')
          setLoading(false)
        }
      } else {
        const res = await createDesignation(createData)
        if (res) {
          toast.success('Staff Designation added Successfully.')
          setLoading(false)
          fetchStaffDesignation && fetchStaffDesignation()
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

  const categoryDetail = async () => {
    setLoading(true)
    const res = await getDesignationByID(editId)
    if (res) {
      setDesignationData(res)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    editId && categoryDetail()
  }, [editId])

  useEffect(() => {
    if (designationData) {
      setValue('name', designationData?.designationName)
      setValue('description', designationData?.description)
    }
  }, [designationData])

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          !isView && isChanged ? openWarningModal() : close()
        }}
        sx={{ ...dialogContainer, height: 'fitContent' }}
        maxWidth="lg"
        PaperProps={{
          sx: {
            ...dialogPaperProps,
            minHeight: editId && !isView ? 'fitContent' : '441px',
          },
        }}
        BackdropProps={{
          sx: { dialogBackdropProps },
        }}
        disableScrollLock
      >
        <DialogTitle sx={dialogTitle}>
          {editId && !isView ? 'Edit Designation Details' : 'Designation Details'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={dialogContent}>
          {loading && (
            <div style={loader}>
              <CircularProgress />
            </div>
          )}
          <Box sx={{ filter: loading ? 'blur(5px)' : 'none' }}>
            <Box sx={inputContainer}>
              <Grid container spacing={1} sx={gridContainer}>
                <Grid size={12}>
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
                            setIsChanged(designationData?.designationName !== newValue)
                          }}
                          error={!!errors.name}
                          workflow={true}
                        />
                      )}
                    />
                    {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid size={12}>
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
                            setIsChanged(designationData?.description !== newValue)
                          }}
                          error={!!errors.description}
                          minRows={5}
                          maxRows={5}
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
                  {editId && !isView ? 'Update Designation' : 'Add Designation'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {warningOpen && (
        <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={hanndleWarningClose} />
      )}
    </>
  )
}

export default AddStaffDesignationModal
