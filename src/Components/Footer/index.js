import React from "react";
import { makeStyles } from "@mui/styles";
import { Box, Typography, IconButton, Container } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Email } from "@mui/icons-material";

const useStyles = makeStyles({
  footer: {
    backgroundColor: "#3f51b5",
    color: "#ffffff",
    padding: "20px 0",
    textAlign: "center",
    width: "100%",
  },
  icons: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      margin: "0 10px",
    },
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

const Footer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Container>
        <Typography variant="h6">Contact Us</Typography>
        <Box className={classes.icons}>
          <IconButton
            component="a"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <Facebook />
          </IconButton>
          <IconButton
            component="a"
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <Twitter />
          </IconButton>
          <IconButton
            component="a"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <LinkedIn />
          </IconButton>
          <IconButton
            component="a"
            href="mailto:support@example.com"
            color="inherit"
          >
            <Email />
          </IconButton>
        </Box>
        <Typography variant="body2">
          © 2024 HR Management System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
