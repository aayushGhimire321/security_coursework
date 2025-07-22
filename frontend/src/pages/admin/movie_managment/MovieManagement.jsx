import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import {
  addShowsApi,
  createMovieApi,
  deleteMovieApi,
  getAllMoviesApi,
} from '../../../apis/Api';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [openAddMovie, setOpenAddMovie] = useState(false);
  const [openAddShow, setOpenAddShow] = useState(false);
  const [movieForShow, setMovieForShow] = useState(null);

  const [formData, setFormData] = useState({
    movieName: '',
    movieGenre: '',
    movieDetails: '',
    movieRated: '',
    movieDuration: '',
    moviePosterImage: null,
    previewPosterImage: null,
  });

  const [showData, setShowData] = useState({
    showDate: '',
    showTime: '',
    showPrice: 0,
  });

  useEffect(() => {
    getAllMoviesApi()
      .then((res) => setMovies(res.data.movies))
      .catch((error) => {
        // console.log(error)
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosterImage = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      moviePosterImage: file,
      previewPosterImage: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'previewPosterImage') {
        formDataToSend.append(key, formData[key]);
      }
    });

    createMovieApi(formDataToSend)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          setOpenAddMovie(false);
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          toast.warning(error.response.data.message);
        } else {
          toast.error('Something went wrong!');
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      deleteMovieApi(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            setMovies(movies.filter((movie) => movie._id !== id));
          }
        })
        .catch((error) => {
          if (error.response?.status === 500) {
            toast.error(error.response.data.message);
          }
        });
    }
  };

  const handleAddShow = (e) => {
    e.preventDefault();
    const data = {
      ...showData,
      movieId: movieForShow._id,
    };

    addShowsApi(data)
      .then((res) => {
        toast.success(res.data.message);
        setOpenAddShow(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.response?.data.message || 'Something went wrong');
      });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component='main'
        sx={{ flexGrow: 1, p: 2 }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={4}>
          <Typography
            variant='h4'
            component='h1'
            fontWeight='bold'>
            Movie Ticketing Admin Panel
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => setOpenAddMovie(true)}>
            Add Movie
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Movie Poster</TableCell>
                <TableCell>Movie Name</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Rated</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie._id}>
                  <TableCell>
                    <img
                      src={`https://localhost:5000/movies/${movie.moviePosterImage}`}
                      alt={movie.movieName}
                      style={{ width: 40, height: 40, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{movie.movieName}</TableCell>
                  <TableCell>{movie.movieGenre}</TableCell>
                  <TableCell>{movie.movieDetails}</TableCell>
                  <TableCell>{movie.movieRated}</TableCell>
                  <TableCell>{movie.movieDuration}</TableCell>
                  <TableCell>
                    <Box
                      display='flex'
                      gap={1}>
                      <Button
                        component={Link}
                        to={`/admin/update/${movie._id}`}
                        variant='outlined'
                        size='small'>
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(movie._id)}
                        variant='outlined'
                        color='error'
                        size='small'>
                        Delete
                      </Button>
                      <Button
                        onClick={() => {
                          setMovieForShow(movie);
                          setOpenAddShow(true);
                        }}
                        variant='contained'
                        color='primary'
                        size='small'>
                        Add Show
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Movie Dialog */}
        <Dialog
          open={openAddMovie}
          onClose={() => setOpenAddMovie(false)}
          maxWidth='md'
          fullWidth>
          <DialogTitle>Create a New Movie</DialogTitle>
          <DialogContent>
            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label='Movie Name'
                name='movieName'
                value={formData.movieName}
                onChange={handleInputChange}
                margin='normal'
                required
              />
              <TextField
                fullWidth
                label='Movie Genre'
                name='movieGenre'
                value={formData.movieGenre}
                onChange={handleInputChange}
                margin='normal'
                required
              />
              <TextField
                fullWidth
                label='Movie Details'
                name='movieDetails'
                value={formData.movieDetails}
                onChange={handleInputChange}
                margin='normal'
                multiline
                rows={3}
                required
              />
              <FormControl
                fullWidth
                margin='normal'>
                <InputLabel>Movie Rating</InputLabel>
                <Select
                  name='movieRated'
                  value={formData.movieRated}
                  onChange={handleInputChange}
                  required>
                  <MenuItem value='G'>G</MenuItem>
                  <MenuItem value='PG'>PG</MenuItem>
                  <MenuItem value='PG-13'>PG-13</MenuItem>
                  <MenuItem value='R'>R</MenuItem>
                  <MenuItem value='NR'>NR</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label='Movie Duration'
                name='movieDuration'
                value={formData.movieDuration}
                onChange={handleInputChange}
                margin='normal'
                required
              />
              <TextField
                fullWidth
                type='file'
                onChange={handlePosterImage}
                margin='normal'
                required
                InputLabelProps={{ shrink: true }}
              />
              {formData.previewPosterImage && (
                <Box mt={2}>
                  <img
                    src={formData.previewPosterImage}
                    alt='preview'
                    style={{ maxWidth: '100%', maxHeight: 200 }}
                  />
                </Box>
              )}
              <DialogActions>
                <Button onClick={() => setOpenAddMovie(false)}>Cancel</Button>
                <Button
                  type='submit'
                  variant='contained'>
                  Save
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Add Show Dialog */}
        <Dialog
          open={openAddShow}
          onClose={() => setOpenAddShow(false)}>
          <DialogTitle>Add Show Details</DialogTitle>
          <DialogContent>
            <Box
              component='form'
              onSubmit={handleAddShow}
              sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type='date'
                label='Show Date'
                value={showData.showDate}
                onChange={(e) =>
                  setShowData((prev) => ({ ...prev, showDate: e.target.value }))
                }
                margin='normal'
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type='time'
                label='Show Time'
                value={showData.showTime}
                onChange={(e) =>
                  setShowData((prev) => ({ ...prev, showTime: e.target.value }))
                }
                margin='normal'
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type='number'
                label='Show Price'
                value={showData.showPrice}
                onChange={(e) =>
                  setShowData((prev) => ({
                    ...prev,
                    showPrice: e.target.value,
                  }))
                }
                margin='normal'
                required
              />
              <DialogActions>
                <Button onClick={() => setOpenAddShow(false)}>Cancel</Button>
                <Button
                  type='submit'
                  variant='contained'>
                  Save
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MovieManagement;
