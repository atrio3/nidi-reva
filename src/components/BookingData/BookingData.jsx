import React, { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { database, db } from "../../firebase";
import "./BookingData.css";
import { Search } from "@mui/icons-material";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { CSVLink } from "react-csv";

const BookingData = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickupDate, setPickupDate] = useState(null); // State for selected pickup date
  const [quantityData, setQuantityData] = useState([]);
  const [requiredData, setRequiredData] = useState({});
  const [newQuantity, setNewQuantity] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});
  const [userDetailsIds, setUserDetailsIds] = useState([]);

  useEffect(() => {
    const fetchUserDetailsIds = async () => {
      const dbRef = ref(database, "UserDetails");
      onValue(dbRef, (snapshot) => {
        const ids = [];
        snapshot.forEach((childSnapshot) => {
          const userDetails = childSnapshot.val();
          if (userDetails.userLocation === "REVA") {
            ids.push(childSnapshot.key);
          }
        });
        setUserDetailsIds(ids);
      });
    };
    fetchUserDetailsIds();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database);
      onValue(
        dbRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userDetailsArray = Object.values(data.UserDetails || {});
            const filteredData = userDetailsArray.filter(
              (item) => item.userLocation === "REVA"
            );
            setTableData(filteredData);
            setFilteredData(filteredData);
            const status = {};
            filteredData.forEach((user, index) => {
              status[index] = "complete";
            });
            setCompletionStatus(status);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredIndex = searchQuery
      ? tableData.findIndex((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tableData;
    console.log(filteredIndex);
    const filteredElement = searchQuery
      ? tableData.find((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tableData;

    console.log(filteredElement);
    const newFiltered = [];

    newFiltered[filteredIndex] = filteredElement;
    setFilteredData(newFiltered);
  }, [searchQuery, tableData]);

  useEffect(() => {
    const filtered = pickupDate
      ? tableData.filter((user) => user.pickUpDate === pickupDate)
      : tableData;
    setFilteredData(filtered);
  }, [pickupDate, tableData]);

  const handlePickupDateChange = (date) => {
    setPickupDate(date);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "vehicleQuantityList")
        );
        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuantityData(newData);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (index, userDetails) => {
    const data = quantityData.find(
      (item) => item.id === userDetails.vehicle_id
    );
    if (data) {
      setCompletionStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "completed",
      }));
      setRequiredData(data);
      const indexInQuantity = data.location.findIndex(
        (item) => item === "REVA"
      );
      setNewQuantity(data.quantity[indexInQuantity] + 1);
    }
  };

  useEffect(() => {
    if (Object.keys(requiredData).length > 0 && newQuantity !== null) {
      updateQuantityInFirestore(requiredData);
    }
  }, [requiredData, newQuantity]);

  const updateQuantityInFirestore = async (data) => {
    if (!data || newQuantity === null) {
      console.error("No required data available for updating");
      return;
    }
    const updatedQuantities = [...data.quantity];
    const index = data.location.findIndex((item) => item === "REVA");
    updatedQuantities[index] = newQuantity;

    const docRef = doc(db, "vehicleQuantityList", data.id);
    try {
      await updateDoc(docRef, { quantity: updatedQuantities });
      let newArray = { ...data };
      newArray.quantity = [...updatedQuantities];
      setQuantityData((prevData) =>
        prevData.map((item) => (item.id === newArray.id ? newArray : item))
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const postData = async (userDetails, index) => {
    const {
      name,
      email,
      address,
      tel,
      drivingID,
      vehicle_name,
      vehicle_price,
      rentAmount,
      pickUpDate,
      dropOffDate,
      time,
      vehicle_category,
      userLocation,
      image_Url,
    } = userDetails;

    const postRes = await fetch(
      "https://nidi-databases-default-rtdb.firebaseio.com/completed-bookings.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          tel,
          address,
          drivingID,
          vehicle_name,
          vehicle_category,
          vehicle_price,
          pickUpDate,
          dropOffDate,
          time,
          rentAmount,
          userLocation,
          image_Url,
        }),
      }
    );

    if (postRes.ok) {
      const userDetailRef = ref(
        database,
        `UserDetails/${userDetailsIds[index]}`
      );
      await remove(userDetailRef);

      setFilteredData((prevData) => prevData.filter((_, idx) => idx !== index));
      setTableData((prevData) => prevData.filter((_, idx) => idx !== index));
      window.location.reload();
    }
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
    <div className="booking-data-container">
      <h2 className="booking-data-title">REVA Bookings:</h2>
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
        <div className="date-picker-container">
          <label>Pickup Date:</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => handlePickupDateChange(e.target.value)}
          />
        </div>
        {filteredData.length !== 0 && (
          <div className="export-container">
            <CSVLink data={filteredData} headers={headers}>
              <button>Export CSV</button>
            </CSVLink>
          </div>
        )}
      </div>
      <hr />
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>UserDetail ID</th>
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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((userDetails, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{userDetailsIds[index]}</td>
                <td>{userDetails.name}</td>
                <td>{userDetails.email}</td>
                <td>{userDetails.address}</td>
                <td>{userDetails.tel}</td>
                <td>{userDetails.drivingID}</td>
                <td>{userDetails.vehicle_name}</td>
                <td>₹{userDetails.vehicle_price}</td>
                <td>{userDetails.vehicle_category}</td>
                <td>{formatDate(userDetails.pickUpDate)}</td>
                <td>{formatDate(userDetails.dropOffDate)}</td>
                <td>{formatTime(userDetails.time)}</td>
                <td>₹{userDetails.rentAmount}</td>
                <td>
                  <a href={userDetails.image_Url}>Click Here</a>
                </td>
                <td>
                  {completionStatus[index] !== "completed" ? (
                    <button
                      onClick={() => {
                        handleClick(index, userDetails);
                      }}
                    >
                      {completionStatus[index]}
                    </button>
                  ) : (
                    <button disabled>{completionStatus[index]}</button>
                  )}
                </td>
                <td>
                  {completionStatus[index] === "completed" ? (
                    <button onClick={() => postData(userDetails, index)}>
                      Delete
                    </button>
                  ) : (
                    <button disabled>Complete to enable</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingData;
