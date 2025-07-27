import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

const policyLinks = [
  { name: "Privacy Policy", to: "#" },
  { name: "Shipping Policy", to: "#" },
  { name: "Terms & Conditions", to: "#" },
  { name: "Refund Policy", to: "#" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full bg-[#b2b47a] border-t border-desi-accent mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        {/* Left: Logo/Brand */}
        <div className="flex flex-col gap-2 items-center md:items-start">
          <img src={logo} alt="Desi Etsy Logo" className="h-14 w-14 rounded-full border-2 border-desi-primary mb-2" />
          <span className="font-brand font-bold text-3xl text-desi-primary leading-tight">Desi<br />Etsy</span>
        </div>
        {/* Center: Contact */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="text-desi-secondary font-medium">+91-12345-67890</div>
          <div className="text-desi-secondary font-medium">support@desi-etsy.com</div>
          <div className="text-desi-secondary font-medium">123 Artisan Lane, Jaipur, India</div>
        </div>
        {/* Right: Policy Links */}
        <div className="flex flex-col gap-2 items-center md:items-start">
          {policyLinks.map(link => (
            <a key={link.name} href={link.to} className="text-desi-secondary hover:text-desi-primary font-medium transition-colors duration-200">
              {link.name}
            </a>
          ))}
        </div>
        {/* Far Right: Feedback Form (WIX style) */}
        <form className="flex flex-col gap-4 w-full max-w-xs mx-auto md:mx-0">
          <span className="font-brand text-lg text-desi-primary font-semibold mb-2">Feedback</span>
          <div className="flex flex-col gap-2">
            <label htmlFor="footer-name" className="text-desi-secondary text-sm mb-1">Name *</label>
            <input id="footer-name" type="text" placeholder="Your Name" required className="bg-transparent border-0 border-b-2 border-desi-accent focus:border-desi-primary focus:outline-none px-0 py-2 text-desi-secondary placeholder:text-desi-accent transition-all duration-200" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input id="footer-feedback-check" type="checkbox" className="accent-desi-primary w-5 h-5 rounded" />
            <label htmlFor="footer-feedback-check" className="text-desi-secondary text-sm select-none">Yes, I want to leave feedback.</label>
          </div>
          <div className="bg-desi-accent/30 rounded-xl shadow-md p-3 flex justify-center mt-2">
            <button type="submit" className="w-full bg-desi-primary text-white font-brand font-semibold py-3 rounded-md text-base transition-all duration-200 hover:bg-desi-accent focus:bg-desi-accent focus:outline-none active:scale-95 hover:scale-105">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="text-desi-secondary text-center py-4 text-sm border-t border-desi-accent bg-[#b2b47a]">
        &copy; {new Date().getFullYear()} Desi Etsy. Powered by Desi Etsy.
      </div>
    </motion.footer>
  );
}
