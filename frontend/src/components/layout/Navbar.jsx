import React, { useState } from "react";
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

  React.useEffect(() => {
    setMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        controls.start({ boxShadow: "0 2px 16px rgba(0,0,0,0.10)", backgroundColor: "#fff" });
      } else {
        controls.start({ boxShadow: "0 0px 0px rgba(0,0,0,0)", backgroundColor: "#fff" });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return (
    <motion.nav
      animate={controls}
      initial={{ backgroundColor: "#fff", boxShadow: "0 0px 0px rgba(0,0,0,0)" }}
      className="sticky top-0 z-50 w-full transition-all duration-300"
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
                {link.icon && <img src={link.icon} alt="cart" className="h-5 w-5" />}
                {link.name}
              </Link>
              <span
                className="absolute left-0 -bottom-1 h-0.5 w-full bg-desi-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                style={{ transform: location.pathname === link.to ? 'scaleX(1)' : undefined }}
              />
            </motion.div>
          ))}
          {/* Auth Links */}
          {!user ? (
            <Link
              to="/login"
              className="ml-4 px-5 py-2 rounded-xl bg-desi-primary text-white font-semibold hover:bg-desi-accent transition-colors duration-200 shadow"
            >
              Login / Register
            </Link>
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
        </div>
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
              {link.icon && <img src={link.icon} alt="cart" className="h-5 w-5" />}
              {link.name}
            </Link>
          ))}
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-desi-primary text-white font-semibold hover:bg-desi-accent text-center shadow"
              onClick={() => setMenuOpen(false)}
            >
              Login / Register
            </Link>
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
