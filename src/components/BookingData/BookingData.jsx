import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';
import './BookingData.css';
import { Search } from '@mui/icons-material'; 

const BookingData = () => {
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(database);
            
            try {
                onValue(dbRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const userDetailsArray = Object.values(data.UserDetails || {});
                        const filteredData = userDetailsArray.filter(item => item.userLocation === 'REVA');
                        setTableData(filteredData);
                        setFilteredData(filteredData); 
                    } else {
                        console.log("No data found.");
                    }
                }, (error) => {
                    console.error("Error fetching data:", error);
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            }
            fetchData();
    }, []);

    

    useEffect(() => {
        if (searchQuery !== '') {
            const filtered = tableData.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredData(filtered);
        } else {
            setFilteredData(tableData);
        }
    }, [searchQuery, tableData]);

   

    const formatTime = (timeString) => {
        const timeParts = timeString.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        
        let amOrPm = 'AM';
        let formattedHours = hours;
        
        if (hours >= 12) {
            amOrPm = 'PM';
            formattedHours = hours === 12 ? 12 : hours - 12;
        }
        
        return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    return (
        <div className="booking-data-container">
            <h2 className="booking-data-title">REVA Bookings:</h2>
            <div className="search-container">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Name" />
                <button onClick={() => setSearchQuery('')}>
                    <Search />
                </button>
            </div>
            <div className="table-container">
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            {/* <th>Location-Selected</th> */}
                            <th>Phone No.</th>
                            <th>Driving ID</th>
                            <th>Selected Vehicle</th>
                            <th>Vehicle Price</th>
                            <th>Vehicle Category</th>
                            <th>Pickup Date</th>
                            <th>Drop-off Date</th>
                            <th>Time</th>
                            <th>Total Paid Amount</th>

                       </tr>
                       </thead>
                    <tbody>
                        {filteredData.map((userDetails, index) => (
                            <tr key={userDetails.id}>
                                <td>{index + 1}</td>
                                <td>{userDetails.name}</td>
                                <td>{userDetails.email}</td>
                                <td>{userDetails.address}</td>
                                {/* <td>{userDetails.userLocation}</td> */}
                                <td>{userDetails.tel}</td>
                                <td>{userDetails.drivingID}</td>
                                <td>{userDetails.vehicle_name}</td>
                                <td>₹{userDetails.vehicle_price}</td>
                                <td>{userDetails.vehicle_category}</td>
                                <td>{formatDate(userDetails.pickUpDate)}</td>
                                <td>{formatDate(userDetails.dropOffDate)}</td>
                                <td>{formatTime(userDetails.time)}</td>
                                <td>₹{userDetails.rentAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookingData;
