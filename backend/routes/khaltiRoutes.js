const express = require('express');
const router = express.Router();
const {
  initializeKhalti,
  completeKhaltiPayment,
} = require('../controllers/paymentController');
const { authGuard } = require('../middleware/authGuard');

// Production routes with authentication
router.post('/initialize_khalti', authGuard, initializeKhalti);
router.post('/complete-khalti-payment', authGuard, completeKhaltiPayment);

// Test routes without authentication (for debugging)
router.post('/test_initialize_khalti', initializeKhalti);
router.post('/test_complete_khalti', completeKhaltiPayment);

module.exports = router;
