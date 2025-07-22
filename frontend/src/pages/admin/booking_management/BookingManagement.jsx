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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllBookingsApi()
      .then((res) => {
        setBookings(res.data?.bookings || []);
        setLoading(false);
      })
      .catch((error) => {
        // console.log(error);
        toast.error('Failed to fetch bookings. Please try again later.');
        setLoading(false);
      });
  }, []);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.show?.movieId?.movieName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
