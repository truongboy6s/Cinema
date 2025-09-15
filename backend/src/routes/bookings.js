const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user bookings
router.get('/', auth, (req, res) => {
  res.json({ success: true, message: 'Bookings endpoint - Coming soon' });
});

module.exports = router;