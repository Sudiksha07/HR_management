import React, { useState, useEffect } from "react";
import { useFirebase } from "../../context/Firebase";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import {
  addDoc,
  collection,
  Timestamp,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import styled from "styled-components";
import { db } from "../../context/Firebase";

const CustomButton = styled(Button)`
  && {
    background-color: #008080;
    color: white;
    &:hover {
      background-color: #006666;
    }
  }
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AttendanceForm = ({ setAttendanceData, attendanceData }) => {
  const { fetchEmployees, employees } = useFirebase();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [status, setStatus] = useState("Present");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAttendanceSubmit = async () => {
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(currentDate);

    const attendanceQuery = query(
      collection(
        db,
        "users",
        localStorage.getItem("userId") || "",
        "attendance"
      ),
      where("employeeId", "==", selectedEmployee),
      where("formattedDate", "==", formattedDate)
    );

    const querySnapshot = await getDocs(attendanceQuery);

    if (!querySnapshot.empty) {
      alert("Attendance already marked for today.");
      return;
    }

    const newAttendance = {
      employeeId: selectedEmployee,
      status,
      date: Timestamp.now(),
      signOutTime: null,
      submitTime: Timestamp.now(),
      formattedDate,
    };

    try {
      const attendanceDocRef = await addDoc(
        collection(
          db,
          "users",
          localStorage.getItem("userId") || "",
          "attendance"
        ),
        newAttendance
      );
      setAttendanceData([
        ...attendanceData,
        { id: attendanceDocRef.id, ...newAttendance },
      ]);
      alert("Attendance marked successfully");
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <FormContainer>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  value={new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date())}
                  InputProps={{ readOnly: true }}
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel>Select Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                    <MenuItem value="Unavailable">Unavailable</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <CustomButton
                  variant="contained"
                  onClick={handleAttendanceSubmit}
                >
                  Submit Attendance
                </CustomButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FormContainer>
  );
};

export default AttendanceForm;
