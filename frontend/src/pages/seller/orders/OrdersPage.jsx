import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import OrderDetailView from './OrderDetailView';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import * as orderService from '../../../services/orderService';

const OrderStatusPill = ({ status }) => {
    const statusStyles = {
        processing: 'bg-yellow-100 text-yellow-800',
        packed: 'bg-blue-100 text-blue-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        paid: 'bg-cyan-100 text-cyan-800',
    };
    const formattedStatus = status.replace('_', ' ');
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{formattedStatus}</span>;
};

const OrdersPage = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for filtering and sorting
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await orderService.getArtisanOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            toast.error(err.message || 'Failed to fetch orders.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusUpdate = async (orderId, newStatus, details = {}) => {
        try {
            const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus, details);
            // Update the list of orders with the new data
            setOrders(currentOrders =>
                currentOrders.map(order => (order._id === orderId ? updatedOrder : order))
            );
            // If the detailed view is open, update it as well
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(updatedOrder);
            }
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            toast.error(err.message || 'Failed to update order status.');
        }
    };

    const filteredAndSortedOrders = useMemo(() => {
        let processedOrders = [...orders];

        if (statusFilter !== 'all') {
            processedOrders = processedOrders.filter(order => order.status === statusFilter);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            processedOrders = processedOrders.filter(order =>
                order._id.toLowerCase().includes(lowercasedTerm) ||
                order.userId.name.toLowerCase().includes(lowercasedTerm)
            );
        }

        processedOrders.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

        return processedOrders;
    }, [orders, statusFilter, searchTerm, sortBy]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    if (selectedOrder) {
        return <OrderDetailView 
                    order={selectedOrder} 
                    onBack={() => setSelectedOrder(null)} 
                    onStatusUpdate={handleStatusUpdate} 
                />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
            
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Search by Order ID or Customer"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="e.g., ORD12345 or Priya Patel"
                    />
                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                        <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="all">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
                        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedOrders.length > 0 ? filteredAndSortedOrders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">...{order._id.slice(-6)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.userId.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><OrderStatusPill status={order.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Button onClick={() => setSelectedOrder(order)} size="sm">View Details</Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
