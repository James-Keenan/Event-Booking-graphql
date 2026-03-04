import React, { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import Spinner from "../components/spinner/spinner";
import BookingList from "../components/Bookings/BookingsList/BookingList";
import "./Booking.css";

const BookingPage = () => {
  const authContext = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookingsHandler = useCallback(async () => {
    setIsLoading(true);

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `,
    };

    try {
      const response = await fetch("http://localhost:3005/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authContext.token,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      if (responseData.errors && responseData.errors.length > 0) {
        throw new Error(responseData.errors[0].message);
      }

      setBookings(responseData.data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [authContext.token]);

  useEffect(() => {
    fetchBookingsHandler();
  }, [fetchBookingsHandler]);

  const cancelBookingHandler = async (bookingId) => {
    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
          }
        }
      `,
    };

    try {
      const response = await fetch("http://localhost:3005/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authContext.token,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      if (responseData.errors && responseData.errors.length > 0) {
        throw new Error(responseData.errors[0].message);
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onCancel={cancelBookingHandler} />
      )}
    </div>
  );
};

export default BookingPage;
