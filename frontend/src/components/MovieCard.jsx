// import React from "react";
// import { Link } from "react-router-dom";

// const MovieCard = ({ movieInformation, color }) => {
//   return (
//     <div className="card" style={{ width: "18rem" }}>
//       <span style={{ backgroundColor: color }} className="badge position-absolute top-0">
//         {movieInformation.movieRated}
//       </span>
//       <img
//         src={`https://localhost:5000/movies/${movieInformation.moviePosterImage}`}
//         className="card-img-top"
//         alt={movieInformation.movieName}
//       />
//       <div className="card-body">
//         <div className="card-body">
//           <div className="d-flex justify-content-between">
//             <h5 className="card-title">{movieInformation.movieName}</h5>
//           </div>
//         </div>
//         <p className="card-text">
//           {movieInformation.movieDetails.slice(0, 30)}
//         </p>
//         <Link to={`/movie/buyTickets/${movieInformation._id}`} className="btn btn-outline-dark w-100">
//           Buy Tickets
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default MovieCard;

import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css'; // Make sure to create this CSS file in the same directory

const MovieCard = ({ movieInformation, color }) => {
  return (
    <div className='movie-card'>
      <div className='movie-poster'>
        <img
          src={`https://localhost:5000/movies/${movieInformation.moviePosterImage}`}
          alt={movieInformation.movieName}
        />
        <span
          className='movie-rating'
          style={{ backgroundColor: color }}>
          {movieInformation.movieRated}
        </span>
      </div>
      <div className='movie-info'>
        <h3 className='movie-title'>{movieInformation.movieName}</h3>
        <p className='movie-description'>
          {movieInformation.movieDetails.slice(0, 80)}...
        </p>
        <Link
          to={`/user/movie/buyTickets/${movieInformation._id}`}
          className='buy-tickets-btn'>
          Buy Tickets
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
