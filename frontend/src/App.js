import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingPage from "./pages/Booking";

import Navbar from "./components/navigation/MainNavagation";

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/bookings" element={<BookingPage />} />
      </Routes>
      </main>
    </>
  );
}

export default App;
