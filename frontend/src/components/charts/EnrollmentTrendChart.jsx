import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function EnrollmentTrendChart() {
  // Mock data - in real app, fetch from API
  const data = [
    { month: 'Jan', students: 65 },
    { month: 'Feb', students: 78 },
    { month: 'Mar', students: 92 },
    { month: 'Apr', students: 88 },
    { month: 'May', students: 95 },
    { month: 'Jun', students: 102 },
    { month: 'Jul', students: 110 },
    { month: 'Aug', students: 98 },
    { month: 'Sep', students: 120 },
    { month: 'Oct', students: 135 },
    { month: 'Nov', students: 142 },
    { month: 'Dec', students: 150 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Enrollment Trend
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#1976d2"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EnrollmentTrendChart;