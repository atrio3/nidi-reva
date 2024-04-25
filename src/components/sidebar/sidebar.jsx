import React from "react";
import { BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function Sidebar() {
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
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.jpg" alt="Logo" className="logo" />
      </div>

      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">
          <Link to="/booking" className="sidebar-link">
            <BsFillGrid3X3GapFill className="icon" /> Bookings
          </Link>
        </li>

        <li className="sidebar-menu-item">
          <Link to="/vehicles" className="sidebar-link">
            <BsFillArchiveFill className="icon" /> Vehicles
          </Link>
        </li>

        <li className="sidebar-menu-item">
          <Link to="/completed" className="sidebar-link">
            <BsFillArchiveFill className="icon" /> Completed Bookings
          </Link>
        </li>
      </ul>

      <button className="logout-button" onClick={handleLogout}>
        <BsPeopleFill className="icon" /> Logout
      </button>

      <div className="sidebar-footer"><hr />Powered by: Atrio technologies</div>
    </aside>
  );
}

export default Sidebar;
