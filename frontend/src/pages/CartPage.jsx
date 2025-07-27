import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

// ICONS
const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const MinusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>;
const TrashIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount, loading } = useCart();

    if (loading) {
        return <Loader text="Loading your cart..." />;
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-desi-primary mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-desi-primary mb-8">Your Shopping Cart</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map(item => (
                        <div key={item.productId._id} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
                            <img src={item.productId.images[0]} alt={item.productId.name} className="w-24 h-24 rounded-md object-cover" />
                            <div className="flex-grow">
                                <Link to={`/products/${item.productId._id}`} className="font-semibold text-lg hover:text-orange-600">{item.productId.name}</Link>
                                <p className="text-gray-500">Price: ₹{item.productId.price.toLocaleString('en-IN')}</p>
                                <button onClick={() => removeFromCart(item.productId._id)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 mt-2">
                                    <TrashIcon /> Remove
                                </button>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center border rounded-full">
                                    <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-l-full"><MinusIcon /></button>
                                    <span className="px-4 font-semibold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)} className="p-2 hover:bg-gray-100 rounded-r-full"><PlusIcon /></button>
                                </div>
                                <p className="font-bold text-lg">₹{(item.productId.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="p-6 border rounded-lg shadow-sm bg-gray-50 sticky top-28">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal ({cartCount} items)</span>
                                <span className="font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
                            <span>Total</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <Link to="/checkout" className="mt-6 block">
                           <Button className="w-full">Proceed to Checkout</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;