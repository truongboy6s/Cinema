import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, LogOut, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      // Here you would typically update the user data via API
      // For now, we'll just update localStorage
      const currentUser = JSON.parse(localStorage.getItem('cinema_user') || '{}');
      const updatedUser = { ...currentUser, ...editData };
      localStorage.setItem('cinema_user', JSON.stringify(updatedUser));
      
      // Update users list as well
      const users = JSON.parse(localStorage.getItem('cinema_users') || '[]');
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...editData };
        localStorage.setItem('cinema_users', JSON.stringify(users));
      }
      
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleCancel = () => {
    setEditData({
      fullName: user?.fullName || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Thông tin cá nhân</h2>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Họ và tên</label>
              {!isEditing && (
                <button onClick={handleEdit} className="text-red-500 hover:text-red-400">
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                className="w-full bg-transparent text-white text-lg font-medium focus:outline-none"
              />
            ) : (
              <p className="text-white text-lg font-medium">{user?.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="bg-white/5 rounded-xl p-4">
            <label className="text-sm text-gray-400">Email</label>
            <div className="flex items-center gap-3 mt-2">
              <Mail size={20} className="text-gray-400" />
              <p className="text-white">{user?.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white/5 rounded-xl p-4">
            <label className="text-sm text-gray-400">Số điện thoại</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="w-full bg-transparent text-white mt-2 focus:outline-none"
              />
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <Phone size={20} className="text-gray-400" />
                <p className="text-white">{user?.phone}</p>
              </div>
            )}
          </div>

          {/* Join Date */}
          <div className="bg-white/5 rounded-xl p-4">
            <label className="text-sm text-gray-400">Ngày tham gia</label>
            <div className="flex items-center gap-3 mt-2">
              <Calendar size={20} className="text-gray-400" />
              <p className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Lưu
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
