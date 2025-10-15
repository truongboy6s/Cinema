const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getBookingStats,
  getAllBookings
} = require('../controllers/bookingController');

const router = express.Router();

// User routes
router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/:id', auth, getBookingById);
router.patch('/:id/cancel', auth, cancelBooking);

// Admin routes
router.get('/admin/all', auth, getAllBookings);
router.get('/admin/stats', auth, getBookingStats);

module.exports = router;