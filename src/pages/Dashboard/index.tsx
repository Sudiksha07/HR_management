import React from "react";
import { makeStyles } from "@mui/styles";
import Reveal from "../../Components/Reveal";
import "./index.css";
import { Typography, Box } from "@mui/material";
import Footer from "../../Components/Footer";

const useStyles = makeStyles({
  heading: {
    color: "#7443b4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // marginLeft:"50px"
  },
  sectionHeader: {
    color: "#ff5722",
  },
  paragraph: {
    color: "#757575",
  },
});

const Dashboard: React.FC = () => {
  const classes = useStyles();

  return (
    <div style={{ marginTop: "60px" }}>
      <Reveal>
        <div className="dashboardHeading">
          <div className="headingContent">
            <h1 className="headingText">Welcome to </h1>
            <h1 className="headingText"> HR Management System </h1>
          </div>
          <div className="hrImage"></div>
        </div>
        <div className="whatWeOffer">
          <Typography variant="h1" className={classes.sectionHeader}>
            What We Offer
          </Typography>
        </div>
      </Reveal>
      <Reveal>
        <div className="content">
          <div className="employeeImage"></div>
          <div className="sectionDetails">
            <Typography variant="h2" className={classes.sectionHeader}>
              Manage Employees
            </Typography>
            <Typography className={classes.paragraph}>
              Easily add, update, and remove employee records. Manage employee
              profiles, roles, and departments efficiently.
            </Typography>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="reverseContent">
          <div className="projectImage"></div>
          <div className="sectionDetails">
            <Typography variant="h2" className={classes.sectionHeader}>
              Project Management
            </Typography>
            <Typography className={classes.paragraph}>
              Create and manage projects seamlessly. Assign employees to
              projects and track progress effortlessly.
            </Typography>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="content">
          <div className="leaveImage"></div>
          <div className="sectionDetails">
            <Typography variant="h2" className={classes.sectionHeader}>
              Manage Leaves
            </Typography>
            <Typography className={classes.paragraph}>
              Process leave requests and approvals. View leave balances and
              histories for better planning.
            </Typography>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="reverseContent">
          <div className="payrollImage"></div>
          <div className="sectionDetails">
            <Typography variant="h2" className={classes.sectionHeader}>
              Payroll Management
            </Typography>
            <Typography className={classes.paragraph}>
              Calculate salaries, manage deductions, and process payroll with
              ease. Generate and download payslips securely.
            </Typography>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <Footer/>
      </Reveal>
    </div>
  );
};

export default Dashboard;
