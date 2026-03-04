import React, { useState, useEffect, useCallback, useContext } from "react";

import Modal from "../components/modal/modal";
import Backdrop from "../components/backdrop/backdrop";
import { AuthContext } from "../context/auth-context";
import Spinner from "../components/spinner/spinner";

import EventList from "../components/Events/EventList/EventList";

import "./Events.css";

const EventsPage = () => {
  const authContext = useContext(AuthContext);

  // State for modal visibility
  const [creating, setCreating] = useState(false);

  // State for form inputs
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
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
      variables: {
        title,
        description,
        price: +price,
        date,
      },
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
      // Add new event directly to list without re-fetching
      const newEvent = responseData.data.createEvent;
      setEvents((prevEvents) => [...prevEvents, newEvent]);
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

  const showDetailHandler = (eventId) => {
    const event = events.find((e) => e._id === eventId);
    setSelectedEvent(event);
    return event;
  };

  const bookEventHandler = async () => {
    const requestBody = {
      query: `
        mutation BookEvent($eventId: ID!) {
          bookEvent(eventId: $eventId) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        eventId: selectedEvent._id,
      },
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

      console.log("Booked!", responseData.data.bookEvent);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Booking failed:", error.message);
    }
  };

  return (
    <>
      <h1 className="events-title">Events</h1>

      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={cancelHandler}
          onConfirm={submitEventHandler}
          confirmText="Create"
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

      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={() => setSelectedEvent(null)}
          onConfirm={bookEventHandler}
          confirmText="Book"
        >
          <p>
            <b>Description:</b> {selectedEvent.description}
          </p>
          <p>
            <b>Price:</b> ${selectedEvent.price}
          </p>
          <p>
            <b>Date:</b> {new Date(selectedEvent.date).toLocaleDateString()}
          </p>
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

      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={authContext.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
};

export default EventsPage;
