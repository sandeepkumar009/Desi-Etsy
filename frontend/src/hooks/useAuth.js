import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to get user and auth functions from context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
