import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white font-brand">
    <Navbar />
    <main className="flex-1 w-full flex flex-col justify-start items-stretch">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
