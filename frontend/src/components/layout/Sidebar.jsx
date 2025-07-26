import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const dashboardLinks = [
    { name: 'My Profile', to: '/dashboard/profile', icon: '👤' },
    { name: 'My Orders', to: '/dashboard/orders', icon: '📦' },
    { name: 'My Wishlist', to: '/dashboard/wishlist', icon: '❤️' },
    { name: 'Security', to: '/dashboard/security', icon: '🔒' },
    { name: 'Notifications', to: '/dashboard/notifications', icon: '🔔' },
];

const DashboardNavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium transition-colors duration-200 ${
                isActive 
                ? 'bg-orange-100 text-orange-600' 
                : 'hover:bg-gray-100'
            }`}
        >
            {children}
        </NavLink>
    );
};

export default function Sidebar() {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:col-span-1">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-desi-primary mb-4 border-b pb-2">My Account</h2>
                        <nav className="flex flex-col gap-2">
                            {dashboardLinks.map(link => (
                                <DashboardNavLink key={link.name} to={link.to}>
                                    <span className="text-xl">{link.icon}</span>
                                    <span>{link.name}</span>
                                </DashboardNavLink>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="md:col-span-3">
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md min-h-[400px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
