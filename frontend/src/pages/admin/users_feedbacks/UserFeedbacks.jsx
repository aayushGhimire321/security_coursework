import { Visibility as VisibilityIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getContactMessagesApi } from '../../../apis/Api';

const UserFeedbacks = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getContactMessagesApi();
      setMessages(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth='lg'>
        <Typography
          variant='h4'
          component='h1'
          align='center'
          gutterBottom>
          User Feedbacks
        </Typography>

        <Paper
          elevation={2}
          sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Alert severity='info'>No Feedback Messages Available</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow
                      key={message._id}
                      hover>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>
                        {message.message.substring(0, 50)}...
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton
                          color='primary'
                          size='small'
                          onClick={() => setSelectedMessage(message)}>
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog
          open={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          maxWidth='sm'
          fullWidth>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogContent dividers>
            <Typography
              variant='subtitle2'
              color='text.secondary'
              gutterBottom>
              From
            </Typography>
            <Typography
              variant='body1'
              paragraph>
              {selectedMessage?.name}
            </Typography>

            <Typography
              variant='subtitle2'
              color='text.secondary'
              gutterBottom>
              Subject
            </Typography>
            <Typography
              variant='body1'
              paragraph>
              {selectedMessage?.subject}
            </Typography>

            <Typography
              variant='subtitle2'
              color='text.secondary'
              gutterBottom>
              Message
            </Typography>
            <Typography variant='body1'>{selectedMessage?.message}</Typography>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserFeedbacks;
