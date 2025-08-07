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
    console.log('Update movie request received');
    console.log('Movie ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    const movieId = req.params.id;
    
    // Validate movie ID
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required',
      });
    }

    // Check if movie exists
    const existingMovie = await movieModel.findById(movieId);
    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Handle image update if provided
    if (req.files && req.files.moviePosterImage) {
      console.log('Processing new image upload...');
      const { moviePosterImage } = req.files;

      // Upload image to /public/movies folder
      const imageName = `${Date.now()}-${moviePosterImage.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/movies/${imageName}`
      );
      
      try {
        await moviePosterImage.mv(imageUploadPath);
        console.log('New image uploaded:', imageName);
        
        // Add new field to req.body
        req.body.moviePosterImage = imageName;

        // Delete old image if new image is uploaded successfully
        if (existingMovie.moviePosterImage) {
          const oldImagePath = path.join(
            __dirname,
            `../public/movies/${existingMovie.moviePosterImage}`
          );
          
          try {
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log('Old image deleted:', existingMovie.moviePosterImage);
            }
          } catch (imageDeleteError) {
            console.warn('Failed to delete old image:', imageDeleteError.message);
          }
        }
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload new image',
          error: uploadError.message,
        });
      }
    }

    console.log('Updating movie with data:', req.body);

    // Update the movie data
    const updatedMovie = await movieModel.findByIdAndUpdate(
      movieId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update movie',
      });
    }

    console.log('Movie updated successfully:', updatedMovie._id);

    // Log the activity
    await logMovieActivity(
      'info',
      `Movie "${updatedMovie.movieName}" updated successfully`,
      req.method,
      req.originalUrl,
      req.user?.id,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Movie updated successfully',
      movie: updatedMovie,
    });
  } catch (error) {
    console.error('Update movie error:', error);
    
    // Log the error
    await logMovieActivity(
      'error',
      `Failed to update movie: ${error.message}`,
      req.method,
      req.originalUrl,
      req.user?.id,
      req.ip
    );

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
