const express = require('express');
const { bookAppointment } = require('../controllers/appointmentController');

const router = express.Router();

/**
 * POST /api/appointment/book
 */
router.post('/book', bookAppointment);

module.exports = router;
