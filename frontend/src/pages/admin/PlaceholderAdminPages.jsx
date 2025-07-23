import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAdminSummary } from '../../services/analyticsService';
import Loader from '../../components/common/Loader';

// --- Reusable UI Components for the Dashboard ---

const StatCard = ({ title, value, icon, note }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 text-blue-500 rounded-full p-3 mr-4 text-3xl">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-admin-primary">{value}</p>
            {note && <p className="text-xs text-gray-400">{note}</p>}
        </div>
    </div>
);

const ActionCard = ({ title, count, icon, linkTo, linkText }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 font-medium">{title}</p>
                <p className="text-5xl font-bold text-admin-accent my-2">{count}</p>
            </div>
            <div className="text-5xl text-gray-200">{icon}</div>
        </div>
        <Link to={linkTo} className="mt-4 inline-block w-full text-center bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            {linkText}
        </Link>
    </div>
);

const RecentUserItem = ({ user }) => (
    <li className="flex items-center justify-between py-2">
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 font-bold text-gray-500 text-sm">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
            </div>
        </div>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.role === 'artisan' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
            {user.role}
        </span>
    </li>
);

const RecentOrderItem = ({ order }) => (
    <li className="flex items-center justify-between py-2">
        <div>
            <p className="text-sm font-medium text-gray-800">Order #{order._id.substring(0, 8)}</p>
            <p className="text-xs text-gray-500">by {order.userId?.name || 'N/A'}</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 capitalize">{order.status.replace('_', ' ')}</p>
        </div>
    </li>
);

// --- Main Admin Dashboard Page Component ---

export const AdminDashboardPage = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const data = await getAdminSummary();
                setSummary(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader text="Loading Dashboard..." /></div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
        </div>;
    }

    if (!summary) return null;

    const { keyMetrics, actionItems, recentActivity } = summary;

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <img 
                    src={user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`} 
                    alt="Admin" 
                    className="h-16 w-16 rounded-full mr-4 border-4 border-admin-accent"
                />
                <div>
                    <h1 className="text-3xl font-bold text-admin-primary">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className="text-gray-500">Here's a snapshot of your platform's activity.</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${keyMetrics.totalRevenue.toLocaleString('en-IN')}`} icon="💰" note="From delivered orders" />
                <StatCard title="Total Orders" value={keyMetrics.totalOrders.toLocaleString()} icon="📦" />
                <StatCard title="New Users" value={keyMetrics.newUsersLast30Days.toLocaleString()} icon="👋" note="In the last 30 days" />
                <StatCard title="Active Artisans" value={keyMetrics.activeArtisans.toLocaleString()} icon="🎨" note="Approved to sell" />
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard 
                    title="Pending Artisan Applications" 
                    count={actionItems.pendingArtisans} 
                    icon="⏳" 
                    linkTo="/admin/artisan-verification" 
                    linkText="Review Applications" 
                />
                <ActionCard 
                    title="Pending Product Approvals" 
                    count={actionItems.pendingProducts} 
                    icon="🔍" 
                    linkTo="/admin/product-approval" 
                    linkText="Review Products" 
                />
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg text-admin-primary mb-4">Recent Orders</h3>
                    <ul className="divide-y divide-gray-200">
                        {recentActivity.latestOrders.length > 0 ? (
                            recentActivity.latestOrders.map(order => <RecentOrderItem key={order._id} order={order} />)
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent orders.</p>
                        )}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg text-admin-primary mb-4">Newest Users</h3>
                    <ul className="divide-y divide-gray-200">
                        {recentActivity.recentUsers.length > 0 ? (
                            recentActivity.recentUsers.map(u => <RecentUserItem key={u._id} user={u} />)
                        ) : (
                            <p className="text-gray-500 text-center py-4">No new users.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};


// --- Other Placeholder Pages ---
const PageTitle = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-admin-primary mb-4">{title}</h1>
        <div className="text-gray-600">
            {children}
        </div>
    </div>
);

export const ArtisanVerificationPage = () => <PageTitle title="✅ Artisan Verification">Review and approve or reject pending artisan applications from this page.</PageTitle>;
export const ProductApprovalPage = () => <PageTitle title="📦 Product Approval">Moderate new products submitted by artisans before they go live on the site.</PageTitle>;
export const CategoryManagementPage = () => <PageTitle title="🏷️ Category Management">Add, edit, or remove product categories for the entire platform.</PageTitle>;
export const UserManagementPage = () => <PageTitle title="👥 User Management">View and manage all registered users and artisans.</PageTitle>;
export const AdminSettingsPage = () => <PageTitle title="⚙️ Platform Settings">Configure global settings for the e-commerce platform.</PageTitle>;
