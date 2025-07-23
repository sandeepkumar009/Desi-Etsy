/*
* FILE: frontend/src/components/layout/AdminNavbar.jsx
*
* DESCRIPTION:
* The admin navbar is updated to use the real notification system.
* - The mock notification count is removed.
* - The static notification icon is replaced with the live <NotificationBell /> component.
*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../common/NotificationBell'; // <-- ADDED

// Helper Hook for clicking outside an element
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const AdminNavbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    
    useOutsideClick(profileDropdownRef, () => setDropdownOpen(false));
    
    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-500 md:hidden" aria-label="Open sidebar">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <Link to="/" className="flex items-center" aria-label="Back to DesiEtsy Homepage">
                            <span className="font-brand font-bold text-2xl text-orange-500 tracking-tight">DesiEtsy</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        
                        {/* --- MODIFIED: Replaced mock icon with real NotificationBell --- */}
                        <NotificationBell role="admin" />

                        {/* --- Profile Dropdown --- */}
                        {user && (
                            <div className="relative" ref={profileDropdownRef}>
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-gray-100 transition-colors">
                                    <img src={user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`} alt="Profile" className="h-8 w-8 rounded-full border-2 border-admin-accent object-cover" />
                                    <span className="hidden sm:inline font-semibold text-sm text-gray-700">{user.name.split(' ')[0]}</span>
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg p-2 z-50 border">
                                            <div className="px-4 py-2 border-b"><p className="font-bold text-gray-800">{user.name}</p><p className="text-sm text-gray-500 truncate">{user.email}</p></div>
                                            <div className="py-1">
                                                <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Admin Dashboard</Link>
                                                <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">My Customer Account</Link>
                                            </div>
                                            <div className="border-t pt-1"><button onClick={logout} className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 rounded">Logout</button></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
