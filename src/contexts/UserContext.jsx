import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('cinema_users');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (error) {
        console.error('Error parsing saved users:', error);
      }
    }
    
    // No default users - start with empty array
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cinema_users', JSON.stringify(users));
  }, [users]);

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      isActive: true,
      joinDate: new Date().toISOString().split('T')[0],
      bookings: 0,
      createdAt: new Date().toISOString()
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    return newUser;
  };

  const updateUser = (userId, updatedData) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === parseInt(userId)
          ? { ...user, ...updatedData }
          : user
      )
    );
  };

  const deleteUser = (userId) => {
    setUsers(prevUsers => 
      prevUsers.filter(user => user.id !== parseInt(userId))
    );
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === parseInt(userId));
  };

  const getUserByEmail = (email) => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  };

  const toggleUserStatus = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === parseInt(userId)
          ? { ...user, isActive: !user.isActive }
          : user
      )
    );
  };

  const incrementUserBookings = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === parseInt(userId)
          ? { ...user, bookings: user.bookings + 1 }
          : user
      )
    );
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const inactive = users.filter(u => !u.isActive).length;
    const totalBookings = users.reduce((sum, u) => sum + u.bookings, 0);
    
    const today = new Date().toDateString();
    const newToday = users.filter(u => {
      const userDate = new Date(u.joinDate);
      return userDate.toDateString() === today;
    }).length;

    return {
      total,
      active,
      inactive,
      totalBookings,
      newToday
    };
  };

  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByEmail,
    toggleUserStatus,
    incrementUserBookings,
    getUserStats,
    setUsers
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;