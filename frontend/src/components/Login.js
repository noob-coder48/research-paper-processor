import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Grid } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        history.push('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', width: '100%', display: 'flex' }}>
      <Grid container sx={{ minHeight: '100vh', width: '100%', flexWrap: 'nowrap' }} spacing={0}>
        {/* Left: Login Form (2/3 width) */}
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fff',
            minHeight: '100vh',
            p: 0,
            width: '66.666667%', // Explicitly set 2/3 width
          }}
        >
          <Box sx={{ 
            width: '100%', 
            maxWidth: 500, 
            mx: 'auto', 
            p: 4, 
            boxShadow: 3, 
            borderRadius: 4,
            bgcolor: '#fff'
          }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
              Login to Your Account
            </Typography>
            <Typography align="center" sx={{ color: '#666', mb: 3 }}>
              Enter your credentials
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, py: 1.5, fontWeight: 'bold', fontSize: 16 }}
              >
                Sign In
              </Button>
            </form>
          </Box>
        </Grid>

        {/* Right: Signup Prompt (1/3 width) */}
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          xl={4}
          sx={{
            background: 'linear-gradient(135deg, #3ec6e0 0%, #6e8efb 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 0,
            width: '33.333333%', // Explicitly set 1/3 width
          }}
        >
          <Box sx={{ textAlign: 'center', px: 4, width: '100%', maxWidth: 300 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              New Here?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: 16, lineHeight: 1.6 }}>
              Sign up to upload research papers, extract metadata and summaries, and manage your collection with ease!
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#fff',
                color: '#3ec6e0',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 8,
                fontSize: 16,
                boxShadow: 2,
                '&:hover': { 
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
              onClick={() => history.push('/signup')}
            >
              Sign Up
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;