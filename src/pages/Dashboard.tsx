import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import MainContent from '../components/MainContent';
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <SideBar/>
      <MainContent />
    </div>
  );
}
