import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Vehicle from './components/VehicleList/VehicleList';
import Login from "./pages/Login/Login";
import Home from "./pages/home/Home";
import { AuthContext } from "./context/AuthContext";
import Booking from './pages/Booking/Booking';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className="grid-container">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path="/vehicles" element={<RequireAuth><Vehicle /></RequireAuth>} />
          <Route path="/booking" element={<RequireAuth><Booking/></RequireAuth>} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;