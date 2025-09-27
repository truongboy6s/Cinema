import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  // Initial movies data (can be loaded from localStorage or API)
  const [movies, setMovies] = useState(() => {
    // Try to load from localStorage first
    const savedMovies = localStorage.getItem('cinema_movies');
    if (savedMovies) {
      try {
        return JSON.parse(savedMovies);
      } catch (error) {
        console.error('Error parsing saved movies:', error);
      }
    }
    
    // Default movies if none saved
    return [
      {
        id: 1,
        title: "Inception",
        backdrop_path: "https://image.tmdb.org/t/p/w500/8ib2zML1zUr2slqQQVoUGQyWbbu.jpg",
        poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
        release_date: "2010-07-16",
        genres: [{ name: "Action" }, { name: "Sci-Fi" }],
        genre: "Action, Sci-Fi",
        runtime: 148,
        duration: 148,
        vote_average: 8.8,
        rating: 8.8,
        status: 'showing',
        overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious."
      },
      {
        id: 2,
        title: "The Dark Knight",
        backdrop_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        release_date: "2008-07-18",
        genres: [{ name: "Action" }, { name: "Drama" }],
        genre: "Action, Drama",
        runtime: 152,
        duration: 152,
        vote_average: 9.0,
        rating: 9.0,
        status: 'showing',
        overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets."
      },
      {
        id: 3,
        title: "Interstellar",
        backdrop_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        release_date: "2014-11-07",
        genres: [{ name: "Adventure" }, { name: "Sci-Fi" }],
        genre: "Adventure, Sci-Fi",
        runtime: 169,
        duration: 169,
        vote_average: 8.6,
        rating: 8.6,
        status: 'showing',
        overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
      },
      {
        id: 4,
        title: "The Matrix",
        backdrop_path: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        release_date: "1999-03-31",
        genres: [{ name: "Action" }, { name: "Sci-Fi" }],
        genre: "Action, Sci-Fi",
        runtime: 136,
        duration: 136,
        vote_average: 8.7,
        rating: 8.7,
        status: 'showing',
        overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
      },
      {
        id: 5,
        title: "Spider-Man: No Way Home",
        backdrop_path: "https://image.tmdb.org/t/p/w500/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
        poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        release_date: "2021-12-15",
        genres: [{ name: "Action" }, { name: "Adventure" }],
        genre: "Action, Adventure",
        runtime: 148,
        duration: 148,
        vote_average: 8.4,
        rating: 8.4,
        status: 'showing',
        overview: "Spider-Man's identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man."
      }
    ];
  });

  // Save to localStorage whenever movies change
  useEffect(() => {
    localStorage.setItem('cinema_movies', JSON.stringify(movies));
  }, [movies]);

  // Add a new movie
  const addMovie = (movieData) => {
    const newMovie = {
      ...movieData,
      id: Date.now(), // Simple ID generation
      // Ensure both formats are available
      genre: Array.isArray(movieData.genres) 
        ? movieData.genres.map(g => g.name).join(', ')
        : movieData.genre || '',
      genres: typeof movieData.genre === 'string'
        ? movieData.genre.split(', ').map(name => ({ name }))
        : movieData.genres || [],
      duration: movieData.duration || movieData.runtime || 0,
      runtime: movieData.runtime || movieData.duration || 0,
      rating: movieData.rating || movieData.vote_average || 0,
      vote_average: movieData.vote_average || movieData.rating || 0,
    };
    
    setMovies(prevMovies => [...prevMovies, newMovie]);
    return newMovie;
  };

  // Update a movie
  const updateMovie = (movieId, updatedData) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === movieId
          ? {
              ...movie,
              ...updatedData,
              // Ensure both formats are updated
              genre: Array.isArray(updatedData.genres) 
                ? updatedData.genres.map(g => g.name).join(', ')
                : updatedData.genre || movie.genre,
              genres: typeof updatedData.genre === 'string'
                ? updatedData.genre.split(', ').map(name => ({ name }))
                : updatedData.genres || movie.genres,
              duration: updatedData.duration || updatedData.runtime || movie.duration,
              runtime: updatedData.runtime || updatedData.duration || movie.runtime,
              rating: updatedData.rating || updatedData.vote_average || movie.rating,
              vote_average: updatedData.vote_average || updatedData.rating || movie.vote_average,
            }
          : movie
      )
    );
  };

  // Delete a movie
  const deleteMovie = (movieId) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
  };

  // Get movies by status
  const getMoviesByStatus = (status) => {
    if (!status) return movies;
    return movies.filter(movie => movie.status === status);
  };

  // Get movie by ID
  const getMovieById = (movieId) => {
    return movies.find(movie => movie.id === parseInt(movieId));
  };

  const value = {
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    getMoviesByStatus,
    getMovieById,
    setMovies
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;