import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import { useShowtimes } from '../contexts/ShowtimeContext';
import { bookingAPI } from '../services/apiServices';

export const useSeatBooking = () => {
  const { movieId, showtimeId } = useParams();
  const location = useLocation();
  const { movies, loading: moviesLoading } = useMovies();
  const { showtimes } = useShowtimes();
  
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState('select');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!moviesLoading && movies.length > 0) {
        try {
          setLoading(true);
          setError(null);

          // Get movie from context or location state
          let selectedMovie = movies.find(m => m._id === movieId || m.id === movieId);
          if (!selectedMovie && location.state?.movie) {
            selectedMovie = location.state.movie;
          }
        
          if (!selectedMovie) {
            throw new Error('Movie not found');
          }
          setMovie(selectedMovie);

          // Get showtime details
          let showtimeDetails = null;
          
          // Try to find showtime from context first
          if (showtimeId && showtimes?.length > 0) {
            showtimeDetails = showtimes.find(s => s._id === showtimeId || s.id === showtimeId);
          }
          
          // If not found, use location state
          if (!showtimeDetails && location.state?.showtime) {
            showtimeDetails = location.state.showtime;
          }
          
          // If still not found, create default (for backward compatibility)
          if (!showtimeDetails) {
            showtimeDetails = {
              _id: showtimeId,
              movieId: selectedMovie._id,
              date: location.state?.selectedDate || new Date().toISOString().split('T')[0],
              time: location.state?.selectedTime || "19:30",
              price: 100000,
              theaterId: { 
                name: "CGV Vincom Center", 
                location: "Hà Nội"
              },
              roomId: "Phòng chiếu 1",
              totalSeats: 120,
              availableSeats: 100
            };
          }

          setShowDetails(showtimeDetails);

          // Load existing bookings for this showtime to determine occupied seats
          await loadOccupiedSeats(showtimeId);
        
        } catch (err) {
          setError(err.message);
          console.error('Error loading seat booking data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [movieId, showtimeId, location.state, movies, moviesLoading, showtimes]);

  // Load occupied seats from existing bookings
  const loadOccupiedSeats = async (showtimeId) => {
    try {
      // In a real app, we would fetch bookings for this showtime
      // For now, generate some occupied seats for demo
      const occupied = generateOccupiedSeats();
      setOccupiedSeats(occupied);
    } catch (error) {
      console.error('Error loading occupied seats:', error);
      // Fallback to empty occupied seats
      setOccupiedSeats({});
    }
  };

  // Generate random occupied seats for demo
  const generateOccupiedSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const occupied = {};
    
    // Add some realistic occupied seat patterns
    const occupiedPatterns = [
      ['A3', 'A4', 'A5'], // Group of 3
      ['B8', 'B9'], // Couple
      ['C12', 'C13'], // Couple
      ['F5', 'F6', 'F7', 'F8'], // Group of 4
      ['G10', 'G11'], // Couple
      ['I3', 'I4'], // Couple seats
      ['J7', 'J8'] // Couple seats
    ];

    occupiedPatterns.flat().forEach(seat => {
      occupied[seat] = `user_${Math.random().toString(36).substring(7)}`;
    });

    return occupied;
  };

  return {
    movie,
    showDetails,
    selectedSeats,
    setSelectedSeats,
    occupiedSeats,
    setOccupiedSeats,
    loading,
    bookingStep,
    setBookingStep,
    error
  };
};