import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerNavbar from './SellerNavbar';
import SellerSidebar from './SellerSidebar';

const SellerLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-gray-100 min-h-screen">
            <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="md:ml-64 transition-all duration-300">
                <SellerNavbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
