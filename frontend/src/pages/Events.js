import React, { useState, useEffect, useCallback, useContext } from "react";

import Modal from "../components/modal/modal";
import Backdrop from "../components/backdrop/backdrop";
import { AuthContext } from "../context/auth-context";

import "./Events.css";

const EventsPage = () => {
  const authContext = useContext(AuthContext);

  // State for modal visibility
  const [creating, setCreating] = React.useState(false);

  // State for form inputs
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState(null);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  // Handle form submission
  const submitEventHandler = async () => {
    // Validation - check if fields are empty
    if (
      title.trim() === "" ||
      price.trim() === "" ||
      date.trim() === "" ||
      description.trim() === ""
    ) {
      setError("Please fill in all fields!");
      return;
    }

    const requestBody = {
      query: `
         mutation {
         createEvent(eventInput: {title: "${title}", description: "${description}", price: ${+price}, date: "${date}"}) {
           _id
           title
           description
           price
           date
           creator {
             _id
             email
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
        const backendMessage = responseData?.errors?.[0]?.message;
        throw new Error(
          backendMessage || `Request failed with status ${response.status}.`,
        );
      }

      if (responseData.errors && responseData.errors.length > 0) {
        throw new Error(responseData.errors[0].message);
      }

      // Clear form
      setTitle("");
      setPrice("");
      setDate("");
      setDescription("");
      setError(null);

      // Close modal
      setCreating(false);
      // Fetch events to show the newly created one
      await fetchEventsHandler();
    } catch (error) {
      setError(error.message);
    }
  };

  const cancelHandler = () => {
    setTitle("");
    setPrice("");
    setDate("");
    setDescription("");
    setCreating(false);
    setError(null);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchEventsHandler = useCallback(async () => {
    setIsLoading(true);

    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
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

      setEvents(responseData.data.events);
    } catch (error) {
      setError(error.message); 
    } finally {
      setIsLoading(false); 
    }
  }, [authContext.token]);

  useEffect(() => {
    fetchEventsHandler();
  }, [fetchEventsHandler]);

  return (
    <>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={cancelHandler}
          onConfirm={submitEventHandler}
        >
          {error && <p className="error">{error}</p>}
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
              />
            </div>
          </form>
        </Modal>
      )}

      {authContext.token && (
        <div className="events-control">
          <p>Share Your Own Events</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}

      <ul className="events__list">
        {events.length === 0 && !isLoading && <li>No events available.</li>}
        {isLoading && <li>Loading...</li>}
        {events.map((event) => (
          <li key={event._id} className="events__list-item">
            <h2>{event.title}</h2>
            <h3>${event.price}</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default EventsPage;
