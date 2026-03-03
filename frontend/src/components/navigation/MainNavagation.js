import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const authContext = useContext(AuthContext);

  return (
    <header className="main-nav">
      <div className="main-nav__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-nav__items">
        <ul>
          {!authContext.token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          {authContext.token && (
            <>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      {authContext.token && (
        <div className="main-nav__logout">
          <button onClick={authContext.logout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default MainNavigation;
