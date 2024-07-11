import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { FirebaseProvider } from "./context/Firebase";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.Fragment>
    <AuthProvider>
      <BrowserRouter>
        <FirebaseProvider>
          <App />
        </FirebaseProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
