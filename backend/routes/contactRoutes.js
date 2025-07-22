const router = require('express').Router();
const contactController = require('../controllers/contactController');
const { authGuard } = require('../middleware/authGuard');

// sending messages(by user)
router.post('/create', authGuard, contactController.addContact);

// to get messages(admin)
router.get('/get_contact', authGuard, contactController.getContact);

module.exports = router;
