import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Movie,
  Star,
  Schedule,
  Support,
  LocalOffer,
  EventSeat,
  CheckCircle,
  Theaters,
} from '@mui/icons-material';
import './AboutUs.css';

const AboutUs = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Schedule />,
      title: 'Easy and Quick Booking',
      description: 'Book your tickets in just a few clicks with our streamlined process'
    },
    {
      icon: <Theaters />,
      title: 'Extensive Selection',
      description: 'Wide range of movies and theaters to choose from across the country'
    },
    {
      icon: <LocalOffer />,
      title: 'Exclusive Deals',
      description: 'Get access to special discounts and promotional offers'
    },
    {
      icon: <EventSeat />,
      title: 'Real-time Seat Selection',
      description: 'Choose your perfect seats with our interactive seating maps'
    },
    {
      icon: <Support />,
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance for all your movie booking needs'
    },
    {
      icon: <Star />,
      title: 'Premium Experience',
      description: 'Enjoy a world-class movie booking experience with FilmSathi'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
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
              About FilmSathi
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
              Your Premier Destination for Movie Tickets
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Paper
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  🎬 Since 2020
                </Typography>
              </Paper>
              <Paper
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  🌟 Trusted Platform
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Our Story Section */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              }}
            >
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Movie sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Our Story
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    flexGrow: 1,
                  }}
                >
                  Founded in 2020, FilmSathi has quickly become the go-to platform for movie enthusiasts across Nepal. 
                  We're passionate about bringing the magic of cinema right to your fingertips, making the process of 
                  booking movie tickets as enjoyable as watching the films themselves. Our journey began with a simple 
                  vision: to make movie booking accessible, convenient, and delightful for everyone.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              }}
            >
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Star sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Our Mission
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    flexGrow: 1,
                  }}
                >
                  At FilmSathi, we're on a mission to revolutionize the way you experience movies. We strive to provide 
                  a seamless, user-friendly platform that connects movie-goers with the latest blockbusters, indie gems, 
                  and timeless classics. Our goal is to eliminate the hassle from movie booking and focus on what matters 
                  most - your entertainment experience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: 'text.primary',
            }}
          >
            Why Choose FilmSathi?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              mb: 6,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover what makes us the preferred choice for movie enthusiasts
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        mx: 'auto',
                        mb: 3,
                        color: 'white',
                      }}
                    >
                      {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'text.primary',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Card
          sx={{
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Ready to Experience FilmSathi?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '500px',
                mx: 'auto',
              }}
            >
              Join millions of movie lovers and book your next cinema adventure with us!
            </Typography>
            <Button
              component={Link}
              to="/homepage"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                bgcolor: 'white',
                color: theme.palette.primary.main,
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Book Now
            </Button>
          </CardContent>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.1,
            }}
          />
        </Card>
      </Container>
    </Box>
  );
};

export default AboutUs;
