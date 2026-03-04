import React from "react";
import "./BookingControls.css";

const BookingControls = ({ outputType, onChangeType }) => {
  return (
    <div className="booking-controls">
      <button
        className={outputType === "list" ? "active" : ""}
        onClick={() => onChangeType("list")}
      >
        List
      </button>
      <button
        className={outputType === "chart" ? "active" : ""}
        onClick={() => onChangeType("chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingControls;
