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
    
    // Default theaters
    return [
      {
        id: 1,
        name: 'Rạp 1 - Deluxe',
        type: 'deluxe',
        capacity: 150,
        facilities: ['3D', 'Dolby Atmos', 'Recliner Seats'],
        status: 'active',
        location: 'Tầng 3',
        description: 'Rạp cao cấp với ghế ngồi sang trọng và âm thanh vượt trội'
      },
      {
        id: 2,
        name: 'Rạp 2 - IMAX',
        type: 'imax',
        capacity: 200,
        facilities: ['IMAX', '4DX', 'Laser Projection'],
        status: 'active',
        location: 'Tầng 4',
        description: 'Rạp IMAX với màn hình khổng lồ và công nghệ chiếu laser'
      },
      {
        id: 3,
        name: 'Rạp 3 - Standard',
        type: 'standard',
        capacity: 100,
        facilities: ['Digital Sound', 'Standard Screen'],
        status: 'active',
        location: 'Tầng 2',
        description: 'Rạp tiêu chuẩn phù hợp cho mọi loại phim'
      },
      {
        id: 4,
        name: 'Rạp 4 - VIP',
        type: 'vip',
        capacity: 50,
        facilities: ['Private Lounge', 'Premium Service', 'Luxury Seats'],
        status: 'active',
        location: 'Tầng 5',
        description: 'Rạp VIP với dịch vụ cao cấp và không gian riêng tư'
      }
    ];
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