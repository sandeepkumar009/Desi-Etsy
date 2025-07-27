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
            if (location.pathname === '/seller/dashboard') {
                return <Outlet />;
            }
            return <Outlet />;
        } else {
            if (isAllowedPath) {
                return location.pathname === '/seller/dashboard' ? <ArtisanStatusPage /> : <Outlet />;
            } else {
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
