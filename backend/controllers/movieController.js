const path = require('path');
const movieModel = require('../models/movieModel');
const fs = require('fs');
const Log = require('../models/logModel');

// Helper function to log movie activities
const logMovieActivity = async (level, message, method, url, userId, ip) => {
  try {
    await Log.create({
      level,
      message,
      method,
      url,
      user: userId || 'system',
      ip: ip || 'unknown'
    });
  } catch (error) {
    console.error('Failed to log movie activity:', error.message);
  }
};

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

    // Log successful movie creation
    await logMovieActivity(
      'success',
      `New movie created: ${movieName}`,
      'POST',
      '/api/movies/create',
      req.user?.id || 'admin',
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    // console.log(error);

    // Log movie creation error
    logMovieActivity(
      'error',
      `Failed to create movie: ${error.message}`,
      'POST',
      '/api/movies/create',
      req.user?.id || 'admin',
      req.ip || req.connection.remoteAddress
    ).catch(logErr => console.error('Failed to log error:', logErr));

    res.status(500).json({
      success: false,
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
    console.log('UpdateMovie request received:');
    console.log('Request ID:', req.params.id);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request files:', req.files ? Object.keys(req.files) : 'No files');
    console.log('Content-Type:', req.headers['content-type']);
    
    // Validate that the movie ID is valid
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required',
      });
    }

    // Check if movie exists first
    const existingMovie = await movieModel.findById(req.params.id);
    if (!existingMovie) {
      console.log('Movie not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }
    
    // Check if a new image is being uploaded
    if (req.files && req.files.moviePosterImage) {
      const { moviePosterImage } = req.files;
      
      console.log('Processing new image upload:');
      console.log('- File name:', moviePosterImage.name);
      console.log('- File size:', (moviePosterImage.size / 1024 / 1024).toFixed(2) + 'MB');
      console.log('- File type:', moviePosterImage.mimetype);

      // Validate file type and size (optional but recommended)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(moviePosterImage.mimetype)) {
        console.log('Invalid file type rejected:', moviePosterImage.mimetype);
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only JPEG and PNG images are allowed.',
        });
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (moviePosterImage.size > maxSize) {
        console.log('File too large rejected:', (moviePosterImage.size / 1024 / 1024).toFixed(2) + 'MB');
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB.',
        });
      }

      // Generate new image name and upload path
      const imageName = `${Date.now()}-${moviePosterImage.name}`;
      const uploadDir = path.join(__dirname, '../public/movies');
      const imageUploadPath = path.join(uploadDir, imageName);
      
      console.log('Upload directory:', uploadDir);
      console.log('Upload path:', imageUploadPath);

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        console.log('Creating upload directory:', uploadDir);
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      try {
        // Upload new image
        await moviePosterImage.mv(imageUploadPath);
        console.log('New image uploaded successfully:', imageName);
        
        // Add new image name to req.body for database update
        req.body.moviePosterImage = imageName;

        // Try to delete old image file (if it exists)
        try {
          if (existingMovie.moviePosterImage) {
            const oldImagePath = path.join(uploadDir, existingMovie.moviePosterImage);
            
            // Check if old image file exists before trying to delete it
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log('Old image deleted:', existingMovie.moviePosterImage);
            } else {
              console.log('Old image file not found, skipping deletion:', oldImagePath);
            }
          }
        } catch (deleteError) {
          // Log the error but don't fail the whole operation
          console.error('Error deleting old image:', deleteError.message);
        }
      } catch (uploadError) {
        console.error('Error uploading new image:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload new image',
          error: uploadError.message,
        });
      }
    } else {
      console.log('No new image provided, updating other fields only');
    }

    // Update the movie data in database
    console.log('Updating movie in database with data:', req.body);
    const updatedMovie = await movieModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('Movie updated successfully:', updatedMovie.movieName);

    // Log successful movie update
    await logMovieActivity(
      'success',
      `Movie updated: ${updatedMovie.movieName}`,
      'PUT',
      `/api/movie/update_movie/${req.params.id}`,
      req.user?.id || 'admin',
      req.ip || req.connection.remoteAddress
    );

    res.status(201).json({
      success: true,
      message: 'Movie updated successfully',
      movie: updatedMovie,
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    console.error('Error stack:', error.stack);

    // Log movie update error
    logMovieActivity(
      'error',
      `Failed to update movie: ${error.message}`,
      'PUT',
      `/api/movie/update_movie/${req.params.id}`,
      req.user?.id || 'admin',
      req.ip || req.connection.remoteAddress
    ).catch(logErr => console.error('Failed to log error:', logErr));

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
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
