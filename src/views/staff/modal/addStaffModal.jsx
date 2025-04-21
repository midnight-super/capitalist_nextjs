import MultiSelectField from '@/components/customMultiSelectField';
import CustomTextField from '@/components/customTextField';
import { getAllDesignation } from '@/services/designation.service';
import { createStaff, getStaffByID, updateStaff } from '@/services/staff.service';
import { staffStyles } from '@/styles/add-modals-styles';
import WarningModal from '@/views/componenets/warningModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const defaultValues = {
    firstName: '',
    secondName: '',
    designation: '',
    email: ''
};
const AddStaffModal = ({ open, close, editId, isView, fetchStaffData }) => {
    const {
        dialogContainer,
        dialogPaperProps,
        dialogBackdropProps,
        dialogTitle,
        dialogContent,
        loader,
        inputContainer,
        formContainer,
        nameInput,
        buttonContainer,
        button
    } = staffStyles;

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [staffData, setStaffData] = useState(null);
    const [warningOpen, setWarningModal] = useState(false);
    const [isChanged, setIsChanged] = useState(false)

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().trim().required('First Name is required'),
        secondName: Yup.string().trim().required('Second Name is required'),
        designation: Yup.array()
            .of(Yup.string().trim())
            .min(1, 'At least one designation is required')
            .required('Designation is required'),
        email: Yup.string().email('Invalid email address').trim().required('Email Name is required'),
    });

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
    });
    const staffDetail = async () => {
        setLoading(true)
        const res = await getStaffByID(editId)
        if (res) {
            setStaffData(res)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    const openWarningModal = () => {
        setWarningModal(true);
    };

    const onSubmit = async () => {
        const values = getValues()
        const formValues = {
            ...values,
            designation: values.designation[0],
            fullName: values?.firstName + ' ' + values?.secondName,
        };
        try {
            const createData = {
                firstName: formValues?.firstName,
                lastName: formValues?.secondName,
                fullName: formValues?.fullName,
                designation: formValues?.designation,
                email: formValues?.email,
            };
            const editData = {
                staffId: editId,
                firstName: formValues?.firstName,
                lastName: formValues?.secondName,
                fullName: formValues?.fullName,
                designation: formValues?.designation,
                email: formValues?.email,
            };
            setLoading(true);
            if (editId && !isView) {
                const res = await updateStaff(editData);
                if (res && res !== "RECORD_DUPLICATE") {
                    toast.success('Staff updated Successfully.');
                    setLoading(false);
                    fetchStaffData();
                    close();
                } else {
                    toast.error('Duplicate record. Change name to update');
                    setLoading(false);
                }
            } else {
                const res = await createStaff(createData);
                if (res) {
                    toast.success('Staff added Successfully.');
                    setLoading(false);
                    fetchStaffData && fetchStaffData();
                    close();
                }
            }
        } catch (error) {
            toast.error(error);
            setLoading(false);
        }

    };

    const handleWarningClose = () => {
        setWarningModal(false);
        close();
    };

    const fetchAllDesignation = async () => {
        const res = await getAllDesignation();
        const formattedOptions = res?.data?.map((item) => ({
            label: item.designationName,
            value: item.designationName,
        }));

        setOptions(formattedOptions);
    }

    useEffect(() => {
        if (editId) {
            staffDetail();
        }
        fetchAllDesignation();
    }, [editId]);

    useEffect(() => {
        if (staffData) {
            setValue('firstName', staffData?.firstName);
            setValue('secondName', staffData?.lastName);
            setValue('designation', [staffData?.designation]);
            setValue('email', staffData?.email);
        }
    }, [staffData]);


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
                <DialogTitle
                    sx={dialogTitle}
                >
                    {editId && !isView ? 'Update Staff' : 'Invite'}

                </DialogTitle>

                <Divider />
                <DialogContent sx={dialogContent}>
                    {loading && (
                        <div
                            style={loader}
                        >
                            <CircularProgress />
                        </div>
                    )}
                    <Box sx={{ filter: loading ? 'blur(5px)' : 'none' }}>
                        <Box sx={inputContainer}>
                            <Box sx={formContainer}>
                                <FormControl fullWidth sx={nameInput}>
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <CustomTextField
                                                type="text"
                                                value={value}
                                                label="First Name"
                                                disabled={editId && isView}
                                                onChange={(event) => {
                                                    const newValue = event.target.value;
                                                    onChange(newValue);
                                                    setIsChanged(staffData?.firstName !== newValue);
                                                }}
                                                error={!!errors.firstName}
                                                workflow={true}
                                            />
                                        )}
                                    />
                                    {errors?.firstName && <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>}
                                </FormControl>

                                <FormControl fullWidth sx={nameInput}>
                                    <Controller
                                        name="secondName"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <CustomTextField
                                                type="text"
                                                value={value}
                                                label="Second Name"
                                                disabled={editId && isView}
                                                onChange={(event) => {
                                                    const newValue = event.target.value;
                                                    onChange(newValue);
                                                    setIsChanged(staffData?.secondName !== newValue);
                                                }}
                                                error={!!errors.secondName}
                                                workflow={true}
                                            />
                                        )}
                                    />
                                    {errors?.secondName && <FormHelperText sx={{ color: 'error.main' }}>{errors.secondName.message}</FormHelperText>}
                                </FormControl>

                            </Box>
                            <FormControl fullWidth sx={nameInput}>
                                <Controller
                                    name="designation"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <MultiSelectField
                                            value={value}
                                            onChange={(event) => {
                                                const newValue = event;
                                                onChange(newValue);
                                                setIsChanged(staffData?.designation !== newValue);
                                            }}
                                            label="Designation"
                                            options={options}
                                            error={!!errors.designation}
                                        />
                                    )}
                                />
                                {errors.designation && <FormHelperText sx={{ color: 'error.main' }}>{errors.designation.message}</FormHelperText>}

                            </FormControl>
                            <FormControl fullWidth sx={nameInput}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            type="email"
                                            value={value}
                                            label="Email"
                                            disabled={editId && isView}
                                            onChange={(event) => {
                                                const newValue = event.target.value;
                                                onChange(newValue);
                                                setIsChanged(staffData?.email !== newValue);
                                            }}
                                            error={!!errors.email}
                                        />
                                    )}
                                />
                                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                            </FormControl>
                        </Box>

                        <Box sx={{ ...buttonContainer, mt: '26px', mb: "10px" }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    ...button,
                                    color: '#757575',
                                    border: '1px solid #DEE0E4',
                                }}
                                onClick={close}
                            >
                                Back
                            </Button>
                            {!isView && <Button
                                variant="contained"
                                sx={{
                                    ...button,
                                    color: '#fff',
                                }}
                                disabled={editId && isView}
                                onClick={handleSubmit(onSubmit)}
                            >
                                {editId && !isView ? 'Update' : 'Send Invite'}
                            </Button>}
                        </Box>
                    </Box>

                </DialogContent >
            </Dialog >
            {warningOpen && <WarningModal open={warningOpen} close={() => setWarningModal(false)} closeAll={handleWarningClose} />
            }
        </>
    );
};

export default AddStaffModal;
