const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getBookingStats,
  getAllBookings,
  getOccupiedSeats,
  simulatePaymentSuccess,
  simulatePaymentFailure
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

// Get occupied seats for a showtime
router.get('/showtime/:showtimeId/occupied-seats', getOccupiedSeats);

// Payment simulation routes
router.post('/payment/simulate-success/:bookingId', auth, simulatePaymentSuccess);
router.post('/payment/simulate-failure/:bookingId', auth, simulatePaymentFailure);

module.exports = router;