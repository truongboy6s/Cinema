const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all movies
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Movies endpoint - Coming soon' });
});

module.exports = router;