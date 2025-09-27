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
    
    // Default bookings
    return [
      {
        id: 1,
        userId: 'user_1',
        movieId: 1,
        theaterId: 1,
        showtimeId: 1,
        bookingDate: '2024-12-19',
        showDate: '2024-12-20',
        showTime: '14:30',
        seats: ['A1', 'A2'],
        totalAmount: 160000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        createdAt: '2024-12-19T10:00:00Z',
        customerInfo: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789'
        }
      },
      {
        id: 2,
        userId: 'user_2',
        movieId: 2,
        theaterId: 2,
        showtimeId: 3,
        bookingDate: '2024-12-20',
        showDate: '2024-12-21',
        showTime: '19:30',
        seats: ['B5', 'B6', 'B7'],
        totalAmount: 360000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'bank_transfer',
        createdAt: '2024-12-20T14:30:00Z',
        customerInfo: {
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654321'
        }
      },
      {
        id: 3,
        userId: 'user_3',
        movieId: 1,
        theaterId: 1,
        showtimeId: 2,
        bookingDate: '2024-12-20',
        showDate: '2024-12-20',
        showTime: '17:00',
        seats: ['C10'],
        totalAmount: 100000,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
        createdAt: '2024-12-20T12:15:00Z',
        customerInfo: {
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          phone: '0369258147'
        }
      }
    ];
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