import {
  AccessTime,
  CalendarMonth,
  Close as CloseIcon,
  ConfirmationNumber,
  Weekend,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  buyTicketsApi,
  getSeatsByShowIdApi,
  getShowByMovieIdApi,
  getSingleMovieApi,
  initializeKhaltiApi,
  makeSeatUnavailableApi,
} from '../../../apis/Api';

import {
  AccessTime,
  CalendarMonth,
  Close as CloseIcon,
  ConfirmationNumber,
  Weekend,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  buyTicketsApi,
  getSeatsByShowIdApi,
  getShowByMovieIdApi,
  getSingleMovieApi,
  initializeKhaltiApi,
  makeSeatUnavailableApi,
} from '../../../apis/Api';

const BuyTickets = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovieDetails = useCallback(async () => {
    try {
      console.log('🎬 Fetching movie details for ID:', id);
      const res = await getSingleMovieApi(id);
      console.log('✅ Movie details:', res.data);
      setMovie(res.data.movie);
    } catch (error) {
      console.error('❌ Failed to fetch movie details:', error);
      setError('Failed to load movie details');
    }
  }, [id]);

  const fetchShows = useCallback(async () => {
    try {
      console.log('🎭 Fetching shows for movie ID:', id);
      const res = await getShowByMovieIdApi(id);
      console.log('✅ Shows data:', res.data);
      setShows(res.data.shows || []);
    } catch (error) {
      console.error('❌ Failed to fetch show details:', error);
      setError('Failed to load show times');
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchMovieDetails(),
          fetchShows()
        ]);
      } catch (err) {
        console.error('❌ Error loading page data:', err);
        setError('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    } else {
      setError('No movie ID provided');
      setLoading(false);
    }
  }, [id, fetchMovieDetails, fetchShows]);

  const handleSelectShow = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
  };

  const handleOpenModal = async () => {
    if (!selectedShow) {
      console.error('Please select a show');
      return;
    }
    try {
      const res = await getSeatsByShowIdApi(selectedShow._id);
      setSeats(res.data.seats);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch seats');
    }
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleProceedToPayment = async () => {
    console.log('🎫 Starting ticket purchase process...');
    
    // Validation checks with detailed logging
    if (!selectedShow) {
      console.error('❌ No show selected');
      setError('Please select a show first');
      return;
    }
    
    if (!selectedSeats.length) {
      console.error('❌ No seats selected');
      setError('Please select at least one seat');
      return;
    }

    console.log('✅ Validation passed:', {
      show: selectedShow._id,
      seats: selectedSeats.length,
      seatNumbers: selectedSeats.map(s => s.seatNo)
    });

    const totalAmount = selectedShow.showPrice * selectedSeats.length;
    const data = {
      show: selectedShow._id,
      seats: selectedSeats,
      price: totalAmount,
    };

    console.log('💰 Booking data:', data);

    try {
      setLoading(true);
      console.log('📡 Calling buyTicketsApi...');
      
      const bookingRes = await buyTicketsApi(data);
      console.log('✅ Booking created:', bookingRes.data);
      
      const khaltiConfig = {
        itemId: bookingRes.data.id,
        totalPrice: parseInt(totalAmount * 100),
        website_url: window.location.origin, // Use current protocol and origin dynamically
      };

      console.log('💳 Initializing Khalti payment...', khaltiConfig);
      const khaltiRes = await initializeKhaltiApi(khaltiConfig);
      console.log('✅ Khalti response:', khaltiRes.data);
      
      // Mark seats as unavailable
      console.log('🪑 Making seats unavailable...');
      await makeSeatUnavailableApi(data);
      console.log('✅ Seats marked unavailable');

      // Redirect to payment
      console.log('🔄 Redirecting to payment:', khaltiRes.data.payment_url);
      window.location.href = khaltiRes.data.payment_url;

    } catch (error) {
      console.error('❌ Payment failed:', error);
      
      if (error.response) {
        console.error('Server response:', error.response.data);
        setError(`Payment failed: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        console.error('Network error:', error.request);
        setError('Network error: Unable to connect to server. Please check if the backend is running.');
      } else {
        console.error('Error:', error.message);
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSeats = () => (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1 }}>
      {seats.map((seat) => (
        <IconButton
          key={seat._id}
          onClick={() => handleSeatSelection(seat)}
          disabled={!seat.available}
          sx={{
            color: !seat.available
              ? 'grey.400'
              : selectedSeats.includes(seat)
              ? 'primary.main'
              : 'grey.700',
          }}>
          <Weekend />
          <Typography variant='caption'>{seat.seatNo}</Typography>
        </IconButton>
      ))}
    </Box>
  );

  const groupedShows = shows.reduce((acc, show) => {
    const { showDate } = show;
    if (!acc[showDate]) acc[showDate] = [];
    acc[showDate].push(show);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 5, pt: 8 }}>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8 }}>
          <CircularProgress size={50} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading movie details...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Movie ID: {id}
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Movie
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Movie ID: {id}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check if the movie exists and try again.
          </Typography>
        </Alert>
      ) : !movie.movieName ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Movie Not Found
          </Typography>
          <Typography variant="body2">
            The movie with ID "{id}" could not be found.
          </Typography>
        </Alert>
      ) : (
        <>
          <Grid
            container
            spacing={4}>
            <Grid
              item
              xs={12}
              md={4}>
              <Card>
                <CardMedia
                  component='img'
                  image={`${window.location.protocol}//${window.location.hostname}:5000/movies/${movie.moviePosterImage}`}
                  alt={movie.movieName}
                  onError={(e) => {
                    console.error('❌ Failed to load movie poster');
                    e.target.style.display = 'none';
                  }}
                />
                <CardContent>
                  <Typography
                    variant='h5'
                    gutterBottom>
                    {movie.movieName}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={movie.movieGenre}
                      color='info'
                      sx={{ mr: 1 }}
                    />
                <Chip
                  label={movie.movieRated}
                  color='warning'
                />
              </Box>
              <Typography>{movie.movieDetails}</Typography>
              <Typography>Duration: {movie.movieDuration}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          md={8}>
          <Typography
            variant='h4'
            gutterBottom>
            Available Shows
          </Typography>

          {Object.entries(groupedShows).map(([date, dateShows]) => (
            <Box
              key={date}
              sx={{ mb: 4 }}>
              <Typography
                variant='h6'
                sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarMonth sx={{ mr: 1 }} />
                {format(new Date(date), 'MMMM dd, yyyy')}
              </Typography>

              <Grid
                container
                spacing={2}>
                {dateShows.map((show) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={show._id}>
                    <Card
                      onClick={() => handleSelectShow(show)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor:
                          selectedShow?._id === show._id
                            ? 'primary.light'
                            : 'background.paper',
                      }}>
                      <CardContent>
                        <Typography
                          sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ mr: 1 }} /> {show.showTime}
                        </Typography>
                        <Typography
                          sx={{ display: 'flex', alignItems: 'center' }}>
                          <ConfirmationNumber sx={{ mr: 1 }} /> Rs.
                          {show.showPrice}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Button
            variant='contained'
            size='large'
            onClick={handleOpenModal}
            sx={{ mt: 4 }}>
            Select Seats
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth='md'
        fullWidth>
        <DialogTitle>
          Select Your Seats
          <IconButton
            onClick={() => setShowModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: '100%',
              height: 8,
              bgcolor: 'grey.300',
              borderRadius: 1,
              mb: 4,
              mt: 2,
            }}>
            <Typography
              align='center'
              variant='caption'>
              Screen
            </Typography>
          </Box>
          {renderSeats()}
          <Box
            sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Weekend sx={{ color: 'grey.700' }} />
              <Typography
                variant='caption'
                sx={{ ml: 1 }}>
                Available
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Weekend sx={{ color: 'primary.main' }} />
              <Typography
                variant='caption'
                sx={{ ml: 1 }}>
                Selected
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Weekend sx={{ color: 'grey.400' }} />
              <Typography
                variant='caption'
                sx={{ ml: 1 }}>
                Unavailable
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Close</Button>
          <Button
            onClick={() => {
              if (selectedSeats.length) {
                setShowConfirmationModal(true);
                setShowModal(false);
              }
            }}
            variant='contained'>
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Movie:</strong> {movie.movieName}
          </Typography>
          <Typography>
            <strong>Show Date:</strong>{' '}
            {selectedShow
              ? format(new Date(selectedShow.showDate), 'MMMM dd, yyyy')
              : ''}
          </Typography>
          <Typography>
            <strong>Show Time:</strong> {selectedShow?.showTime}
          </Typography>
          <Typography>
            <strong>Seats:</strong>{' '}
            {selectedSeats.map((seat) => seat.seatNo).join(', ')}
          </Typography>
          <Typography>
            <strong>Total Price:</strong> Rs.{' '}
            {selectedShow ? selectedShow.showPrice * selectedSeats.length : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleProceedToPayment}
            variant='contained'>
            Pay with Khalti
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )}
    </Box>
  );
};

export default BuyTickets;
