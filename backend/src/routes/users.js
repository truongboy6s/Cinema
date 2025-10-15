const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const {
  getAllUsers,
  getUserStats,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Admin routes for user management
router.get('/', auth, adminOnly, getAllUsers);
router.get('/stats', auth, adminOnly, getUserStats);
router.patch('/:userId/status', auth, adminOnly, updateUserStatus);
router.delete('/:userId', auth, adminOnly, deleteUser);

module.exports = router;