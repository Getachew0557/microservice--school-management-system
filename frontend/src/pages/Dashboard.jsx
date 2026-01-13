import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Book as BookIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useStudents } from "../hooks/useStudents";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import QuickStatsCard from "../components/dashboard/QuickStatsCard";
import StudentStatusChart from "../components/charts/StudentStatusChart";
import EnrollmentTrendChart from "../components/charts/EnrollmentTrendChart";

function Dashboard() {
  const navigate = useNavigate();
  const { 
    data: studentsData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useStudents({ page: 1, limit: 10 });

  const handleRefresh = () => {
    refetch();
  };

  const handleAddStudent = () => {
    navigate("/students?action=add");
  };

  // Calculate statistics from real data
  const totalStudents = studentsData?.pagination?.total ?? 0;
  const activeStudents = studentsData?.data?.filter(s => s.status === 'active').length ?? 0;
  const inactiveStudents = studentsData?.data?.filter(s => s.status === 'inactive').length ?? 0;
  const graduatedStudents = studentsData?.data?.filter(s => s.status === 'graduated').length ?? 0;

  // Prepare data for charts
  const chartData = {
    active: activeStudents,
    inactive: inactiveStudents,
    graduated: graduatedStudents,
    total: totalStudents
  };

  const stats = [
    {
      title: "Total Students",
      value: isLoading ? "..." : totalStudents,
      icon: <PeopleIcon />,
      color: "#1976d2",
      progress: 100,
      trend: totalStudents > (studentsData?.previousTotal || 0) ? "up" : "down",
    },
    {
      title: "Active Students",
      value: isLoading ? "..." : activeStudents,
      icon: <SchoolIcon />,
      color: "#4caf50",
      progress: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0,
      trend: "up",
    },
    {
      title: "Inactive Students",
      value: isLoading ? "..." : inactiveStudents,
      icon: <BookIcon />,
      color: "#ff9800",
      progress: totalStudents > 0 ? Math.round((inactiveStudents / totalStudents) * 100) : 0,
      trend: "down",
    },
    {
      title: "Graduated",
      value: isLoading ? "..." : graduatedStudents,
      icon: <TrendingUpIcon />,
      color: "#9c27b0",
      progress: totalStudents > 0 ? Math.round((graduatedStudents / totalStudents) * 100) : 0,
      trend: "up",
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading dashboard: {error?.message || "Unknown error"}
        </Alert>
      </Layout>
    );
  }

  const latestStudents = studentsData?.data?.slice(0, 5) || [];

  return (
    <>
      <Box>
        {/* Header with Actions */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          mb: 4 
        }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome to School Management System
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddStudent}
            >
              Add Student
            </Button>
          </Stack>
        </Box>

        {/* Stats Cards using QuickStatsCard */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <QuickStatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                progress={stat.progress}
                trend={stat.trend}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <StudentStatusChart data={chartData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <EnrollmentTrendChart />
          </Grid>
        </Grid>

        {/* Rest of your dashboard code... */}
        <Grid container spacing={3}>
          {/* Recent Students Table */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                mb: 3 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Students ({latestStudents.length})
                </Typography>
                <Button
                  variant="text"
                  endIcon={<DownloadIcon />}
                  onClick={() => navigate("/students")}
                >
                  View All
                </Button>
              </Box>
              
              {/* ... Table code remains same ... */}
            </Paper>
          </Grid>

          {/* Quick Actions & System Status */}
          <Grid item xs={12} lg={4}>
            {/* ... Quick actions code remains same ... */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Dashboard;