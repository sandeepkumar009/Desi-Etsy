import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const GOOGLE_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_17_40)">
      <path d="M47.5 24.5C47.5 22.5 47.3 20.7 47 19H24V29H37.5C37 31.5 35.5 34 33 35.7V41H40.5C44.5 37.3 47.5 31.5 47.5 24.5Z" fill="#4285F4"/>
      <path d="M24 48C30.5 48 35.8 45.8 40.5 41L33 35.7C30.7 37.3 27.7 38.3 24 38.3C17.8 38.3 12.3 34.2 10.4 28.7H2.6V34.1C7.3 42.1 15.1 48 24 48Z" fill="#34A853"/>
      <path d="M10.4 28.7C9.9 27.1 9.6 25.5 9.6 24C9.6 22.5 9.9 20.9 10.4 19.3V13.9H2.6C0.9 17.1 0 20.5 0 24C0 27.5 0.9 30.9 2.6 34.1L10.4 28.7Z" fill="#FBBC05"/>
      <path d="M24 9.7C27.2 9.7 29.9 10.8 31.9 12.7L39.1 5.5C35.8 2.5 30.5 0 24 0C15.1 0 7.3 5.9 2.6 13.9L10.4 19.3C12.3 13.8 17.8 9.7 24 9.7Z" fill="#EA4335"/>
    </g>
    <defs>
      <clipPath id="clip0_17_40">
        <rect width="48" height="48" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export default function Register() {
  const [role, setRole] = useState("Customer");
  return (
    <div className="max-w-screen-md mx-auto p-6 md:p-10 font-brand">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <span className="text-5xl md:text-6xl">💎</span>
          <h1 className="text-3xl md:text-4xl font-bold text-desi-primary">Create Your Desi Etsy Account</h1>
          <p className="text-desi-secondary text-lg">Join the community of creators and shoppers.</p>
        </div>
        {/* Right: Form Card */}
        <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6">
          <Button
            className="w-full p-2 border rounded-md bg-white text-gray-800 hover:shadow flex items-center justify-center gap-2 mb-4"
            onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)}
          >
            {GOOGLE_ICON}
            Sign up with Google
          </Button>
          <form className="flex flex-col gap-5">
            <div>
              <label htmlFor="fullname" className="block text-desi-secondary font-medium mb-1">Full Name</label>
              <input id="fullname" type="text" className="w-full px-4 py-3 rounded-lg border border-desi-accent focus:outline-none focus:ring-2 focus:ring-desi-primary text-desi-secondary" placeholder="Enter your full name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-desi-secondary font-medium mb-1">Email</label>
              <input id="email" type="email" className="w-full px-4 py-3 rounded-lg border border-desi-accent focus:outline-none focus:ring-2 focus:ring-desi-primary text-desi-secondary" placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-desi-secondary font-medium mb-1">Password</label>
              <input id="password" type="password" className="w-full px-4 py-3 rounded-lg border border-desi-accent focus:outline-none focus:ring-2 focus:ring-desi-primary text-desi-secondary" placeholder="Create a password" />
            </div>
            <div>
              <label htmlFor="role" className="block text-desi-secondary font-medium mb-1">Register as</label>
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-desi-primary text-desi-secondary"
              >
                <option value="Customer">Customer</option>
                <option value="Artisan">Artisan</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-orange-300 hover:bg-orange-400 text-white font-brand font-semibold py-4 rounded-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-desi-accent scale-100 hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0m-7.5-7.5v3m0 0h3m-3 0H9" />
              </svg>
              Create Account
            </button>
          </form>
          <div className="text-center text-desi-secondary text-sm mt-2">
            Already have an account? <Link to="/login" className="text-desi-primary font-semibold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
