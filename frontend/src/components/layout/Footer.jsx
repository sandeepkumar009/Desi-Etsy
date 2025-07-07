import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

const footerLinks = [
  { name: "Help", to: "#" },
  { name: "Terms", to: "#" },
  { name: "Privacy", to: "#" },
];

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-desi-secondary text-white py-8 px-4 mt-12 w-full"
      style={{ minHeight: '120px' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        {/* Left: Branding & About */}
        <div className="flex flex-col items-center md:items-start gap-3 md:w-1/2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Desi Etsy Logo" className="h-10 w-10 rounded-full" />
            <span className="font-brand font-bold text-xl text-desi-primary">Desi Etsy</span>
          </div>
          <p className="text-desi-accent text-center md:text-left max-w-xs">
            Desi Etsy is your destination for unique, handmade treasures crafted by talented artisans. Shop handmade, shop Desi.
          </p>
        </div>
        {/* Right: Contact Links */}
        <div className="flex flex-col items-center md:items-end gap-2 md:w-1/2">
          <span className="font-semibold text-lg text-desi-accent mb-2">Contact</span>
          <ul className="flex flex-col gap-1">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.to}
                  className="hover:underline hover:text-desi-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-desi-accent text-sm">
        &copy; {new Date().getFullYear()} Desi Etsy. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
