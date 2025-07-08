import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import logo from "../../assets/images/logo.png";
import cartIcon from "../../assets/icons/cart.svg";

// Placeholder AuthContext logic
const useAuth = () => ({ user: null }); // Replace with real hook when available

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Products", to: "/products" },
  { name: "Cart", to: "/cart", icon: cartIcon },
];

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useAnimation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
        controls.start({ boxShadow: "0 2px 16px rgba(0,0,0,0.10)", backgroundColor: "#fff" });
      } else {
        setScrolled(false);
        controls.start({ boxShadow: "0 0px 0px rgba(0,0,0,0)", backgroundColor: "rgba(255,255,255,0)" });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return (
    <motion.nav
      animate={controls}
      initial={{ backgroundColor: "rgba(255,255,255,0)", boxShadow: "0 0px 0px rgba(0,0,0,0)" }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "backdrop-blur" : ""}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 min-w-[120px]">
          <img src={logo} alt="Desi Etsy Logo" className="h-10 w-10 rounded-full border-2 border-desi-primary" />
          <span className="font-brand font-bold text-2xl text-desi-primary tracking-tight">Desi Etsy</span>
        </Link>
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.08 }}
              className="relative group"
            >
              <Link
                to={link.to}
                className="flex items-center gap-1 px-2 py-1 font-medium text-desi-secondary hover:text-desi-primary transition-colors duration-200"
              >
                {link.icon && link.name === 'Cart' && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-orange-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0l1.7 6.385m-.383-7.822h12.354c.51 0 .955.343 1.087.835l1.386 5.197c.13.487-.06 1.006-.47 1.3a1.125 1.125 0 01-.617.188H6.375m0 0L5.25 21h13.5M6.375 12l1.125 9m7.5-9l-1.125 9" />
                  </svg>
                )}
                {link.icon && link.name !== 'Cart' && (
                  <img src={link.icon} alt={link.name} className="h-5 w-5" />
                )}
                {link.name}
              </Link>
              <span
                className="absolute left-0 -bottom-1 h-0.5 w-full bg-desi-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 opacity-60"
                style={{ transform: location.pathname === link.to ? 'scaleX(1)' : undefined }}
              />
            </motion.div>
          ))}
        </div>
        {/* Search Bar (Desktop Only) */}
        <div className="hidden md:flex justify-center px-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-xs px-4 py-2 rounded-xl border border-desi-accent focus:outline-none focus:ring-2 focus:ring-desi-primary text-desi-secondary shadow"
          />
        </div>
        {/* Auth Links */}
        {!user ? (
          <div className="ml-4 flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl bg-orange-300 text-white font-semibold hover:bg-orange-400 transition-colors duration-200 shadow"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-orange-300 text-white font-semibold hover:bg-orange-400 transition-colors duration-200 shadow"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="relative group ml-4">
            <button className="px-5 py-2 rounded-xl bg-desi-primary text-white font-semibold">
              Profile
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg p-2 hidden group-hover:block z-50">
              <Link to="/profile" className="block px-4 py-2 hover:bg-desi-accent rounded">My Profile</Link>
              <Link to="/logout" className="block px-4 py-2 hover:bg-desi-accent rounded">Logout</Link>
            </div>
          </div>
        )}
        {/* Hamburger for Mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-desi-primary transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
          <span className={`block h-0.5 w-6 bg-desi-primary transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
          <span className={`block h-0.5 w-6 bg-desi-primary transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
        </button>
      </div>
      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden bg-white shadow-lg overflow-hidden transition-all duration-300"
      >
        <div className="flex flex-col gap-4 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="flex items-center gap-2 text-desi-secondary hover:text-desi-primary text-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.icon && link.name === 'Cart' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-orange-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0l1.7 6.385m-.383-7.822h12.354c.51 0 .955.343 1.087.835l1.386 5.197c.13.487-.06 1.006-.47 1.3a1.125 1.125 0 01-.617.188H6.375m0 0L5.25 21h13.5M6.375 12l1.125 9m7.5-9l-1.125 9" />
                </svg>
              )}
              {link.icon && link.name !== 'Cart' && (
                <img src={link.icon} alt={link.name} className="h-5 w-5" />
              )}
              {link.name}
            </Link>
          ))}
          {!user ? (
            <div className="ml-4 flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-orange-300 text-white font-semibold hover:bg-orange-400 transition-colors duration-200 shadow"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-orange-300 text-white font-semibold hover:bg-orange-400 transition-colors duration-200 shadow"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <>
              <Link to="/profile" className="block px-4 py-2 hover:bg-desi-accent rounded" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <Link to="/logout" className="block px-4 py-2 hover:bg-desi-accent rounded" onClick={() => setMenuOpen(false)}>Logout</Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
