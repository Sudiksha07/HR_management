import React from "react";
import { getDatabase, ref, set } from "firebase/database";
//  import {app} from "../src/firebase"
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "../src/pages/Signin";
import Dashboard from "./pages/Dashboard";
// const db = getDatabase(app);
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Signup />} path="/" />
          <Route element={<Signin />} path="/Signin" />
          {/* <Route element={<Home/>} path="/Signin/Home"/> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
