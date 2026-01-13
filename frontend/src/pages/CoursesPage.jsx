import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';

const CoursesPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courses Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Course management page - Coming Soon
        </Typography>
      </Box>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          This feature is under development
        </Typography>
      </Paper>
    </Container>
  );
};

export default CoursesPage;