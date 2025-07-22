import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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

  useEffect(() => {
    getBookingsByUserApi()
      .then((res) => {
        const sortedTickets = res.data.tickets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTickets(sortedTickets);
      })
      .catch((error) => {
        // console.log(error);
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
        {tickets.length === 0 ? (
          <Typography variant='body1'>No tickets available</Typography>
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
