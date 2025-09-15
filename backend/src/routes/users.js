const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, adminOnly, (req, res) => {
  res.json({ success: true, message: 'Users endpoint - Coming soon' });
});

module.exports = router;