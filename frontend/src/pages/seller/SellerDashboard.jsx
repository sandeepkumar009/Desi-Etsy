/*
================================================================================
File: frontend/src/pages/seller/SellerDashboard.jsx (Updated Code)
Description: This is the new "Shop Hub" landing page for the Seller Portal.
             It prominently displays the artisan's brand identity using real data,
             followed by key stats and recent activity.
================================================================================
*/
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

// Mock data for UI development
const mockStats = [
    { name: 'Sales (This Month)', value: '₹12,500', icon: '💰' },
    { name: 'Pending Orders', value: '4', icon: '📋' },
    { name: 'Unread Messages', value: '2', icon: '💬' },
    { name: 'Total Products', value: '18', icon: '📦' },
];

const mockActivity = [
    { text: 'You have a new order #12345.', time: '2 hours ago', type: 'order' },
    { text: 'A new review was left on "Handmade Vase".', time: '5 hours ago', type: 'review' },
    { text: 'Your product "Woven Basket" was approved.', time: '1 day ago', type: 'product' },
];

const SellerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <div>Loading...</div>; // Or a proper loader component
    }

    // Use real data from the user object, with sensible fallbacks
    const artisanProfile = user.artisanProfile || {};
    const brandName = artisanProfile.brandName || `${user.name}'s Creations`;
    const story = artisanProfile.story || "You haven't shared your story yet. Click 'Edit Shop Profile' to tell customers what makes your shop special!";
    const bannerImage = artisanProfile.bannerImage && artisanProfile.bannerImage !== 'default-banner-url.jpg' 
        ? artisanProfile.bannerImage 
        : 'https://placehold.co/1200x400/e9d5ff/4c1d95?text=Your+Shop+Banner';
    const profilePicture = user.profilePicture && user.profilePicture !== 'default-avatar-url.jpg'
        ? user.profilePicture
        : `https://i.pravatar.cc/150?u=${user._id}`;

    return (
        <div className="space-y-8">
            {/* --- Shop Header & Story --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative">
                    <div className="h-48 bg-gray-200 rounded-lg -m-6 mb-0" style={{ backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 px-4">
                        <img src={profilePicture} alt="Shop Profile" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">{brandName}</h1>
                            <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
                        </div>
                        <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-auto">
                            <Button onClick={() => navigate('/seller/settings')} variant="secondary">Edit Shop Profile</Button>
                            <a href={`/shop/${user._id}`} target="_blank" rel="noopener noreferrer">
                                <Button className='px-5'>View Storefront</Button>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">My Story</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{story}</p>
                </div>
            </div>

            {/* --- Key Metrics --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockStats.map(stat => (
                    <div key={stat.name} className="bg-white p-5 rounded-lg shadow-md flex items-center">
                        <div className="text-3xl bg-indigo-100 p-3 rounded-full">{stat.icon}</div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">{stat.name}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Recent Activity --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <ul className="divide-y divide-gray-200">
                    {mockActivity.map((activity, index) => (
                        <li key={index} className="py-3 flex justify-between items-center">
                            <p className="text-sm text-gray-700">{activity.text}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SellerDashboard;
