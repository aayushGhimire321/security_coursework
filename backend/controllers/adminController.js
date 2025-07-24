const User = require('../models/userModel');
const Movie = require('../models/movieModel');
const Bookings = require('../models/bookingModel');
const Logs = require('../models/logModel');

const getDashboardStats = async (req, res) => {
  try {
    console.log('Fetching dashboard statistics...');
    
    const totalUserLogins = await User.countDocuments({});
    console.log('Total users:', totalUserLogins);
    
    const totalMoviesAdded = await Movie.countDocuments({});
    console.log('Total movies:', totalMoviesAdded);
    
    const totalBookings = await Bookings.countDocuments({});
    console.log('Total bookings:', totalBookings);

    const stats = {
      totalUserLogins,
      totalMoviesAdded,
      totalBookings,
    };

    console.log('Dashboard stats response:', stats);

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard statistics',
      error: error.message 
    });
  }
};

// get all logs
const getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Logs per page
    const searchTerm = req.query.searchTerm || ''; // Search term
    const levelFilter = req.query.levelFilter || 'all'; // Log level filter

    // Build the filter dynamically
    const filter = {
      ...(levelFilter !== 'all' && { level: levelFilter }),
      ...(searchTerm && {
        $or: [
          { message: { $regex: searchTerm, $options: 'i' } },
          { url: { $regex: searchTerm, $options: 'i' } },
          { user: { $regex: searchTerm, $options: 'i' } },
        ],
      }),
    };

    // Query logs with pagination and total count
    const logs = await Logs.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ timestamp: -1 }); // Sort by newest first

    const totalLogs = await Logs.countDocuments(filter); // Total logs for pagination

    res.status(200).json({
      logs,
      totalLogs,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res
      .status(500)
      .json({ message: 'Error fetching logs', error: error.message });
  }
};

module.exports = { getDashboardStats, getAllLogs };
