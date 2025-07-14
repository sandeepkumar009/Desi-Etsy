import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';

export default function GoogleAuthCallback() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleAuth = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (token) {
                try {
                    await login(token);
                    toast.success("Successfully logged in with Google!");
                    navigate('/dashboard/profile');
                } catch (error) {
                    toast.error("Google authentication failed. Please try again.");
                    navigate('/login');
                }
            } else {
                toast.error("Google authentication failed. No token provided.");
                navigate('/login');
            }
        };

        handleAuth();
    }, []);

    return <Loader text="Finalizing authentication..." />;
}
