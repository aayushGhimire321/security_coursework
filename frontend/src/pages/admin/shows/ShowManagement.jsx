import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
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
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllShowsApi } from '../../../apis/Api';

const ShowManagement = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = () => {
    setLoading(true);
    getAllShowsApi()
      .then((res) => {
        setShows(res.data.shows || []);
        setLoading(false);
      })
      .catch((error) => {
        // console.log(error);
        toast.error('Failed to fetch shows. Please try again later.');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    toast.warning('Delete functionality not implemented');
  };

  const filteredShows = shows.filter(
    (show) =>
      show.movieId.movieName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.showDate.includes(searchTerm) ||
      show.showTime.includes(searchTerm)
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
        Show Management
      </Typography>
      <Paper
        elevation={1}
        sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <TextField
            placeholder='Search by movie name, date, or time...'
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
        ) : filteredShows.length === 0 ? (
          <Alert severity='info'>No Shows Available</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Movie Poster</TableCell>
                  <TableCell>Movie Name</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredShows.map((show) => (
                  <TableRow
                    key={show._id}
                    hover>
                    <TableCell>
                      <Box
                        component='img'
                        src={`https://localhost:5000/movies/${show.movieId.moviePosterImage}`}
                        alt={show.movieId.movieName}
                        sx={{
                          width: '50px',
                          height: '75px',
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>{show.movieId.movieName}</TableCell>
                    <TableCell>{show.movieId.movieDuration}</TableCell>
                    <TableCell>{show.showDate}</TableCell>
                    <TableCell>{show.showTime}</TableCell>
                    <TableCell>Rs.{show.showPrice}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`/admin/shows/edit/${show._id}`}
                        startIcon={<EditIcon />}
                        variant='outlined'
                        size='small'
                        sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(show._id)}
                        startIcon={<DeleteIcon />}
                        variant='outlined'
                        color='error'
                        size='small'>
                        Delete
                      </Button>
                    </TableCell>
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

export default ShowManagement;
