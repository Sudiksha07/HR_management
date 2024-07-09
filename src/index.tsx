import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {  AuthProvider } from './context/Firebase';
//import {FirebaseProvider} from "../src/context/Firebase"
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import Employee from './pages/Employee';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <FirebaseProvider> */}
    <AuthProvider>
    <App/>
    {/* </FirebaseProvider> */}
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

