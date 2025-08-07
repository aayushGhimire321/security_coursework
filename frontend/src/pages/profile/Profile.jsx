/* eslint-disable no-unused-vars */
import { PhotoCamera } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deleteUserApi,
  getSingleProfileApi,
  updateProfileApi,
  uploadProfilePictureApi,
} from '../../apis/Api';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    avatar: null,
    rememberDevice: false,
    address: '',
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('👤 Loading user profile...');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No authentication token found');
      setError('Please log in to view your profile');
      setLoading(false);
      navigate('/login');
      return;
    }

    getSingleProfileApi()
      .then((res) => {
        console.log('✅ Profile API Response:', res.data);
        const userData = res.data.user;
        
        if (!userData) {
          throw new Error('No user data received');
        }
        
        setFormData((prev) => ({
          ...prev,
          ...userData,
        }));
        setUser(userData);
        setLoading(false);
        console.log('✅ Profile loaded successfully:', userData.username);
      })
      .catch((error) => {
        console.error('❌ Profile loading error:', error);
        console.error('Full error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(error.response?.data?.message || error.message || 'Failed to load profile');
        }
        toast.error('Failed to load profile');
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value, {
      // Remove the input if not text, number, or space
      ALLOWED_TAGS: [],
    });

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizedValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // check the mime type
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        toast.warning('Please upload a JPEG or PNG image');
        return;
      }
      // Check the extension
      if (
        file.name.split('.').pop() !== 'jpg' &&
        file.name.split('.').pop() !== 'png'
      ) {
        toast.warning('Please upload a JPEG or PNG image');
        return;
      }
      const form = new FormData();
      form.append('avatar', file);
      uploadProfilePictureApi(form)
        .then((res) => {
          if (res.status === 200) {
            setFormData((prev) => ({
              ...prev,
              avatar: res.data.avatar,
            }));
          }
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Image upload failed');
        });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfileApi(formData);
      if (response.status === 200) {
        toast.success('Profile updated successfully');
        if (formData.rememberDevice) {
          localStorage.setItem(
            'rememberedDevice',
            JSON.stringify({
              deviceId: navigator.userAgent,
              timestamp: new Date().getTime(),
            })
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            gap: 2
          }}>
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">
            Loading your profile...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we fetch your information
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Loading Error
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Please try refreshing the page or log in again.
          </Typography>
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mr: 2 }}
          >
            Refresh Page
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/login')}
          >
            Login Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth='md'
      sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 3,
            textAlign: 'center',
          }}>
          <Avatar
            src={
              formData.avatar
                ? `https://localhost:5000/avatar/${formData.avatar}`
                : null
            }
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />
          <input
            accept='image/*'
            id='avatar-upload'
            type='file'
            hidden
            onChange={handleImageChange}
          />
          <label htmlFor='avatar-upload'>
            <IconButton
              component='span'
              sx={{ color: 'white' }}>
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography
            variant='h4'
            component='h1'>
            {formData.username || 'Your Profile'}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box
            component='form'
            onSubmit={handleUpdate}>
            <Grid
              container
              spacing={3}>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  fullWidth
                  name='username'
                  label='Username'
                  value={formData.username}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  fullWidth
                  name='phoneNumber'
                  label='Phone Number'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <TextField
                  fullWidth
                  name='email'
                  label='Email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>

              <Grid
                item
                xs={12}>
                <TextField
                  fullWidth
                  name='address'
                  label='address'
                  value={formData.address}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>

              <Grid
                item
                xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name='rememberDevice'
                      checked={formData.rememberDevice}
                      onChange={handleChange}
                      color='primary'
                    />
                  }
                  label='Remember this device'
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                textAlign: 'center',
                gap: 4,
                justifyContent: 'center',
                display: 'flex',
              }}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}>
                Save Changes
              </Button>

              <Button
                type='button'
                variant='contained'
                color='error'
                size='large'
                onClick={() => {
                  deleteUserApi()
                    .then((res) => {
                      if (res.status === 200) {
                        toast.success('User deleted successfully');
                        localStorage.removeItem('rememberedDevice');
                        navigate('/login', { replace: true });
                      }
                    })
                    .catch((error) => {
                      toast.error(
                        error.response?.data?.message || 'Delete failed'
                      );
                    });
                }}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}>
                Delete
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default Profile;
