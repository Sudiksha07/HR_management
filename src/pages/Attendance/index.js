import React, { useState, useEffect } from "react";
import { useFirebase } from "../../context/Firebase";
import { useAuth } from "../../context/authContext";
import { createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import styled from "styled-components";
import AttendanceForm from "./attendancForm";
import AttendanceTable from "../Attendance/AttendaceTable"
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../../context/Firebase";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LeavePage from "./LeavePage";
const theme = createTheme({
  palette: {
    primary: {
      main: "#008080",
    },
  },
});

const Container = styled.div`
  padding: 70px /* Adjust padding as needed */
  width: calc(100% - 2px); /* Adjust this value based on the width of your sidebar */
    margin-left: 50px; /* Adjust this value based on the width of your sidebar */ */} */}
  background-color: #f0f4f8;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh; /* Ensure the container takes the full height of the screen */
`;

const Title = styled.h1`
  text-align: center;
  color: ${theme.palette.primary.main};
  margin-bottom: 16px;
`;


const Attendance = () => {
  const { user, fetchEmployees, employees, fetchAttendance } = useFirebase();
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchEmployees();
    if (user) {
      fetchAttendance(user.uid).then((data) => {
        setAttendanceData(data);
      });
    }
  }, [user]);

  const handleSignOut = async (attendanceId) => {
    const signOutTime = Timestamp.now();
    const attendanceDocRef = doc(db, "users", user.uid, "attendance", attendanceId);

    try {
      await updateDoc(attendanceDocRef, { signOutTime });
      setAttendanceData((prevData) =>
        prevData.map((att) =>
          att.id === attendanceId ? { ...att, signOutTime } : att
        )
      );
    } catch (error) {
      console.error("Error updating sign-out time:", error);
    }
  };
  const NavButton = styled.button`
  margin: 16px;
  
  padding: 8px 16px;
  background-color: #008080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #006666;
  }
`;
  return (
    
   
      <Container>
        <Title>Mark Attendance 
        <Link to="/leave">
          <NavButton>Leave Form</NavButton>
        </Link></Title>
       
        <AttendanceForm
        employees={employees}
        setAttendanceData={setAttendanceData}
        attendanceData={attendanceData}
      />
        <Title>Attendance Details</Title>
        <AttendanceTable
        employees={employees}
        attendanceData={attendanceData}
        handleSignOut={handleSignOut} // Pass handleSignOut function here
      />

      </Container>
 

  );
};

export default Attendance;