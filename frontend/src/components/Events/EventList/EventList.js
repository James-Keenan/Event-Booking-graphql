import React from "react";
import "./EventList.css";

import EventItem from "./EventItem/EventItem";

const EventList = (props) => {
  return (
    <ul className="event__list">
      {props.events.map((event) => (
        <EventItem key={event._id} 
        eventId={event._id} 
        event={event} 
        authUserId={props.authUserId}
        onDetail={props.onViewDetail}
         />
      ))}
    </ul>
  );
};

export default EventList;
