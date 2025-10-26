import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Film, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Star,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useMovies } from '../../contexts/MovieContext';
import { useShowtimes } from '../../contexts/ShowtimeContext';
import { useTheaters } from '../../contexts/TheaterContext';
import { useBookings } from '../../contexts/BookingContext';
import { useUsers } from '../../contexts/UserContext';

const AdminWelcome = () => {
  const { movies } = useMovies();
  const { showtimes } = useShowtimes();
  const { theaters } = useTheaters();
  const { bookings } = useBookings();
  const { users, getUserStats } = useUsers();

  // User statistics
  const userStats = getUserStats() || {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newToday: 0,
    totalBookings: 0
  };

  // Calculate real stats
  const todayShowtimes = (showtimes || []).filter(showtime => {
    const today = new Date();
    const showtimeDate = new Date(showtime.datetime);
    return showtimeDate.toDateString() === today.toDateString();
  });

  const activeTheaters = (theaters || []).filter(theater => theater && theater.status === 'active');

  // Revenue statistics with seat calculation - Only count paid bookings
  const revenueStats = useMemo(() => {
    console.log('Calculating revenue stats with bookings:', bookings);
    
    // Chỉ tính những booking đã thanh toán thành công
    const paidBookings = (bookings || []).filter(b => {
      const isPaid = b.paymentStatus === 'paid';
      const isConfirmedOrCompleted = b.status === 'confirmed' || b.status === 'completed';
      console.log(`Booking ${b._id}: status=${b.status}, paymentStatus=${b.paymentStatus}, included=${isPaid && isConfirmedOrCompleted}`);
      return isPaid && isConfirmedOrCompleted;
    });
    
    console.log('Paid bookings:', paidBookings.length, 'out of', (bookings || []).length, 'total bookings');
    
    const totalRevenue = paidBookings.reduce((sum, b) => {
      const amount = b.totalAmount || 0;
      console.log(`Adding revenue: ${amount} from booking ${b._id}`);
      return sum + amount;
    }, 0);
    
    const totalSeats = paidBookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);
    
    // Doanh thu hôm nay - chỉ tính booking đã thanh toán
    const todayPaidBookings = paidBookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      const today = new Date();
      return bookingDate.toDateString() === today.toDateString();
    });
    const todayRevenue = todayPaidBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const todaySeats = todayPaidBookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);
    
    console.log('Final revenue stats:', {
      totalRevenue,
      todayRevenue,
      totalSeats,
      todaySeats,
      paidBookingsCount: paidBookings.length
    });
    
    return {
      totalRevenue,
      todayRevenue,
      totalSeats,
      todaySeats,
      averageRevenuePerSeat: totalSeats > 0 ? totalRevenue / totalSeats : 0,
      confirmedBookings: paidBookings.length
    };
  }, [bookings]);

  // Thống kê phim theo trạng thái
  const movieStats = useMemo(() => {
    const today = new Date();
    const movieArray = movies || [];
    const showingMovies = movieArray.filter(movie => movie.status === 'showing').length;
    const comingSoonMovies = movieArray.filter(movie => {
      if (movie.status === 'coming_soon') return true;
      // Nếu release_date trong tương lai thì cũng là sắp chiếu
      if (movie.release_date) {
        const releaseDate = new Date(movie.release_date);
        return releaseDate > today;
      }
      return false;
    }).length;
    const endedMovies = movieArray.filter(movie => movie.status === 'ended').length;
    
    return { showingMovies, comingSoonMovies, endedMovies, total: movieArray.length };
  }, [movies]);

  const stats = [
    { 
      icon: Users, 
      label: 'Tổng người dùng', 
      value: (userStats?.totalUsers || 0).toString(), 
      change: (userStats?.newToday || 0) > 0 ? `+${userStats.newToday} hôm nay` : 'Không có mới', 
      color: 'text-emerald-400' 
    },
    { 
      icon: Film, 
      label: 'Phim đang chiếu', 
      value: movieStats.showingMovies.toString(), 
      change: movieStats.comingSoonMovies > 0 ? `${movieStats.comingSoonMovies} sắp chiếu` : 'Không có sắp chiếu', 
      color: 'text-blue-400' 
    },
    { 
      icon: MapPin, 
      label: 'Rạp chiếu', 
      value: activeTheaters.length.toString(), 
      change: '+' + Math.round((activeTheaters.length / 4) * 100) + '%', 
      color: 'text-green-400' 
    },
    { 
      icon: DollarSign, 
      label: 'Doanh thu', 
      value: new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        notation: 'compact'
      }).format(revenueStats?.totalRevenue || 0), 
      change: `${revenueStats?.confirmedBookings || 0} đơn đặt`, 
      color: 'text-yellow-400' 
    }
  ];

  const quickActions = [
    { icon: Users, label: 'Quản lý người dùng', path: '/admin/users', color: 'from-emerald-500 to-teal-500' },
    { icon: Film, label: 'Quản lý phim', path: '/admin/movies', color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, label: 'Lịch chiếu', path: '/admin/showtimes', color: 'from-green-500 to-emerald-500' },
    { icon: MapPin, label: 'Rạp chiếu', path: '/admin/theaters', color: 'from-purple-500 to-pink-500' },
    { icon: CreditCard, label: 'Đặt vé', path: '/admin/bookings', color: 'from-orange-500 to-red-500' }
  ];

  const recentMovies = movies.slice(0, 4).map(movie => ({
    title: movie.title,
    rating: movie.rating || 4.5,
    views: Math.floor(Math.random() * 2000000) + 500000
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20">
        <h1 className="text-3xl font-bold text-white mb-2">Chào mừng đến với CineMax Admin</h1>
        <p className="text-gray-300">Quản lý hệ thống rạp chiếu phim một cách hiệu quả</p>
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
          <div>Giá trung bình/ghế: <span className="text-cyan-400 font-semibold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueStats.averageRevenuePerSeat || 0)}
          </span></div>
          <div>Tổng ghế đã bán: <span className="text-green-400 font-semibold">{revenueStats.totalSeats}</span></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Movie Statistics Detail */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Thống kê phim chi tiết</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{movieStats.showingMovies}</div>
            <div className="text-sm text-gray-400">Đang chiếu</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">{movieStats.comingSoonMovies}</div>
            <div className="text-sm text-gray-400">Sắp chiếu</div>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">{movieStats.endedMovies}</div>
            <div className="text-sm text-gray-400">Đã kết thúc</div>
          </div>
          <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <div className="text-2xl font-bold text-emerald-400">{movieStats.total}</div>
            <div className="text-sm text-gray-400">Tổng cộng</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className={`p-4 rounded-lg bg-gradient-to-r ${action.color} hover:scale-105 transition-transform duration-200 group`}
                >
                  <Icon className="w-6 h-6 text-white mb-2" />
                  <p className="text-white font-medium text-sm">{action.label}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Movies Performance */}
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Phim nổi bật</h2>
          <div className="space-y-4">
            {recentMovies.map((movie, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">{movie.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-400 text-sm">{movie.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(movie.views)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Phân tích doanh thu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(revenueStats.totalRevenue)}
            </div>
            <div className="text-gray-400 text-sm">Tổng doanh thu</div>
            <div className="text-xs text-gray-500 mt-1">{revenueStats.totalSeats} ghế đã bán</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(revenueStats.todayRevenue)}
            </div>
            <div className="text-gray-400 text-sm">Doanh thu hôm nay</div>
            <div className="text-xs text-gray-500 mt-1">{revenueStats.todaySeats} ghế hôm nay</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueStats.averageRevenuePerSeat || 0)}
            </div>
            <div className="text-gray-400 text-sm">Giá trung bình/ghế</div>
            <div className="text-xs text-gray-500 mt-1">{revenueStats.confirmedBookings} đơn đặt thành công</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Hoạt động gần đây</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">Đặt vé mới cho suất chiếu "{todayShowtimes[0]?.movie || 'Avengers'}"</span>
            <span className="text-gray-500 text-sm ml-auto">2 phút trước</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300">Phim "{movies[0]?.title || 'Spider-Man'}" đã được cập nhật</span>
            <span className="text-gray-500 text-sm ml-auto">5 phút trước</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-300">Rạp chiếu "{activeTheaters[0]?.name || 'Deluxe Theater'}" đang hoạt động</span>
            <span className="text-gray-500 text-sm ml-auto">10 phút trước</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-gray-300">Suất chiếu mới đã được thêm vào lịch - Tổng {revenueStats.totalSeats} ghế đã bán</span>
            <span className="text-gray-500 text-sm ml-auto">15 phút trước</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;