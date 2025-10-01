import { apiClient } from './api';

// Movie API functions
export const movieAPI = {
  // Get all movies
  getAll: () => apiClient.get('/movies'),
  
  // Get movie by ID
  getById: (id) => apiClient.get(`/movies/${id}`),
  
  // Create new movie
  create: (movieData) => apiClient.post('/movies', movieData),
  
  // Update movie
  update: (id, movieData) => apiClient.put(`/movies/${id}`, movieData),
  
  // Delete movie
  delete: (id) => apiClient.delete(`/movies/${id}`),
  
  // Upload movie poster
  uploadPoster: (id, file) => {
    const formData = new FormData();
    formData.append('poster', file);
    return apiClient.upload(`/movies/${id}/poster`, formData);
  },
  
  // Get movies by status
  getByStatus: (status) => apiClient.get(`/movies?status=${status}`),
  
  // Search movies
  search: (query) => apiClient.get(`/movies/search?q=${encodeURIComponent(query)}`),
};

// User API functions
export const userAPI = {
  // Get all users (admin only)
  getAll: () => apiClient.get('/users'),
  
  // Get user by ID
  getById: (id) => apiClient.get(`/users/${id}`),
  
  // Create new user
  create: (userData) => apiClient.post('/users', userData),
  
  // Update user
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  
  // Delete user
  delete: (id) => apiClient.delete(`/users/${id}`),
  
  // Toggle user status
  toggleStatus: (id) => apiClient.put(`/users/${id}/toggle-status`),
  
  // Get user statistics
  getStats: () => apiClient.get('/users/stats'),
  
  // Register new user
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => apiClient.post('/auth/login', credentials),
  
  // Get current user profile
  getProfile: () => apiClient.get('/users/profile'),
  
  // Update user profile
  updateProfile: (userData) => apiClient.put('/users/profile', userData),
};

// Theater API functions
export const theaterAPI = {
  // Get all theaters
  getAll: () => apiClient.get('/theaters'),
  
  // Get theater by ID
  getById: (id) => apiClient.get(`/theaters/${id}`),
  
  // Create new theater
  create: (theaterData) => apiClient.post('/theaters', theaterData),
  
  // Update theater
  update: (id, theaterData) => apiClient.put(`/theaters/${id}`, theaterData),
  
  // Delete theater
  delete: (id) => apiClient.delete(`/theaters/${id}`),
  
  // Get theaters by status
  getByStatus: (status) => apiClient.get(`/theaters?status=${status}`),
};

// Showtime API functions  
export const showtimeAPI = {
  // Get all showtimes
  getAll: () => apiClient.get('/showtimes'),
  
  // Get showtime by ID
  getById: (id) => apiClient.get(`/showtimes/${id}`),
  
  // Create new showtime
  create: (showtimeData) => apiClient.post('/showtimes', showtimeData),
  
  // Update showtime
  update: (id, showtimeData) => apiClient.put(`/showtimes/${id}`, showtimeData),
  
  // Delete showtime
  delete: (id) => apiClient.delete(`/showtimes/${id}`),
  
  // Get showtimes by movie
  getByMovie: (movieId) => apiClient.get(`/showtimes?movieId=${movieId}`),
  
  // Get showtimes by theater
  getByTheater: (theaterId) => apiClient.get(`/showtimes?theaterId=${theaterId}`),
  
  // Get showtimes by date
  getByDate: (date) => apiClient.get(`/showtimes?date=${date}`),
};

// Booking API functions
export const bookingAPI = {
  // Get all bookings (admin only)
  getAll: () => apiClient.get('/bookings'),
  
  // Get booking by ID
  getById: (id) => apiClient.get(`/bookings/${id}`),
  
  // Create new booking
  create: (bookingData) => apiClient.post('/bookings', bookingData),
  
  // Update booking
  update: (id, bookingData) => apiClient.put(`/bookings/${id}`, bookingData),
  
  // Cancel booking
  cancel: (id) => apiClient.put(`/bookings/${id}/cancel`),
  
  // Confirm booking
  confirm: (id) => apiClient.put(`/bookings/${id}/confirm`),
  
  // Get user bookings
  getUserBookings: () => apiClient.get('/bookings/user'),
  
  // Get booking statistics
  getStats: () => apiClient.get('/bookings/stats'),
  
  // Process payment
  processPayment: (bookingId, paymentData) => 
    apiClient.post(`/bookings/${bookingId}/payment`, paymentData),
};

// Admin API functions
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  
  // Get revenue analytics
  getRevenueAnalytics: (period = 'month') => 
    apiClient.get(`/admin/analytics/revenue?period=${period}`),
  
  // Get user analytics
  getUserAnalytics: () => apiClient.get('/admin/analytics/users'),
  
  // Get movie analytics
  getMovieAnalytics: () => apiClient.get('/admin/analytics/movies'),
  
  // Admin login
  login: (credentials) => apiClient.post('/auth/admin-login', credentials),
  
  // Get system settings
  getSettings: () => apiClient.get('/admin/settings'),
  
  // Update system settings
  updateSettings: (settings) => apiClient.put('/admin/settings', settings),
};