import React, { useState, ChangeEvent, FormEvent } from "react";
import { db, firebaseAuth, useFirebase } from "../../context/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface FormData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}
const initialData:FormData = {
  id: "",
  name: "",
  email: "",
  phoneNumber: "",
  gender: "",
  department: "",
  role: "",
};
const departments = ["HR", "Engineering", "Marketing", "Sales"]; // Example departments
const roles = ["Manager", "Developer", "Designer", "Marketer"]; // Example roles

const EmployeeForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [user] = useAuthState(firebaseAuth);
  const [open, setOpen] = useState(false);
  const firebase = useFirebase();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFormData(initialData)
    setOpen(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange =
    (name: keyof FormData) => (e: SelectChangeEvent<string>) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: e.target.value,
      }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("adding employee button clicked");
    e.preventDefault();
    console.log(user);
    firebase.writeUserData(formData);
    firebase.fetchEmployees();
    setFormData(initialData);
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ margin: "20px 0px" }}
      >
        Add Member
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Employee</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              margin="dense"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="standard"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleSelectChange("department")}
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange("role")}
                required
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange("gender")}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add Employee
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default EmployeeForm;
