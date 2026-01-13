import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Book as BookIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useStudents } from "../hooks/useStudents";

function Dashboard() {
  const { data, isLoading } = useStudents({ page: 1, limit: 1 });
  const totalStudents = data?.pagination?.total ?? 0;

  const stats = [
    {
      title: "Total Students",
      value: isLoading ? "Loading..." : totalStudents,
      icon: <PeopleIcon />,
      color: "#1976d2",
    },
    {
      title: "Total Teachers",
      value: "45",
      icon: <SchoolIcon />,
      color: "#dc004e",
    },
    {
      title: "Active Courses",
      value: "32",
      icon: <BookIcon />,
      color: "#388e3c",
    },
    {
      title: "Attendance Rate",
      value: "94%",
      icon: <TrendingUpIcon />,
      color: "#f57c00",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Typography color="textSecondary">No recent activities</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <Typography color="textSecondary">No upcoming events</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
