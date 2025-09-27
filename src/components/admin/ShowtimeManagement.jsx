import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Clock, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useShowtimes } from '../../contexts/ShowtimeContext';
import { useMovies } from '../../contexts/MovieContext';
import { useTheaters } from '../../contexts/TheaterContext';

const ShowtimeManagement = () => {
  const { showtimes, addShowtime, updateShowtime, deleteShowtime } = useShowtimes();
  const { movies } = useMovies();
  const { theaters } = useTheaters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    theaterId: '',
    date: '',
    time: '',
    price: '',
    totalSeats: ''
  });

  const filteredShowtimes = showtimes.filter(showtime => {
    const movie = movies.find(m => m.id === showtime.movieId);
    const theater = theaters.find(t => t.id === showtime.theaterId);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      movie?.title?.toLowerCase().includes(searchLower) ||
      theater?.name?.toLowerCase().includes(searchLower) ||
      showtime.date.includes(searchTerm) ||
      showtime.time.includes(searchTerm)
    );
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const showtimeData = {
      ...formData,
      movieId: parseInt(formData.movieId),
      theaterId: parseInt(formData.theaterId),
      price: parseInt(formData.price),
      totalSeats: parseInt(formData.totalSeats)
    };

    if (editingShowtime) {
      updateShowtime(editingShowtime.id, showtimeData);
      setEditingShowtime(null);
    } else {
      addShowtime(showtimeData);
    }
    
    setFormData({
      movieId: '',
      theaterId: '',
      date: '',
      time: '',
      price: '',
      totalSeats: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (showtime) => {
    setEditingShowtime(showtime);
    setFormData({
      movieId: showtime.movieId.toString(),
      theaterId: showtime.theaterId.toString(),
      date: showtime.date,
      time: showtime.time,
      price: showtime.price.toString(),
      totalSeats: showtime.totalSeats.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = (showtimeId) => {
    if (confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) {
      deleteShowtime(showtimeId);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie?.title || 'Unknown Movie';
  };

  const getTheaterName = (theaterId) => {
    const theater = theaters.find(t => t.id === theaterId);
    return theater?.name || 'Unknown Theater';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý lịch chiếu</h1>
          <p className="text-gray-400">Quản lý thời gian chiếu phim và giá vé</p>
        </div>
        <button 
          onClick={() => {
            setEditingShowtime(null);
            setFormData({
              movieId: '',
              theaterId: '',
              date: '',
              time: '',
              price: '',
              totalSeats: ''
            });
            setShowAddForm(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm lịch chiếu
        </button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo phim, rạp, ngày chiếu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Showtimes List */}
      <div className="grid gap-4">
        {filteredShowtimes.map((showtime) => (
          <div key={showtime.id} className="glass-card rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  {getMovieTitle(showtime.movieId)}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {getTheaterName(showtime.theaterId)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(showtime.date).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {showtime.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatPrice(showtime.price)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400">
                    Còn trống: {showtime.availableSeats}/{showtime.totalSeats} ghế
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    showtime.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {showtime.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(showtime)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(showtime.id)}
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Showtime Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl border border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingShowtime ? 'Sửa lịch chiếu' : 'Thêm lịch chiếu mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Phim *</label>
                  <select
                    name="movieId"
                    value={formData.movieId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Chọn phim</option>
                    {movies.map(movie => (
                      <option key={movie.id} value={movie.id}>{movie.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Rạp chiếu *</label>
                  <select
                    name="theaterId"
                    value={formData.theaterId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Chọn rạp</option>
                    {theaters.map(theater => (
                      <option key={theater.id} value={theater.id}>{theater.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Ngày chiếu *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Giờ chiếu *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Giá vé (VND) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Tổng số ghế *</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
                  >
                    {editingShowtime ? 'Cập nhật' : 'Thêm lịch chiếu'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimeManagement;