import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { FirebaseProvider } from "./context/Firebase";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue, green, red } from "@mui/material/colors"; // Adjust colors as per your theme

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: green,
    error: red,
    // Add more customizations as needed
  },
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.Fragment>
    <AuthProvider>
      <BrowserRouter>
        <FirebaseProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </FirebaseProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
