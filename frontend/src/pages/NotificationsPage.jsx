/*
* FILE: frontend/src/pages/NotificationsPage.jsx
*
* DESCRIPTION:
* This file is updated to make the "Mark all as read" functionality role-specific.
* - A new "Mark all as read" button is added to the page header.
* - This button is only visible if there are unread notifications for the current role.
* - The onClick handler for this button now correctly calls `markAllAsRead(role)`,
* passing the role determined from the URL. This ensures only the notifications
* for the current view (customer, artisan, or admin) are marked as read.
*/
import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { FaBell, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';

const NotificationsPage = () => {
    const { 
        customerNotifications, 
        artisanNotifications, 
        adminNotifications, 
        markAsRead,
        markAllAsRead // <-- Import the function
    } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();

    const { role, notifications } = useMemo(() => {
        const path = location.pathname;
        if (path.startsWith('/seller')) return { role: 'artisan', notifications: artisanNotifications };
        if (path.startsWith('/admin')) return { role: 'admin', notifications: adminNotifications };
        return { role: 'customer', notifications: customerNotifications };
    }, [location.pathname, customerNotifications, artisanNotifications, adminNotifications]);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        navigate(notification.link || '/');
    };

    const unreadNotifications = notifications.filter(n => !n.isRead);
    const readNotifications = notifications.filter(n => n.isRead);
    
    const pageTitle = `${role.charAt(0).toUpperCase() + role.slice(1)} Notifications`;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                            <FaBell className="text-orange-500" />
                            {pageTitle}
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">
                            Stay updated with all recent activities for your {role} account.
                        </p>
                    </div>
                    {/* --- ADDED: Role-specific "Mark all as read" button --- */}
                    {unreadNotifications.length > 0 && (
                         <button 
                            onClick={() => markAllAsRead(role)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-200 transition-colors"
                         >
                             Mark all as read
                         </button>
                    )}
                </header>

                <main className="space-y-10">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
                            New ({unreadNotifications.length})
                        </h2>
                        {unreadNotifications.length > 0 ? (
                            <ul className="space-y-3">
                                {unreadNotifications.map(notif => (
                                    <li 
                                        key={notif._id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-orange-200 hover:shadow-md hover:border-orange-400 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mr-4 flex-shrink-0"></div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{notif.message}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {format(new Date(notif.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                        <FaArrowRight className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 px-4 bg-white rounded-lg shadow-sm">
                                <FaCheckCircle className="mx-auto text-5xl text-green-500" />
                                <p className="mt-4 text-gray-600">You're all caught up!</p>
                            </div>
                        )}
                    </section>

                    {readNotifications.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
                                Earlier
                            </h2>
                            <ul className="space-y-3">
                                {readNotifications.map(notif => (
                                    <li 
                                        key={notif._id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className="bg-white/70 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                                            <div>
                                                <p className="text-gray-600">{notif.message}</p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {format(new Date(notif.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                        <FaArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default NotificationsPage;
