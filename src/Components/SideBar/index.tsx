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
import path from "path";

interface MenuItem {
  name: string;
  icon: React.ElementType;
}
const SideBar = () => {
  const [selectedItem, setSelectedItem] = useState<number|null>(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const menuItems1 = [
    { name: "Employees", icon: PeopleIcon },
    { name: "Projects", icon: AutoAwesomeMotionIcon },
    { name: "Attendance", icon: CalendarTodayIcon },
    { name: "Payroll", icon: AccountBalanceIcon },
    { name: "Logout", icon: LogoutIcon },
  ];
 
  useEffect(() => {
    if (isAuthenticated) {
      setSelectedItem(0);
      setMenuItems(menuItems1);
    }
  }, [isAuthenticated]);
  
  useEffect(()=>{
    const pathname=window.location.pathname;
    console.log("pathname",pathname)
    if(pathname==='/' && isAuthenticated){
      setSelectedItem(0)
    }
    if(pathname=='/employees' || pathname=='/signin'){
      setSelectedItem(0);
    }
    else if(pathname=='/projects' || pathname=='/signup'){
      console.log("pro")
      setSelectedItem(1);
    }
    else if(pathname=='/attendance'){
      setSelectedItem(2);
    }
    else if(pathname=='/payroll'){
      setSelectedItem(3);
    }
    else{
      setSelectedItem(0)
    }
  },[selectedItem])


  const handleSelection = (id: number) => {
    setSelectedItem(id);

    if (menuItems[id].name == "Logout") {
      localStorage.clear();
      setIsAuthenticated(false);
      setSelectedItem(null);
      localStorage.setItem('logout','true')
      navigate("/signIn");
    } 
    else if (menuItems[id].name == "Dashboard") {
      navigate("/");
    }
     else {
      navigate(menuItems[id].name.toLowerCase());
    }
  };
  return (
    <div className={isAuthenticated?"sidebar":"sidebar noSidebar"}>
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
