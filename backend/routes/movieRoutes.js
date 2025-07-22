const router = require('express').Router();
const movieController = require('../controllers/movieController');

const {
  authGuard,
  adminGuard,
  publicGuard,
} = require('../middleware/authGuard');

// Route to create a new movie
router.post('/create', adminGuard, movieController.createMovie);

// Route to fetch all movies
router.get('/get_all_movies', publicGuard, movieController.getAllMovies);

// Route to fetch a single movie by ID
router.get('/get_single_movie/:id', authGuard, movieController.getSingleMovie);

// Route to delete a movie by ID
router.delete('/delete_movie/:id', adminGuard, movieController.deleteMovie);

// Route to update a movie by ID
router.put('/update_movie/:id', adminGuard, movieController.updateMovie);

// pagination
router.get('/pagination', publicGuard, movieController.paginationMovies);

router.get('/get_movies_count', publicGuard, movieController.getMovieCount);

module.exports = router;
