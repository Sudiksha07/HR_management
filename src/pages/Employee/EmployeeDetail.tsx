import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { db, firebaseAuth } from "../../context/Firebase";
import { collection, doc, getDocs,getDoc } from "firebase/firestore";
interface Employee {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}
const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get employee ID from URL params
  const [employee, setEmployee] = useState<Employee>();
  const [user] = useAuthState(firebaseAuth); // Ensure 'auth' is correctly initialized
  
  useEffect(() => {
    const fetchEmployee = async () => {
      // try {
      if (!user) return; // Check if user is authenticated
      try {
        const employeeReff = doc(db, `users/${user.uid}/employees/${id}`);
        const employeeSnap = await getDoc(employeeReff);

        if (employeeSnap.exists() != null) {
          setEmployee(employeeSnap.data() as Employee)
        } else {
          console.log("No such document!");
          return null;
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, []);

  if (!employee) {
    return <div>Loading employee details...</div>;
  }

  return (
    <div>
      <h2>Employee Details</h2>
      <p>Name: {employee.name}</p>
      <p>Email: {employee.email}</p>
      <p>Phone Number: {employee.phoneNumber}</p>
      <p>Gender: {employee.gender}</p>
      <p>Department: {employee.department}</p>
      <p>Role: {employee.role}</p>
    </div>
  );
};

export default EmployeeDetail;
