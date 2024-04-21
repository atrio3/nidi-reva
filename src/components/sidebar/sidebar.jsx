import React from "react";
import {
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function Sidebar({ open, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside id="sidebar" className={open ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        <img src="/logo.jpg" alt="Logo" className="logo" />
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/booking">
            <BsFillGrid3X3GapFill className="icon" /> Bookings
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/vehicles">
            <BsFillArchiveFill className="icon" /> Vehicles
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/completed">
            <BsFillArchiveFill className="icon" /> Completed Bookings
          </Link>
        </li>

        <li className="sidebar-list-item">
          <button className="logout-button" onClick={handleLogout}>
            <BsPeopleFill className="icon" /> Logout
          </button>
        </li>
      </ul>

      <div className="sidebar-footer">Powered by: Atrio technologies</div>
    </aside>
  );
}

export default Sidebar;
