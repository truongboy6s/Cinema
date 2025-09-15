import React from 'react';
import { TrendingUp, Users, DollarSign, Eye, BarChart3, Calendar } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
        <p className="text-gray-400">Thống kê và báo cáo hoạt động rạp phim</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <span className="text-green-400 text-sm font-medium">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">$45,230</h3>
          <p className="text-gray-400 text-sm">Doanh thu tháng này</p>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">12,450</h3>
          <p className="text-gray-400 text-sm">Lượt khách tháng này</p>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">2,156</h3>
          <p className="text-gray-400 text-sm">Vé đã bán hôm nay</p>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">148</h3>
          <p className="text-gray-400 text-sm">Suất chiếu hôm nay</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Doanh thu theo ngày</h2>
          <div className="h-64 bg-slate-800/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Biểu đồ doanh thu</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Top phim được xem nhiều</h2>
          <div className="space-y-4">
            {[
              { name: 'Spider-Man: No Way Home', views: '2.1M', percent: 85 },
              { name: 'The Batman', views: '1.8M', percent: 72 },
              { name: 'Doctor Strange 2', views: '1.5M', percent: 60 },
              { name: 'Top Gun: Maverick', views: '1.2M', percent: 48 }
            ].map((movie, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white font-medium">{movie.name}</span>
                  <span className="text-gray-400">{movie.views}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${movie.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;