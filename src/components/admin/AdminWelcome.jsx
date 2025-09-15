import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Film, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Star,
  MapPin
} from 'lucide-react';

const AdminWelcome = () => {
  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', color: 'text-blue-400' },
    { icon: Film, label: 'Movies', value: '156', change: '+5%', color: 'text-green-400' },
    { icon: Calendar, label: 'Showtimes Today', value: '48', change: '+8%', color: 'text-purple-400' },
    { icon: DollarSign, label: 'Revenue', value: '$12,450', change: '+15%', color: 'text-yellow-400' }
  ];

  const quickActions = [
    { icon: Film, label: 'Add Movie', path: '/admin/movies', color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, label: 'Schedule Show', path: '/admin/showtimes', color: 'from-green-500 to-emerald-500' },
    { icon: Users, label: 'Manage Users', path: '/admin/users', color: 'from-purple-500 to-pink-500' },
    { icon: MapPin, label: 'Theaters', path: '/admin/theaters', color: 'from-orange-500 to-red-500' }
  ];

  const recentMovies = [
    { title: 'Spider-Man: No Way Home', rating: 4.8, views: '2.1M' },
    { title: 'The Batman', rating: 4.7, views: '1.8M' },
    { title: 'Doctor Strange 2', rating: 4.6, views: '1.5M' },
    { title: 'Top Gun: Maverick', rating: 4.9, views: '1.2M' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to CineMax Admin</h1>
        <p className="text-gray-300">Manage your cinema operations efficiently</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
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
          <h2 className="text-xl font-bold text-white mb-6">Top Movies</h2>
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
                    {movie.views}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">New user registration: john@example.com</span>
            <span className="text-gray-500 text-sm ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300">Movie "Avatar 2" was updated</span>
            <span className="text-gray-500 text-sm ml-auto">5 minutes ago</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-300">New booking for "Spider-Man"</span>
            <span className="text-gray-500 text-sm ml-auto">10 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;