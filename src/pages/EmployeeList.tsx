import React, { useEffect, useState } from 'react';
import { db, auth } from '../context/Firebase';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  DocumentData,
} from 'firebase/firestore';
// import { routes } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}

const departments = ['HR', 'Engineering', 'Marketing', 'Sales'];
const roles = ['Manager', 'Developer', 'Designer', 'Marketer'];

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [user] = useAuthState(auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user) return;

      try {
        const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'employees'), (snapshot) => {
          const updatedEmployees: Employee[] = [];
          snapshot.forEach((doc) => {
            updatedEmployees.push({
              id: doc.id,
              ...doc.data(),
            } as Employee);
          });
          setEmployees(updatedEmployees);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching employees: ', error);
      }
    };

    fetchEmployees();
  }, [user]);

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'employees', employeeId));
      console.log('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee: ', error);
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
      const employeeRef = doc(db, 'users', user.uid, 'employees', editEmployee.id);
      await updateDoc(employeeRef, formData); // No need to cast now
      console.log('Employee updated successfully');
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating employee: ', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, name: keyof Employee) => {
    const value = e.target.value as string;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>Employee List</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteEmployee(employee.id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(employee)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <Link to={`/employees/${employee.id}`}>View Details</Link> {/* Link to EmployeeDetails */}
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
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Gender"
            select
            fullWidth
            name="gender"
            value={formData.gender || ''}
            onChange={(e) => handleSelectChange(e, 'gender')}
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
            value={formData.department || ''}
            onChange={(e) => handleSelectChange(e, 'department')}
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
            value={formData.role || ''}
            onChange={(e) => handleSelectChange(e, 'role')}
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

