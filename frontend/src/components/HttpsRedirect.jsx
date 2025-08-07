import React, { useEffect } from 'react';
import { Alert, Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HttpsRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we're on HTTPS
    if (window.location.protocol === 'https:') {
      // Redirect to HTTP version
      const httpUrl = window.location.href.replace('https://', 'http://');
      console.log('🔄 Redirecting from HTTPS to HTTP:', httpUrl);
      
      // Give user 3 seconds to see the message, then redirect
      setTimeout(() => {
        window.location.href = httpUrl;
      }, 3000);
    }
  }, []);

  const handleManualRedirect = () => {
    const httpUrl = window.location.href.replace('https://', 'http://');
    window.location.href = httpUrl;
  };

  const handleGoHome = () => {
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🚨 HTTPS Not Supported
        </Typography>
        <Typography variant="body1" gutterBottom>
          FilmSathi is configured for HTTP only in development mode.
        </Typography>
        <Typography variant="body2">
          Redirecting to HTTP version in 3 seconds...
        </Typography>
      </Alert>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          ❌ Current URL (Wrong):
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
          {window.location.href}
        </Typography>

        <Typography variant="h5" color="success.main" gutterBottom>
          ✅ Correct URL:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 4 }}>
          {window.location.href.replace('https://', 'http://')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleManualRedirect}
          >
            🎬 Continue to Movie Booking (HTTP)
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleGoHome}
          >
            🏠 Go to Homepage (HTTP)
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>💡 Why HTTP?</strong><br />
            Your local development server uses HTTP. Khalti payment integration, 
            movie images, and all APIs are configured for HTTP on localhost.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default HttpsRedirect;
