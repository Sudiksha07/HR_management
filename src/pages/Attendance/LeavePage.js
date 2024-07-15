import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/Firebase";
import { addDoc, collection, Timestamp,getDocs } from "firebase/firestore";
import { db } from "../../context/Firebase";
import { createTheme } from "@mui/material/styles";

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`;
const theme = createTheme({
    palette: {
      primary: {
        main: "#008080",
      },
    },
  });
  const Title = styled.h1`
  text-align: center;
  color: ${theme.palette.primary.main};
  margin-bottom: 16px;
`;

const CustomButton = styled(Button)`
  && {
    background-color: #008080;
    color: white;
    &:hover {
      background-color: #006666;
    }
  }
`;
const LeavePage = () => {
  const { fetchEmployees, employees } = useFirebase();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [status, setStatus] = useState("Unapproved");
  const [leaveData, setLeaveData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    const querySnapshot = await getDocs(collection(db, "users", localStorage.getItem("userId") || "", "leave"));
    const leaves = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLeaveData(leaves);
  };

  const handleLeaveSubmit = async () => {
    const newLeave = {
      employeeId: selectedEmployee,
      status,
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: Timestamp.fromDate(new Date(endDate)),
      submitTime: Timestamp.now(),
    };

    try {
      const leaveDocRef = await addDoc(
        collection(db, "users", localStorage.getItem("userId") || "", "leave"),
        newLeave
      );
      setLeaveData([...leaveData, { id: leaveDocRef.id, ...newLeave }]);
      alert("Leave submitted successfully");
    } catch (error) {
      console.error("Error submitting leave:", error);
    }
  };

  return (
    <div>
    <CustomButton variant="contained" onClick={() => navigate("/attendance")}>
        Back to Attendance
      </CustomButton>
      <h1>Leave Details</h1>
      <FormContainer>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Employee</InputLabel>
                    <Select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    label="Start Date"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    type="date"
                    label="End Date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Unapproved">Unapproved</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <CustomButton variant="contained" onClick={handleLeaveSubmit} fullWidth>
                    Submit Leave
                  </CustomButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </FormContainer>

      

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Submit Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveData.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{employees.find((e) => e.id === leave.employeeId)?.name}</TableCell>
                <TableCell>{leave.status}</TableCell>
                <TableCell>{new Date(leave.startDate.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(leave.endDate.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(leave.submitTime.seconds * 1000).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeavePage;

