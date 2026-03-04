import React from "react";
import "./BookingList.css";

const BookingList = (props) => {
  if (props.bookings.length === 0) {
    return (
      <div className="booking__empty">
        <p>You have no bookings yet.</p>
        <span>Browse events and book your first one!</span>
      </div>
    );
  }

  return (
    <ul className="booking__list">
      {props.bookings.map((booking) => (
        <li key={booking._id} className="booking__list-item">
          <div className="booking__list-item-data">
            <h2>{booking.event.title}</h2>
            <h3>${booking.event.price}</h3>
            <p>{new Date(booking.event.date).toLocaleDateString()}</p>
          </div>
          <div className="booking__list-item-actions">
            <button className="btn" onClick={() => props.onCancel(booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookingList;
