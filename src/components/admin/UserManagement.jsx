import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, User, Mail, Phone, UserPlus, Users, CheckCircle, XCircle } from 'lucide-react';
import { useUsers } from '../../contexts/UserContext';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, getUserStats } = useUsers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = getUserStats() || {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newToday: 0,
    totalBookings: 0
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
      setEditingUser(null);
    } else {
      addUser(formData);
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (userId) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteUser(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
          <p className="text-gray-400">Quản lý tài khoản người dùng hệ thống</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              password: ''
            });
            setShowAddForm(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
        >
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

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">Tổng người dùng</h3>
              <p className="text-2xl font-bold text-blue-400">{stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">Hoạt động</h3>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">Không hoạt động</h3>
              <p className="text-2xl font-bold text-red-400">{stats.inactiveUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">Mới hôm nay</h3>
              <p className="text-2xl font-bold text-purple-400">{stats.newToday || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">Tổng đặt vé</h3>
              <p className="text-2xl font-bold text-yellow-400">{stats.totalBookings || 0}</p>
            </div>
          </div>
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
                        <p className="text-white font-medium">{user.name}</p>
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
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        title={user.isActive ? 'Tạm khóa' : 'Kích hoạt'}
                      >
                        {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">Không tìm thấy người dùng nào</div>
              <div className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl border border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                {!editingUser && (
                  <div>
                    <label className="block text-white mb-2">Mật khẩu *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
                  >
                    {editingUser ? 'Cập nhật' : 'Thêm người dùng'}
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

export default UserManagement;