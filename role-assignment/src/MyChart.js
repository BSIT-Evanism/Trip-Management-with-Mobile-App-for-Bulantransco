import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const MyChart = () => {
  const data = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // Days of the week
    datasets: [
      {
        label: 'Passenger Frequency',
        data: [50, 60, 75, 80, 60, 90, 100], // Example data
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days of the Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Passenger Count',
        },
      },
    },
    plugins: {
      legend: {
        onClick: null, // Disable click functionality on the legend
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MyChart;
