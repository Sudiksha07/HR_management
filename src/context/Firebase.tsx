import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  addDoc,
  getDoc,
  collection,
  getDocs,
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
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  fetchEmployees: () => Promise<void>;
  writeUserData: (userData: Employee) => Promise<void>;
  addProject: (
    projectName: string,
    selectedEmployees: string[],
    setProjectName: React.Dispatch<React.SetStateAction<string>>,
    setSelectedEmployees: React.Dispatch<React.SetStateAction<string[]>>
  ) => Promise<void>;
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
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);
  
  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(
          db,
          "users",
          localStorage.getItem("userId") || "",
          "employees"
        )
      );

      const employeesData = querySnapshot.docs.map((doc, ID) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;
      console.log("employees data is: ", employeesData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  const writeUserData = async (userData: Employee) => {
    try {
      const docRef = await addDoc(
        collection(
          db,
          "users",
          localStorage.getItem("userId") || "",
          "employees"
        ),
        {
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          gender: userData.gender,
          department: userData.department,
          role: userData.role,
        }
      );
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const handleEmployees = () => {
    fetchEmployees();
  };

  const signup = async (email: string, password: string) => {
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(() => {
        console.log("Signup successful");
        navigate("/employees");
      })
      .catch((err) => {
        alert("Wrong email or password entered");
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
      .catch((err) => console.log("Error in SignIn ", err));
  };

  const addProject = async (
    projectName: string,
    selectedEmployees: string[],
    setProjectName: React.Dispatch<React.SetStateAction<string>>,
    setSelectedEmployees: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    try {
      await addDoc(collection(db, "projects"), {
        name: projectName,
        employees: selectedEmployees,
      });
      setProjectName("");
      setSelectedEmployees([]);
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error creating project: ", error);
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
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
export { db, firebaseAuth };
