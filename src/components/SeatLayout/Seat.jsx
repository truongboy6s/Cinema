import React from 'react';
import { getSeatType, getSeatPrice, getSeatTypeLabel, formatPrice } from '../../utils/seatUtils';

const Seat = ({ seatId, row, isOccupied, isSelected, basePrice, onClick }) => {
  const seatType = getSeatType(row);
  const seatNumber = seatId.replace(row, '');
  
  let seatClass = 'w-8 h-8 rounded-sm cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold hover:scale-110 ';
  
  if (isOccupied) {
    seatClass += 'bg-red-500 text-white cursor-not-allowed';
  } else if (isSelected) {
    seatClass += 'bg-blue-500 text-white shadow-lg';
  } else {
    if (seatType === 'vip') {
      seatClass += 'bg-yellow-500/20 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/40';
    } else if (seatType === 'couple') {
      seatClass += 'bg-pink-500/20 border border-pink-500 text-pink-300 hover:bg-pink-500/40';
    } else {
      seatClass += 'bg-gray-600 text-white hover:bg-gray-500';
    }
  }

  return (
    <div
      className={seatClass}
      onClick={() => !isOccupied && onClick(seatId, row)}
      title={`${seatId} - ${getSeatTypeLabel(row)} - ${formatPrice(getSeatPrice(row, basePrice))}`}
    >
      {seatNumber}
    </div>
  );
};

export default Seat;