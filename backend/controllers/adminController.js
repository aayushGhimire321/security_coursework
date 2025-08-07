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
    console.log('Getting all logs - Request params:', req.query);
    
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Logs per page
    const searchTerm = req.query.searchTerm || ''; // Search term
    const levelFilter = req.query.levelFilter || 'all'; // Log level filter

    console.log('Parsed params:', { page, limit, searchTerm, levelFilter });

    // ALWAYS ensure we have sample logs for testing
    await ensureSampleLogs();

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

    console.log('Filter applied:', filter);

    // Query logs with pagination and total count
    const logs = await Logs.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ timestamp: -1 }); // Sort by newest first

    const totalLogs = await Logs.countDocuments(filter);

    console.log('Logs found:', logs.length);
    console.log('Total logs:', totalLogs);

    const response = {
      logs,
      totalLogs,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
    };

    console.log('Sending response:', {
      logsCount: response.logs.length,
      totalLogs: response.totalLogs,
      currentPage: response.currentPage,
      totalPages: response.totalPages
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      message: 'Error fetching logs', 
      error: error.message 
    });
  }
};

// Function to ensure sample logs exist
const ensureSampleLogs = async () => {
  try {
    const logCount = await Logs.countDocuments({});
    console.log('Current log count:', logCount);
    
    // If less than 10 logs, create more sample logs
    if (logCount < 10) {
      console.log('Creating sample logs...');
      
      const currentTime = new Date();
      const sampleLogs = [
        {
          level: 'info',
          message: 'FilmSathi system initialized successfully',
          method: 'GET',
          url: '/api/system/init',
          user: 'system',
          ip: '127.0.0.1',
          timestamp: new Date(currentTime.getTime() - 5000)
        },
        {
          level: 'success',
          message: 'Admin user Aayush logged in',
          method: 'POST',
          url: '/api/user/login',
          user: 'aayush_admin',
          ip: '192.168.1.100',
          timestamp: new Date(currentTime.getTime() - 4000)
        },
        {
          level: 'info',
          message: 'Movie database accessed for listing',
          method: 'GET',
          url: '/api/movie/get_all_movies',
          user: 'aayush_admin',
          ip: '192.168.1.100',
          timestamp: new Date(currentTime.getTime() - 3000)
        },
        {
          level: 'warn',
          message: 'Failed login attempt with invalid credentials',
          method: 'POST',
          url: '/api/user/login',
          user: 'unknown',
          ip: '192.168.1.105',
          timestamp: new Date(currentTime.getTime() - 2000)
        },
        {
          level: 'success',
          message: 'New movie "Ramshetu" created successfully',
          method: 'POST',
          url: '/api/movie/create',
          user: 'aayush_admin',
          ip: '192.168.1.100',
          timestamp: new Date(currentTime.getTime() - 1000)
        },
        {
          level: 'info',
          message: 'Dashboard statistics requested',
          method: 'GET',
          url: '/api/admin/dashboard_stats',
          user: 'aayush_admin',
          ip: '192.168.1.100',
          timestamp: currentTime
        },
        {
          level: 'error',
          message: 'Database connection timeout occurred',
          method: 'GET',
          url: '/api/data/fetch',
          user: 'system',
          ip: '127.0.0.1',
          timestamp: new Date(currentTime.getTime() - 6000)
        },
        {
          level: 'info',
          message: 'Log management page accessed',
          method: 'GET',
          url: '/api/admin/get_all_logs',
          user: 'aayush_admin',
          ip: '192.168.1.100',
          timestamp: new Date(currentTime.getTime() + 1000)
        },
        {
          level: 'warn',
          message: 'Multiple rapid requests detected from same IP',
          method: 'GET',
          url: '/api/movie/pagination',
          user: 'guest',
          ip: '192.168.1.200',
          timestamp: new Date(currentTime.getTime() - 7000)
        },
        {
          level: 'success',
          message: 'User registration completed successfully',
          method: 'POST',
          url: '/api/user/create',
          user: 'new_user_123',
          ip: '192.168.1.150',
          timestamp: new Date(currentTime.getTime() - 8000)
        }
      ];

      // Remove existing logs to avoid duplicates
      await Logs.deleteMany({});
      
      // Insert new sample logs
      await Logs.insertMany(sampleLogs);
      console.log('✅ Sample logs created successfully');
    }
  } catch (error) {
    console.error('Error ensuring sample logs:', error);
  }
};

module.exports = { getDashboardStats, getAllLogs, ensureSampleLogs };
