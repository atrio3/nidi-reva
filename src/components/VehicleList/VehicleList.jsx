import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vehicleQuantityList"));
        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehicles(newData);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchData();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => Array.isArray(vehicle.location) && vehicle.location.includes("REVA"));

  const quantity = filteredVehicles.map(vehicle =>
    vehicle.location.findIndex(location => location === "REVA") !== -1 ?
      vehicle.quantity[vehicle.location.findIndex(location => location === "REVA")] :
      ""
  );

  return (
    <Paper elevation={3} style={{ borderRadius: "14px", margin: "20px", padding: "20px" }}>
      <TableContainer>
        <Table>
          <TableHead style={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell colSpan={2} align="center" style={{ fontWeight: "bold" }}>
                REVA
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVehicles.map((vehicle, index) => (
              <TableRow key={vehicle.id}>
                <TableCell align="center">{vehicle.name}</TableCell>
                <TableCell align="center">{quantity[index]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default VehicleList;
