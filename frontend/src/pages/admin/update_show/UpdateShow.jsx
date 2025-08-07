import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleShowApi, updateShowApi, getAllMoviesApi } from '../../../apis/Api';

const UpdateShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    movieId: '',
    showDate: '',
    showTime: '',
    showPrice: '',
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the show data and available movies
    Promise.all([
      getSingleShowApi(id),
      getAllMoviesApi()
    ])
    .then(([showRes, moviesRes]) => {
      const show = showRes.data.show;
      setFormData({
        movieId: show.movieId._id || show.movieId,
        showDate: show.showDate,
        showTime: show.showTime,
        showPrice: show.showPrice,
      });
      setMovies(moviesRes.data.movies || []);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error fetching data:', err);
      setError('Failed to load show data');
      setLoading(false);
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.movieId || !formData.showDate || !formData.showTime || !formData.showPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    updateShowApi(id, formData)
      .then((res) => {
        toast.success('Show updated successfully!');
        navigate('/admin/showManagement');
      })
      .catch((err) => {
        console.error('Error updating show:', err);
        toast.error(err.response?.data?.message || 'Failed to update show');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    navigate('/admin/showManagement');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography align="center">Loading show data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Update Show
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Movie</InputLabel>
            <Select
              name="movieId"
              value={formData.movieId}
              onChange={handleInputChange}
              label="Movie"
            >
              {movies.map((movie) => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.movieName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            required
            name="showDate"
            label="Show Date"
            type="date"
            value={formData.showDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            required
            name="showTime"
            label="Show Time"
            type="time"
            value={formData.showTime}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            required
            name="showPrice"
            label="Show Price (Rs.)"
            type="number"
            value={formData.showPrice}
            onChange={handleInputChange}
            inputProps={{ min: 0 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? 'Updating...' : 'Update Show'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateShow;
