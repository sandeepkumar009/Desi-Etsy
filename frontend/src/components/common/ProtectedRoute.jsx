import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';
import { toast } from 'react-toastify';

/**
 * A protected route component that checks for user authentication and role-based authorization.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 * @param {string[]} [props.allowedRoles] - An array of roles allowed to access the route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader text="Verifying access..." /></div>;
    }

    if (!user) {
        // If user is not logged in, redirect to login page
        // state={{ from: location }} helps redirect back after successful login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If the user's role is not in the allowedRoles array,
        // show an error and redirect them.
        toast.error("You are not authorized to view this page.");
        // Redirect to a safe page, like their primary dashboard or home.
        const redirectTo = user.role === 'admin' ? '/admin/dashboard' : user.role === 'artisan' ? '/seller/dashboard' : '/';
        return <Navigate to={redirectTo} replace />;
    }

    // If the user is authenticated and has the correct role, render the children.
    return children;
};

export default ProtectedRoute;
