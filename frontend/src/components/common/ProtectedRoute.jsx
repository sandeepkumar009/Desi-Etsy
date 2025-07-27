import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader text="Verifying access..." /></div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("You are not authorized to view this page.");
        const redirectTo = user.role === 'admin' ? '/admin/dashboard' : user.role === 'artisan' ? '/seller/dashboard' : '/';
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;
