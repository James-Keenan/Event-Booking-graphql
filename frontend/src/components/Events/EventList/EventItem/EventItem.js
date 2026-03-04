import React from "react";

import "./EventItem.css";

const EventItem = (props) => {
  return (
    <li className="event__list-item">
      <div>
        <h1>{props.event.title}</h1>
        <h2>
          ${props.event.price} -{" "}
          {new Date(props.event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        <button
          className="btn"
          onClick={() => props.onDetail && props.onDetail(props.event._id)}
        >
          View Details
        </button>

        {props.event.creator ? (
          props.event.creator._id === props.authUserId ? (
            <p>
              <b className="your-event">Your event</b>
            </p>
          ) : (
            <p>
              <b className="event__list-item-creator">Creator:</b>{" "}
              {props.event.creator.email}
            </p>
          )
        ) : (
          <p>Unknown</p>
        )}
      </div>
    </li>
  );
};

export default EventItem;
