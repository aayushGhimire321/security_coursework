import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Button,
} from '@mui/material';
import { MovieFilter, Theaters, TrendingUp } from '@mui/icons-material';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMovieCount, getSingleProfileApi, pagination } from '../../apis/Api';
import MovieCard from '../../components/MovieCard';
import './Homepage.css';

const carouselImages = [
  {
    url: 'https://images.squarespace-cdn.com/content/v1/567064569cadb63cb308ddb1/1450208617048-6Z99SCNCDPDOLOVN6RO4/mad-max-fury-road-movie-posters.jpg',
    label: 'Mad Max',
  },
  {
    url: 'https://i.ebayimg.com/images/g/GtEAAOSw1W9eN1cY/s-l1600.jpg',
    label: 'Movie 2',
  },
  {
    url: 'https://thedullwoodexperiment.com/wp-content/uploads/2017/05/265-poster_umir-krvi.jpg',
    label: 'Movie 3',
  },
];

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const [user, setUser] = useState(null);
  const maxSteps = carouselImages.length;

  const limit = isMobile ? 2 : 3;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setShowError(false);

      console.log('Fetching movie count...');
      console.log('API Base URL:', process.env.REACT_APP_API_URL || 'https://localhost:5000');
      
      const countRes = await getMovieCount();
      console.log('Movie count response:', countRes);

      if (!countRes?.data?.movieCount && countRes?.data?.movieCount !== 0) {
        throw new Error('Invalid movie count response: ' + JSON.stringify(countRes?.data));
      }

      const count = countRes.data.movieCount;
      console.log('Total movie count:', count);
      setTotalPages(Math.ceil(count / limit));

      if (count === 0) {
        console.log('No movies found in database');
        setMovies([]);
        setError('No movies found. Please add some movies to the database.');
        setShowError(true);
        return;
      }

      console.log('Fetching movies with pagination...');
      console.log('Page:', page, 'Limit:', limit);
      
      const moviesRes = await pagination(page, limit);
      console.log('Movies response:', moviesRes);

      if (!Array.isArray(moviesRes?.data?.movies)) {
        throw new Error('Invalid movies response: expected array but got ' + typeof moviesRes?.data?.movies);
      }

      setMovies(moviesRes.data.movies);
      console.log('Successfully fetched', moviesRes.data.movies.length, 'movies');
    } catch (err) {
      console.error('Error fetching data:', err);
      
      let errorMessage = 'An error occurred while fetching data';
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to the server. Please check if the backend is running on https://localhost:5000';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server configuration.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  useEffect(() => {
    // Fetch user profile (optional, don't block main content)
    getSingleProfileApi()
      .then((response) => {
        console.log('User profile fetched successfully');
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log('Failed to fetch user profile (this is optional):', error);
        // Don't show error for profile fetch failure as it's optional
      });

    // Fetch main content
    fetchData();
  }, [fetchData]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      // console.log('Searching for:', term);
    }, 500),
    []
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep === maxSteps - 1 ? 0 : prevStep + 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep === 0 ? maxSteps - 1 : prevStep - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [maxSteps]);

  const handleCloseError = () => {
    setShowError(false);
  };

  if (error && !loading) {
    return (
      <Container sx={{ mt: 10, mb: 4 }}>
        <Alert
          severity='error'
          sx={{ 
            mt: 5,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (user?.isAdmin) {
    return (
      <Navigate
        to='/admin/dashboard'
        replace={true}
      />
    );
  }

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
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to FilmSathi
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Discover amazing movies and book your tickets with ease
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Theaters />}
                label={`${movies.length} Movies Available`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <Chip
                icon={<TrendingUp />}
                label="Now Showing"
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

      {/* Movies Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Section Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MovieFilter sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
              Now Showing
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Book your favorite movies and enjoy the cinematic experience
          </Typography>
        </Box>

        {/* Movies Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(limit)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: 400 }}>
                  <Skeleton variant="rectangular" height={250} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : movies.length === 0 ? (
          <Card
            sx={{
              p: 6,
              textAlign: 'center',
              background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <MovieFilter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.primary" fontWeight="600">
              No Movies Available
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              There are currently no movies to display. Please check back later or contact the administrator.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ borderRadius: 2 }}
            >
              Refresh Page
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} key={movie.id}>
                <MovieCard movieInformation={movie} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Snackbar for errors */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Homepage;