import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './context/Firebase';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeList from './pages/EmployeeList';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import EmployeeDetail from './pages/EmployeeDetail';

const App: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <h1>Employee Management System</h1>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/employees" /> : <Signup />} />
          <Route path="/signin" element={user ? <Navigate to="/employees" /> : <Signin />} />
          <Route
            path="/employees"
            element={user ? (
              <>
                <EmployeeForm />
                <EmployeeList />
              </>
            ) : (
              <Navigate to="/signin" replace />
            )}
          />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
