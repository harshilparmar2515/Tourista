import ModernNavbar from "./components/ModernNavbar";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TripDetail from "./pages/TripDetail";
import TripListing from "./pages/TripListing";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";
import "./styles/toast.css";
import "./App.css";
import Auth from  "./components/Auth/Auth";
import Booking from "./pages/Booking"
import ProtectedRoute from "./components/ProtectedRoute";
import MyBookings from "./pages/MyBookings";
import { ToastProvider } from "./components/ToastContext";
import AuthContextProvider from "./components/context/AuthContext";


function App() {
  return (
    <ToastProvider>
      <ModernNavbar />

      <main className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripListing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </ToastProvider>
  );
}

export default App;