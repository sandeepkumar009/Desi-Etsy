// Full-featured order management page with search, filter, sort, and detail view
import React, { useState, useMemo } from 'react';
import OrderDetailView from './OrderDetailView';
import { mockOrders as allMockOrders } from './mockOrderData';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const OrderStatusPill = ({ status }) => {
    const statusStyles = {
        processing: 'bg-yellow-100 text-yellow-800',
        packed: 'bg-blue-100 text-blue-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const OrdersPage = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState(allMockOrders);
    
    // State for filtering and sorting
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const updateOrderStatus = (orderId, newStatus, details = {}) => {
        console.log(`Updating order ${orderId} to status: ${newStatus}`, details);
        setOrders(currentOrders =>
            currentOrders.map(order => {
                if (order._id === orderId) {
                    const newStatusHistory = [...order.statusHistory, { status: newStatus, updatedAt: new Date() }];
                    return { ...order, status: newStatus, statusHistory: newStatusHistory };
                }
                return order;
            })
        );
        setSelectedOrder(prevOrder => prevOrder ? {...prevOrder, status: newStatus} : null);
        alert(`Order ${orderId} status updated to ${newStatus} (simulated).`);
    };

    const filteredAndSortedOrders = useMemo(() => {
        let processedOrders = [...orders];

        // Filter by status
        if (statusFilter !== 'all') {
            processedOrders = processedOrders.filter(order => order.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            processedOrders = processedOrders.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        processedOrders.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

        return processedOrders;
    }, [orders, statusFilter, searchTerm, sortBy]);


    if (selectedOrder) {
        return <OrderDetailView 
                    order={selectedOrder} 
                    onBack={() => setSelectedOrder(null)} 
                    onStatusUpdate={updateOrderStatus} 
                />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
            
            {/* Filter and Search Controls */}
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

            {/* Orders Table */}
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
                            {filteredAndSortedOrders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.userId.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><OrderStatusPill status={order.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Button onClick={() => setSelectedOrder(order)} size="sm">View Details</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination would go here */}
            </div>
        </div>
    );
};

export default OrdersPage;
