import React from "react";
import "./index.css";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <div className="headerContainer">
      <div className={!isAuthenticated?"headerComponents":"background"}>
        <h2 onClick={() => navigate("/")} className="heading">
          Easy HR
        </h2>
      </div>
      {!isAuthenticated && (
        <li className="headerComponents">
          <ul className="headerList" onClick={() => navigate("/")}>
            Dashboard
          </ul>
          <ul className="headerList" onClick={() => navigate("/signIn")}>
            SignIn
          </ul>
          <ul className="headerList" onClick={() => navigate("/signUp")}>
            SignUp
          </ul>
        </li>
      )}
    </div>
  );
};

export default Header;
