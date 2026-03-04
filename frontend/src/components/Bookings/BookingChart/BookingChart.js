import React from "react";

import "./BookingChart.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BOOKINGS_BUCKETS = {
  Free: { min: 0, max: 0 },
  Cheap: { min: 1, max: 100 },
  Normal: { min: 101, max: 200 },
  Expensive: { min: 201, max: Infinity },
};

const BookingChart = (props) => {
  const chartData = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price >= BOOKINGS_BUCKETS[bucket].min &&
        current.event.price <= BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    chartData.push({ label: bucket, value: filteredBookingsCount });
  }

  const data = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        label: "Bookings",
        data: chartData.map((d) => d.value),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="booking-chart">
      <Bar data={data} options={options} />
    </div>
  );
};
export default BookingChart;
