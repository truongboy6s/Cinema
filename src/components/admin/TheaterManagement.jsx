import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Users, Settings, Star } from 'lucide-react';
import { useTheaters } from '../../contexts/TheaterContext';

const TheaterManagement = () => {
  const { theaters, addTheater, updateTheater, deleteTheater } = useTheaters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'standard',
    capacity: '',
    facilities: [],
    location: '',
    description: '',
    status: 'active'
  });

  const theaterTypes = [
    { value: 'standard', label: 'Standard', color: 'bg-blue-500/20 text-blue-400' },
    { value: 'deluxe', label: 'Deluxe', color: 'bg-purple-500/20 text-purple-400' },
    { value: 'imax', label: 'IMAX', color: 'bg-red-500/20 text-red-400' },
    { value: 'vip', label: 'VIP', color: 'bg-yellow-500/20 text-yellow-400' }
  ];

  const availableFacilities = [
    '3D', 'Dolby Atmos', 'IMAX', '4DX', 'Laser Projection', 
    'Recliner Seats', 'Premium Service', 'Private Lounge', 
    'Digital Sound', 'Standard Screen', 'Luxury Seats'
  ];

  const filteredTheaters = theaters.filter(theater =>
    theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theater.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theater.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const theaterData = {
      ...formData,
      capacity: parseInt(formData.capacity)
    };

    if (editingTheater) {
      updateTheater(editingTheater.id, theaterData);
      setEditingTheater(null);
    } else {
      addTheater(theaterData);
    }
    
    setFormData({
      name: '',
      type: 'standard',
      capacity: '',
      facilities: [],
      location: '',
      description: '',
      status: 'active'
    });
    setShowAddForm(false);
  };

  const handleEdit = (theater) => {
    setEditingTheater(theater);
    setFormData({
      name: theater.name || '',
      type: theater.type || 'standard',
      capacity: theater.capacity?.toString() || '',
      facilities: theater.facilities || [],
      location: theater.location || '',
      description: theater.description || '',
      status: theater.status || 'active'
    });
    setShowAddForm(true);
  };

  const handleDelete = (theaterId) => {
    if (confirm('Bạn có chắc chắn muốn xóa rạp chiếu này?')) {
      deleteTheater(theaterId);
    }
  };

  const getTypeColor = (type) => {
    const typeConfig = theaterTypes.find(t => t.value === type);
    return typeConfig?.color || 'bg-gray-500/20 text-gray-400';
  };

  const getTypeLabel = (type) => {
    const typeConfig = theaterTypes.find(t => t.value === type);
    return typeConfig?.label || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý rạp chiếu</h1>
          <p className="text-gray-400">Quản lý các rạp chiếu và trang thiết bị</p>
        </div>
        <button 
          onClick={() => {
            setEditingTheater(null);
            setFormData({
              name: '',
              type: 'standard',
              capacity: '',
              facilities: [],
              location: '',
              description: '',
              status: 'active'
            });
            setShowAddForm(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm rạp mới
        </button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-6 border border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên rạp, loại rạp, vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Theaters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTheaters.map((theater) => (
          <div key={theater.id} className="glass-card rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{theater.name}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(theater.type)}`}>
                    {getTypeLabel(theater.type)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    theater.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {theater.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(theater)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(theater.id)}
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Sức chứa: {theater.capacity} ghế</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Vị trí: {theater.location}</span>
              </div>
              
              {theater.description && (
                <p className="text-gray-400">{theater.description}</p>
              )}
              
              {theater.facilities && theater.facilities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4" />
                    <span>Trang thiết bị:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {theater.facilities.map((facility, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-slate-700/50 text-cyan-400 text-xs rounded"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Theater Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingTheater ? 'Sửa rạp chiếu' : 'Thêm rạp mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Tên rạp *</label>
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
                    <label className="block text-white mb-2">Loại rạp</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      {theaterTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Sức chứa (ghế) *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Vị trí</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Tầng 3, Khu A"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Trạng thái</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="maintenance">Bảo trì</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Trang thiết bị</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFacilities.map(facility => (
                      <label key={facility} className="flex items-center text-white">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="mr-2 accent-cyan-500"
                        />
                        <span className="text-sm">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  ></textarea>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
                  >
                    {editingTheater ? 'Cập nhật' : 'Thêm rạp'}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Tổng rạp</h3>
          <p className="text-3xl font-bold text-cyan-400">{theaters.length}</p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Đang hoạt động</h3>
          <p className="text-3xl font-bold text-green-400">
            {theaters.filter(t => t.status === 'active').length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Tổng ghế</h3>
          <p className="text-3xl font-bold text-blue-400">
            {theaters.reduce((sum, t) => sum + t.capacity, 0)}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Rạp VIP</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {theaters.filter(t => t.type === 'vip' || t.type === 'imax').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TheaterManagement;