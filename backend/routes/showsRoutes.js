const express = require('express');
const router = express.Router();
const showsController = require('../controllers/showsController');
const { adminGuard, authGuard } = require('../middleware/authGuard');

router.post('/create', adminGuard, showsController.createShow);
router.get('/get_all', authGuard, showsController.getAllShows);
router.get('/get_by_movie/:id', authGuard, showsController.getAllShowById);
router.delete('/delete/:id', adminGuard, showsController.deleteShow);
router.put('/:id/update', adminGuard, showsController.updateShow);
router.get('/get_by_id/:id', authGuard, showsController.showById);

module.exports = router;
