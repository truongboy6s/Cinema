import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Clock, MapPin, CreditCard, Star, Trash2, Eye, CheckCircle, XCircle, AlertCircle, Calendar, Search, Filter } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import { useMovies } from '../contexts/MovieContext';
import { useBookings } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';

const MyBooking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { movies, loading: moviesLoading } = useMovies();
  const { bookings, loading: bookingsLoading, error: bookingsError, cancelBooking } = useBookings();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'confirmed', 'cancelled', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_asc', 'date_desc', 'price_asc', 'price_desc'
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Filter and sort bookings
  const getFilteredBookings = () => {
    let filtered = bookings || [];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.bookingStatus === filterStatus);
    }

    // Search by movie title or seats
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.movieId?.title?.toLowerCase().includes(lowerQuery) ||
        b.bookingCode?.toLowerCase().includes(lowerQuery) ||
        b.seats?.map(seat => seat.seatNumber).join(', ').toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(`${a.showDate} ${a.showTime}`) - new Date(`${b.showDate} ${b.showTime}`);
        case 'date_desc':
          return new Date(`${b.showDate} ${b.showTime}`) - new Date(`${a.showDate} ${a.showTime}`);
        case 'price_asc':
          return a.totalAmount - b.totalAmount;
        case 'price_desc':
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredBookings = getFilteredBookings();
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  // Handle cancel booking
  const handleCancel = async (bookingId) => {
    if (window.confirm('Bạn có chắc muốn hủy vé này?')) {
      try {
        await cancelBooking(bookingId);
        // Success message will be shown by context
      } catch (error) {
        alert('Không thể hủy vé: ' + error.message);
      }
    }
  };

  // Handle rate movie (simulate)
  const handleRate = (movieId) => {
    alert(`Đánh giá phim ${movieId}. Chức năng này sẽ mở modal đánh giá sao và bình luận.`);
  };

  // Handle view details
  const handleViewDetails = (bookingId) => {
    alert(`Xem chi tiết booking ${bookingId}. Có thể navigate đến trang chi tiết.`);
  };

  // Show login prompt if user not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-400 mb-4">Bạn cần đăng nhập để xem lịch sử đặt vé</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (bookingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h2 className="text-white text-xl font-semibold">Đang tải lịch sử đặt vé...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-400 mb-4">{bookingsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top="100px" left="0" />
      <BlurCircle bottom="100px" right="0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Lịch Sử Đặt Vé</h1>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm phim hoặc ghế..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="all">Tất cả</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="date_desc">Mới nhất</option>
              <option value="date_asc">Cũ nhất</option>
              <option value="price_desc">Giá cao nhất</option>
              <option value="price_asc">Giá thấp nhất</option>
            </select>
          </div>
        </div>

        {paginatedBookings.length === 0 ? (
          <div className="bg-black/20 rounded-2xl border border-white/10 p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Chưa có đặt vé nào</h2>
            <p className="text-gray-400 mb-6">Hãy bắt đầu đặt vé cho bộ phim yêu thích của bạn!</p>
            <button
              onClick={() => navigate('/movies')}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              Khám phá phim
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedBookings.map((booking) => (
              <div key={booking._id} className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={booking.movieId?.poster || '/placeholder-poster.svg'}
                    alt={booking.movieId?.title || 'Movie'}
                    className="w-full md:w-32 h-48 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{booking.movieId?.title || 'N/A'}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.bookingStatus === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                        booking.bookingStatus === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {booking.bookingStatus === 'confirmed' ? 'Đã xác nhận' :
                         booking.bookingStatus === 'cancelled' ? 'Đã hủy' :
                         booking.bookingStatus === 'completed' ? 'Hoàn thành' : 'Pending'}
                      </div>
                    </div>
                    
                    {/* Booking Code */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-400">Mã đặt vé: </span>
                      <span className="text-sm font-mono text-white bg-gray-700 px-2 py-1 rounded">{booking.bookingCode}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span>{new Date(booking.showDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span>{booking.showTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span>{booking.theaterId?.name || 'N/A'} - {booking.theaterId?.location || ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-purple-500" />
                        <span>Ghế: {booking.seats?.map(seat => seat.seatNumber).join(', ') || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        booking.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-300' :
                        booking.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-300' :
                        'bg-red-500/10 text-red-300'
                      }`}>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {booking.paymentStatus === 'paid' ? 'Đã thanh toán' :
                           booking.paymentStatus === 'pending' ? 'Chưa thanh toán' :
                           booking.paymentStatus === 'failed' ? 'Thanh toán thất bại' :
                           'Đã hoàn tiền'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-red-500">
                        Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetails(booking._id)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {booking.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-300 transition-colors"
                            title="Hủy vé"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        {booking.bookingStatus === 'completed' && (
                          <button
                            onClick={() => handleRate(booking.movieId?._id)}
                            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-full text-yellow-300 transition-colors"
                            title="Đánh giá"
                          >
                            <Star className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  currentPage === i + 1 ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;