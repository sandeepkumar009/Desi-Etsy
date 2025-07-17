// Notifications page for artisans to view and manage updates like orders, reviews, and stock alerts
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockNotifications as initialNotifications } from './mockNotificationData';
import Button from '../../../components/common/Button';

const NotificationIcon = ({ type }) => {
    const icons = {
        new_order: '📋',
        new_review: '⭐',
        new_message: '💬',
        product_approved: '📦',
        low_stock: '⚠️',
    };
    return <span className="text-2xl">{icons[type] || '🔔'}</span>;
};

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id) => {
        setNotifications(current => current.map(n => n._id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(current => current.map(n => ({ ...n, read: true })));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                <Button onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>
                    Mark All as Read
                </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <li key={notification._id} className={`p-4 flex items-start gap-4 ${!notification.read ? 'bg-indigo-50' : ''}`}>
                                <NotificationIcon type={notification.type} />
                                <div className="flex-grow">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                        <Link to={notification.link} className="hover:underline">{notification.message}</Link>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <button onClick={() => markAsRead(notification._id)} className="p-1 rounded-full hover:bg-gray-200" title="Mark as read">
                                        <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                                    </button>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">You have no notifications.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationsPage;
