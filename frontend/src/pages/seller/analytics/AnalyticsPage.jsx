import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as analyticsService from '../../../services/analyticsService';
import Loader from '../../../components/common/Loader';
import { Link } from 'react-router-dom';

const StatCard = ({ name, value, icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
        <div className="text-3xl bg-indigo-100 p-3 rounded-full text-indigo-600">{icon}</div>
        <div className="ml-4">
            <p className="text-sm text-gray-500">{name}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AnalyticsPage = () => {
    const [timePeriod, setTimePeriod] = useState('30d');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await analyticsService.getAnalytics(timePeriod);
            setAnalyticsData(data);
        } catch (err) {
            setError('Could not load analytics data. Please try again later.');
            toast.error(err.message || 'Failed to fetch analytics.');
        } finally {
            setIsLoading(false);
        }
    }, [timePeriod]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const keyStats = analyticsData?.keyStats ? [
        { name: 'Total Revenue', value: `₹${analyticsData.keyStats.totalRevenue.toLocaleString('en-IN')}`, icon: '₹' },
        { name: 'Total Sales', value: analyticsData.keyStats.totalOrders, icon: '🛒' },
        { name: 'Avg. Order Value', value: `₹${analyticsData.keyStats.avgOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: '📊' },
        { name: 'Total Products', value: analyticsData.keyStats.totalProducts, icon: '🎨' },
    ] : [];

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
                <div className="flex items-center bg-white p-1 rounded-lg shadow-sm border">
                    {['7d', '30d', '90d', 'all'].map(period => (
                        <button 
                            key={period}
                            onClick={() => setTimePeriod(period)} 
                            className={`px-4 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${timePeriod === period ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {period === 'all' ? 'All Time' : `Last ${period.replace('d', ' Days')}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {keyStats.map(stat => <StatCard key={stat.name} {...stat} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Summary</h2>
                     <div className="space-y-4">
                        <div className="flex justify-between items-baseline"><span className="text-gray-600">Time Period:</span><span className="font-semibold text-gray-800">{analyticsData.salesSummary.period}</span></div>
                        <div className="flex justify-between items-baseline"><span className="text-gray-600">Total Sales Revenue:</span><span className="text-2xl font-bold text-indigo-600">₹{analyticsData.salesSummary.totalSales.toLocaleString('en-IN')}</span></div>
                     </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Top Performing Products</h2>
                    {analyticsData.topProducts.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {analyticsData.topProducts.map((product, index) => (
                                <li key={product._id} className="py-3 flex items-center justify-between">
                                   <div className="flex items-center">
                                        <span className="text-lg font-bold text-gray-400 mr-4 w-6 text-center">{index + 1}</span>
                                        <div>
                                            <Link to={`/seller/products/view/${product._id}`} className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors">{product.name}</Link>
                                            <p className="text-xs text-gray-500">{product.sales} sales</p>
                                        </div>
                                   </div>
                                    <span className="text-sm font-semibold text-gray-800">₹{product.revenue.toLocaleString('en-IN')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No sales data for this period.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
