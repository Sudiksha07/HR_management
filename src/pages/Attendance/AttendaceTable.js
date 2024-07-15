import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import styled from "styled-components";
import { grey, red } from "@mui/material/colors";
import { Timestamp } from "firebase/firestore";

const CustomTableContainer = styled(TableContainer)`
  margin-bottom: 32px;
`;

const CustomTableHeader = styled(TableRow)`
  background-color: #008080;
`;

const CustomTableCell = styled(TableCell)`
  color: white;
  border-bottom: 1px solid ${grey[300]};
`;

// const CustomTableRow = styled(TableRow)`
//   &:nth-of-type(odd) {
//     background-color: ${grey[100]};
//   }
//   &:hover {
//     background-color: #b2d8d8;
//   }
// `;

const SignOutButton = styled(Button)`
  && {
    background-color: ${red[500]};
    color: white;
    &:hover {
      background-color: ${red[700]};
    }
  }
`;
const CustomTableRow = styled(TableRow)`
  && {
    &:nth-of-type(odd) {
      background-color: #f2f2f2;
    }
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
const AttendanceTable = ({ attendanceData, employees, handleSignOut }) => {
  const formatDate = (date) => {
    if (!date) return "";
    if (date instanceof Timestamp) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date.toDate());
    } else if (date instanceof Date) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    }
    return "";
  };

  const formatTime = (date) => {
    if (!date) return "";
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else if (date instanceof Date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }
    return "";
  };

  return (
    <CustomTableContainer component={Paper}>
      <Table>
        <TableHead>
          <CustomTableHeader>
            <CustomTableCell>Date</CustomTableCell>
            <CustomTableCell>Employee</CustomTableCell>
            <CustomTableCell>Status</CustomTableCell>
            <CustomTableCell>Submit Time</CustomTableCell>
            <CustomTableCell>Sign-out Time</CustomTableCell>
            <CustomTableCell>Action</CustomTableCell>
          </CustomTableHeader>
        </TableHead>
        <TableBody>
          {attendanceData.map((att) => (
            <CustomTableRow key={att.id}>
              <TableCell>{formatDate(att.date)}</TableCell>
              <TableCell>{employees.find((e) => e.id === att.employeeId)?.name}</TableCell>
              <TableCell>{att.status}</TableCell>
              <TableCell>{formatTime(att.submitTime)}</TableCell>
              <TableCell>
                {att.signOutTime ? formatTime(att.signOutTime) : ""}
              </TableCell>
              <TableCell>
                {att.status === "Present" && !att.signOutTime && (
                  <SignOutButton variant="contained" onClick={() => handleSignOut(att.id)}>
                    Sign Out
                  </SignOutButton>
                )}
              </TableCell>
            </CustomTableRow>
          ))}
        </TableBody>
      </Table>
    </CustomTableContainer>
  );
};

export default AttendanceTable;

