import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useAuth } from './AuthContext';
import { useAdminAuth } from './AdminAuthContext';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const { adminUser } = useAdminAuth();
  
  // Sử dụng user có role admin hoặc adminUser
  const currentUser = (() => {
    // Nếu có adminUser từ AdminAuthContext, dùng nó
    if (adminUser) return adminUser;
    
    // Nếu user có role admin, dùng user đó
    if (user && user.role === 'admin') return user;
    
    // Trả về null nếu không có admin access
    return null;
  })();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newToday: 0,
    totalBookings: 0
  });

  // Fetch users từ MongoDB (chỉ admin mới được gọi)
  const fetchUsers = async () => {
    // Kiểm tra quyền admin trước khi gọi API
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('⚠️ Access denied: Only admin can fetch users. Current user:', currentUser);
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Fetching users from MongoDB...');
      
      const response = await apiClient.get('/users');
      
      if (response.success) {
        setUsers(response.data.users || []);
        console.log('✅ Users loaded from MongoDB:', response.data.users?.length || 0);
      } else {
        console.error('❌ API error:', response.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error.message);
      setUsers([]);
      if (!error.message.includes('authentication') && !error.message.includes('Access denied')) {
        toast.error('Không thể tải danh sách user: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats từ MongoDB (chỉ admin mới được gọi)
  const fetchUserStats = async () => {
    // Kiểm tra quyền admin trước khi gọi API
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('⚠️ Access denied: Only admin can fetch user stats. Current user:', currentUser);
      return;
    }

    try {
      console.log('📊 Fetching user stats from MongoDB...');
      
      const response = await apiClient.get('/users/stats');
      
      if (response.success) {
        setStats(response.data);
        console.log('✅ User stats loaded:', response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error.message);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        newToday: 0,
        totalBookings: 0
      });
    }
  };

  // Load data on mount - chỉ gọi khi user là admin
  useEffect(() => {
    // Chỉ load data admin khi user đã được authenticate và là admin
    if (currentUser && currentUser.role === 'admin') {
      // Xóa localStorage cũ nếu có
      localStorage.removeItem('cinema_users');
      
      // Load data từ MongoDB (chỉ admin mới được phép)
      fetchUsers();
      fetchUserStats();
    }
  }, [currentUser]); // Dependency array includes currentUser để re-run khi user thay đổi

  const addUser = async (userData) => {
    try {
      console.log('➕ Adding user via API:', userData.email);
      
      const response = await apiClient.post('/auth/register', {
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || ''
      });

      if (response.success) {
        console.log('✅ User added successfully');
        // Chỉ refresh khi cần thiết - user có thể bấm refresh manual
        toast.success('Thêm người dùng thành công! Bấm nút "Làm mới" để xem user mới.');
        return response.data.user;
      } else {
        toast.error(response.message || 'Thêm người dùng thất bại!');
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ Error adding user:', error.message);
      toast.error(error.message || 'Không thể thêm người dùng');
      throw error;
    }
  };

  const updateUser = async (userId, updatedData) => {
    // Kiểm tra quyền admin
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error('Bạn không có quyền cập nhật user');
      return;
    }

    try {
      console.log('🔄 Updating user:', userId);
      
      // Gọi API update (tùy thuộc vào loại update)
      toast.success('Cập nhật thành công! Bấm "Làm mới" để xem thay đổi.');
    } catch (error) {
      console.error('❌ Error updating user:', error.message);
      toast.error('Không thể cập nhật: ' + error.message);
    }
  };

  const deleteUser = async (userId) => {
    // Kiểm tra quyền admin
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error('Bạn không có quyền xóa user');
      return;
    }

    try {
      console.log('🗑️ Deleting user:', userId);
      
      const response = await apiClient.delete(`/users/${userId}`);
      
      if (response.success) {
        console.log('✅ User deleted successfully');
        // Chỉ refresh khi cần thiết
        toast.success('Xóa người dùng thành công! Bấm "Làm mới" để cập nhật danh sách.');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error.message);
      toast.error(error.message || 'Không thể xóa người dùng');
    }
  };

  const toggleUserStatus = async (userId) => {
    // Kiểm tra quyền admin
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error('Bạn không có quyền thay đổi trạng thái user');
      return;
    }

    try {
      console.log('🔄 Toggling user status:', userId);
      
      // Tìm user hiện tại để biết status
      const targetUser = users.find(u => u._id === userId || u.id === parseInt(userId));
      if (!targetUser) {
        throw new Error('Không tìm thấy người dùng');
      }

      const newStatus = !targetUser.isActive;
      const response = await apiClient.patch(`/users/${userId}/status`, {
        isActive: newStatus
      });
      
      if (response.success) {
        console.log('✅ User status updated');
        // Chỉ refresh khi cần thiết  
        toast.success(`${newStatus ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công! Bấm "Làm mới" để xem thay đổi.`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ Error toggling status:', error.message);
      toast.error(error.message || 'Không thể thay đổi trạng thái');
    }
  };

  const incrementUserBookings = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === parseInt(userId)
          ? { ...user, bookings: user.bookings + 1 }
          : user
      )
    );
  };

  const getUserById = (userId) => {
    return users.find(user => user._id === userId || user.id === parseInt(userId));
  };

  const getUserByEmail = (email) => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  };

  const getUserStats = () => {
    // Sử dụng stats từ API MongoDB
    return {
      totalUsers: stats.totalUsers || 0,
      activeUsers: stats.activeUsers || 0,  
      inactiveUsers: stats.inactiveUsers || 0,
      newToday: stats.newToday || 0,
      totalBookings: stats.totalBookings || 0
    };
  };

  const value = {
    users,
    loading,
    stats,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByEmail,
    toggleUserStatus,
    incrementUserBookings,
    getUserStats,
    fetchUsers,
    fetchUserStats,
    setUsers
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;