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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentSchema } from '../../utils/validationSchemas';
import { useStudent, useCreateStudent, useUpdateStudent } from '../../hooks/useStudents';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'graduated', label: 'Graduated' },
];

function StudentForm({ studentId, onSuccess, onCancel }) {
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentSchema),
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
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
        // Error handling is done via mutation error stat

    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Edit Student' : 'Add New Student'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.message || 'An error occurred'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
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
                    disabled={isEditMode} // Can't change ID after creation
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      {...field}
                      label="Status"
                      error={!!errors.status}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
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

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of Birth"
                    inputFormat="yyyy-MM-dd"
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

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  onClick={onCancel}
                  disabled={isLoading}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading
                    ? 'Saving...'
                    : isEditMode
                    ? 'Update Student'
                    : 'Create Student'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}

export default StudentForm;