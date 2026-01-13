import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

function QuickStatsCard({ title, value, icon, color, progress, trend }) {
  return (
    <Card sx={{ 
      position: 'relative',
      overflow: 'visible',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: color,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: `${color}15`, 
            color: color,
            mr: 2,
            width: 48,
            height: 48,
          }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: trend === 'up' ? '#4caf50' : '#f44336'
          }}>
            {trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
              {progress}%
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1 
          }}>
            <Typography variant="caption" color="textSecondary">
              Progress
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {progress}%
            </Typography>
          </Box>
          <Box sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'action.selected',
            overflow: 'hidden',
          }}>
            <Box
              sx={{
                height: '100%',
                width: `${progress}%`,
                bgcolor: color,
                borderRadius: 3,
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default QuickStatsCard;