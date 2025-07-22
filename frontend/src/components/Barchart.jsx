import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from 'chart.js';
  import React from 'react';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const BarChart = ({ data }) => {
    const chartData = {
      labels: ['Total User', 'Total Movies', 'Total Bookings'],
      datasets: [
        {
          label: 'Statistics',
          data: [data.totalUserLogins, data.totalMoviesAdded, data.totalBookings],
          backgroundColor: [
            'green',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { color: 'black' } }, // Dark mode legend color
        title: {
          display: true,
          text: 'Admin Dashboard Statistics',
          color: 'black',
        }, // Dark mode title color
      },
      scales: {
        x: {
          ticks: { color: 'black' }, // Dark mode x-axis ticks color
          grid: { color: 'rgba(255, 255, 255, 0.1)' }, // Dark mode x-axis grid color
        },
        y: {
          ticks: { color: 'black' }, // Dark mode y-axis ticks color
          grid: { color: 'rgba(255, 255, 255, 0.1)' }, // Dark mode y-axis grid color
        },
      },
    };
  
    return (
      <div className='p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700 max-w-2xl mx-auto'>
        <div className='text-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-100'>
            Statistics Overview
          </h2>
          <p className='text-gray-400 text-sm'>
            A graphical representation of the total users, movies, and bookings.
          </p>
        </div>
        <div className='flex items-center justify-center'>
          <Bar
            data={chartData}
            options={options}
          />
        </div>
      </div>
    );
  };
  
  export default BarChart;