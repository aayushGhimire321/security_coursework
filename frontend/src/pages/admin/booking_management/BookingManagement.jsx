import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllBookingsApi } from '../../../apis/Api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('📋 Loading booking management...');
    setLoading(true);
    setError(null);
    
    getAllBookingsApi()
      .then((res) => {
        console.log('✅ Bookings API Response:', res.data);
        const bookingsData = res.data?.bookings || [];
        console.log('📊 Number of bookings:', bookingsData.length);
        setBookings(bookingsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error loading bookings:', error);
        console.error('Full error:', error.response?.data || error.message);
        setError(error.response?.data?.message || error.message || 'Failed to fetch bookings');
        toast.error('Failed to fetch bookings. Please try again later.');
        setLoading(false);
      });
  }, []);

  const filteredBookings = bookings.filter(
    (booking) => {
      if (!booking) return false;
      
      const userName = booking.user?.username?.toLowerCase() || '';
      const movieName = booking.show?.movieId?.movieName?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return userName.includes(searchLower) || movieName.includes(searchLower);
    }
  );

  return (
    <Container
      maxWidth='lg'
      sx={{ py: 5, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Typography
        variant='h4'
        component='h1'
        align='center'
        gutterBottom>
        Booking Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Bookings
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}
      
      <Paper
        elevation={1}
        sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <TextField
            placeholder='Search by user or movie...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant='outlined'
            size='small'
            sx={{ width: '50%' }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Alert severity='info'>No Bookings Available</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Movie Name</TableCell>
                  <TableCell>Seats</TableCell>
                  <TableCell>Show Date</TableCell>
                  <TableCell>Show Time</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow
                    key={booking._id}
                    hover>
                    <TableCell>{booking.user?.username || 'N/A'}</TableCell>
                    <TableCell>
                      {booking.show?.movieId?.movieName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {booking.seats?.map((seat) => seat.seatNo).join(', ') ||
                        'N/A'}
                    </TableCell>
                    <TableCell>{booking.show?.showDate || 'N/A'}</TableCell>
                    <TableCell>{booking.show?.showTime || 'N/A'}</TableCell>
                    <TableCell>Rs.{booking.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default BookingManagement;
