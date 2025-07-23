import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as userService from '../../services/userService';
import ProductCard from '../../components/products/ProductCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const WishlistPage = () => {
    const { user } = useAuth();
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await userService.getWishlist();
                setWishlistProducts(data);
            } catch (error) {
                toast.error("Could not fetch your wishlist.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [user?.wishlist]); // Re-fetch whenever the user's wishlist array changes

    if (isLoading) {
        return <Loader text="Loading your wishlist..." />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-desi-primary mb-6">My Wishlist</h1>
            {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <span className="text-5xl">❤️</span>
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">Your Wishlist is Empty</h2>
                    <p className="mt-2 text-gray-500">Looks like you haven't added any favorites yet. Explore our products to find something you love!</p>
                    <Link to="/products" className="mt-6 inline-block">
                        <Button>Start Exploring</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;