import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.css";

const MainNavigation = (props) => {
  return (
    <header className="main-nav">
      <div className="main-nav__logo">
        <h1>EasyEvent</h1>
        <nav className="main-nav__items">
          <ul>
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default MainNavigation;
