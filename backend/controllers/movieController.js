const path = require('path');
const movieModel = require('../models/movieModel');
const fs = require('fs');

const createMovie = async (req, res) => {
  // Check incoming data
  // console.log(req.body);
  // console.log(req.files);

  // Destructuring the body data (json)
  const { movieName, movieGenre, movieDetails, movieRated, movieDuration } =
    req.body;

  // Validation (task)
  if (
    !movieName ||
    !movieGenre ||
    !movieDetails ||
    !movieRated ||
    !movieDuration
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please enter all fields',
    });
  }

  // Validate if there is an image
  if (!req.files || !req.files.moviePosterImage) {
    return res.status(400).json({
      success: false,
      message: 'Image not found',
    });
  }

  const { moviePosterImage } = req.files;

  // Upload image
  // 1. Generate new image name (abc.png) -> (21324-abc.png)
  const imageName = `${Date.now()}-${moviePosterImage.name}`;

  // 2. Make an upload path(/path/upload-directory)
  const imageUploadPath = path.join(__dirname, `../public/movies/${imageName}`);

  // 3. Move to that directory (await, try-catch)
  try {
    await moviePosterImage.mv(imageUploadPath);

    // Save to database
    const newMovie = new movieModel({
      movieName: movieName,
      movieGenre: movieGenre,
      movieDetails: movieDetails,
      movieRated: movieRated,
      movieDuration: movieDuration,
      moviePosterImage: imageName,
    });

    const movie = await newMovie.save();
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      'succ  ess': false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Fetch all movies
const getAllMovies = async (req, res) => {
  try {
    const allMovies = await movieModel.find({});
    res.status(200).json({
      success: true,
      message: 'Movies fetched successfully',
      movies: allMovies,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Fetch single movie
const getSingleMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await movieModel.findById(movieId);
    if (!movie) {
      return res.status(400).json({
        success: false,
        message: 'No Movie Found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Movie fetched',
      movie: movie,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Delete movie
const deleteMovie = async (req, res) => {
  try {
    await movieModel.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: 'Movie Deleted Successfully',
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Update movie
const updateMovie = async (req, res) => {
  try {
    if (req.files && req.files.moviePosterImage) {
      const { moviePosterImage } = req.files;

      // Upload image to /public/movies folder
      const imageName = `${Date.now()}-${moviePosterImage.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/movies/${imageName}`
      );
      await moviePosterImage.mv(imageUploadPath);

      // Add new field to req.body
      req.body.moviePosterImage = imageName;

      // If image is uploaded and req.body is assigned
      if (req.body.moviePosterImage) {
        const existingMovie = await movieModel.findById(req.params.id);
        const oldImagePath = path.join(
          __dirname,
          `../public/movies/${existingMovie.moviePosterImage}`
        );
        fs.unlinkSync(oldImagePath);
      }
    }

    //update the data
    const updatedMovie = await movieModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: 'Movie updated successfully',
      movie: updatedMovie,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

//Pagination
const paginationMovies = async (req, res) => {
  // requesting page no
  const pageNo = req.query.page || 1;

  // result per page
  const resultPerPage = parseInt(req.query.limit) || 2;

  try {
    //fing all movies, skip, limit
    const movies = await movieModel
      .find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);

    // if page 6 is requested, result 0 (No data)
    if (movies.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No Movies Found',
      });
    }

    //response
    res.status(201).json({
      success: true,
      message: 'Movie Fetched',
      movies: movies,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const getMovieCount = async (req, res) => {
  try {
    const movieCount = await movieModel.countDocuments({});

    res.status(200).json({
      success: true,
      message: 'Movie count fetched successfully',
      movieCount: movieCount,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getSingleMovie,
  deleteMovie,
  updateMovie,
  paginationMovies,
  getMovieCount,
};
