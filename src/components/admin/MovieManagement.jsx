import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Star, Calendar, Clock } from 'lucide-react';

const MovieManagement = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: 'Spider-Man: No Way Home',
      genre: 'Action, Adventure',
      duration: 148,
      rating: 4.8,
      releaseDate: '2024-12-15',
      status: 'showing',
      poster: '/api/placeholder/100/150'
    },
    {
      id: 2,
      title: 'The Batman',
      genre: 'Action, Crime, Drama',
      duration: 176,
      rating: 4.7,
      releaseDate: '2024-03-04',
      status: 'showing',
      poster: '/api/placeholder/100/150'
    },
    {
      id: 3,
      title: 'Doctor Strange 2',
      genre: 'Action, Adventure, Fantasy',
      duration: 126,
      rating: 4.6,
      releaseDate: '2024-05-06',
      status: 'coming-soon',
      poster: '/api/placeholder/100/150'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'showing':
        return 'bg-green-500/20 text-green-400';
      case 'coming-soon':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'ended':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'showing':
        return 'Đang chiếu';
      case 'coming-soon':
        return 'Sắp chiếu';
      case 'ended':
        return 'Đã kết thúc';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý phim</h1>
          <p className="text-gray-400">Quản lý danh sách phim và thông tin chiếu</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200">
          <Plus className="w-5 h-5 mr-2" />
          Thêm phim mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phim hoặc thể loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <select className="px-4 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500">
            <option value="">Tất cả trạng thái</option>
            <option value="showing">Đang chiếu</option>
            <option value="coming-soon">Sắp chiếu</option>
            <option value="ended">Đã kết thúc</option>
          </select>
          <select className="px-4 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500">
            <option value="">Tất cả thể loại</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="glass-card rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-200">
            {/* Movie Poster */}
            <div className="relative aspect-[2/3] bg-slate-800">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/300/450';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(movie.status)}`}>
                  {getStatusText(movie.status)}
                </span>
              </div>
            </div>

            {/* Movie Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-400 text-sm">{movie.genre}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {movie.duration} phút
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {movie.rating}
                  </div>
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-colors">
                  <Eye className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  <Edit className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Tổng phim</h3>
          <p className="text-3xl font-bold text-cyan-400">{movies.length}</p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Đang chiếu</h3>
          <p className="text-3xl font-bold text-green-400">
            {movies.filter(m => m.status === 'showing').length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Sắp chiếu</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {movies.filter(m => m.status === 'coming-soon').length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Đánh giá TB</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {(movies.reduce((acc, m) => acc + m.rating, 0) / movies.length).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieManagement;