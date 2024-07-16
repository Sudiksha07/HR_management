import React, { useEffect, useState } from "react";
import { db, firebaseAuth, useFirebase } from "../../context/Firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
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
import Box from "@mui/material/Box";
import { Container, Typography } from "@mui/material";
import EmployeeForm from "./EmployeeForm";

interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}

const departments = ["HR", "Engineering", "Marketing", "Sales"];
const roles = ["Manager", "Developer", "Designer", "Marketer"];

const EmployeeList: React.FC = () => {
  const firebase = useFirebase();
  const employees = firebase.employees;

  const [user, setUser] = useAuthState(firebaseAuth);
  const [openDialog, setOpenDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [addEmployeeButton, setAddEmployeeButton] = useState<Boolean>(false);
  useEffect(() => {
    firebase.fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (employeeId: any) => {
    firebase.deleteEmployeeData(employeeId);
    firebase.fetchEmployees();
  };

  const handleOpenDialog = (employee: any) => {
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
      const employeeRef = doc(
        db,
        "users",
        user.uid,
        "employees",
        editEmployee.id
      );
      await updateDoc(employeeRef, formData); // No need to cast now
      console.log("Employee updated successfully");
      firebase.fetchEmployees();
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
    <div>
      <EmployeeForm />
      <Typography variant="h5" sx={{ margin: "0px 0px" }}>
        Employee List
      </Typography>
      <TableContainer sx={{margin:"20px 0px"}}>
        <Table sx={{width:"900px"}}>
          <TableHead>
            <TableRow>
              <TableCell>Employee name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, id) => (
              <TableRow key={id} style={{ borderBottom: "1px solid black" }}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <IconButton
                        onClick={() => handleDeleteEmployee(employee.id)}
                        aria-label="delete"
                        style={{
                          backgroundColor: "#f44336",
                          color: "white",
                          borderRadius: "10px",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box mr={1}>
                      <IconButton
                        onClick={() => handleOpenDialog(employee)}
                        aria-label="edit"
                        style={{
                          backgroundColor: "#405cf5",
                          color: "white",
                          borderRadius: "10px",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                    <Box mr={1}>
                      <Link
                        to={`/employee/${employee.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          style={{
                            backgroundColor: "#04AA6D",
                            color: "white",
                            borderRadius: "10px",
                          }}
                        >
                          View Details
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </div>
  );
};

export default EmployeeList;
