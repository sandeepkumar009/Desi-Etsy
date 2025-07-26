import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const initializeCart = async () => {
            setLoading(true);
            const localCartString = localStorage.getItem('cart');
            const localCart = localCartString ? JSON.parse(localCartString) : [];

            if (user) {
                try {
                    let finalCart;
                    if (localCart.length > 0) {
                        localStorage.removeItem('cart');
                        const cartToMerge = localCart.map(item => ({
                            productId: item.productId._id,
                            quantity: item.quantity
                        }));
                        finalCart = await cartService.mergeCarts(cartToMerge);
                    } else {
                        finalCart = await cartService.getCart();
                    }
                    setCartItems(finalCart);
                } catch (error) {
                    toast.error("Could not sync your cart. Please refresh the page.");
                    setCartItems(localCart);
                }
            } else {
                setCartItems(localCart);
            }
            setLoading(false);
        };
        initializeCart();
    }, [user]);

    const addToCart = async (product, quantity) => {
        let updatedCart;
        const productId = product._id;
        const existingItem = cartItems.find(i => (i.productId._id || i.productId) === productId);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            updatedCart = cartItems.map(i => ((i.productId._id || i.productId) === productId) ? { ...i, quantity: newQuantity } : i);
        } else {
            const newItem = { productId: product, quantity };
            updatedCart = [...cartItems, newItem];
        }

        setCartItems(updatedCart);
        toast.success(`${product.name} added to cart!`);

        if (user) {
            try {
                await cartService.addToCart(productId, quantity);
            } catch (error) {
                toast.error("Failed to sync cart with server.");
            }
        } else {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = cartItems.map(item =>
            (item.productId._id || item.productId) === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);

        if (user) {
            await cartService.updateCartItemQuantity(productId, newQuantity);
        } else {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const removeFromCart = async (productId) => {
        const updatedCart = cartItems.filter(item => (item.productId._id || item.productId) !== productId);
        setCartItems(updatedCart);
        toast.info("Item removed from cart.");

        if (user) {
            await cartService.removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const clearCart = () => {
        setCartItems([]);
        if (!user) {
            localStorage.removeItem('cart');
        }
    };

    const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
    const cartTotal = useMemo(() => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((acc, item) => {
            const price = item.productId?.price || 0;
            return acc + (price * item.quantity);
        }, 0);
    }, [cartItems]);

    const value = { cartItems, isCartOpen, setIsCartOpen, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal, loading };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
