/*
================================================================================
File: frontend/src/components/layout/layout.jsx (Updated Code)
Description: This is your main layout. The only change is that it now uses
             the <Outlet /> component from react-router-dom instead of `children`.
             This is necessary for the modern routing pattern to work.
================================================================================
*/
import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Import Outlet
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* <-- Use Outlet here instead of {children} */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
