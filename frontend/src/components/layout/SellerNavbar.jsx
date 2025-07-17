/*
================================================================================
File: frontend/src/components/layout/SellerNavbar.jsx (Updated Code)
Description: The navbar now includes a functional notification bell with a
             dropdown preview for the latest seller-specific alerts.
================================================================================
*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { mockNotifications } from '../../pages/seller/notifications/mockNotificationData';

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

const NotificationIcon = ({ type }) => {
    const icons = {
        new_order: '📋',
        new_review: '⭐',
        new_message: '💬',
        product_approved: '📦',
        low_stock: '⚠️',
    };
    return <span className="text-xl mr-3">{icons[type] || '🔔'}</span>;
};

const SellerNavbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isNotifOpen, setNotifOpen] = useState(false);
    
    const profileDropdownRef = useRef(null);
    const notifDropdownRef = useRef(null);
    
    useOutsideClick(profileDropdownRef, () => setDropdownOpen(false));
    useOutsideClick(notifDropdownRef, () => setNotifOpen(false));
    
    const unreadNotifications = mockNotifications.filter(n => !n.read);
    const sellerNotificationCount = unreadNotifications.length;

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
                        {/* --- Notification Dropdown --- */}
                        <div className="relative" ref={notifDropdownRef}>
                            <button onClick={() => setNotifOpen(!isNotifOpen)} className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="View seller notifications">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m8 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                {sellerNotificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white border-2 border-white">{sellerNotificationCount}</span>
                                )}
                            </button>
                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg p-2 z-50 border">
                                        <div className="px-2 py-1 font-bold text-gray-800">Notifications</div>
                                        <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                                            {unreadNotifications.length > 0 ? unreadNotifications.slice(0, 4).map(notif => (
                                                <li key={notif._id}>
                                                    <Link to={notif.link} onClick={() => setNotifOpen(false)} className="p-2 flex items-start hover:bg-gray-100 rounded-lg">
                                                        <NotificationIcon type={notif.type} />
                                                        <div>
                                                            <p className="text-sm text-gray-700">{notif.message}</p>
                                                            <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )) : <p className="p-4 text-center text-sm text-gray-500">No new notifications.</p>}
                                        </ul>
                                        <div className="border-t mt-2 pt-2">
                                            <Link to="/seller/notifications" onClick={() => setNotifOpen(false)} className="block text-center w-full px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                View All Notifications
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* --- Profile Dropdown --- */}
                        {user && (
                            <div className="relative" ref={profileDropdownRef}>
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-gray-100 transition-colors">
                                    <img src={user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`} alt="Profile" className="h-8 w-8 rounded-full border-2 border-indigo-300 object-cover" />
                                    <span className="hidden sm:inline font-semibold text-sm text-gray-700">{user.name.split(' ')[0]}</span>
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg p-2 z-50 border">
                                            <div className="px-4 py-2 border-b"><p className="font-bold text-gray-800">{user.name}</p><p className="text-sm text-gray-500 truncate">{user.email}</p></div>
                                            <div className="py-1">
                                                <Link to="/seller/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Seller Dashboard</Link>
                                                <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">My Customer Account</Link>
                                                <a href={`/shop/${user._id}`} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">View My Storefront</a>
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

export default SellerNavbar;
