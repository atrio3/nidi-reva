import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Vehicle from './components/VehicleList/VehicleList';
import Login from "./pages/Login/Login";
import Home from "./pages/home/Home"; 
import { AuthContext } from "./context/AuthContext";
import Booking from './pages/Booking/Booking';

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="grid-container">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/vehicles" element={currentUser ? <Vehicle /> : <Navigate to="/" />} />
          <Route path="/booking" element={currentUser ? <Booking /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
