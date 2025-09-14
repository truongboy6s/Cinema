import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

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

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual backend call
      const users = JSON.parse(localStorage.getItem('cinema_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
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
      // Simulate API call - replace with actual backend call
      const users = JSON.parse(localStorage.getItem('cinema_users') || '[]');
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        toast.error('Email đã được sử dụng!');
        return { success: false, error: 'Email already exists' };
      }

      // Add new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('cinema_users', JSON.stringify(users));
      
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
