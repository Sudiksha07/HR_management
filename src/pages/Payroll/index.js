import React, { useEffect, useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/Firebase";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import styled from "styled-components";
import { createTheme } from "@mui/material/styles";
import {downloadPDF} from "../../Utility/index"

const theme = createTheme({
  palette: {
    primary: {
      main: "#008080",
    },
  },
});

const Title = styled.h1`
  text-align: center;
  color: ${theme.palette.primary.main};
  margin-bottom: 16px;
`;

const CustomTableContainer = styled(TableContainer)`
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
`;

const CustomTableHeader = styled(TableHead)`
  background-color: #008080;
  text-align: center; /* Center align the text */
`;

const CustomTableCell = styled(TableCell)`
  color: white;
  text-align: center; /* Center align the text */
`;

const CustomTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #e0e0e0;
  }
`;

const CustomTableBodyCell = styled(TableCell)`
  color: black;
     text-align: center; /* Center align the text */ 
`;

const Container = styled.div`
  margin-top: 80px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f4f8;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;


const Payroll = () => {
  const { fetchEmployees, employees ,pdfRef} = useFirebase();
  const navigate = useNavigate();
  // const pdfRef = useRef();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const viewDetails = (employeeId) => {
    navigate(`/salary/${employeeId}`);
  };

  // const handleDownloadPDF = () => {
  //   downloadPDF(pdfRef, 'Salary.pdf');
  // };

  return (
    <Container>
      <Title>Salary Details</Title>
      <CustomTableContainer>
        <Table>
          <CustomTableHeader>
            <TableRow>
              <CustomTableCell>Employee Name</CustomTableCell>

              <CustomTableCell>Actions</CustomTableCell>
            </TableRow>
          </CustomTableHeader>
          <TableBody>
            {employees.map((employee) => (
              <CustomTableRow key={employee.id}>
                <CustomTableBodyCell>{employee.name}</CustomTableBodyCell>

                <CustomTableBodyCell>
                  <ButtonContainer>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => viewDetails(employee.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                     onClick={()=>downloadPDF(pdfRef)}
                    >
                      Download
                    </Button>
                  </ButtonContainer>
                </CustomTableBodyCell>
              </CustomTableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTableContainer>
    </Container>
  );
};

export default Payroll;