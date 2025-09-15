import React, { createContext, useContext, useState, useEffect } from 'react';

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
      // Demo admin accounts
      const demoAdminAccounts = [
        { email: 'admin@cinema.com', password: 'admin123', fullName: 'Cinema Administrator' },
        { email: 'demo@admin.com', password: 'demo123', fullName: 'Demo Administrator' }
      ];

      // Try demo accounts first
      const demoAdmin = demoAdminAccounts.find(
        admin => admin.email === email && admin.password === password
      );

      if (demoAdmin) {
        const adminUserData = {
          id: 'admin_' + Date.now(),
          fullName: demoAdmin.fullName,
          email: demoAdmin.email,
          role: 'admin',
          token: 'admin_token_' + Date.now()
        };

        setAdminUser(adminUserData);
        localStorage.setItem('cinema_admin', JSON.stringify(adminUserData));
        localStorage.setItem('cinema_admin_token', adminUserData.token);
        
        return true;
      }

      // Try backend API (will create this endpoint)
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setAdminUser(data.data.user);
          localStorage.setItem('cinema_admin', JSON.stringify(data.data.user));
          localStorage.setItem('cinema_admin_token', data.data.token);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Admin login error:', error);
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