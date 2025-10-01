import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUsers } from './UserContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addUser, users } = useUsers();

  // Kiểm tra user đã đăng nhập từ localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cinema_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      localStorage.removeItem('cinema_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Kiểm tra trạng thái user real-time
  useEffect(() => {
    if (user && users.length > 0) {
      const currentUser = users.find(u => u.id === user.id);
      if (currentUser) {
        if (currentUser.status !== 'active') {
          // User bị khóa, tự động logout
          toast.error('Tài khoản của bạn đã bị tạm khóa!');
          logout();
        } else if (currentUser.status !== user.status || currentUser.name !== user.name || currentUser.email !== user.email) {
          // Chỉ cập nhật khi có thay đổi thực sự
          const updatedUser = { ...currentUser };
          delete updatedUser.password;
          setUser(updatedUser);
          localStorage.setItem('cinema_user', JSON.stringify(updatedUser));
        }
      }
    }
  }, [users]);

  const login = async (email, password) => {
    try {
      // Use UserContext data for login
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Check if user account is active
        if (foundUser.status !== 'active') {
          toast.error('Tài khoản của bạn đã bị tạm khóa!');
          return { success: false, error: 'Account inactive' };
        }

        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        localStorage.setItem('cinema_user', JSON.stringify(userWithoutPassword));
        toast.success('Đăng nhập thành công!');
        return { success: true };
      } else {
        toast.error('Email hoặc mật khẩu không đúng!');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng nhập!');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        toast.error('Email đã được sử dụng!');
        return { success: false, error: 'Email already exists' };
      }

      // Add user to UserContext (this will handle localStorage automatically)
      const newUser = await addUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        role: 'user',
        status: 'active'
      });
      
      // Auto login after registration
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('cinema_user', JSON.stringify(userWithoutPassword));
      
      toast.success('Đăng ký thành công!');
      return { success: true };
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký!');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinema_user');
    toast.success('Đăng xuất thành công!');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
