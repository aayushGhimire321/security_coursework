import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';

const VerificationModal = ({ 
  open, 
  onClose, 
  isRegistration = false,
  onVerify,
  email 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onVerify(otpString);
      onClose();
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          {isRegistration ? 'Complete Registration' : 'Verify Login'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography color="text.secondary">
            Enter the 6-digit code sent to
          </Typography>
          <Typography fontWeight="medium">
            {email}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            justifyContent: 'center',
            mb: 3
          }}
        >
          {otp.map((digit, index) => (
            <TextField
              key={index}
              name={`otp-${index}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              inputProps={{
                maxLength: 1,
                sx: { 
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  padding: '12px',
                  width: '48px'
                }
              }}
              autoComplete="off"
            />
          ))}
        </Box>

        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center"
        >
          Didn't receive the code?{' '}
          <Button 
            color="primary" 
            sx={{ textTransform: 'none' }}
            onClick={() => {/* Implement resend logic */}}
          >
            Resend
          </Button>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ 
            minWidth: 200,
            height: 48
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Verify'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationModal;