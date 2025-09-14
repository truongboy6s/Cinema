export const SEAT_CONFIG = {
  seatRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  seatsPerRow: 14,
  vipRows: ['F', 'G', 'H'],
  coupleRows: ['I', 'J'],
  regularRows: ['A', 'B', 'C', 'D', 'E']
};

export const getSeatPrice = (row, basePrice = 100000) => {
  if (SEAT_CONFIG.vipRows.includes(row)) return basePrice * 1.5;
  if (SEAT_CONFIG.coupleRows.includes(row)) return basePrice * 2.0;
  return basePrice;
};

export const getSeatType = (row) => {
  if (SEAT_CONFIG.vipRows.includes(row)) return 'vip';
  if (SEAT_CONFIG.coupleRows.includes(row)) return 'couple';
  return 'regular';
};

export const getSeatTypeLabel = (row) => {
  if (SEAT_CONFIG.vipRows.includes(row)) return 'VIP';
  if (SEAT_CONFIG.coupleRows.includes(row)) return 'Đôi';
  return 'Thường';
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateTotal = (selectedSeats, basePrice = 100000) => {
  return selectedSeats.reduce((total, seatId) => {
    const row = seatId.charAt(0);
    return total + getSeatPrice(row, basePrice);
  }, 0);
};