import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingPage from "./pages/Booking";

import Navbar from "./components/navigation/MainNavagation";

import { AuthContext } from "./context/auth-context";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  const isAuth = !!token;

  return (
    <>
      <AuthContext.Provider
        value={{
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <Navbar />
        <main className="main-content">
          <Routes>
            {!isAuth && <Route path="/auth" element={<AuthPage />} />}
            {isAuth && <Route path="/events" element={<EventsPage />} />}
            {isAuth && <Route path="/bookings" element={<BookingPage />} />}

            {!isAuth && (
              <Route path="*" element={<Navigate to="/auth" replace />} />
            )}
            {isAuth && (
              <Route path="*" element={<Navigate to="/events" replace />} />
            )}
          </Routes>
        </main>
      </AuthContext.Provider>
    </>
  );
}

export default App;
