import React from 'react';
import { NavLink } from 'react-router-dom';

const adminNavLinks = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: '👑' },
    { name: 'Artisan Verification', to: '/admin/artisan-verification', icon: '✅' },
    { name: 'Product Approval', to: '/admin/product-approval', icon: '📦' },
    { name: 'Category Management', to: '/admin/categories', icon: '🏷️' },
    { name: 'Payout Management', to: '/admin/payouts', icon: '💸' },
    { name: 'Notifications', to: '/admin/notifications', icon: '🔔' },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const sidebarClasses = `
        fixed top-0 left-0 h-full w-64 bg-admin-primary text-white shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
    `;

    const activeLinkClass = 'bg-admin-accent text-white';
    const inactiveLinkClass = 'text-gray-300 hover:bg-gray-700 hover:text-white';

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            <aside className={sidebarClasses}>
                <div className="p-4 border-b border-gray-700 flex items-center">
                    <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                </div>
                <nav className="p-4">
                    <ul>
                        {adminNavLinks.map(link => (
                            <li key={link.name} className="mb-2">
                                <NavLink
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => 
                                        `flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                                            isActive ? activeLinkClass : inactiveLinkClass
                                        }`
                                    }
                                >
                                    <span className="mr-3 text-lg">{link.icon}</span>
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;
