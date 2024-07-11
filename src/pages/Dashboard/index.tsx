import React from "react";
import { Container, Typography } from '@material-ui/core';
const Dashboard = () => {
  return (
    <div>
      <Container>
        <Typography variant="h4" gutterBottom>
          Welcome to the HR Management Application
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          convallis libero in dui auctor, vel placerat libero tempor.
        </Typography>
      </Container>
    </div>
  );
};

export default Dashboard;
