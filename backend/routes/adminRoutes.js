const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllLogs,
} = require('../controllers/adminController');
const { adminGuard } = require('../middleware/authGuard');

// Define the route for getting dashboard statistics
router.get('/dashboard_stats', adminGuard, getDashboardStats);

// getAllLogs
router.get('/get_all_logs', adminGuard, getAllLogs);

module.exports = router;
