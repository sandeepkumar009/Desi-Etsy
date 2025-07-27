import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as orderService from '../../services/orderService';
import Loader from '../../components/common/Loader';
import OrderDetail from './OrderDetail';
import { toast } from 'react-toastify';

// Order Status Pill Component
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
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{formattedStatus}</span>;
};

// Order List View Component
const OrderList = ({ orders }) => (
    <div className="space-y-6">
        {orders.length > 0 ? (
            orders.map(order => (
                <div key={order._id} className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 mb-3">
                        <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-mono text-gray-800">...{order._id.slice(-8)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date Placed</p>
                            <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-semibold text-gray-800">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <OrderStatusPill status={order.status} />
                        <Link to={`/dashboard/orders/${order._id}`} className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                            View Details
                        </Link>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-500 py-12">You have not placed any orders yet.</p>
        )}
    </div>
);


// Main Page Component
const CustomerOrdersPage = () => {
    const { orderId } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                let response;
                if (orderId) {
                    response = await orderService.getCustomerOrderDetail(orderId);
                } else {
                    response = await orderService.getCustomerOrders();
                }
                setData(response);
            } catch (err) {
                setError('Failed to fetch order data.');
                toast.error(err.message || 'Could not load data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    const handleReviewUpdate = (updatedReview) => {
         const refetchData = async () => {
            const response = await orderService.getCustomerOrderDetail(orderId);
            setData(response);
         };
         refetchData();
    };

    if (isLoading) return <Loader text="Fetching your orders..." />;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-desi-primary mb-6">
                {orderId ? 'Order Details' : 'My Orders'}
            </h1>
            {orderId ? (
                <OrderDetail order={data} onReviewUpdate={handleReviewUpdate} />
            ) : (
                <OrderList orders={data} />
            )}
        </div>
    );
};

export default CustomerOrdersPage;