import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const CartPanel = () => {
    const { isCartOpen, setIsCartOpen, cartItems, cartTotal, cartCount } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Shopping Cart ({cartCount})</h2>
                            <button onClick={() => setIsCartOpen(false)} className="text-2xl">&times;</button>
                        </div>

                        {cartItems.length > 0 ? (
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.productId._id} className="flex gap-4">
                                        <img src={item.productId.images[0]} alt={item.productId.name} className="w-20 h-20 rounded-md object-cover" />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.productId.name}</h3>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">₹{(item.productId.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center text-center">
                                <p className="text-lg text-gray-600">Your cart is empty.</p>
                            </div>
                        )}

                        <div className="p-4 border-t space-y-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <Link to="/cart">
                                <Button variant="secondary" onClick={() => setIsCartOpen(false)}>View Cart</Button>
                            </Link>
                             <Link to="/checkout">
                                <Button onClick={() => setIsCartOpen(false)}>Proceed to Checkout</Button>
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartPanel;