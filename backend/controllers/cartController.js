import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// GET /api/cart - Get user's cart
export const getCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'cart.productId',
        model: 'Product',
        select: 'name price images stock'
    });
    res.status(200).json(new ApiResponse(200, user.cart, "Cart fetched successfully."));
});

// POST /api/cart - Add item to cart or update quantity
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
        user.cart[existingItemIndex].quantity += quantity;
    } else {
        user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json(new ApiResponse(200, user.cart, "Item added to cart."));
});

// PUT /api/cart/:productId - Update item quantity
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
        user.cart[itemIndex].quantity = quantity;
        await user.save();
        res.status(200).json(new ApiResponse(200, user.cart, "Cart updated."));
    } else {
        throw new ApiError(404, "Item not found in cart.");
    }
});

// DELETE /api/cart/:productId - Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { cart: { productId: productId } } },
        { new: true }
    );
    res.status(200).json(new ApiResponse(200, user.cart, "Item removed from cart."));
});

// POST /api/cart/merge - Merge guest cart with user cart on login
export const mergeCarts = asyncHandler(async (req, res) => {
    const { localCart } = req.body; // Expecting an array of { productId, quantity }
    const user = await User.findById(req.user._id);

    // ROBUST MERGE LOGIC
    for (const localItem of localCart) {
        const dbItemIndex = user.cart.findIndex(
            (dbItem) => dbItem.productId.toString() === localItem.productId
        );

        if (dbItemIndex > -1) {
            // Item exists in DB cart, so we add the quantities.
            user.cart[dbItemIndex].quantity += localItem.quantity;
        } else {
            // Item does not exist in DB cart, so we add it.
            user.cart.push(localItem);
        }
    }

    await user.save();
    
    // Repopulate to send back full product details for immediate UI update
    const populatedUser = await User.findById(req.user._id).populate({
        path: 'cart.productId',
        model: 'Product',
        select: 'name price images stock'
    });
    
    res.status(200).json(new ApiResponse(200, populatedUser.cart, "Carts merged successfully."));
});