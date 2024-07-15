import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { db, firebaseAuth } from "../../context/Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Grid,
  Box
} from "@mui/material";
import { makeStyles } from "@mui/styles";

interface Employee {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  role: string;
}

const useStyles = makeStyles({
  card: {
    backgroundColor: "rgb(53, 35, 73)",
    color: "#ffffff",
    borderRadius: "12px",
  },
  container: {
    marginTop: "20px",
  },
  title: {
    marginBottom: "16px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  text: {
    marginBottom: "8px",
    fontSize: "16px",
  },
  loaderBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
});

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get employee ID from URL params
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [user] = useAuthState(firebaseAuth); // Ensure 'auth' is correctly initialized
  const classes = useStyles();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!user) return; // Check if user is authenticated
      try {
        const employeeRef = doc(db, `users/${user.uid}/employees/${id}`);
        const employeeSnap = await getDoc(employeeRef);

        if (employeeSnap.exists()) {
          setEmployee(employeeSnap.data() as Employee);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [user, id]);

  if (!employee) {
    return (
      <Container>
        <Box className={classes.loaderBox}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card className={classes.card} sx={{backgroundImage:'url(/images/bgg.jpg)'}}>
            <CardContent>
              <Typography className={classes.title} variant="h5" component="div" sx={{color:"black"}}>
                Employee Details
              </Typography>
              <Typography className={classes.text} variant="body2" color="inherit" sx={{color:"black"}}>
                Name: {employee.name}
              </Typography>
              <Typography className={classes.text} variant="body2" color="inherit" sx={{color:"black"}}>
                Email: {employee.email}
              </Typography>
              <Typography className={classes.text} variant="body2" color="inherit" sx={{color:"black"}}>
                Phone Number: {employee.phoneNumber}
              </Typography>
              <Typography className={classes.text} variant="body2" color="inherit" sx={{color:"black"}}>
                Gender: {employee.gender}
              </Typography>
              <Typography className={classes.text} variant="body2" color="inherit" sx={{color:"black"}}>
                Department: {employee.department}
              </Typography>
              <Typography className={classes.text} variant="body2" color="inherit" sx={{color:"black"}}>
                Role: {employee.role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDetail;
