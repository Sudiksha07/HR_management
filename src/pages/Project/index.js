import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  MenuItem,
  ListItemText,
  DialogContent,
  TextField,
  FormHelperText,
  ListItemIcon,
  Chip,
  Box,
  InputLabel,
  Checkbox,
} from "@mui/material";
import { useFirebase } from "../../context/Firebase";
import "./index.css";

const Project = () => {
  const firebase = useFirebase();
  const [projects, setProjects] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectValue, setSelectValue] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [leadEmployee, setLeadEmployee] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [nameError, setNameError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [leadEmployeeError, setLeadEmployeeError] = useState("");

  useEffect(() => {
    setAvailableEmployees(firebase.employees);
  }, [firebase.employees]);

  useEffect(() => {
    firebase.fetchProjects();
  }, []);

  useEffect(() => {
    setProjects(firebase.projects);
  }, [firebase.projects]);

  const handleValue = (e) => {
    const value = e.target.value;
    setSelectValue(value);
    setEmployeeError("");
  };

  const handleLeadEmployee = (e) => {
    setLeadEmployee(e.target.value);
    setLeadEmployeeError("");
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleOpenEditModal = (project) => {
    setProjectName(project.name);
    setSelectValue(project.employees);
    setLeadEmployee(project.leadEmployee);
    setEditProjectId(project.id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectName("");
    setSelectValue([]);
    setLeadEmployee("");
    setNameError("");
    setEmployeeError("");
    setLeadEmployeeError("");
  };

  const handleSaveProject = () => {
    let hasError = false;

    if (projectName.trim() === "") {
      setNameError("Project name cannot be empty");
      hasError = true;
    } else {
      setNameError("");
    }

    if (selectValue.length === 0) {
      setEmployeeError("At least one employee must be selected");
      hasError = true;
    } else {
      setEmployeeError("");
    }

    if (leadEmployee.trim() === "") {
      setLeadEmployeeError("Lead Employee should be selected");
      hasError = true;
    } else {
      setLeadEmployeeError("");
    }

    if (hasError) {
      return;
    }

    firebase.addProject(projectName, selectValue, leadEmployee);
    firebase.fetchProjects();
    handleCloseAddModal();
  };

  const handleEditProject = () => {
    let hasError = false;

    if (projectName.trim() === "") {
      setNameError("Project name cannot be empty");
      hasError = true;
    } else {
      setNameError("");
    }

    if (selectValue.length === 0) {
      setEmployeeError("At least one employee must be selected");
      hasError = true;
    } else {
      setEmployeeError("");
    }

    if (leadEmployee.trim() === "") {
      setLeadEmployeeError("Lead Employee should be selected");
      hasError = true;
    } else {
      setLeadEmployeeError("");
    }

    if (hasError) {
      return;
    }
    const formData = {
      id: editProjectId,
      name: projectName,
      leadEmployee: leadEmployee,
      employees: selectValue,
    };
    firebase.updateProject(editProjectId, formData);
    firebase.fetchProjects();
    handleCloseEditModal();
  };

  return (
    <div className="projectsSection">
      <Dialog open={isAddModalOpen} onClose={handleCloseAddModal}>
        <DialogContent>
          <DialogTitle variant="h5">Add Project</DialogTitle>
          <FormControl fullWidth margin="normal" error={Boolean(nameError)}>
            <TextField
              label="Project Name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setNameError("");
              }}
              fullWidth
            />
            {nameError && <FormHelperText>{nameError}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel
              id="demo-select-small-label-lead"
              sx={{ marginTop: "8px" }}
            >
              Select Project Lead
            </InputLabel>
            <Select
              value={leadEmployee}
              fullWidth
              sx={{ marginBottom: "20px" }}
              labelId="demo-select-small-label-employees"
              onChange={handleLeadEmployee}
            >
              {availableEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.name}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
            {leadEmployeeError && (
              <FormHelperText sx={{ marginTop: "-15px" }}>
                {leadEmployeeError}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel
              id="demo-select-small-label-employees"
              sx={{ marginTop: "8px" }}
            >
              Select employees
            </InputLabel>
            <Select
              value={selectValue}
              multiple
              fullWidth
              id="multi-select"
              labelId="demo-select-small-label-employees"
              onChange={handleValue}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    height: "50px",
                    width: "auto",
                    overflow: "auto",
                  }}
                >
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        availableEmployees.find((emp) => emp.name === value)
                          ?.name
                      }
                    />
                  ))}
                </Box>
              )}
            >
              {availableEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.name}>
                  <ListItemIcon>
                    <Checkbox
                      checked={selectValue.indexOf(employee.name) > -1}
                    />
                  </ListItemIcon>
                  <ListItemText primary={employee.name}></ListItemText>
                </MenuItem>
              ))}
            </Select>
            {employeeError && <FormHelperText>{employeeError}</FormHelperText>}
          </FormControl>
          <DialogActions>
            <Button onClick={handleCloseAddModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveProject} color="primary">
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal}>
        <DialogContent>
          <DialogTitle variant="h5">Edit Project</DialogTitle>
          <FormControl fullWidth margin="normal" error={Boolean(nameError)}>
            <TextField
              label="Project Name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setNameError("");
              }}
              fullWidth
            />
            {nameError && <FormHelperText>{nameError}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel
              id="demo-select-small-label-lead"
              sx={{ marginTop: "8px" }}
            >
              Select Project Lead
            </InputLabel>
            <Select
              value={leadEmployee}
              fullWidth
              sx={{ marginBottom: "20px" }}
              labelId="demo-select-small-label-employees"
              onChange={handleLeadEmployee}
            >
              {availableEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.name}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
            {leadEmployeeError && (
              <FormHelperText sx={{ marginTop: "-15px" }}>
                {leadEmployeeError}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel
              id="demo-select-small-label-employees"
              sx={{ marginTop: "8px" }}
            >
              Select employees
            </InputLabel>
            <Select
              value={selectValue}
              multiple
              fullWidth
              id="multi-select"
              labelId="demo-select-small-label-employees"
              onChange={handleValue}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    height: "50px",
                    width: "auto",
                    overflow: "auto",
                  }}
                >
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        availableEmployees.find((emp) => emp.name === value)
                          ?.name
                      }
                    />
                  ))}
                </Box>
              )}
            >
              {availableEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.name}>
                  <ListItemIcon>
                    <Checkbox
                      checked={selectValue.indexOf(employee.name) > -1}
                    />
                  </ListItemIcon>
                  <ListItemText primary={employee.name}></ListItemText>
                </MenuItem>
              ))}
            </Select>
            {employeeError && <FormHelperText>{employeeError}</FormHelperText>}
          </FormControl>
          <DialogActions>
            <Button onClick={handleCloseEditModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditProject} color="primary">
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <div className="buttonAndHeading">
        <Button
          variant="contained"
          onClick={handleOpenAddModal}
          className="addProject"
          color="secondary"
        >
          Add Project
        </Button>
        <h1>Project List </h1>
      </div>

      {projects.length > 0 ? (
        <div className="projectList">
          {projects.map((project) => (
            <div key={project.id} className="projectName">
              <h3>Name: {project.name}</h3>
              <p>Lead Employee: {project.leadEmployee}</p>
              <p>
                Working Employees:{" "}
                <span className="employeeList">
                  {project.employees.join(", ")}
                </span>
              </p>
              <div className="deleteAndEditButtons">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    firebase.deleteProject(project.id);
                    firebase.fetchProjects();
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#06f" }}
                  onClick={() => handleOpenEditModal(project)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div classname="noProjects">
          <h3>Sorry, there are no projects to show</h3>
        </div>
      )}
    </div>
  );
};

export default Project;
