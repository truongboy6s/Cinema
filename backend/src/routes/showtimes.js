const express = require('express');
const router = express.Router();
const {
  getAllShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAvailableTimeSlots,
  copyShowtimes
} = require('../controllers/showtimeController');

// Get all showtimes
router.get('/', getAllShowtimes);

// Get available time slots for a specific theater/room/date
router.get('/available-slots', getAvailableTimeSlots);

// Copy showtimes from one date to another
router.post('/copy', copyShowtimes);

// Get showtime by ID
router.get('/:id', getShowtimeById);

// Create new showtime
router.post('/', createShowtime);

// Update showtime
router.put('/:id', updateShowtime);

// Delete showtime
router.delete('/:id', deleteShowtime);

module.exports = router;