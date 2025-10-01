import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem('cinema_bookings');
    if (savedBookings) {
      try {
        return JSON.parse(savedBookings);
      } catch (error) {
        console.error('Error parsing saved bookings:', error);
      }
    }
    
    // No default sample data - start with empty array
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cinema_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: 'pending'
    };
    
    setBookings(prevBookings => [...prevBookings, newBooking]);
    return newBooking;
  };

  const updateBooking = (bookingId, updatedData) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, ...updatedData }
          : booking
      )
    );
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === parseInt(bookingId)
          ? { ...booking, status }
          : booking
      )
    );
  };

  const deleteBooking = (bookingId) => {
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== bookingId)
    );
  };

  const getBookingById = (bookingId) => {
    return bookings.find(booking => booking.id === parseInt(bookingId));
  };

  const getBookingsByUser = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  const getBookingsByDate = (date) => {
    return bookings.filter(booking => booking.showDate === date);
  };

  const getBookingsByMovie = (movieId) => {
    return bookings.filter(booking => booking.movieId === parseInt(movieId));
  };

  const confirmBooking = (bookingId) => {
    updateBooking(bookingId, { 
      status: 'confirmed', 
      paymentStatus: 'paid' 
    });
  };

  const cancelBooking = (bookingId) => {
    updateBooking(bookingId, { 
      status: 'cancelled',
      paymentStatus: 'refunded' 
    });
  };

  const getTotalRevenue = () => {
    return bookings
      .filter(booking => booking.paymentStatus === 'paid')
      .reduce((total, booking) => total + booking.totalAmount, 0);
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const revenue = getTotalRevenue();

    // Tính toán số ghế và giá trung bình
    const totalSeats = bookings.reduce((sum, booking) => sum + (booking.seats?.length || 0), 0);
    const averagePricePerSeat = totalSeats > 0 ? revenue / totalSeats : 0;

    return {
      total,
      confirmed,
      pending,
      cancelled,
      completed,
      revenue,
      totalSeats,
      averagePricePerSeat
    };
  };

  const validateBookingAmount = (seats, totalAmount) => {
    // Giá cơ bản mỗi ghế (có thể tùy chỉnh theo rạp/phim)
    const basePrice = 80000; // 80,000 VND mỗi ghế
    const expectedAmount = seats.length * basePrice;
    return Math.abs(totalAmount - expectedAmount) < 1000; // Cho phép sai lệch nhỏ
  };

  const value = {
    bookings,
    addBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
    getBookingById,
    getBookingsByUser,
    getBookingsByStatus,
    getBookingsByDate,
    getBookingsByMovie,
    confirmBooking,
    cancelBooking,
    getTotalRevenue,
    getBookingStats,
    validateBookingAmount,
    setBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;