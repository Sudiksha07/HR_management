import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme:any) => ({
  title: {
    flexGrow: 1,
  },
}));

const Header = () => {
  const classes = useStyles();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          HR Management System
        </Typography>
        {isAuthenticated ? (
          <Typography>Welcome, {localStorage.getItem("email")}</Typography>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/signIn")}>
              Sign In
            </Button>
            <Button color="inherit" onClick={() => navigate("/signUp")}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
