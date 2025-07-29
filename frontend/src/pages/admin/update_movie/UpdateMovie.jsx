import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleMovieApi, updateMovieApi } from '../../../apis/Api';

const UpdateMovie = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    movieName: '',
    movieGenre: '',
    movieRated: '',
    movieDetails: '',
    movieDuration: '',
  });
  const [moviePosterNewImage, setmoviePosterNewImage] = useState(null);
  const [previewMoviePosterNewImage, setPreviewMoviePosterNewImage] =
    useState(null);
  const [oldImage, setOldImage] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        console.log('Fetching movie with ID:', id);
        const res = await getSingleMovieApi(id);
        console.log('Movie data received:', res.data);
        
        const movie = res.data.movie;
        setFormData({
          movieName: movie.movieName,
          movieGenre: movie.movieGenre,
          movieRated: movie.movieRated,
          movieDetails: movie.movieDetails,
          movieDuration: movie.movieDuration,
        });
        setOldImage(movie.moviePosterImage);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Failed to fetch movie details');
        toast.error('Failed to fetch movie details');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, JPG, or PNG)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image file must be smaller than 5MB');
        return;
      }

      setmoviePosterNewImage(file);
      setPreviewMoviePosterNewImage(URL.createObjectURL(file));
      console.log('New image selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
        console.log(`Adding to FormData: ${key} = ${value}`);
      });

      // Add new image if selected
      if (moviePosterNewImage) {
        formDataToSend.append('moviePosterImage', moviePosterNewImage);
        console.log('New image added to FormData:', moviePosterNewImage.name, 'Type:', moviePosterNewImage.type);
      } else {
        console.log('No new image selected');
      }

      console.log('Updating movie with ID:', id);
      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      const res = await updateMovieApi(id, formDataToSend);
      console.log('Update response:', res);
      
      if (res.status === 201) {
        toast.success(res.data.message);
        
        // Update old image state if new image was uploaded
        if (moviePosterNewImage && res.data.movie?.moviePosterImage) {
          setOldImage(res.data.movie.moviePosterImage);
          setmoviePosterNewImage(null);
          setPreviewMoviePosterNewImage(null);
        }
        
        console.log('Movie updated successfully:', res.data.movie);
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 500) {
        toast.error(error.response.data.message || 'Internal server error occurred');
        console.error('Server error details:', error.response.data);
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid data provided');
      } else if (error.response?.status === 404) {
        toast.error('Movie not found');
      } else {
        toast.error('Failed to update movie. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const ratingOptions = ['G', 'PG', 'PG-13', 'R', 'NR'];

  // Show loading state while fetching movie data
  if (initialLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='h6' sx={{ mt: 2 }}>Loading movie details...</Typography>
      </Container>
    );
  }

  // Show error state if movie fetch failed
  if (error) {
    return (
      <Container maxWidth='lg' sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>{error}</Typography>
        <Button onClick={() => window.history.back()} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth='lg'
      sx={{ py: 4 }}>
      <Typography
        variant='h4'
        gutterBottom>
        Update Movie:{' '}
        <Typography
          component='span'
          color='primary'
          variant='h4'>
          {formData.movieName}
        </Typography>
      </Typography>

      <Grid
        container
        spacing={4}>
        <Grid
          item
          xs={12}
          md={8}>
          <Paper
            elevation={2}
            sx={{ p: 3 }}>
            <form onSubmit={handleUpdate}>
              <Grid
                container
                spacing={3}>
                <Grid
                  item
                  xs={12}>
                  <TextField
                    fullWidth
                    label='Movie Name'
                    name='movieName'
                    value={formData.movieName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <TextField
                    fullWidth
                    label='Movie Genre'
                    name='movieGenre'
                    value={formData.movieGenre}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label='Movie Details'
                    name='movieDetails'
                    value={formData.movieDetails}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Movie Rating</InputLabel>
                    <Select
                      name='movieRated'
                      value={formData.movieRated}
                      onChange={handleChange}
                      label='Movie Rating'>
                      {ratingOptions.map((rating) => (
                        <MenuItem
                          key={rating}
                          value={rating}>
                          {rating}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <TextField
                    fullWidth
                    label='Movie Duration'
                    name='movieDuration'
                    value={formData.movieDuration}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <Button
                    variant='contained'
                    component='label'
                    fullWidth
                    color={moviePosterNewImage ? 'success' : 'primary'}>
                    {moviePosterNewImage ? 'New Image Selected - Click to Change' : 'Upload Movie Poster'}
                    <input
                      type='file'
                      hidden
                      onChange={handleImage}
                      accept='image/*'
                    />
                  </Button>
                  {moviePosterNewImage && (
                    <Typography variant='body2' color='success.main' sx={{ mt: 1 }}>
                      Selected: {moviePosterNewImage.name}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <LoadingButton
                    loading={loading}
                    variant='contained'
                    color='primary'
                    fullWidth
                    type='submit'
                    size='large'>
                    Update Movie
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}>
          <Typography
            variant='h6'
            gutterBottom>
            Current Poster
          </Typography>
          <Card>
            <CardMedia
              component='img'
              height='300'
              image={`https://localhost:5000/movies/${oldImage}`}
              alt={formData.movieName}
              sx={{ objectFit: 'cover' }}
            />
          </Card>

          {previewMoviePosterNewImage && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography
                  variant='h6'>
                  New Poster Preview
                </Typography>
                <Button
                  variant='outlined'
                  color='error'
                  size='small'
                  onClick={() => {
                    setmoviePosterNewImage(null);
                    setPreviewMoviePosterNewImage(null);
                  }}>
                  Cancel New Image
                </Button>
              </Box>
              <Card>
                <CardMedia
                  component='img'
                  height='300'
                  image={previewMoviePosterNewImage}
                  alt='New poster preview'
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateMovie;
