import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { getBookingsByUserApi } from '../../apis/Api';

const StyledTicketNumber = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  left: -15,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🎫 Fetching user tickets...');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    console.log('🔑 User token exists:', !!token);
    
    if (!token) {
      setError('Please log in to view your tickets');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    getBookingsByUserApi()
      .then((res) => {
        console.log('✅ Tickets API Response:', res.data);
        
        // Check if tickets exist in the response
        const ticketsData = res.data.tickets || res.data.bookings || [];
        console.log('📋 Tickets data:', ticketsData);
        console.log('📊 Number of tickets:', ticketsData.length);
        
        const sortedTickets = ticketsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTickets(sortedTickets);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error fetching tickets:', error);
        console.error('Full error:', error.response?.data || error.message);
        
        // More specific error messages
        if (error.response?.status === 401) {
          setError('Please log in to view your tickets');
          localStorage.removeItem('token'); // Clear invalid token
        } else if (error.response?.status === 404) {
          setError('No tickets found for your account');
        } else {
          setError(error.response?.data?.message || error.message || 'Failed to fetch tickets');
        }
        setLoading(false);
      });
  }, []);

  const groupTicketsByDate = (tickets) => {
    const groups = {};
    tickets.forEach((ticket) => {
      const date = new Date(ticket.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(ticket);
    });
    return groups;
  };

  const downloadTicket = (ticket, index) => {
    // Create a temporary container for the ticket
    const ticketElement = document.createElement('div');
    ticketElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 600px; border: 2px solid #ccc; margin: 20px auto;">
        <h2 style="color: #333;">${ticket.show.movieId.movieName}</h2>
        <div style="margin: 10px 0;">
          <p><strong>Date:</strong> ${new Date(
            ticket.show.showDate
          ).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${ticket.show.showTime}</p>
        </div>
        <div style="margin: 10px 0;">
          <h3>Seats:</h3>
          ${ticket.seats
            .map((seat) => `<p>Seat Number: ${seat.seatNo}</p>`)
            .join('')}
        </div>
        <div style="margin: 10px 0;">
          <h3>User Information:</h3>
          <p><strong>Username:</strong> ${ticket.user.username}</p>
          <p><strong>Email:</strong> ${ticket.user.email}</p>
          <p><strong>Phone:</strong> ${ticket.user.phoneNumber}</p>
        </div>
        <div style="margin: 10px 0; text-align: right;">
          <h3>Price: Rs.${ticket.price}</h3>
        </div>
        <div style="margin: 10px 0;">
          <p><strong>Ticket ID:</strong> ${ticket._id}</p>
        </div>
      </div>
    `;

    // Convert the HTML to a Blob
    const blob = new Blob([ticketElement.outerHTML], { type: 'text/html' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `ticket-${ticket.show.movieId.movieName}-${new Date(
      ticket.show.showDate
    ).toLocaleDateString()}.html`;

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up
    URL.revokeObjectURL(downloadLink.href);
  };

  const groupedTickets = groupTicketsByDate(tickets);

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 10 }}>
        <Typography
          variant='h4'
          gutterBottom>
          My Tickets
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading your tickets...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Error Loading Tickets
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please make sure you're logged in and try refreshing the page.
            </Typography>
          </Alert>
        ) : tickets.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              No Tickets Found
            </Typography>
            <Typography variant="body2">
              You haven't purchased any tickets yet. Start by browsing movies and booking your first show!
            </Typography>
          </Alert>
        ) : (
          Object.entries(groupedTickets).map(([date, dateTickets]) => (
            <Box
              key={date}
              sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                sx={{ mb: 2 }}>
                {date}
              </Typography>
              <Grid
                container
                spacing={3}>
                {dateTickets.map((ticket, index) => {
                  const { show, seats, user, price } = ticket;
                  const { movieId, showDate, showTime } = show;
                  const { movieName } = movieId;

                  return (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={ticket._id}>
                      <Paper
                        elevation={3}
                        sx={{ position: 'relative' }}>
                        <StyledTicketNumber>{index + 1}</StyledTicketNumber>
                        <Card>
                          <CardHeader
                            title={movieName}
                            subheader={`${new Date(
                              showDate
                            ).toLocaleDateString()} at ${showTime}`}
                            action={
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'center',
                                }}>
                                <QRCodeSVG
                                  value={`Ticket ID: ${ticket._id}`}
                                  size={64}
                                />
                                <Button
                                  variant='contained'
                                  color='primary'
                                  onClick={() => downloadTicket(ticket, index)}
                                  startIcon={<Download size={20} />}>
                                  Download
                                </Button>
                              </Box>
                            }
                          />
                          <CardContent>
                            <Grid
                              container
                              spacing={2}>
                              <Grid
                                item
                                xs={12}
                                sm={6}>
                                <Typography variant='h6'>Seats</Typography>
                                {seats.length > 0 ? (
                                  <List dense>
                                    {seats.map((seat) => (
                                      <ListItem key={seat._id}>
                                        Seat Number: {seat.seatNo}
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : (
                                  <Typography>No seats selected</Typography>
                                )}
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={6}>
                                <Typography variant='h6'>
                                  User Information
                                </Typography>
                                <Typography>
                                  Username: {user.username}
                                </Typography>
                                <Typography>Email: {user.email}</Typography>
                                <Typography>
                                  Phone: {user.phoneNumber}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                              <Typography variant='h6'>
                                Price: Rs.{price}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Tickets;
