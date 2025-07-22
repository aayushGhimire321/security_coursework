import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      <div>a</div>
      <div className='about-us-container mt-5'>
        <header className='about-us-header'>
          <h1>About CineEase</h1>
          <p>Your Premier Destination for Movie Tickets</p>
        </header>

        <section className='about-us-content'>
          <div className='about-us-intro'>
            <h2>Our Story</h2>
            <p>
              Founded in 2020, CineEase has quickly become the go-to platform
              for movie enthusiasts. We're passionate about bringing the magic
              of cinema right to your fingertips, making the process of booking
              movie tickets as enjoyable as watching the films themselves.
            </p>
          </div>

          <div className='about-us-mission'>
            <h2>Our Mission</h2>
            <p>
              At CineEase, we're on a mission to revolutionize the way you
              experience movies. We strive to provide a seamless, user-friendly
              platform that connects movie-goers with the latest blockbusters,
              indie gems, and timeless classics.
            </p>
          </div>

          <div className='about-us-features'>
            <h2>Why Choose CineEase?</h2>
            <ul>
              <li>Easy and quick ticket booking</li>
              <li>Extensive selection of movies and theaters</li>
              <li>Exclusive deals and discounts</li>
              <li>Real-time seat selection</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        </section>

        <section className='about-us-cta'>
          <h2>Ready to Experience CineEase?</h2>
          <p>
            Join millions of movie lovers and book your next cinema adventure
            with us!
          </p>
          <Link
            to='/homepage'
            className='cta-button'>
            Book Now
          </Link>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
