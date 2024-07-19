import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  RefObject,
} from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  addDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

const firebaseConfig = {
  apiKey: "AIzaSyDA8HAyGsfcRIRFP37a4CeMwhN5NLQeYIU",
  authDomain: "hrmanagament-b6c14.firebaseapp.com",
  projectId: "hrmanagament-b6c14",
  storageBucket: "hrmanagament-b6c14.appspot.com",
  messagingSenderId: "55444164972",
  appId: "1:55444164972:web:b515c28b1c1b65c044e349",
};
interface FirebaseContextType {
  user: User | null;
  userData: any;
  employees: Employee[];
  projects: Project[];
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  writeUserData: (userData: Employee) => Promise<void>;
  deleteEmployeeData: (employeeId: string) => Promise<void>;
  addProject: (
    projectName: string,
    selectedEmployees: [],
    leadEmployee: string
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, formData: any) => Promise<void>;
  markAttendance: (employeeId: string, status: string) => Promise<void>;
  fetchAttendance: (employeeId: string) => Promise<void>;
  pdfRef: RefObject<HTMLDivElement> | null;
}
interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}
interface Project {
  id: string;
  name: string;
  leadEmployee: string;
  employees: string[];
}

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const firebaseAuth = getAuth(app);
const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const signup = async (email: string, password: string) => {
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((data) => {
        console.log("Signup successful");
        console.log("data is:", data);
        localStorage.setItem("userId", data.user.uid);
        localStorage.setItem("email", data.user.email ? data.user.email : "");
        setIsAuthenticated(true);
        navigate("/employees");
      })
      .catch((err) => {
        alert("Wrong email or password entered");
      });
  };

  const signUpWithGoogle = async () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log("result of signup with google: ", result);
        const user = result.user;
        localStorage.setItem("userId", user.uid);
        localStorage.setItem("email", user.email ? user.email : "");
        setIsAuthenticated(true);
        navigate("/employees");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
  const signin = async (email: string, password: string) => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((data: any) => {
        console.log("user data is: ", data.user);
        setUser(data.user);
        localStorage.setItem("token", data.user.accessToken);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("userId", data.user.uid);
        setIsAuthenticated(true);
        navigate("/employees");
      })
      .catch((err) => {
        alert("Wrong email or password entered");
        console.log("Error in SignIn ", err);
      });
  };
  const fetchEmployees = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const querySnapshot = await getDocs(
        collection(db, `users/${userId}/employees`)
      );

      const employeesData = querySnapshot.docs.map((doc, ID) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];

      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const querySnapshot = await getDocs(
        collection(db, `users/${userId}/projects`)
      );

      const projectValue = querySnapshot.docs.map((project, ID) => ({
        id: project.id,
        ...project.data(),
      })) as any;

      setProjects(projectValue);
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  const writeUserData = async (userData: Employee) => {
    try {
      const userId = localStorage.getItem("userId");
      const docRef = await addDoc(collection(db, `users/${userId}/employees`), {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        department: userData.department,
        role: userData.role,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteEmployeeData = async (employeeId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("employee id: ", employeeId);
      await deleteDoc(doc(db, `users/${userId}/employees/${employeeId}`));
      console.log("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee: ", error);
    }
  };

  const addProject = async (
    projectName: string,
    selectedEmployees: [],
    leadEmployee: string
  ) => {
    try {
      const userId = localStorage.getItem("userId");
      await addDoc(collection(db, `users/${userId}/projects`), {
        name: projectName,
        employees: selectedEmployees,
        leadEmployee: leadEmployee,
      });
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error creating project: ", error);
    }
  };
  const deleteProject = async (id: string) => {
    try {
      const userId = localStorage.getItem("userId");
      await deleteDoc(doc(db, `users/${userId}/projects/${id}`));
      console.log("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting employee: ", error);
    }
  };

  const updateProject = async (editProjectId: string, formData: any) => {
    const userId = localStorage.getItem("userId");
    try {
      const employeeRef = doc(db, `users/${userId}/projects/${editProjectId}`);
      await updateDoc(employeeRef, formData);
    } catch (error) {
      console.error("Error updating employee: ", error);
    }
  };

  const markAttendance = async (employeeId: string, status: string) => {
    try {
      const userId = localStorage.getItem("userId");

      const attendanceDoc = await addDoc(
        collection(db, `users/${userId}/attendance`),
        {
          employeeId,
          status,
          date: Timestamp.now(),
          signOutTime: null,
        }
      );
      console.log("Attendance marked with ID: ", attendanceDoc.id);
    } catch (e) {
      console.error("Error marking attendance: ", e);
    }
  };
  const fetchAttendance = async (employeeId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      const querySnapshot = await getDocs(
        collection(db, `users/${userId}/attendance`)
      );
      const attendanceData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;
      console.log("attendance data is: ",attendanceData)
      return attendanceData;
    } catch (error) {
      console.error("Error fetching attendance: ", error);
    }
  };
  return (
    <FirebaseContext.Provider
      value={{
        user,
        userData,
        signup,
        signin,
        fetchEmployees,
        addProject,
        employees,
        writeUserData,
        deleteEmployeeData,
        setUser,
        projects,
        fetchProjects,
        signUpWithGoogle,
        deleteProject,
        updateProject,
        markAttendance,
        fetchAttendance,
        pdfRef,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
export { db, firebaseAuth };
