import React, { useEffect, useState } from "react";
import { db, firebaseAuth, useFirebase } from "../../context/Firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import EmployeeForm from "./EmployeeForm";
import { createTheme } from "@mui/material/styles";
interface Employee {
  id: string; // Firestore document ID
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}
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

const departments = ["HR", "Engineering", "Marketing", "Sales"];
const roles = ["Manager", "Developer", "Designer", "Marketer"];

// Styled Components
const CustomTableContainer = styled(TableContainer)`
  margin-bottom: 32px;
`;
const AddMemberButton = styled(Button)`
  && {
    position: absolute;
    top: 80px;
    right: 100px;
    // background-color:black;
  }
`;
const CustomTableHeader = styled(TableHead)`
  background-color: #008080;
`;

const CustomTableCell = styled(TableCell)`
  color: black; /* Change to black or another contrasting color */
`;

const CustomTableRow = styled(TableRow)`
  && {
    &:nth-of-type(odd) {
      background-color: #f2f2f2;
    }
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const Container = styled.div`
margin-top:80px;
width:100%;
  // padding: 100px /* Adjust padding as needed */
  // width: calc(100% - 25px); /* Adjust this value based on the width of your sidebar */
    margin-left: 15px; /* Adjust this value based on the width of your sidebar */ */} */}
  background-color: #f0f4f8;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh; /* Ensure the container takes the full height of the screen */
`;

const EmployeeList: React.FC = () => {
  const firebase = useFirebase();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [user, setUser] = useAuthState(firebaseAuth);
  const [openDialog, setOpenDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "users", user.uid, "employees"),
        (snapshot) => {
          const updatedEmployees: Employee[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data(); // Ensure doc.data() contains all Employee properties
            if (data) {
              updatedEmployees.push({
                id: doc.id,
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                department: data.department,
                role: data.role,
                
              });
            }
          });
          setEmployees(updatedEmployees);
        }
      );
  
      return () => unsubscribe();
    }
  }, [user]);
  

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "employees", employeeId));
      console.log("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee: ", error);
    }
  };

  const handleOpenDialog = (employee: Employee) => {
    setEditEmployee(employee);
    setFormData(employee);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditEmployee(null);
    setFormData({});
  };

  const handleSaveChanges = async () => {
    if (!user || !editEmployee) return;

    try {
      const employeeRef = doc(db, "users", user.uid, "employees", editEmployee.id);
      await updateDoc(employeeRef, formData); // No need to cast now
      console.log("Employee updated successfully");
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating employee: ", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<{ value: unknown }>,
    name: keyof Employee
  ) => {
    const value = e.target.value as string;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    // <div>
<Container>
      <AddMemberButton>
      <EmployeeForm />
      </AddMemberButton>
      <Title>Employee Detail</Title>
      <CustomTableContainer>
        <Table>
          <CustomTableHeader>
            <TableRow>
              <CustomTableCell>Employee ID</CustomTableCell>
              <CustomTableCell>Name</CustomTableCell>
              <CustomTableCell>Department</CustomTableCell>
              <CustomTableCell>Role</CustomTableCell>
              <CustomTableCell>Actions</CustomTableCell>
            </TableRow>
          </CustomTableHeader>
          <TableBody>
            {employees.map((employee) => (
              <CustomTableRow key={employee.id}>
                <CustomTableCell>{employee.id}</CustomTableCell>
                <CustomTableCell>{employee.name}</CustomTableCell>
                <CustomTableCell>{employee.department}</CustomTableCell>
                <CustomTableCell>{employee.role}</CustomTableCell>
                <CustomTableCell>
                  <IconButton
                    onClick={() => handleDeleteEmployee(employee.id)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDialog(employee)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <Link to={`/employee/${employee.id}`}>View Details</Link>{" "}
                  {/* Link to EmployeeDetails */}
                </CustomTableCell>
              </CustomTableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTableContainer>

      {/* Edit Employee Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Gender"
            select
            fullWidth
            name="gender"
            value={formData.gender || ""}
            onChange={(e) => handleSelectChange(e, "gender")}
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Department"
            select
            fullWidth
            name="department"
            value={formData.department || ""}
            onChange={(e) => handleSelectChange(e, "department")}
            required
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Role"
            select
            fullWidth
            name="role"
            value={formData.role || ""}
            onChange={(e) => handleSelectChange(e, "role")}
            required
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
      // </div>
  );
};

export default EmployeeList;
