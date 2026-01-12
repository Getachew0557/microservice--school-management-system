import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom>
          School Management System
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Welcome to the School Management System
        </Typography>
        <Typography variant="body1">
          This is a microservices-based school management system.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Get Started
        </Button>
      </Container>
    </ThemeProvider>
  )
}

export default App