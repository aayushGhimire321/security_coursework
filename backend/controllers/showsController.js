const Show = require('../models/showsModel');
const Movie = require('../models/movieModel');
const Seat = require('../models/seatModel');
const { addSeat } = require('./seatController');

const createShow = async (req, res) => {
  const { showDate, showTime, showPrice, movieId } = req.body;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    const newShow = new Show({
      movieId: movieId,
      showDate: showDate,
      showTime: showTime,
      showPrice: showPrice,
    });

    var show = await newShow.save();

    // create seat
    addSeat(newShow._id);

    const seats = await Seat.find({ showId: newShow._id });
    newShow.seats = seats;
    show = await newShow.save();
    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: show,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const showById = async (req, res) => {
  const id = req.params.id;

  try {
    const show = await Show.findById(id).populate('movieId');
    res.status(200).json({
      success: true,
      message: 'Show fetched successfully',
      show: show,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({})
      .populate('movieId')
      .sort({ showDate: 1, showTime: 1 });
    res.status(200).json({
      success: true,
      message: 'Shows fetched successfully',
      shows: shows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const getAllShowById = async (req, res) => {
  const movieId = req.params.id;

  try {
    const shows = await Show.find({ movieId: movieId }).populate('movieId');
    res.status(200).json({
      success: true,
      message: 'Shows fetched successfully',
      shows: shows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const deleteShow = async (req, res) => {
  const id = req.params.id;

  try {
    const show = await Show.findByIdAndDelete(id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const updateShow = async (req, res) => {
  const id = req.params.id;
  const { showDate, showTime, price } = req.body;

  try {
    const show = await Show.findByIdAndUpdate(
      id,
      { showDate, showTime, showPrice: prices },
      { new: true }
    );
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      data: show,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

module.exports = {
  createShow,
  getAllShowById,
  deleteShow,
  updateShow,
  getAllShows,
  showById,
};
