import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  useTheme,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import {
  Email,
  LocationOn,
  Phone,
  Send,
  Facebook,
  Twitter,
  Instagram,
  ContactSupport,
} from '@mui/icons-material';
import dompurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { contactUsApi, getSingleProfileApi } from '../../apis/Api';
import './ContactUs.css';

const ContactUs = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const sanitizedValue = dompurify.sanitize(e.target.value);
    setFormData({ ...formData, [e.target.name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await contactUsApi(formData);
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error('Failed to send the message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    getSingleProfileApi()
      .then((res) => {
        // console.log('API response:', res.data);
        const { username, email } = res.data.user;
        setFormData({ ...formData, name: username, email });
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 6, md: 8 },
          mt: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<ContactSupport />}
                label="24/7 Support"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <Chip
                icon={<Send />}
                label="Quick Response"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 3,
                  }}
                >
                  Send us a Message
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={6}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        startIcon={<Send />}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          px: 4,
                          fontWeight: 'bold',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.divider}`,
                height: 'fit-content',
                background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 3,
                  }}
                >
                  Contact Information
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Paper
                      sx={{
                        p: 1.5,
                        mr: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                      }}
                    >
                      <LocationOn />
                    </Paper>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ghattekulo, Kathmandu-29
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Paper
                      sx={{
                        p: 1.5,
                        mr: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                      }}
                    >
                      <Phone />
                    </Paper>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Phone
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +977 9860099869
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Paper
                      sx={{
                        p: 1.5,
                        mr: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                      }}
                    >
                      <Email />
                    </Paper>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Email
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        aghimire491@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 2,
                  }}
                >
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    component="a"
                    href="https://www.facebook.com/aayush.ghimire.18/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: `linear-gradient(135deg, #3b5998 0%, #2d4373 100%)`,
                      color: 'white',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(59,89,152,0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://x.com/AayushG06895950"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: `linear-gradient(135deg, #1da1f2 0%, #0c85d0 100%)`,
                      color: 'white',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(29,161,242,0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://www.instagram.com/aayush4599/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: `linear-gradient(135deg, #e4405f 0%, #c13584 100%)`,
                      color: 'white',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(228,64,95,0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Instagram />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;
