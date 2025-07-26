import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder, verifyPayment } from '../services/orderService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, cartTotal, clearCart, loading: cartLoading } = useCart();

    const [shippingAddress, setShippingAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
    });
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Pre-fill with the user's default address if it exists
        const defaultAddress = user?.addresses?.find(addr => addr.isDefault);
        if (defaultAddress) {
            setShippingAddress({
                addressLine1: defaultAddress.addressLine1 || '',
                addressLine2: defaultAddress.addressLine2 || '',
                city: defaultAddress.city || '',
                state: defaultAddress.state || '',
                postalCode: defaultAddress.postalCode || '',
                country: defaultAddress.country || 'India',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const displayRazorpay = (orderData) => {
        const { razorpayOrder, orderGroupId } = orderData;
        
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'Desi Etsy',
            description: `Order Group ID: ${orderGroupId}`,
            order_id: razorpayOrder.id,
            handler: async (response) => {
                setLoading(true);
                try {
                    const verificationData = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    
                    const result = await verifyPayment(verificationData);

                    if (result.success) {
                        clearCart();
                        toast.success('Payment successful!');
                        navigate(`/order-success/${result.data.orderGroupId}`);
                    } else {
                        toast.error(result.message || 'Payment verification failed.');
                        navigate('/order-failure');
                    }
                } catch (err) {
                    toast.error(err.message || 'An error occurred during payment verification.');
                } finally {
                    setLoading(false);
                }
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: {
                color: '#F59E0B', // Amber color
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
            toast.error(`Payment Failed: ${response.error.description}`);
            setLoading(false);
        });
        paymentObject.open();
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
            toast.error("Please fill in all required address fields.");
            return;
        }
        setLoading(true);

        try {
            const orderPayload = { shippingAddress, paymentMethod };
            const result = await createOrder(orderPayload);

            if (result.success) {
                if (paymentMethod === 'COD') {
                    clearCart();
                    toast.success('Order placed successfully!');
                    navigate(`/order-success/${result.data.orderGroupId}`);
                } else {
                    // Online payment: open Razorpay
                    displayRazorpay(result.data);
                }
            } else {
                toast.error(result.message || 'Failed to place order.');
            }
        } catch (err) {
            toast.error(err.message || 'An error occurred while placing the order.');
        } finally {
            if (paymentMethod === 'COD') {
               setLoading(false);
            }
        }
    };

    if (cartLoading) return <Loader text="Loading cart..." />;

    if (!cartLoading && cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Your cart is empty.</h2>
                <Button onClick={() => navigate('/products')} className="mt-4">Go Shopping</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {(loading) && <Loader />}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <form onSubmit={handlePlaceOrder}>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <input name="addressLine1" value={shippingAddress.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" required className="p-2 border rounded" />
                                <input name="addressLine2" value={shippingAddress.addressLine2} onChange={handleInputChange} placeholder="Address Line 2 (Optional)" className="p-2 border rounded" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input name="city" value={shippingAddress.city} onChange={handleInputChange} placeholder="City" required className="p-2 border rounded" />
                                    <input name="state" value={shippingAddress.state} onChange={handleInputChange} placeholder="State" required className="p-2 border rounded" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange} placeholder="Postal Code" required className="p-2 border rounded" />
                                    <input name="country" value={shippingAddress.country} onChange={handleInputChange} placeholder="Country" required className="p-2 border rounded" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                            <div className="space-y-2">
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-amber-50">
                                    <input type="radio" name="paymentMethod" value="Online" checked={paymentMethod === 'Online'} onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio h-5 w-5 text-amber-500" />
                                    <span className="ml-3 text-gray-700">Pay Online (Card, UPI, Netbanking)</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-amber-50">
                                    <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio h-5 w-5 text-amber-500" />
                                    <span className="ml-3 text-gray-700">Pay on Delivery</span>
                                </label>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Processing...' : `Place Order (₹${cartTotal.toFixed(2)})`}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.productId._id} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img src={item.productId.images[0]} alt={item.productId.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                        <div>
                                            <p className="font-semibold">{item.productId.name}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">₹{(item.productId.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
