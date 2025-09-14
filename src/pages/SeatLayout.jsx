import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeatBooking } from '../hooks/useSeatBooking';
import BlurCircle from '../components/BlurCircle';
import BookingHeader from '../components/SeatLayout/BookingHeader';
import SeatMap from '../components/SeatLayout/SeatMap';
import BookingSidebar from '../components/SeatLayout/BookingSidebar';
import LoadingScreen from '../components/SeatLayout/LoadingScreen';
import ErrorScreen from '../components/SeatLayout/ErrorScreen';
import SuccessScreen from '../components/SeatLayout/SuccessScreen';
import ConfirmationStep from '../components/SeatLayout/ConfirmationStep';
import PaymentStep from '../components/SeatLayout/PaymentStep';

const SeatLayout = () => {
  const navigate = useNavigate();
  const {
    movie,
    showDetails,
    selectedSeats,
    setSelectedSeats,
    occupiedSeats,
    setOccupiedSeats,
    loading,
    bookingStep,
    setBookingStep
  } = useSeatBooking();

  const handleSeatClick = (seatId, row) => {
    if (occupiedSeats[seatId]) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(seat => seat !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Bạn chỉ có thể chọn tối đa 8 ghế trong một lần đặt');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế');
      return;
    }
    setBookingStep('confirm');
  };

  const handlePayment = () => {
    setBookingStep('payment');
    setTimeout(() => {
      setBookingStep('success');
      const newOccupied = { ...occupiedSeats };
      selectedSeats.forEach(seat => {
        newOccupied[seat] = 'current_user';
      });
      setOccupiedSeats(newOccupied);
    }, 3000);
  };

  const handleBackToMovies = () => {
    navigate('/movies');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (!movie || !showDetails) {
    return (
      <ErrorScreen 
        onBack={handleBackToMovies}
        onRetry={handleRetry}
      />
    );
  }

  // Success state
  if (bookingStep === 'success') {
    return (
      <SuccessScreen
        movie={movie}
        showDetails={showDetails}
        selectedSeats={selectedSeats}
        onBackToMovies={handleBackToMovies}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top="100px" left="0" />
      <BlurCircle bottom="100px" right="0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingHeader 
          movie={movie}
          showDetails={showDetails}
          onBack={() => navigate(`/movies/detail/${movie._id}`)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              {bookingStep === 'select' && (
                <SeatMap
                  selectedSeats={selectedSeats}
                  occupiedSeats={occupiedSeats}
                  basePrice={showDetails.price}
                  onSeatClick={handleSeatClick}
                />
              )}
              {bookingStep === 'confirm' && (
                <ConfirmationStep
                  movie={movie}
                  showDetails={showDetails}
                  selectedSeats={selectedSeats}
                />
              )}
              {bookingStep === 'payment' && <PaymentStep />}
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar
              movie={movie}
              showDetails={showDetails}
              selectedSeats={selectedSeats}
              bookingStep={bookingStep}
              onContinue={handleContinue}
              onPayment={handlePayment}
              onBack={() => setBookingStep('select')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;