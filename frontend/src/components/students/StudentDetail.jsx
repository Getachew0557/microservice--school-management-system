import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useStudent } from '../../hooks/useStudents';

function StudentDetail({ studentId, onClose, onEdit }) {
  const { data, isLoading, isError, error } = useStudent(studentId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Error loading student: {error?.message || 'Unknown error'}
      </Alert>
    );
  }

  const student = data?.data;

  if (!student) {
    return (
      <Alert severity="info">Student not found</Alert>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'graduated': return 'info';
      default: return 'default';
    }
  };

  const infoItems = [
    { icon: <PersonIcon />, label: 'Student ID', value: student.student_id },
    { icon: <EmailIcon />, label: 'Email', value: student.email },
    { icon: <PhoneIcon />, label: 'Phone', value: student.phone || 'N/A' },
    { icon: <CakeIcon />, label: 'Date of Birth', value: student.date_of_birth 
      ? new Date(student.date_of_birth).toLocaleDateString() 
      : 'N/A' },
    { icon: <CalendarIcon />, label: 'Enrollment Date', 
      value: new Date(student.enrollment_date).toLocaleDateString() },
    { icon: <HomeIcon />, label: 'Address', value: student.address || 'N/A' },
  ];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {student.first_name} {student.last_name}
            </Typography>
            <Chip
              label={student.status.toUpperCase()}
              color={getStatusColor(student.status)}
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
            <Button variant="contained" onClick={onEdit}>
              Edit
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {infoItems.map((item) => (
            <Grid item xs={12} sm={6} key={item.label}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ color: 'text.secondary', mr: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Typography color="textSecondary">
        Created: {new Date(student.created_at).toLocaleString()}
      </Typography>
      <Typography color="textSecondary">
        Last Updated: {new Date(student.updated_at).toLocaleString()}
      </Typography>
    </Box>
  );
}

export default StudentDetail;