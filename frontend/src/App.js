import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingPage from "./pages/Booking";

import Navbar from "./components/navigation/MainNavagation";

import { AuthContext } from "./context/auth-context";

function App() {
  const getStoredToken = () => {
    const storedToken = localStorage.getItem("token");
    const storedExpiry = localStorage.getItem("tokenExpiry");
    if (storedToken && storedExpiry && Date.now() < Number(storedExpiry)) {
      return storedToken;
    }
    // Token missing or expired — clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiry");
    return null;
  };

  const [token, setToken] = useState(getStoredToken);
  const [userId, setUserId] = useState(() =>
    getStoredToken() ? localStorage.getItem("userId") : null,
  );

  const login = (token, userId, tokenExpiration) => {
    const expiryMs = Date.now() + tokenExpiration * 60 * 60 * 1000;
    setToken(token);
    setUserId(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("tokenExpiry", String(expiryMs));
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiry");
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
