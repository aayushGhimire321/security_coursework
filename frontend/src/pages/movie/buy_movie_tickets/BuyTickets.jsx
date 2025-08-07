import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import KhaltiCheckout from 'khalti-checkout-web';

const BuyTickets = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/${id}`);
        setShow(response.data);
      } catch (err) {
        console.error('Failed to fetch show:', err);
        setError('Failed to load show details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handlePayment = () => {
    if (!selectedSeats.length) {
      alert('Please select at least one seat.');
      return;
    }

    if (!show) {
      alert('Show information is missing. Please reload the page.');
      return;
    }

    let config = {
      publicKey: '649f06815d4942178072493f83258c78',
      productIdentity: id,
      productName: show.movieTitle,
      productUrl: 'http://localhost:3000/',
      eventHandler: {
        onSuccess(payload) {
          console.log('Payment successful!', payload);
          alert('Payment successful!');
          // Optionally send token to backend to finalize booking
        },
        onError(error) {
          console.error('Payment failed:', error);
          alert('Payment failed. Please try again.');
        },
        onClose() {
          console.log('Khalti widget closed');
        },
      },
      paymentPreference: [
        'KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'
      ],
    };

    let checkout = new KhaltiCheckout(config);
    checkout.show({ amount: selectedSeats.length * show.showPrice * 100 });
  };

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading show details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  if (!show) {
    return <div className="text-center text-lg mt-10">No show details available.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-2">{show.movieTitle}</h2>
      <p className="text-gray-700 mb-4">{show.cinemaName}</p>
      <p className="text-gray-600 mb-4">
        Show Time: {new Date(show.showTime).toLocaleString()}
      </p>
      <p className="text-gray-800 font-semibold mb-6">
        Ticket Price: Rs. {show.showPrice}
      </p>

      <div className="grid grid-cols-6 gap-3 mb-6">
        {Array.from({ length: show.totalSeats }, (_, i) => {
          const seatNumber = i + 1;
          const isSelected = selectedSeats.includes(seatNumber);
          return (
            <button
              key={`seat-${seatNumber}`}
              onClick={() => handleSeatClick(seatNumber)}
              className={`px-3 py-2 border rounded ${
                isSelected ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}
            >
              Seat {seatNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={handlePayment}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded shadow-lg"
      >
        Pay with Khalti (Rs. {selectedSeats.length * show.showPrice})
      </button>
    </div>
  );
};

export default BuyTickets;
