import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, adminLoading, adminUser } = useAdminAuth();
  const location = useLocation();

  console.log('AdminProtectedRoute - adminUser:', adminUser); // Debug log
  console.log('AdminProtectedRoute - isAdminAuthenticated:', isAdminAuthenticated); // Debug log

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Đang kiểm tra đăng nhập admin...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    // Redirect to admin login page with return url
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;