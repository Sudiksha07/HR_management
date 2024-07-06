import React, { useState } from "react";
import "./index.css";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const SideBar = () => {
  const [selectedItem, setSelectedItem] = useState<number>(0);

  const menuItems = [
    { name: "Employees", icon: PeopleIcon },
    { name: "Projects", icon: AutoAwesomeMotionIcon },
    { name: "Attendance", icon: CalendarTodayIcon },
    { name: "Payroll", icon: AccountBalanceIcon },
  ];

  return (
    <div className="sidebar">
      
      {menuItems.map((item, id) => {
        const Icon = item.icon;
        const isSelected = selectedItem === id;

        return (
          <div
            key={id}
            className={`menuItems ${isSelected ? "selected" : ""}`}
            onClick={() => setSelectedItem(id)}
          >
            <Icon className="menuIcon" />
            <p className="menuItem">{item.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
