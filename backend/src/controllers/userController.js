const User = require('../models/User');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    console.log('👥 Admin requesting all users');
    
    const users = await User.find({})
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${users.length} users in database`);

    res.status(200).json({
      success: true,
      data: {
        users,
        total: users.length
      }
    });

  } catch (error) {
    console.error('❌ Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách người dùng'
    });
  }
};

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
  try {
    console.log('📊 Admin requesting user stats');
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    // Users created today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const newToday = await User.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    // Get total bookings (if Booking model exists)
    let totalBookings = 0;
    try {
      const Booking = require('../models/Booking');
      totalBookings = await Booking.countDocuments();
    } catch (error) {
      console.log('📝 Booking model not available for stats');
    }

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newToday,
      totalBookings
    };

    console.log('✅ User stats calculated:', stats);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê người dùng'
    });
  }
};

// Update user status (admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    console.log(`🔄 Admin updating user ${userId} status to:`, isActive);

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    console.log('✅ User status updated successfully');

    res.status(200).json({
      success: true,
      message: `${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công`,
      data: { user }
    });

  } catch (error) {
    console.error('❌ Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái người dùng'
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`🗑️ Admin deleting user:`, userId);

    // Don't allow deleting admin accounts
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản admin'
      });
    }

    await User.findByIdAndDelete(userId);

    console.log('✅ User deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công'
    });

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa người dùng'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  updateUserStatus,
  deleteUser
};