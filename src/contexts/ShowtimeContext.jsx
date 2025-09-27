import React, { createContext, useContext, useState, useEffect } from 'react';

const ShowtimeContext = createContext();

export const useShowtimes = () => {
  const context = useContext(ShowtimeContext);
  if (!context) {
    throw new Error('useShowtimes must be used within a ShowtimeProvider');
  }
  return context;
};

export const ShowtimeProvider = ({ children }) => {
  const [showtimes, setShowtimes] = useState(() => {
    const savedShowtimes = localStorage.getItem('cinema_showtimes');
    if (savedShowtimes) {
      try {
        return JSON.parse(savedShowtimes);
      } catch (error) {
        console.error('Error parsing saved showtimes:', error);
      }
    }
    
    // Default showtimes
    return [
      {
        id: 1,
        movieId: 1,
        theaterId: 1,
        date: '2024-12-20',
        time: '14:30',
        price: 80000,
        availableSeats: 120,
        totalSeats: 150,
        status: 'active'
      },
      {
        id: 2,
        movieId: 1,
        theaterId: 1,
        date: '2024-12-20',
        time: '17:00',
        price: 100000,
        availableSeats: 95,
        totalSeats: 150,
        status: 'active'
      },
      {
        id: 3,
        movieId: 2,
        theaterId: 2,
        date: '2024-12-21',
        time: '19:30',
        price: 120000,
        availableSeats: 80,
        totalSeats: 200,
        status: 'active'
      },
      {
        id: 4,
        movieId: 3,
        theaterId: 3,
        date: '2024-12-22',
        time: '15:45',
        price: 90000,
        availableSeats: 60,
        totalSeats: 100,
        status: 'active'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('cinema_showtimes', JSON.stringify(showtimes));
  }, [showtimes]);

  const addShowtime = (showtimeData) => {
    const newShowtime = {
      ...showtimeData,
      id: Date.now(),
      availableSeats: showtimeData.totalSeats || showtimeData.availableSeats,
      status: 'active'
    };
    
    setShowtimes(prevShowtimes => [...prevShowtimes, newShowtime]);
    return newShowtime;
  };

  const updateShowtime = (showtimeId, updatedData) => {
    setShowtimes(prevShowtimes =>
      prevShowtimes.map(showtime =>
        showtime.id === showtimeId
          ? { ...showtime, ...updatedData }
          : showtime
      )
    );
  };

  const deleteShowtime = (showtimeId) => {
    setShowtimes(prevShowtimes => 
      prevShowtimes.filter(showtime => showtime.id !== showtimeId)
    );
  };

  const getShowtimesByMovie = (movieId) => {
    return showtimes.filter(showtime => showtime.movieId === parseInt(movieId));
  };

  const getShowtimesByTheater = (theaterId) => {
    return showtimes.filter(showtime => showtime.theaterId === parseInt(theaterId));
  };

  const getShowtimesByDate = (date) => {
    return showtimes.filter(showtime => showtime.date === date);
  };

  const bookSeats = (showtimeId, numberOfSeats) => {
    setShowtimes(prevShowtimes =>
      prevShowtimes.map(showtime =>
        showtime.id === showtimeId
          ? { 
              ...showtime, 
              availableSeats: Math.max(0, showtime.availableSeats - numberOfSeats)
            }
          : showtime
      )
    );
  };

  const value = {
    showtimes,
    addShowtime,
    updateShowtime,
    deleteShowtime,
    getShowtimesByMovie,
    getShowtimesByTheater,
    getShowtimesByDate,
    bookSeats,
    setShowtimes
  };

  return (
    <ShowtimeContext.Provider value={value}>
      {children}
    </ShowtimeContext.Provider>
  );
};

export default ShowtimeContext;