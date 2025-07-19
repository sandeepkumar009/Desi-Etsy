import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import SellerNavbar from './SellerNavbar';
import SellerSidebar from './SellerSidebar';
import { useAuth } from '../../hooks/useAuth';
import ArtisanStatusPage from '../../pages/seller/ArtisanStatusPage';
import Loader from '../common/Loader';

// Define paths that an artisan can access regardless of their approval status.
const alwaysAllowedPaths = [
    '/seller/settings',
    '/seller/dashboard' 
];

const SellerLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader text="Loading Seller Portal..." />
            </div>
        );
    }

    const isApproved = user.artisanProfile?.status === 'approved';
    const isAllowedPath = alwaysAllowedPaths.includes(location.pathname);

    // This function determines which component to render in the main content area.
    const renderContent = () => {
        if (isApproved) {
            // If approved, render any seller page requested via the <Outlet />.
            // If they are on the base dashboard URL, show the actual SellerDashboard component.
            if (location.pathname === '/seller/dashboard') {
                return <Outlet />;
            }
            return <Outlet />;
        } else {
            // If not approved...
            if (isAllowedPath) {
                // ...but they are on an allowed path (like /settings), show that page.
                // The <Outlet/> will render the correct component based on the route in App.jsx.
                // We show the status page specifically for the dashboard route.
                return location.pathname === '/seller/dashboard' ? <ArtisanStatusPage /> : <Outlet />;
            } else {
                // ...and they try to access a protected URL directly, redirect them to their dashboard (which shows the status page).
                return <Navigate to="/seller/dashboard" replace />;
            }
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <SellerSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen} 
                isApproved={isApproved}
            />

            <div className="md:ml-64 transition-all duration-300">
                <SellerNavbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

                <main className="p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
