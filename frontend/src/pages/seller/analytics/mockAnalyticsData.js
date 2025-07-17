/*
================================================================================
File: frontend/src/pages/seller/mockAnalyticsData.js (New File)
Description: Contains mock data for the sales analytics dashboard, structured
             for a chart-less display.
================================================================================
*/

// Mock data for key performance indicators (KPIs) or stat cards
export const keyStats = [
    { name: 'Total Revenue', value: '₹87,500', change: '+12.5%', icon: '💰' },
    { name: 'Total Orders', value: '124', change: '+8.2%', icon: '📋' },
    { name: 'Avg. Order Value', value: '₹705', change: '+3.1%', icon: '🛒' },
    { name: 'New Customers', value: '32', change: '+5.0%', icon: '👥' },
];

// Mock data for the top-performing products list
export const topProducts = [
    { _id: '1', name: 'Hand-painted Ceramic Vase', sales: 25, revenue: 43750 },
    { _id: '3', name: 'Custom Wooden Sign', sales: 15, revenue: 24750 },
    { _id: '2', name: 'Woven Seagrass Basket', sales: 30, revenue: 18750 },
    { _id: '4', name: 'Macrame Wall Hanging', sales: 10, revenue: 11000 },
];

// Mock data for a simple sales summary over a period
export const salesSummary = {
    period: 'Last 30 Days',
    totalSales: 87500,
    previousPeriodSales: 77777,
    get performance() {
        const percentage = ((this.totalSales - this.previousPeriodSales) / this.previousPeriodSales * 100).toFixed(1);
        return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
    },
    get isPositive() {
        return this.totalSales > this.previousPeriodSales;
    }
};
