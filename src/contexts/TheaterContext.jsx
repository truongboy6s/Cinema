import React, { createContext, useContext, useState, useEffect } from 'react';

const TheaterContext = createContext();

export const useTheaters = () => {
  const context = useContext(TheaterContext);
  if (!context) {
    throw new Error('useTheaters must be used within a TheaterProvider');
  }
  return context;
};

export const TheaterProvider = ({ children }) => {
  const [theaters, setTheaters] = useState(() => {
    const savedTheaters = localStorage.getItem('cinema_theaters');
    if (savedTheaters) {
      try {
        return JSON.parse(savedTheaters);
      } catch (error) {
        console.error('Error parsing saved theaters:', error);
      }
    }
    
    // No default sample data - start with empty array
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cinema_theaters', JSON.stringify(theaters));
  }, [theaters]);

  const addTheater = (theaterData) => {
    const newTheater = {
      ...theaterData,
      id: Date.now(),
      status: 'active'
    };
    
    setTheaters(prevTheaters => [...prevTheaters, newTheater]);
    return newTheater;
  };

  const updateTheater = (theaterId, updatedData) => {
    setTheaters(prevTheaters =>
      prevTheaters.map(theater =>
        theater.id === theaterId
          ? { ...theater, ...updatedData }
          : theater
      )
    );
  };

  const deleteTheater = (theaterId) => {
    setTheaters(prevTheaters => 
      prevTheaters.filter(theater => theater.id !== theaterId)
    );
  };

  const getTheaterById = (theaterId) => {
    return theaters.find(theater => theater.id === parseInt(theaterId));
  };

  const getTheatersByType = (type) => {
    return theaters.filter(theater => theater.type === type);
  };

  const getActiveTheaters = () => {
    return theaters.filter(theater => theater.status === 'active');
  };

  const value = {
    theaters,
    addTheater,
    updateTheater,
    deleteTheater,
    getTheaterById,
    getTheatersByType,
    getActiveTheaters,
    setTheaters
  };

  return (
    <TheaterContext.Provider value={value}>
      {children}
    </TheaterContext.Provider>
  );
};

export default TheaterContext;