import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, LinearProgress, Stepper, Step, StepLabel } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const steps = [
  'Upload your PDF',
  'Conducting OCR',
  'Extracting Text',
  'Processing Complete'
];

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const history = useHistory();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
    setError('');
    setActiveStep(0);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file to upload.');
      setMessage('');
      return;
    }

    setUploading(true);
    setActiveStep(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setActiveStep(1); // Conducting OCR
      await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate OCR

      setActiveStep(2); // Extracting Text
      await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate text extraction

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      setActiveStep(3); // Processing Complete
      setMessage('File uploaded successfully: ' + response.data.message);
      setError('');
      setTimeout(() => {
        history.push('/dashboard');
      }, 1200);
    } catch (error) {
      setError('Error uploading file: ' + (error.response?.data?.message || 'Unknown error'));
      setMessage('');
      setUploading(false);
      setActiveStep(0);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh" // Ensures the box takes up most of the viewport height
      sx={{ p: 2 }} // Adds some padding around the central paper
    >
      <Paper
        elevation={5} // A moderate shadow for a clean look
        sx={{
          p: { xs: 3, sm: 4, md: 6 }, // Responsive padding
          width: '100%', // Takes full width of its container
          maxWidth: 750, // Limits maximum width for larger screens
          minHeight: 450, // Ensures a decent minimum height
          borderRadius: 3, // Softer rounded corners
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around', // Spreads content vertically
          gap: 3, // Adds space between direct children
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
          Upload Research Paper PDF
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Select a PDF file of your research paper to extract metadata and summaries.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens, row on larger
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Button
            variant="outlined"
            component="label"
            sx={{ 
              fontWeight: 'bold', 
              fontSize: 16, 
              px: 3, 
              py: 1.5, 
              borderRadius: 2,
              minWidth: 150, // Ensure button has a decent width
            }}
            disabled={uploading}
          >
            Choose File
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
              disabled={uploading}
            />
          </Button>
          <Typography variant="body2" sx={{ color: file ? 'text.primary' : 'text.disabled', textAlign: 'center' }}>
            {file ? file.name : 'No file chosen'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading} // Disable if no file or uploading
          sx={{ 
            py: 1.5, 
            fontSize: 18, 
            borderRadius: 2, 
            width: '100%', 
            maxWidth: { xs: '100%', sm: 350 }, // Responsive max width
            alignSelf: 'center' 
          }}
        >
          {uploading ? 'Uploading...' : 'Upload & Process'}
        </Button>

        {(uploading || activeStep > 0 || message || error) && ( // Only show stepper and alerts if there's something to show
          <Box sx={{ width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {uploading && <LinearProgress sx={{ width: '100%', mb: 2, borderRadius: 1 }} />}
            {message && <Alert severity="success" sx={{ fontSize: 16, width: '100%', borderRadius: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mt: message ? 1 : 0, fontSize: 16, width: '100%', borderRadius: 2 }}>{error}</Alert>}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UploadPDF;