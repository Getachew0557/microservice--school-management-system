import React from "react";
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
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useTeacher } from "../../hooks/useTeachers";

function TeacherDetail({ teacherId, onClose, onEdit }) {
  const { data, isLoading, isError, error } = useTeacher(teacherId);

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
        Error loading teacher: {error?.message || "Unknown error"}
      </Alert>
    );
  }

  const teacher = data?.data;

  if (!teacher) {
    return <Alert severity="info">Teacher not found</Alert>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "on_leave":
        return "warning";
      case "retired":
        return "default";
      default:
        return "default";
    }
  };

  const infoItems = [
    {
      icon: <PersonIcon />,
      label: "Teacher ID",
      value: teacher.teacher_id || teacher.id,
    },
    { icon: <EmailIcon />, label: "Email", value: teacher.email },
    { icon: <PhoneIcon />, label: "Phone", value: teacher.phone || "N/A" },
    {
      icon: <CakeIcon />,
      label: "Date of Birth",
      value: teacher.date_of_birth
        ? new Date(teacher.date_of_birth).toLocaleDateString()
        : "N/A",
    },
    {
      icon: <CalendarIcon />,
      label: "Hire Date",
      value: teacher.hire_date
        ? new Date(teacher.hire_date).toLocaleDateString()
        : "N/A",
    },
    { icon: <HomeIcon />, label: "Address", value: teacher.address || "N/A" },
  ];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              {teacher.first_name} {teacher.last_name}
            </Typography>
            <Chip
              label={teacher.status?.toUpperCase()}
              color={getStatusColor(teacher.status)}
              size="small"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box sx={{ color: "text.secondary", mr: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1">{item.value}</Typography>
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
        Created:{" "}
        {teacher.created_at
          ? new Date(teacher.created_at).toLocaleString()
          : "N/A"}
      </Typography>
      <Typography color="textSecondary">
        Last Updated:{" "}
        {teacher.updated_at
          ? new Date(teacher.updated_at).toLocaleString()
          : "N/A"}
      </Typography>
    </Box>
  );
}

export default TeacherDetail;
