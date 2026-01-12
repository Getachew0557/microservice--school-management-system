import React from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

function TestComponent() {
  return (
    <div>
      <Alert severity="success">Environment setup successful!</Alert>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </div>
  )
}

export default TestComponent