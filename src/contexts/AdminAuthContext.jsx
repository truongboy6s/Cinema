import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/apiServices';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  // Initialize admin authentication state
  useEffect(() => {
    const initializeAdminAuth = () => {
      try {
        const storedAdminUser = localStorage.getItem('cinema_admin');
        const storedAdminToken = localStorage.getItem('cinema_admin_token');
        
        if (storedAdminUser && storedAdminToken) {
          const parsedAdminUser = JSON.parse(storedAdminUser);
          setAdminUser(parsedAdminUser);
        }
      } catch (error) {
        console.error('Error initializing admin auth:', error);
        localStorage.removeItem('cinema_admin');
        localStorage.removeItem('cinema_admin_token');
      } finally {
        setAdminLoading(false);
      }
    };

    initializeAdminAuth();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      console.log('🔐 Attempting backend API login...');
      
      // Try backend API first (real JWT authentication)
      const response = await adminAPI.login({ email, password });
      
      if (response.success) {
        console.log('✅ Backend API login successful');
        const adminUserData = response.data.user;
        adminUserData.token = response.data.token;
        
        setAdminUser(adminUserData);
        localStorage.setItem('cinema_admin', JSON.stringify(adminUserData));
        localStorage.setItem('cinema_admin_token', response.data.token);
        return true;
      }
      
      console.log('❌ Backend API login failed');
      return false;
    } catch (error) {
      console.error('❌ Admin login error:', error);
      
      // Fallback to demo accounts for development
      console.log('🔄 Trying demo accounts as fallback...');
      const demoAdminAccounts = [
        { email: 'admin@cinema.com', password: 'admin123', fullName: 'Cinema Administrator' },
        { email: 'demo@admin.com', password: 'demo123', fullName: 'Demo Administrator' }
      ];

      const demoAdmin = demoAdminAccounts.find(
        admin => admin.email === email && admin.password === password
      );

      if (demoAdmin) {
        console.log('⚠️ Using demo admin account (development only)');
        const adminUserData = {
          id: 'admin_' + Date.now(),
          fullName: demoAdmin.fullName,
          email: demoAdmin.email,
          role: 'admin',
          token: 'demo_admin_token_' + Date.now()
        };

        setAdminUser(adminUserData);
        localStorage.setItem('cinema_admin', JSON.stringify(adminUserData));
        localStorage.setItem('cinema_admin_token', adminUserData.token);
        
        return true;
      }
      
      return false;
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('cinema_admin');
    localStorage.removeItem('cinema_admin_token');
  };

  const isAdminAuthenticated = !!adminUser;

  const value = {
    adminUser,
    adminLoading,
    isAdminAuthenticated,
    adminLogin,
    adminLogout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};