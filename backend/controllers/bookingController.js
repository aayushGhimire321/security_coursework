const Booking = require('../models/bookingModel');

const path = require('path');
const crypto = require('crypto-js');

const encrypt = (text) => {
  return crypto.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

const decrypt = (text) => {
  return crypto.AES.decrypt(text, process.env.ENCRYPTION_KEY).toString(
    crypto.enc.Utf8
  );
};

const addBooking = async (req, res) => {
  // console.log(req.body);

  const { show, price, seats } = req.body;
  const id = req.user.id;

  //    Validate
  if (!show || !price || !seats) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    const booking = new Booking({
      show: show,
      price: price,
      seats: seats,
      user: id,
    });
    await booking.save();
    res.status(201).json({
      success: true,
      message: 'Booking added successfully',
      id: booking._id,
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

const getBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('show');
    res.status(200).json({
      success: true,
      message: 'Booked tickets fetched successfully',
      movies: bookings,
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

const getAllBookings = async (req, res) => {
  try {
    // populate movie inside show
    const bookings = await Booking.find({})
      .populate('show')
      .populate('user')
      .populate('seats')
      .populate({
        path: 'show',
        populate: {
          path: 'movieId',
        },
      });
    res.status(200).json({
      success: true,
      message: 'Booked tickets fetched successfully',
      bookings: bookings,
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
const getBookingsByUser = async (req, res) => {
  const userId = req.user.id;
  // console.log(userId);
  try {
    // populate movie inside show
    const bookings = await Booking.find({
      user: userId,
      status: 'completed',
    })
      .populate('show')
      .populate('user', 'email username phoneNumber')
      .populate('seats')
      .populate({
        path: 'show',
        populate: {
          path: 'movieId',
        },
      })
      .populate({
        path: 'seats',
        populate: {
          path: 'showId',
          model: 'Show',
          populate: {
            path: 'movieId',
            model: 'movies',
          },
        },
      });

    // console.log(bookings);

    const tickets = bookings.map((ticket) => {
      const encrypted = encrypt(ticket._id.toString());
      // console.log(encrypted);
      const decryptedUsername = decrypt(ticket.user.username);
      const decryptedPhoneNumber = decrypt(ticket.user.phoneNumber);
      return {
        show: ticket.show,
        _id: encrypted,
        user: {
          username: decryptedUsername,
          email: ticket.user.email,
          phoneNumber: decryptedPhoneNumber,
          _id: ticket.user._id,
        },
        price: ticket.price,
        status: ticket.status,
        seats: ticket.seats,
      };
    });

    // console.log(tickets);

    res.status(200).json({
      success: true,
      message: 'Booked tickets fetched successfully',
      tickets: tickets,
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

// get by id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('show')
      .populate('user')
      .populate('seats')
      .populate({
        path: 'show',
        populate: {
          path: 'movieId',
        },
      })
      .populate({
        path: 'seats',
        populate: {
          path: 'showId',
          model: 'Show',
          populate: {
            path: 'movieId',
            model: 'movies',
          },
        },
      });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Booking fetched successfully',
      booking: booking,
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

// change status
const changeStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    booking.status = req.body.status;
    await booking.save();
    res.status(200).json({
      success: true,
      message: 'Booking status changed successfully',
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
  addBooking,
  getBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  changeStatus,
};
