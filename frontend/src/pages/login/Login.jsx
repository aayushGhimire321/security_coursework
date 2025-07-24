

import {
  Email as EmailIcon,
  LocalMovies as LocalMoviesIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  WavingHand as WavingHandIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';

import { Link } from 'react-router-dom';
import {
  forgotPasswordApi,
  loginUserApi,
  resetPasswordApi,
  verifyLoginOtpApi,
  verifyRegisterOtpApi,
} from '../../apis/Api';
import VerificationModal from '../../components/VerificationModel';

const PasswordStrengthIndicator = ({ password }) => {
  const theme = useTheme();
  const result = useMemo(() => zxcvbn(password), [password]);

  const strengthColor = useMemo(() => {
    switch (result.score) {
      case 0:
        return '#ff4436';
      case 1:
        return '#ffa000';
      case 2:
        return '#ffd600';
      case 3:
        return '#52c41a';
      case 4:
        return '#00c853';
      default:
        return '#e0e0e0';
    }
  }, [result.score]);

  const strengthText = useMemo(() => {
    switch (result.score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  }, [result.score]);

  return (
    <>
      <Box sx={{ width: '100%', mb: 1 }}>
        <Box
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.grey[300], 0.3),
            overflow: 'hidden',
          }}>
          <Box
            sx={{
              height: '100%',
              width: `${((result.score + 1) / 5) * 100}%`,
              backgroundColor: strengthColor,
              transition: 'all 0.3s ease',
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography
          variant='caption'
          sx={{ color: strengthColor }}>
          {strengthText}
        </Typography>
        {result.feedback.warning && (
          <Typography
            variant='caption'
            color='text.secondary'>
            {result.feedback.warning}
          </Typography>
        )}
      </Box>
    </>
  );
};

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSentOtp, setIsSentOtp] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [openRegisterVerificationModal, setOpenRegisterVerificationModal] =
    useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleVerification = (otpString) => {
    // console.log(otpString);
    verifyLoginOtpApi({ email, otp: otpString })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/homepage';
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Verification failed');
      });
  };

  const handleRegisterVerification = (otpString) => {
    // console.log(otpString);
    verifyRegisterOtpApi({ email, otp: otpString })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/homepage';
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Verification failed');
      });
  };

  const validate = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (resetPassword !== confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    }

    // Check password strength before allowing reset
    const strength = zxcvbn(resetPassword);
    if (strength.score < 2) {
      toast.warning('Please choose a stronger password');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordApi({
        email: resetEmail,
        otp,
        password: resetPassword,
      });
      toast.success('Password reset successfully');
      setResetEmail('');
      setOtp('');
      setResetPassword('');
      setConfirmPassword('');
      setIsSentOtp(false);
      setShowForgotPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const sentOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.warning('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPasswordApi({ email: resetEmail });
      toast.success(res.data.message);
      setIsSentOtp(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP send failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Check if CAPTCHA is completed
    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending login request with CAPTCHA token:', captchaToken);
      loginUserApi({ email, password, captchaToken })
        .then((res) => {
          if (res.data.registerOtpRequired) {
            setOpenRegisterVerificationModal(true);
          } else if (res.data.otpRequired) {
            setOpenVerificationModal(true);
          } else {
            toast.success(res.data.message);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/homepage';
          }
        })
        .catch((err) => {
          console.log('Login error:', err.response);
          if (err.response?.data?.message?.includes('captcha') || err.response?.data?.message?.includes('CAPTCHA')) {
            toast.error('CAPTCHA verification failed. Please try again.');
            // Reset CAPTCHA
            setCaptchaToken(null);
            // Force CAPTCHA to reset
            window.grecaptcha?.reset();
          } else {
            toast.error(err.response?.data?.message || 'Login failed');
          }
        });
    } catch (err) {
      console.log('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const textFieldProps = {
    fullWidth: true,
    variant: 'outlined',
    sx: {
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderWidth: '2px',
        },
      },
      '& .MuiInputLabel-root': {
        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },
      },
    },
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      sx={{
        mt: 10,
      }}>
      <Fade
        in
        timeout={800}>
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Card
            elevation={6}
            sx={{
              width: '100%',
              background: `linear-gradient(145deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  mb: 4,
                }}>
                <LocalMoviesIcon
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }}
                />
                <WavingHandIcon
                  sx={{
                    fontSize: 28,
                    color: theme.palette.primary.main,
                    animation: 'wave 1.5s infinite',
                    '@keyframes wave': {
                      '0%': { transform: 'rotate(-10deg)' },
                      '50%': { transform: 'rotate(20deg)' },
                      '100%': { transform: 'rotate(-10deg)' },
                    },
                  }}
                />
              </Box>

              <Typography
                component='h1'
                variant='h4'
                align='center'
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1,
                }}>
                Welcome Back!
              </Typography>

              <Typography
                variant='body1'
                color='text.secondary'
                align='center'
                sx={{ mb: 4 }}>
                Your ticket to cinematic adventures awaits
              </Typography>

              <Box
                component='form'
                onSubmit={handleSubmit}
                noValidate>
                <TextField
                  {...textFieldProps}
                  margin='normal'
                  required
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <EmailIcon color={emailError ? 'error' : 'primary'} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  {...textFieldProps}
                  margin='normal'
                  required
                  name='password'
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockIcon color={passwordError ? 'error' : 'primary'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={() => setShowPassword(!showPassword)}
                          edge='end'
                          size='large'>
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Apply recaptcha */}
                <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ReCAPTCHA
                    sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                    onChange={(token) => {
                      console.log('CAPTCHA Token received:', token ? 'Valid token' : 'No token');
                      setCaptchaToken(token);
                    }}
                    onExpired={() => {
                      console.log('CAPTCHA Expired');
                      setCaptchaToken(null);
                      toast.warning('CAPTCHA expired. Please complete it again.');
                    }}
                    onError={() => {
                      console.log('CAPTCHA Error occurred');
                      setCaptchaToken(null);
                      toast.error('CAPTCHA error. Please refresh and try again.');
                    }}
                  />
                  {!captchaToken && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ mt: 1, textAlign: 'center' }}
                    >
                      Please complete the CAPTCHA verification above
                    </Typography>
                  )}
                  {captchaToken && (
                    <Typography 
                      variant="caption" 
                      color="success.main" 
                      sx={{ mt: 1, textAlign: 'center', display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      ✓ CAPTCHA verified successfully
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    onClick={() => setShowForgotPasswordModal(true)}
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        background: 'transparent',
                        color: theme.palette.primary.main,
                      },
                    }}>
                    Forgot Password?
                  </Button>
                </Box>

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={isLoading || !captchaToken}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.grey[300],
                      color: theme.palette.grey[500],
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}>
                  {isLoading ? 'Logging in...' : !captchaToken ? 'Complete CAPTCHA to Login' : 'Login'}
                </Button>

                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.background.default,
                  }}>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    display='inline'>
                    Don't have an account?{' '}
                  </Typography>
                  <Link
                    to='/register'
                    style={{ color: theme.palette.primary.main }}>
                    Create an account
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>

      <VerificationModal
        open={openRegisterVerificationModal}
        onClose={() => setOpenRegisterVerificationModal(false)}
        isRegistration={true}
        onVerify={handleRegisterVerification}
        email={email}
      />

      <VerificationModal
        open={openVerificationModal}
        onClose={() => setOpenVerificationModal(false)}
        isRegistration={false}
        onVerify={handleVerification}
        email={email}
      />

      <Dialog
        open={showForgotPasswordModal}
        onClose={() => {
          if (!isLoading) {
            setShowForgotPasswordModal(false);
            setIsSentOtp(false);
            setResetEmail('');
            setOtp('');
            setResetPassword('');
            setConfirmPassword('');
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
          },
        }}>
        <DialogTitle
          sx={{
            pb: 1,
            textAlign: 'center',
            fontWeight: 600,
          }}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <Box
            component='form'
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              {...textFieldProps}
              margin='normal'
              required
              fullWidth
              id='phone'
              label='Reset Email'
              name='resetEmail'
              autoComplete='tel'
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={isSentOtp}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailIcon color={isSentOtp ? 'disabled' : 'primary'} />
                  </InputAdornment>
                ),
              }}
            />

            {!isSentOtp ? (
              <Button
                fullWidth
                variant='contained'
                onClick={sentOtp}
                disabled={isLoading}
                sx={{
                  mt: 3,
                  py: 1.2,
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 600,
                }}>
                {isLoading ? 'Sending OTP...' : 'Get OTP'}
              </Button>
            ) : (
              <>
                <TextField
                  {...textFieldProps}
                  margin='normal'
                  required
                  fullWidth
                  id='otp'
                  label='OTP'
                  name='otp'
                  type='number'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                      {
                        '-webkit-appearance': 'none',
                        margin: 0,
                      },
                    '& input[type=number]': {
                      '-moz-appearance': 'textfield',
                    },
                  }}
                />

                <TextField
                  {...textFieldProps}
                  margin='normal'
                  required
                  fullWidth
                  name='newPassword'
                  label='New Password'
                  type='password'
                  id='newPassword'
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockIcon color='primary' />
                      </InputAdornment>
                    ),
                  }}
                />

                {resetPassword && (
                  <Box sx={{ mt: 1 }}>
                    <PasswordStrengthIndicator password={resetPassword} />
                  </Box>
                )}

                <TextField
                  {...textFieldProps}
                  margin='normal'
                  required
                  fullWidth
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockIcon color='primary' />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              if (!isLoading) {
                setShowForgotPasswordModal(false);
                setIsSentOtp(false);
                setResetEmail('');
                setOtp('');
                setResetPassword('');
                setConfirmPassword('');
              }
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 100,
            }}>
            Cancel
          </Button>
          {isSentOtp && (
            <Button
              onClick={handleReset}
              variant='contained'
              disabled={isLoading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 100,
              }}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
