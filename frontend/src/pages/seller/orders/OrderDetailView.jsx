import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import { ProductDetailModal, CancelOrderModal, ShipOrderModal } from './OrderModals';

const OrderStatusTimeline = ({ history }) => (
    <div className="mt-4">
        <h4 className="text-md font-semibold text-gray-600 mb-3">Order History</h4>
        <ol className="relative border-l-2 border-indigo-200">
            {history.map((event, index) => (
                <li key={index} className="mb-8 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-200 rounded-full -left-3 ring-8 ring-white">
                        <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 capitalize">{event.status.replace('_', ' ')}</h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400">{new Date(event.updatedAt).toLocaleString()}</time>
                    {event.details && <p className="text-sm text-gray-600">{event.details}</p>}
                </li>
            ))}
        </ol>
    </div>
);

const OrderDetailView = ({ order, onBack, onStatusUpdate }) => {
    const [modal, setModal] = useState({ type: null, data: null });

    if (!order) return null;

    const renderActionButtons = () => {
        const commonCancelButton = <Button onClick={() => setModal({ type: 'cancel' })} variant="danger" outline>Cancel Order</Button>;
        
        switch (order.status) {
            case 'paid':
            case 'processing':
                return (
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => onStatusUpdate(order._id, 'packed')} variant="primary">Mark as Packed</Button>
                        {commonCancelButton}
                    </div>
                );
            case 'packed':
                return (
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => setModal({ type: 'ship' })} variant="primary">Mark as Shipped</Button>
                        {commonCancelButton}
                    </div>
                );
            case 'shipped':
                 return <Button onClick={() => onStatusUpdate(order._id, 'delivered')} variant="primary">Mark as Delivered</Button>;
            default:
                return <p className="text-sm text-gray-500 italic">No actions available for this order status.</p>;
        }
    };
    
    const getStatusPillStyle = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'packed': return 'bg-blue-100 text-blue-800';
            case 'processing': case 'paid': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
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
                            <h2 className="text-2xl font-bold text-gray-800">Order #...{order._id.slice(-6)}</h2>
                            <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${getStatusPillStyle(order.status)}`}>{order.status.replace('_', ' ')}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Customer Details</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-semibold">Name:</span> {order.userId.name}</p>
                                    <p><span className="font-semibold">Email:</span> {order.userId.email}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Address</h3>
                                <address className="not-italic text-sm text-gray-600">
                                    {order.shippingAddress.addressLine1}<br />
                                    {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                    {order.shippingAddress.country}
                                </address>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Actions</h3>
                                {renderActionButtons()}
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                             <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Items</h3>
                                <ul className="divide-y divide-gray-200 border rounded-lg">
                                    {order.items.map((item) => (
                                        <li key={item.productId} className="p-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover mr-4" />
                                                <div>
                                                    <button 
                                                        onClick={() => setModal({ type: 'product', data: item })}
                                                        className="font-semibold text-gray-800 hover:text-indigo-600 text-left transition-colors duration-200"
                                                    >
                                                        {item.name}
                                                    </button>
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
