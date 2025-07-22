import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CardMedia,
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
    getSingleMovieApi(id)
      .then((res) => {
        const movie = res.data.movie;
        setFormData({
          movieName: movie.movieName,
          movieGenre: movie.movieGenre,
          movieRated: movie.movieRated,
          movieDetails: movie.movieDetails,
          movieDuration: movie.movieDuration,
        });
        setOldImage(movie.moviePosterImage);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch movie details');
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setmoviePosterNewImage(file);
    setPreviewMoviePosterNewImage(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    if (moviePosterNewImage) {
      formDataToSend.append('moviePosterImage', moviePosterNewImage);
    }

    try {
      const res = await updateMovieApi(id, formDataToSend);
      if (res.status === 201) {
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response?.status === 500 || error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const ratingOptions = ['G', 'PG', 'PG-13', 'R', 'NR'];

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
                    fullWidth>
                    Upload Movie Poster
                    <input
                      type='file'
                      hidden
                      onChange={handleImage}
                      accept='image/*'
                    />
                  </Button>
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
              <Typography
                variant='h6'
                gutterBottom>
                New Poster
              </Typography>
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
