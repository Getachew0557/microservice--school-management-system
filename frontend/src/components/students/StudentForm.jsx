import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentSchema } from '../../utils/validationSchemas';
import { useStudent, useCreateStudent, useUpdateStudent } from '../../hooks/useStudents';
import { Person, CameraAlt } from '@mui/icons-material';

const steps = ['Personal Info', 'Contact Details', 'Review'];

function StudentForm({ studentId, onSuccess, onCancel }) {
  const [activeStep, setActiveStep] = React.useState(0);
  
  const isEditMode = !!studentId;
  
  const { data: studentData, isLoading: isLoadingStudent } = useStudent(studentId);
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  
  const isLoading = isLoadingStudent || createMutation.isLoading || updateMutation.isLoading;
  const error = createMutation.error || updateMutation.error;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(studentSchema),
    mode: 'onChange',
    defaultValues: {
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: null,
      address: '',
      status: 'active',
    },
  });

  // Load student data for editing
  useEffect(() => {
    if (studentData?.data) {
      const student = studentData.data;
      reset({
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        phone: student.phone || '',
        date_of_birth: student.date_of_birth ? new Date(student.date_of_birth) : null,
        address: student.address || '',
        status: student.status,
      });
    }
  }, [studentData, reset]);

  const handleNext = async () => {
    const fields = getStepFields(activeStep);
    const isValidStep = await trigger(fields);
    if (isValidStep) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ['student_id', 'first_name', 'last_name', 'date_of_birth', 'status'];
      case 1:
        return ['email', 'phone', 'address'];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      date_of_birth: data.date_of_birth ? data.date_of_birth.toISOString().split('T')[0] : null,
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id: studentId, data: formattedData });
      } else {
        await createMutation.mutateAsync(formattedData);
      }
      onSuccess?.();
    } catch {
      // Error is handled by mutation
    }
  };

  // watch() returns functions that cannot be memoized safely — ignore this lint rule here
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedValues = watch();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {isEditMode ? 'Update student information' : 'Fill in the student details below'}
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error?.message || 'An error occurred'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Info */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: 'primary.light',
                        fontSize: '3rem',
                      }}
                    >
                      {watchedValues.first_name?.[0] || 'S'}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      <CameraAlt />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="student_id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Student ID"
                        fullWidth
                        required
                        error={!!errors.student_id}
                        helperText={errors.student_id?.message}
                        disabled={isEditMode}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          {...field}
                          label="Status"
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                          <MenuItem value="graduated">Graduated</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
                        required
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        fullWidth
                        required
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="date_of_birth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date of Birth"
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.date_of_birth}
                            helperText={errors.date_of_birth?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}

            {/* Step 2: Contact Details */}
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email Address"
                        type="email"
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address"
                        multiline
                        rows={4}
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}

            {/* Step 3: Review */}
            {activeStep === 2 && (
              <Box>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Review Student Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Student ID
                        </Typography>
                        <Typography variant="body1">
                          {watchedValues.student_id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Status
                        </Typography>
                        <Typography variant="body1" textTransform="capitalize">
                          {watchedValues.status}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          First Name
                        </Typography>
                        <Typography variant="body1">
                          {watchedValues.first_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Last Name
                        </Typography>
                        <Typography variant="body1">
                          {watchedValues.last_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {watchedValues.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please review all information before submitting. You can go back to make changes.
                </Alert>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={activeStep === 0 ? onCancel : handleBack}
                disabled={isLoading}
                variant="outlined"
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    disabled={isLoading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !isValid}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  >
                    {isLoading
                      ? 'Saving...'
                      : isEditMode
                      ? 'Update Student'
                      : 'Create Student'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}

export default StudentForm;