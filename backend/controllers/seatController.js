const Seat = require('../models/seatModel');

exports.addSeat = async (id) => {
  try {
    const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const col = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    for (let i = 0; i < row.length; i++) {
      for (let j = 0; j < col.length; j++) {
        const seat = new Seat({
          seatNo: row[i] + col[j],
          available: true,
          showId: id,
        });
        await seat.save();
      }
    }
  } catch (error) {
    // console.log(error)
  }
};

exports.getAllSeatsByShow = async (req, res) => {
  const showId = req.params.id;

  try {
    const seats = await Seat.find({ showId: showId })
      .populate('showId')
      .populate({
        path: 'showId',
        populate: {
          path: 'movieId',
          model: 'movies',
        },
      });
    res.status(200).json({
      success: true,
      message: 'Seats fetched successfully',
      seats: seats,
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

exports.setavailable = async (req, res) => {
  try {
    // console.log(req.body)
    const seats = req.body.seats;
    // console.log(seats)
    for (let i = 0; i < seats.length; i++) {
      const seat = await Seat.findById(seats[i]);
      seat.available = false;
      await seat.save();
    }

    res.status(200).json({
      success: true,
      message: 'Seat updated successfully',
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
