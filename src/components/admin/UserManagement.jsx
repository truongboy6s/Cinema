import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, User, Mail, Phone } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: 'Nguyễn Văn An',
      email: 'nguyen.an@email.com',
      phone: '0123456789',
      isActive: true,
      joinDate: '2024-01-15',
      bookings: 12
    },
    {
      id: 2,
      fullName: 'Trần Thị Bình',
      email: 'tran.binh@email.com',
      phone: '0987654321',
      isActive: true,
      joinDate: '2024-02-20',
      bookings: 8
    },
    {
      id: 3,
      fullName: 'Lê Văn Cường',
      email: 'le.cuong@email.com',
      phone: '0369852147',
      isActive: false,
      joinDate: '2024-03-10',
      bookings: 3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
          <p className="text-gray-400">Quản lý tài khoản người dùng hệ thống</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200">
          <Plus className="w-5 h-5 mr-2" />
          Thêm người dùng
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <select className="px-4 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Người dùng</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Liên hệ</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ngày tham gia</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Đặt vé</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.fullName}</p>
                        <p className="text-gray-400 text-sm">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cyan-400 font-medium">{user.bookings} vé</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Tổng người dùng</h3>
          <p className="text-3xl font-bold text-cyan-400">{users.length}</p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Hoạt động</h3>
          <p className="text-3xl font-bold text-green-400">
            {users.filter(u => u.isActive).length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Tạm khóa</h3>
          <p className="text-3xl font-bold text-red-400">
            {users.filter(u => !u.isActive).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;