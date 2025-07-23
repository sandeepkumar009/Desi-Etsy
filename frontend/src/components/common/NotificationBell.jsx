/*
* FILE: frontend/src/components/common/NotificationBell.jsx
*
* DESCRIPTION:
* This component is now significantly smarter. It accepts a `role` prop
* ('customer', 'artisan', or 'admin') which determines which notifications
* and unread count to display. The "View All Notifications" link is now
* also dynamic, pointing to the correct dashboard based on the provided role.
*/
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

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

// MODIFIED: Component now accepts a 'role' prop
const NotificationBell = ({ role }) => {
    const { 
        customerNotifications, customerUnreadCount,
        artisanNotifications, artisanUnreadCount,
        adminNotifications, adminUnreadCount,
        markAsRead, markAllAsRead
    } = useNotifications();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    useOutsideClick(dropdownRef, () => setIsOpen(false));

    // Determine which notifications and count to use based on the role prop
    const { notifications, unreadCount } = React.useMemo(() => {
        switch (role) {
            case 'artisan':
                return { notifications: artisanNotifications, unreadCount: artisanUnreadCount };
            case 'admin':
                return { notifications: adminNotifications, unreadCount: adminUnreadCount };
            case 'customer':
            default:
                return { notifications: customerNotifications, unreadCount: customerUnreadCount };
        }
    }, [role, customerNotifications, artisanNotifications, adminNotifications, customerUnreadCount, artisanUnreadCount, adminUnreadCount]);

    // Determine the correct link for the "View All" button
    const viewAllLink = {
        customer: '/dashboard/notifications',
        artisan: '/seller/notifications',
        admin: '/admin/notifications'
    }[role];

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        setIsOpen(false);
        navigate(notification.link || '/');
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100" 
                aria-label={`View notifications. ${unreadCount} unread.`}
            >
                <FaBell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }} 
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg z-50 border"
                    >
                        <div className="p-3 flex justify-between items-center border-b">
                            <h3 className="font-bold text-gray-800 capitalize">{role} Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={() => markAllAsRead(role)} className="text-sm text-blue-600 hover:underline">
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.slice(0, 7).map(notif => (
                                    <li key={notif._id} onClick={() => handleNotificationClick(notif)} className="p-3 flex items-start hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                                        {!notif.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>}
                                        <div className={`flex-grow ${notif.isRead ? 'pl-5' : ''}`}>
                                            <p className={`text-sm ${notif.isRead ? 'text-gray-500' : 'text-gray-800 font-semibold'}`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="p-4 text-center text-sm text-gray-500">No new {role} notifications.</p>
                            )}
                        </ul>
                        <div className="border-t">
                            <Link 
                                to={viewAllLink}
                                onClick={() => setIsOpen(false)} 
                                className="block text-center w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-b-lg"
                            >
                                View All Notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
