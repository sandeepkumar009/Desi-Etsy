import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import { ProductDetailModal, CancelOrderModal, ShipOrderModal } from './OrderModals';

const OrderStatusTimeline = ({ history }) => (
    <div className="mt-4">
        <h4 className="text-md font-semibold text-gray-600 mb-3">Order History</h4>
        <ol className="relative border-l border-gray-200">
            {history.map((event, index) => (
                <li key={index} className="mb-6 ml-4">
                    <div className="absolute w-3 h-3 bg-gray-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(event.updatedAt).toLocaleString()}</time>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{event.status}</h3>
                </li>
            ))}
        </ol>
    </div>
);

const OrderDetailView = ({ order, onBack, onStatusUpdate }) => {
    const [modal, setModal] = useState({ type: null, data: null });

    if (!order) return null;

    const renderActionButtons = () => {
        switch (order.status) {
            case 'processing':
                return (
                    <div className="flex gap-2">
                        <Button onClick={() => onStatusUpdate(order._id, 'packed')} variant="primary">Mark as Packed</Button>
                        <Button onClick={() => setModal({ type: 'cancel' })} variant="danger">Cancel Order</Button>
                    </div>
                );
            case 'packed':
                return (
                    <div className="flex gap-2">
                        <Button onClick={() => setModal({ type: 'ship' })} variant="primary">Mark as Shipped</Button>
                        <Button onClick={() => setModal({ type: 'cancel' })} variant="danger">Cancel Order</Button>
                    </div>
                );
            case 'shipped':
                 return <Button onClick={() => onStatusUpdate(order._id, 'delivered')} variant="primary">Mark as Delivered</Button>;
            default:
                return <p className="text-sm text-gray-500">No actions available for this order status.</p>;
        }
    };

    return (
        <>
            {/* Modals */}
            <ProductDetailModal 
                isOpen={modal.type === 'product'} 
                onClose={() => setModal({ type: null, data: null })} 
                product={modal.data} 
            />
            <CancelOrderModal 
                isOpen={modal.type === 'cancel'} 
                onClose={() => setModal({ type: null, data: null })} 
                onConfirm={(reason) => onStatusUpdate(order._id, 'cancelled', { reason })}
            />
            <ShipOrderModal
                isOpen={modal.type === 'ship'}
                onClose={() => setModal({ type: null, data: null })}
                onConfirm={(shippingInfo) => onStatusUpdate(order._id, 'shipped', shippingInfo)}
            />

            {/* Main View */}
            <div>
                <div className="flex items-center mb-6">
                    <button onClick={onBack} className="text-indigo-600 hover:text-indigo-900 font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to All Orders
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Order #{order._id}</h2>
                            <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                        {/* Left Column: Customer & Actions */}
                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Customer Details</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-semibold">Name:</span> {order.userId.name}</p>
                                    <p><span className="font-semibold">Email:</span> {order.userId.email}</p>
                                </div>
                                <Button size="sm" variant="secondary" className="mt-2">Contact Customer</Button>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Address</h3>
                                <address className="not-italic text-sm text-gray-600">
                                    {order.shippingAddress.addressLine1}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                    {order.shippingAddress.country}
                                </address>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Actions</h3>
                                {renderActionButtons()}
                                <Button size="sm" variant="outline" className="mt-4">Print Packing Slip</Button>
                            </div>
                        </div>

                        {/* Right Column: Order Summary & History */}
                        <div className="md:col-span-2 space-y-6">
                             <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Items</h3>
                                <ul className="divide-y divide-gray-200 border rounded-lg">
                                    {order.items.map((item) => (
                                        <li key={item.productId._id} className="p-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <img src={item.image} alt={item.productId.name} className="h-12 w-12 rounded-md object-cover mr-4" />
                                                <div>
                                                    <button onClick={() => setModal({ type: 'product', data: item.productId })} className="font-semibold text-gray-800 hover:text-indigo-600 text-left">{item.productId.name}</button>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-center pt-4 border-t mt-2">
                                    <p className="font-bold text-lg text-gray-900">Total</p>
                                    <p className="font-bold text-lg text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <OrderStatusTimeline history={order.statusHistory} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailView;
