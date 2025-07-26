import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productService from '../../services/productService';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import OrderStatusTracker from './OrderStatusTracker';

// Star Rating Component
const StarRating = ({ rating, setRating, interactive = false }) => (
    <div className={`flex gap-1 ${interactive ? 'cursor-pointer' : ''}`}>
        {[...Array(5)].map((_, i) => (
            <svg key={i} onClick={() => interactive && setRating(i + 1)} className={`w-6 h-6 transition-colors ${i < rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-300' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
        ))}
    </div>
);

// Review Modal Component
const ReviewModal = ({ isOpen, onClose, product, existingReview, onSubmitSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setRating(existingReview?.rating || 0);
        setComment(existingReview?.comment || '');
    }, [existingReview, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }
        setIsSubmitting(true);
        try {
            const reviewData = { rating, comment };
            const updatedReview = existingReview?._id
                ? await productService.updateReview(existingReview._id, reviewData)
                : await productService.submitReview(product.productId._id, reviewData);
            
            toast.success(`Review ${existingReview ? 'updated' : 'submitted'} successfully!`);
            onSubmitSuccess(updatedReview);
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingReview ? `Edit Review for ${product?.name}` : `Review ${product?.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <StarRating rating={rating} setRating={setRating} interactive={true} />
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment</label>
                    <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" placeholder="Tell others what you think..."></textarea>
                </div>
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Review'}</Button>
                </div>
            </form>
        </Modal>
    );
};

// Component to handle review logic for a single item
const OrderItemReview = ({ item, onReviewUpdate }) => {
    const [review, setReview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchReview = async () => {
            const existingReview = await productService.getUserReviewForProduct(item.productId._id);
            setReview(existingReview);
        };
        fetchReview();
    }, [item.productId._id]);
    
    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                {review ? '⭐ Edit Review' : '⭐ Write a Review'}
            </Button>
            <ReviewModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                product={item}
                existingReview={review}
                onSubmitSuccess={(updatedReview) => {
                    setReview(updatedReview); 
                    onReviewUpdate(updatedReview); 
                }}
            />
        </>
    );
};

const OrderDetail = ({ order, onReviewUpdate }) => {
    if (!order || !order.items) {
        return <Loader text="Loading order details..." />;
    }

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <OrderStatusTracker history={order.statusHistory} currentStatus={order.status} />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                        <address className="not-italic text-gray-700 bg-gray-50 p-4 rounded-lg border">
                            {order.shippingAddress.addressLine1}<br />
                            {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
                            {order.shippingAddress.country}
                        </address>
                    </div>
                     <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg border">
                            <div className="flex justify-between text-gray-700"><span>Subtotal</span><span>₹{order.totalAmount.toLocaleString('en-IN')}</span></div>
                             <div className="flex justify-between text-gray-700"><span>Shipping</span><span>FREE</span></div>
                             <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2 mt-2"><span>Total</span><span>₹{order.totalAmount.toLocaleString('en-IN')}</span></div>
                        </div>
                     </div>
                </div>
            </div>

            {/* Items List section remains below */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Items in this Order</h2>
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                                <div>
                                    <Link to={`/products/${item.productId._id}`} className="font-semibold text-gray-800 hover:text-orange-600">{item.name}</Link>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            {order.status === 'delivered' && <OrderItemReview item={item} onReviewUpdate={onReviewUpdate} />}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default OrderDetail;