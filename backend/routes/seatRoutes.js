const router = require('express').Router();
const seatController = require('../controllers/seatController');
const { authGuard, adminGuard } = require('../middleware/authGuard');

router.post('/create', adminGuard, seatController.addSeat);

router.get(
  '/get_seats_by_show/:id',
  authGuard,
  seatController.getAllSeatsByShow
);

router.put('/setavailable', authGuard, seatController.setavailable);

module.exports = router;
