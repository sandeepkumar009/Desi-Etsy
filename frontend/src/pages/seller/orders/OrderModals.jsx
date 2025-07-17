/*
================================================================================
File: frontend/src/pages/seller/OrderModals.jsx (New File)
Description: This file contains all the modal components used in the order
             management workflow: viewing product details, cancelling an order,
             and shipping an order.
================================================================================
*/
import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

// --- Product Detail Modal ---
export const ProductDetailModal = ({ isOpen, onClose, product }) => {
    if (!product) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Product Details">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <img src={product.image} alt={product.name} className="sm:col-span-1 w-full h-auto rounded-lg" />
                <div className="sm:col-span-2 space-y-2">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description || "No description available."}</p>
                    <p className="text-lg font-semibold text-gray-800">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
            </div>
        </Modal>
    );
};

// --- Cancel Order Modal ---
export const CancelOrderModal = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('customer_request');

    const handleConfirm = () => {
        onConfirm(reason);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cancel Order">
            <div className="space-y-4">
                <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
                <div>
                    <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700">Reason for Cancellation</label>
                    <select id="cancelReason" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="customer_request">Customer Request</option>
                        <option value="out_of_stock">Item Out of Stock</option>
                        <option value="address_issue">Address Issue</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="flex justify-end gap-4">
                    <Button onClick={onClose} variant="secondary">Keep Order</Button>
                    <Button onClick={handleConfirm} variant="danger">Confirm Cancellation</Button>
                </div>
            </div>
        </Modal>
    );
};

// --- Ship Order Modal ---
export const ShipOrderModal = ({ isOpen, onClose, onConfirm }) => {
    const [shippingInfo, setShippingInfo] = useState({ carrier: '', trackingNumber: '' });

    const handleChange = (e) => {
        setShippingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleConfirm = () => {
        if (!shippingInfo.carrier || !shippingInfo.trackingNumber) {
            alert("Please provide both a carrier and a tracking number.");
            return;
        }
        onConfirm(shippingInfo);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mark Order as Shipped">
            <div className="space-y-4">
                <p>Please enter the shipping details for this order.</p>
                <Input
                    label="Shipping Carrier"
                    name="carrier"
                    value={shippingInfo.carrier}
                    onChange={handleChange}
                    placeholder="e.g., Blue Dart, Delhivery"
                    required
                />
                <Input
                    label="Tracking Number"
                    name="trackingNumber"
                    value={shippingInfo.trackingNumber}
                    onChange={handleChange}
                    placeholder="e.g., 123456789XYZ"
                    required
                />
                <div className="flex justify-end gap-4">
                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm Shipment</Button>
                </div>
            </div>
        </Modal>
    );
};
