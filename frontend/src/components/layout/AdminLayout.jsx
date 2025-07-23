import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen bg-admin-secondary">
                <Loader text="Loading Admin Portal..." />
            </div>
        );
    }

    return (
        <div className="bg-admin-secondary min-h-screen">
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen} 
            />

            <div className="md:ml-64 transition-all duration-300">
                <AdminNavbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* The Outlet will render the specific admin page component */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
