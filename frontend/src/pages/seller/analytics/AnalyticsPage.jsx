// Dashboard for sellers to view sales performance, revenue, and top products
import React, { useState } from 'react';
import { keyStats, topProducts, salesSummary } from './mockAnalyticsData';
import Button from '../../../components/common/Button';

const StatCard = ({ stat }) => {
    const isPositive = stat.change.startsWith('+');
    return (
        <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
            <div className="text-3xl bg-indigo-100 p-3 rounded-full">{stat.icon}</div>
            <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
            </div>
        </div>
    );
};

const AnalyticsPage = () => {
    const [timePeriod, setTimePeriod] = useState('30d');

    return (
        <div className="space-y-8">
            {/* Header and Time Period Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
                <div className="flex items-center bg-white p-1 rounded-lg shadow-sm border">
                    <button onClick={() => setTimePeriod('7d')} className={`px-4 py-1 rounded-md text-sm font-medium ${timePeriod === '7d' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>7 Days</button>
                    <button onClick={() => setTimePeriod('30d')} className={`px-4 py-1 rounded-md text-sm font-medium ${timePeriod === '30d' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>30 Days</button>
                    <button onClick={() => setTimePeriod('90d')} className={`px-4 py-1 rounded-md text-sm font-medium ${timePeriod === '90d' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>90 Days</button>
                </div>
            </div>

            {/* Key Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {keyStats.map(stat => <StatCard key={stat.name} stat={stat} />)}
            </div>

            {/* Main Data Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Summary</h2>
                     <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">Time Period:</span>
                            <span className="font-semibold text-gray-800">{salesSummary.period}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">Total Sales:</span>
                            <span className="text-2xl font-bold text-indigo-600">₹{salesSummary.totalSales.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600">Performance vs. Previous Period:</span>
                            <span className={`font-semibold text-lg ${salesSummary.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {salesSummary.performance}
                            </span>
                        </div>
                     </div>
                </div>

                {/* Top Performing Products */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
                    <ul className="divide-y divide-gray-200">
                        {topProducts.map((product, index) => (
                            <li key={product._id} className="py-3 flex items-center justify-between">
                               <div className="flex items-center">
                                    <span className="text-lg font-bold text-gray-400 mr-4">{index + 1}</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.sales} sales</p>
                                    </div>
                               </div>
                                <span className="text-sm font-semibold text-gray-800">₹{product.revenue.toLocaleString('en-IN')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
