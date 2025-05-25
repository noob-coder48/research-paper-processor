import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';

const Home = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
    <Paper elevation={6} sx={{ p: 5, maxWidth: 500, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Research Paper Processor
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Upload research paper PDFs, extract important information, and export the data.
      </Typography>
      <Stack spacing={2} direction="column">
        <Button component={Link} to="/signup" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        <Button component={Link} to="/login" variant="outlined" color="primary" fullWidth>
          Login
        </Button>
        <Button component={Link} to="/upload" variant="contained" color="secondary" fullWidth>
          Upload PDF
        </Button>
        <Button component={Link} to="/dashboard" variant="outlined" color="secondary" fullWidth>
          View Dashboard
        </Button>
      </Stack>
    </Paper>
  </Box>
);

export default Home;