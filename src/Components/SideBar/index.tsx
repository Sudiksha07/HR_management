import React, { useEffect, useState } from "react";
import "./sidebar.css";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
interface MenuItem {
  name: string;
  icon: React.ElementType;
}
const SideBar = () => {
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const menuItems1 = [
    { name: "Dashboard", icon: SpaceDashboardIcon },
    { name: "Employees", icon: PeopleIcon },
    { name: "Projects", icon: AutoAwesomeMotionIcon },
    { name: "Attendance", icon: CalendarTodayIcon },
    { name: "Payroll", icon: AccountBalanceIcon },
    { name: "Logout", icon: LogoutIcon },
  ];
  const menuItems2 = [
    { name: "Dashboard", icon: SpaceDashboardIcon },
    { name: "SignIn", icon: LockOpenIcon },
    { name: "SignUp", icon: HowToRegIcon },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setMenuItems(menuItems1);
    } else {
      setSelectedItem(0)
      setMenuItems(menuItems2);
    }
  }, [isAuthenticated]);
  const handleSelection = (id: number) => {
    setSelectedItem(id);

    if (menuItems[id].name == "Logout") {
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/");
    } else if (menuItems[id].name == "Dashboard") {
      navigate("/");
    } else {
      navigate(menuItems[id].name.toLowerCase());
    }
  };
  return (
    <div className="sidebar">
      {menuItems.map((item: any, id: any) => {
        const Icon = item.icon;
        const isSelected = selectedItem === id;

        return (
          <div
            key={id}
            className={`menuItems ${isSelected ? "selected" : ""}`}
            onClick={() => handleSelection(id)}
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
