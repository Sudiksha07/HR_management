import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import PublicRoute from "./Routes/PublicRoute";
import PrivateRoute from "./Routes/PrivateRoute";
import Project from "./pages/Project/index";
import EmployeeList from "./pages/Employee/EmployeeList";
import EmployeeDetail from "./pages/Employee/EmployeeDetail";
import SideBar from "./Components/SideBar";
import "./App.css";
import { useAuth } from "./context/authContext";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Dashboard from "./pages/Dashboard";
import LeavePage from "./pages/Attendance/LeavePage";
import Header from "./Components/Header";
const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <Header/>
      <SideBar />
      <div>
        <div className={isAuthenticated ? "dashboard" : "mainContent"}>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <EmployeeList /> : <Dashboard />}
            />
            <Route
              path="/signIn"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/signUp"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <EmployeeList />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee/:id"
              element={
                <PrivateRoute>
                  <EmployeeDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <Project />
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <PrivateRoute>
                  <Attendance />
                </PrivateRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <PrivateRoute>
                  <Payroll />
                </PrivateRoute>
              }
            />
            <Route
              path="/leave"
              element={
                <PrivateRoute>
                  <LeavePage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<h3>Page Not Found</h3>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
