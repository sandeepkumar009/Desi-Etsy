import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import * as analyticsService from '../../services/analyticsService';
import * as artisanService from '../../services/artisanService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

// Reusable Stat Card Component
const StatCard = ({ name, value, icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
        <div className="text-3xl bg-indigo-100 p-3 rounded-full text-indigo-600">{icon}</div>
        <div className="ml-4">
            <p className="text-sm text-gray-500">{name}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// Settings Modal Component
const SettingsModal = ({ user, isOpen, onClose, onProfileUpdate }) => {
    const [formData, setFormData] = useState({ brandName: '', story: '' });
    const [bannerFile, setBannerFile] = useState(null);
    const [profileFile, setProfileFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                brandName: user.artisanProfile?.brandName || `${user.name}'s Creations`,
                story: user.artisanProfile?.story || '',
            });
            setBannerPreview(user.artisanProfile?.bannerImage || 'https://placehold.co/1200x400/e2e8f0/4a5568?text=Your+Shop+Banner');
            setProfilePreview(user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`);
            setBannerFile(null);
            setProfileFile(null);
        }
    }, [user, isOpen]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const setFile = type === 'banner' ? setBannerFile : setProfileFile;
            const setPreview = type === 'banner' ? setBannerPreview : setProfilePreview;
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const data = new FormData();
        data.append('brandName', formData.brandName);
        data.append('story', formData.story);
        if (profileFile) data.append('profileImage', profileFile);
        if (bannerFile) data.append('bannerImage', bannerFile);

        try {
            const updatedProfile = await artisanService.updateMyArtisanProfile(data);
            onProfileUpdate(updatedProfile);
            toast.success("Shop profile updated successfully!");
            onClose(); // Close modal on success
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Shop Profile">
            <form onSubmit={handleSave} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Banner</label>
                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-2 bg-cover bg-center" style={{ backgroundImage: `url(${bannerPreview})` }}></div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <img src={profilePreview} alt="Shop Profile" className="w-20 h-20 rounded-full border-2 border-white shadow-md object-cover" />
                    </div>
                    <div className="w-full">
                        <Input label="Brand Name" name="brandName" value={formData.brandName} onChange={(e) => setFormData(p => ({...p, brandName: e.target.value}))} required />
                    </div>
                </div>
                 <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Your Story</label>
                    <textarea name="story" rows="5" value={formData.story} onChange={(e) => setFormData(p => ({...p, story: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required></textarea>
                </div>
                <div className="flex justify-end pt-4 border-t"><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button></div>
            </form>
        </Modal>
    );
};


// Main Consolidated Dashboard Component
const SellerDashboard = () => {
    const { user, updateUser, loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [timePeriod, setTimePeriod] = useState('30d');
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch both sets of data concurrently
            const [allTimeStats, periodAnalytics] = await Promise.all([
                analyticsService.getAnalytics('all'),
                analyticsService.getAnalytics(timePeriod)
            ]);
            setStats(allTimeStats.keyStats);
            setAnalyticsData(periodAnalytics);
        } catch (error) {
            toast.error("Failed to load dashboard data.");
            // Set defaults on error
            setStats({ totalRevenue: 0, pendingOrders: 0, totalProducts: 0, totalOrders: 0 });
            setAnalyticsData({ salesSummary: { period: 'N/A', totalSales: 0 }, topProducts: [] });
        } finally {
            setIsLoading(false);
        }
    }, [timePeriod]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user, fetchDashboardData]);
    
    if (loading || !user) return <Loader text="Loading Dashboard..." />;

    // Prepare data for display
    const artisanProfile = user.artisanProfile || {};
    const brandName = artisanProfile.brandName || `${user.name}'s Creations`;
    const story = artisanProfile.story || "You haven't shared your story yet. Click 'Edit Shop Profile' to tell customers what makes your shop special!";
    const bannerImage = artisanProfile.bannerImage || 'https://placehold.co/1200x400/e9d5ff/4c1d95?text=Your+Shop+Banner';
    const profilePicture = user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`;
    
    const keyMetrics = stats ? [
        { name: 'Lifetime Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: '💰' },
        { name: 'Pending Orders', value: stats.pendingOrders, icon: '⏳' },
        { name: 'Total Products', value: stats.totalProducts, icon: '🎨' },
        { name: 'Lifetime Sales', value: stats.totalOrders, icon: '🛒' },
    ] : [];

    return (
        <>
            <SettingsModal 
                user={user} 
                isOpen={isSettingsModalOpen} 
                onClose={() => setIsSettingsModalOpen(false)} 
                onProfileUpdate={updateUser} 
            />
            <div className="space-y-8">
                {/* Profile Section */}
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
                                <Button onClick={() => setIsSettingsModalOpen(true)} variant="secondary">Edit Profile</Button>
                                <a href={`/artisan/${user._id}`} target="_blank" rel="noopener noreferrer"><Button>View Storefront</Button></a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t"><h2 className="text-xl font-bold text-gray-800 mb-2">My Story</h2><p className="text-gray-600 whitespace-pre-wrap">{story}</p></div>
                </div>

                {/* Key Metrics Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? <p className="col-span-4">Loading metrics...</p> : keyMetrics.map(stat => <StatCard key={stat.name} {...stat} />)}
                </div>

                {/* Analytics Section */}
                <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>
                        <div className="flex items-center bg-white p-1 rounded-lg shadow-sm border">
                            {['7d', '30d', '90d', 'all'].map(period => (
                                <button key={period} onClick={() => setTimePeriod(period)} className={`px-4 py-1 rounded-md text-sm font-medium ${timePeriod === period ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    {period === 'all' ? 'All Time' : `Last ${period.replace('d', ' Days')}`}
                                </button>
                            ))}
                        </div>
                    </div>
                    {isLoading ? <Loader /> : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Sales Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline"><span className="text-gray-600">Time Period:</span><span className="font-semibold text-gray-800">{analyticsData.salesSummary.period}</span></div>
                                    <div className="flex justify-between items-baseline"><span className="text-gray-600">Total Sales Revenue:</span><span className="text-2xl font-bold text-indigo-600">₹{analyticsData.salesSummary.totalSales.toLocaleString('en-IN')}</span></div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Top Performing Products</h3>
                                {analyticsData.topProducts.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {analyticsData.topProducts.map((p, i) => (
                                            <li key={p._id} className="py-3 flex items-center justify-between">
                                                <div className="flex items-center"><span className="text-lg font-bold text-gray-400 mr-4 w-6 text-center">{i + 1}</span>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                                        <p className="text-xs text-gray-500">{p.sales} sales</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">₹{p.revenue.toLocaleString('en-IN')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-center text-gray-500 py-8">No sales data for this period.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SellerDashboard;
