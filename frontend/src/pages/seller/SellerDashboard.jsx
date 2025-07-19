import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as analyticsService from '../../services/analyticsService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const StatCard = ({ name, value, icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
        <div className="text-3xl bg-indigo-100 p-3 rounded-full text-indigo-600">{icon}</div>
        <div className="ml-4">
            <p className="text-sm text-gray-500">{name}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const SellerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // Fetch all-time stats for the dashboard overview
                const data = await analyticsService.getAnalytics('all');
                setStats(data.keyStats);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                // Set default stats on error so the page doesn't break
                setStats({ totalRevenue: 0, pendingOrders: 0, totalProducts: 0 });
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardStats();
    }, []);

    if (!user) {
        return <div className="flex justify-center items-center h-96"><Loader /></div>;
    }

    const artisanProfile = user.artisanProfile || {};
    const brandName = artisanProfile.brandName || `${user.name}'s Creations`;
    const story = artisanProfile.story || "You haven't shared your story yet. Click 'Edit Shop Profile' to tell customers what makes your shop special!";
    const bannerImage = artisanProfile.bannerImage || 'https://placehold.co/1200x400/e9d5ff/4c1d95?text=Your+Shop+Banner';
    const profilePicture = user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`;
    
    const keyMetrics = stats ? [
        { name: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: '₹' },
        { name: 'Pending Orders', value: stats.pendingOrders, icon: '📦' },
        { name: 'Total Products', value: stats.totalProducts, icon: '🎨' },
        { name: 'Total Sales', value: stats.totalOrders, icon: '🛒' },
    ] : [];

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative">
                    <div className="h-48 bg-gray-200 rounded-lg -m-6 mb-0" style={{ backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 px-4">
                        <img src={profilePicture} alt="Shop Profile" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200" />
                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">{brandName}</h1>
                            <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
                        </div>
                        <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-auto">
                            <Button onClick={() => navigate('/seller/settings')} variant="secondary">Edit Profile</Button>
                            <a href={`/artisan/${user._id}`} target="_blank" rel="noopener noreferrer"><Button>View Storefront</Button></a>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t"><h2 className="text-xl font-bold text-gray-800 mb-2">My Story</h2><p className="text-gray-600 whitespace-pre-wrap">{story}</p></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <p className="text-center col-span-4">Loading metrics...</p>
                ) : (
                    keyMetrics.map(stat => <StatCard key={stat.name} {...stat} />)
                )}
            </div>
            
            {/* You can later connect this to a notifications or recent orders endpoint */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <p className="text-sm text-gray-500">Recent activity feed coming soon.</p>
            </div>
        </div>
    );
};

export default SellerDashboard;
