import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatLayout from './pages/SeatLayout';
import MyBooking from './pages/MyBooking';
import Favorite from './pages/Favorite';
import Movies from './pages/Movies';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Favorites from './pages/Favorite';
import Releases from './pages/Releases';
import Theaters from './pages/Theaters';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetail />} />
        <Route path="/movies/book/:movieId/:showId" element={
          <ProtectedRoute>
            <SeatLayout />
          </ProtectedRoute>
        } />    
        <Route path='/my-booking' element={
          <ProtectedRoute>
            <MyBooking />
          </ProtectedRoute>
        } />
        <Route path='/favorites' element={
          <ProtectedRoute>
            <Favorites/>
          </ProtectedRoute>
        } />
        <Route path='/releases' element={<Releases/>} />
        <Route path='/theaters' element={<Theaters/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
