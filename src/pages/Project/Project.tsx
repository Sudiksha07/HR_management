import React, { useEffect, useState } from "react";
import { useFirebase } from "../../context/Firebase";

interface Employee {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}

const Project: React.FC = () => {
  const firebase = useFirebase();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>("");

  useEffect(() => {
    firebase.fetchEmployees();
  }, []);

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedEmployees(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    firebase.addProject(
      projectName,
      selectedEmployees,
      setProjectName,
      setSelectedEmployees
    );
  };

  return (
    <div>
      <h3>Welcome to Projects section</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div>
          <label>Employees:</label>
          <select
            multiple
            value={selectedEmployees}
            onChange={handleEmployeeChange}
          >
            {firebase.employees.map((employee: Employee, id: any) => (
              <option key={id} value={id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default Project;
