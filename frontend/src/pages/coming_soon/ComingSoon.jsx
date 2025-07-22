import React, { useState } from 'react';
import './ComingSoon.css';

const movieData = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster:
      "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
    genre: "Sci-Fi, Adventure",
    rating: "PG-13",
    duration: "166 min",
    details:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    releaseDate: "March 1, 2024",
  },
  {
    id: 2,
    title: "Godzilla x Kong: The New Empire",
    poster:
      "https://m.media-amazon.com/images/M/MV5BY2QwOGE2NGQtMWQwNi00M2IzLThlNWItYWMzNGQ5YWNiZDA4XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_QL75_UX190_CR0,2,190,281_.jpg",
    genre: "Action, Sci-Fi",
    rating: "PG-13",
    duration: "115 min",
    details:
      "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island's mysteries.",
    releaseDate: "April 12, 2024",
  },
  {
    id: 3,
    title: "Furiosa: A Mad Max Saga",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNDRkNGNjNzMtYzE3MS00OWQyLTkzZGUtNWIyMmYwMjY3YzYxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genre: "Action, Adventure",
    rating: "R",
    duration: "150 min",
    details:
      "The origin story of renegade warrior Furiosa before she teamed up with Mad Max in 'Fury Road'.",
    releaseDate: "May 24, 2024",
  },
  {
    id: 4,
    title: "Inside Out 2",
    poster:
      "https://m.media-amazon.com/images/M/MV5BYTc1MDQ3NjAtOWEzMi00YzE1LWI2OWUtNjQ0OWJkMzI3MDhmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
    genre: "Animation, Adventure, Comedy",
    rating: "PG",
    duration: "105 min",
    details:
      "Follow Joy, Sadness, Anger, Fear and Disgust as they navigate new challenges in Riley's teenage mind.",
    releaseDate: "June 14, 2024",
  },
  {
    id: 5,
    title: "Pushpa II: The Rule",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNGZlNTFlOWMtMzUwNC00ZDdhLTk0MWUtOGZjYzFlOTBmNDdhXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg",
    genre: "Action, Drama, Thriller",
    rating: "R",
    duration: "168 min",
    details:
      "The film tells the story of a daily labourer's rise in the underworld of redwood smuggling. The movie casts Allu Arjun and Rashmika Mandanna in the lead roles.",
    releaseDate: " December 6, 2024",
  },
  {
    id: 6,
    title: "Avatar 3",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMzdjNjExMTgtZGFmNS00ZWRjLWJmNjAtOTliYzJjYjcxMWFhXkEyXkFqcGdeQXVyMjYwNDA2MDE@._V1_.jpg",
    genre: "Action, Adventure, Fantasy",
    rating: "PG-13",
    duration: "190 min",
    
    details:
      "Jake Sully and Ney'tiri's adventure continues as they face new challenges in Pandora.",
    releaseDate: "December 20, 2024",
  },
];

const ComingSoon = () => {
    const [selectedMovie, setSelectedMovie] = useState(null);
  
    const handleDetailsClick = (movie) => {
      setSelectedMovie(movie);
    };
  
    return (
        <>
      <div className="coming-soon-container mt-5">
        <h1>Coming Soon</h1>
        <div className="movie-grid">
          {movieData.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.poster} alt={movie.title} className="movie-poster" />
              <div className="movie-info">
                <h2>{movie.title}</h2>
                <button onClick={() => handleDetailsClick(movie)}>More Details</button>
              </div>
            </div>
          ))}
        </div>
        {selectedMovie && (
          <div className="movie-details-modal">
            <div className="movie-details-content">
              <h2>{selectedMovie.title}</h2>
              <p><strong>Genre:</strong> {selectedMovie.genre}</p>
              <p><strong>Rating:</strong> {selectedMovie.rating}</p>
              <p><strong>Duration:</strong> {selectedMovie.duration}</p>
              <p><strong>Details:</strong> {selectedMovie.details}</p>
              <p><strong>Release Date:</strong> {selectedMovie.releaseDate}</p>
              <button onClick={() => setSelectedMovie(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
      </>
    );
  };
  
  export default ComingSoon;