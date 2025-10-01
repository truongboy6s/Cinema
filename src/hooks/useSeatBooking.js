import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';

export const useSeatBooking = () => {
  const { movieId, showId } = useParams();
  const location = useLocation();
  const { movies, loading: moviesLoading } = useMovies();
  
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

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          const selectedMovie = movies.find(m => m._id === movieId);
        
        if (!selectedMovie) {
          throw new Error('Movie not found');
        }

        setMovie(selectedMovie);

        if (location.state?.selectedDate && location.state?.selectedTime) {
          setShowDetails({
            id: showId,
            movieId: movieId,
            date: location.state.selectedDate,
            time: location.state.selectedTime,
            price: 100000,
            cinema: "CGV Vincom Center",
            room: "Phòng chiếu 1"
          });
        } else {
          const today = new Date();
          setShowDetails({
            id: showId,
            movieId: movieId,
            date: today,
            time: "19:30",
            price: 100000,
            cinema: "CGV Vincom Center",
            room: "Phòng chiếu 1"
          });
        }

        // Simulate occupied seats from API
        const occupied = generateOccupiedSeats();
        setOccupiedSeats(occupied);
        
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [movieId, showId, location.state, movies, moviesLoading]);

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