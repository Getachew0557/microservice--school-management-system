import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function ThemeToggle({ toggleTheme }) {
  const theme = useTheme();
  
  return (
    <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          ml: 1,
          p: 1,
          borderRadius: 2,
          bgcolor: 'action.selected',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;