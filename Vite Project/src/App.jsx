import NavScrollExample from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TripDetail from "./pages/TripDetail"; 
import "./App.css";
import Auth from  "./components/Auth/Auth";
import Booking from "./pages/Booking"

function App() {
  return (
    <>
      <NavScrollExample />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/trip/:id" element={<TripDetail />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/Booking" element={<Booking />} />
      </Routes>
    </>
  );
}

export default App;