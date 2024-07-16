import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { db, firebaseAuth } from "../../context/Firebase";
import { getDoc, doc } from "firebase/firestore";
import { createTheme } from "@mui/material/styles";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Employee {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
  Salary: string;
}

const Container = styled.div`
  padding: 24px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 0 auto;
  margin-top: 50px;
`;

const Title = styled.h1`
  text-align: center;
  color: #008080;
  margin-bottom: 16px;
`;

const theme = createTheme({
  palette: {
    primary: {
      main: "#008080",
    },
  },
});

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [user] = useAuthState(firebaseAuth);
  const navigate=useNavigate();
  
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const userId=localStorage.getItem('userId')
        const employeeRef = doc(db, `users/${userId}/employees/${id}`);
        const employeeSnap = await getDoc(employeeRef);

        if (employeeSnap.exists()) {
          setEmployee(employeeSnap.data() as Employee);
        } else {
          console.log("No such document!");
          setEmployee(null);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };
    fetchEmployee();
  }, [id, user]);

  if (!employee) {
    return <div>Loading employee details...</div>;
  }
  const back = () => {
    navigate(`/employees`);
  };
  return (
    <Container>
      <Title>Employee Detail</Title>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>{employee.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>{employee.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Phone Number</strong>
              </TableCell>
              <TableCell>{employee.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Gender</strong>
              </TableCell>
              <TableCell>{employee.gender}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Department</strong>
              </TableCell>
              <TableCell>{employee.department}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>{employee.role}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Salary</strong>
              </TableCell>
              <TableCell>₹{employee.Salary}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeDetail;
