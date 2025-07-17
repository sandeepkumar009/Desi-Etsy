/*
================================================================================
File: frontend/src/components/layout/SellerSidebar.jsx (Updated Code)
Description: The seller sidebar has been updated with the complete navigation
             structure for all remaining artisan features.
================================================================================
*/
import React from 'react';
import { NavLink } from 'react-router-dom';

// Updated list with all features for the artisan
const sellerNavLinks = [
    { name: 'Dashboard', to: '/seller/dashboard', icon: '📊' },
    { name: 'Products', to: '/seller/products', icon: '📦' },
    { name: 'Orders', to: '/seller/orders', icon: '📋' },
    { name: 'Messages', to: '/seller/messages', icon: '💬' },
    { name: 'Analytics', to: '/seller/analytics', icon: '📈' },
    { name: 'Discounts', to: '/seller/discounts', icon: '🏷️' },
    { name: 'Settings', to: '/seller/settings', icon: '⚙️' },
];

const SellerSidebar = ({ isOpen, setIsOpen }) => {
    const sidebarClasses = `
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
    `;

    const activeLinkClass = 'bg-indigo-100 text-indigo-600';
    const inactiveLinkClass = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

    return (
        <>
            {/* Overlay for mobile view */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            <aside className={sidebarClasses}>
                <div className="p-4 border-b flex items-center">
                    <h2 className="text-2xl font-bold text-indigo-600">Seller Portal</h2>
                </div>
                <nav className="p-4">
                    <ul>
                        {sellerNavLinks.map(link => (
                            <li key={link.name} className="mb-2">
                                <NavLink
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => 
                                        `flex items-center p-3 rounded-lg text-sm font-medium ${
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

export default SellerSidebar;
