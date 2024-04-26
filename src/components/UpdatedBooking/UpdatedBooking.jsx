import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase"; // Ensure this path is correct
import { Search } from "@mui/icons-material";
import "./UpdatedBooking.css";
import { CSVLink } from "react-csv";

const UpdatedBooking = () => {
  // State to store fetched bookings
  const [bookings, setBookings] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(filteredData);

  useEffect(() => {
    const fetchUpdatedBookings = () => {
      const updatedBookingsRef = ref(database, "completed-bookings");

      const unsubscribe = onValue(updatedBookingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const updatedBookingsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          const filteredData = updatedBookingsArray.filter(
            (item) => item.userLocation === "REVA"
          );
          setTableData(filteredData);
          setFilteredData(filteredData);
          setBookings(updatedBookingsArray);
        } else {
          setBookings([]);
        }
      });

      return () => unsubscribe();
    };

    fetchUpdatedBookings();
  }, []);

  useEffect(() => {
    const filtered = searchQuery
      ? tableData.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tableData;
    setFilteredData(filtered);
  }, [searchQuery, tableData]);

  const formatTime = (timeString) => {
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    let amOrPm = "AM";
    let formattedHours = hours;

    if (hours >= 12) {
      amOrPm = "PM";
      formattedHours = hours === 12 ? 12 : hours - 12;
    }

    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amOrPm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "Phone no", key: "tel" },
    { label: "Driving ID", key: "drivingID" },
    { label: "Selected Vehicle", key: "vehicle_name" },
    { label: "Vehicle Price", key: "vehicle_price" },
    { label: "Vehicle Category", key: "vehicle_category" },
    { label: "Pickup Date", key: "pickUpDate" },
    { label: "Drop-off Date", key: "dropOffDate" },
    { label: "Time", key: "time" },
    { label: "Total Paid Amount", key: "rentAmount" },
    { label: "Driving ID Image", key: "image_Url" },
  ];

  return (
    <div className="updated-bookings">
      <h2>Updated Bookings</h2>
      <div className="search-export-container">
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name"
          />
          <button onClick={() => setSearchQuery("")}>
            <Search />
          </button>
        </div>
        {filteredData.length != 0 && (
          <div className="export-container">
            <CSVLink data={filteredData} headers={headers}>
              <button>Export CSV</button>
            </CSVLink>
          </div>
        )}
      </div>
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone No.</th>
              <th>Driving ID</th>
              <th>Selected Vehicle</th>
              <th>Vehicle Price</th>
              <th>Vehicle Category</th>
              <th>Pickup Date</th>
              <th>Drop-off Date</th>
              <th>Time</th>
              <th>Total Paid Amount</th>
              <th>Driving ID Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((booking, index) => (
              <tr key={booking.id}>
                <td>{index + 1}</td>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.address}</td>
                <td>{booking.tel}</td>
                <td>{booking.drivingID}</td>
                <td>{booking.vehicle_name}</td>
                <td>₹{booking.vehicle_price}</td>
                <td>{booking.vehicle_category}</td>
                <td>{formatDate(booking.pickUpDate)}</td>
                <td>{formatDate(booking.dropOffDate)}</td>
                <td>{formatTime(booking.time)}</td>
                <td>₹{booking.rentAmount}</td>
                <tr>
                  <td>
                    <a href={booking.image_Url}>Click Here</a>
                  </td>
                </tr>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdatedBooking;
