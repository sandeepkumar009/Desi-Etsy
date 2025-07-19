import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductDetails, getReviewsForProduct, submitReview, updateReview, getAllProducts, checkUserPurchase } from '../services/productService';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';

// --- ICONS ---
const StarIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const MinusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>;

// --- Star Rating Component ---
const StarRating = ({ rating, setRating, interactive = false }) => (
    <div className={`flex gap-1 ${interactive ? 'cursor-pointer' : ''}`}>
        {[...Array(5)].map((_, i) => (
            <StarIcon
                key={i}
                className={`w-5 h-5 transition-colors ${i < rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-300' : ''}`}
                onClick={() => interactive && setRating(i + 1)}
            />
        ))}
    </div>
);

const ReviewForm = ({ productId, existingReview, onReviewSubmitted }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
        }
    }, [existingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (!user) {
            navigate('/login');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            if (existingReview) {
                // Update existing review
                await updateReview(existingReview._id, { rating, comment });
            } else {
                // Create new review
                await submitReview(productId, { rating, comment });
            }
            setRating(0);
            setComment('');
            onReviewSubmitted(); // Callback to refresh reviews list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{existingReview ? 'Edit Your Review' : 'Leave a Review'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                    <StarRating rating={rating} setRating={setRating} interactive={true} />
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment</label>
                    <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" placeholder="Tell us what you think..."></textarea>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
                </Button>
            </form>
        </div>
    );
};


const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    
    const [hasPurchased, setHasPurchased] = useState(false);

    const userReview = useMemo(() => {
        if (!user) return null;
        return reviews.find(review => review.userId._id === user._id);
    }, [reviews, user]);

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const productData = await getProductDetails(id);
            setProduct(productData);
            
            const [reviewsData, recommendedData, purchaseStatus] = await Promise.all([
                getReviewsForProduct(id),
                getAllProducts({ category: productData.category._id, limit: 5 }),
                checkUserPurchase(id)
            ]);
            
            setReviews(reviewsData);
            setRecommended(recommendedData.products.filter(p => p._id !== id));
            setHasPurchased(purchaseStatus);

        } catch (err) {
            setError('Failed to load product details. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);
    
    const handleAddToCart = () => {
        console.log({ productId: product._id, quantity, user: user?._id });
        alert(`${quantity} x ${product.name} added to cart!`);
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    const renderReviewSection = () => {
        if (!user) {
            return <p className="text-sm text-gray-600">Please <Link to="/login" className="text-orange-600 font-semibold hover:underline">log in</Link> to leave a review.</p>;
        }
        if (hasPurchased) {
            return <ReviewForm productId={id} existingReview={userReview} onReviewSubmitted={fetchAllData} />;
        }
        return <p className="text-sm text-gray-600">You must purchase this item to leave a review.</p>;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                            <img src={product.images[selectedImage]} alt={`${product.name} view ${selectedImage + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((img, index) => (
                                <button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-orange-500' : 'border-transparent'}`}>
                                    <img src={img} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <Link to={`/products?category=${product.category._id}`} className="text-sm font-semibold text-orange-600 uppercase tracking-wider hover:underline">{product.category.name}</Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
                        {product.artisanId.artisanProfile?.brandName && <p className="text-md text-gray-500 font-semibold mt-1">Brand: {product.artisanId.artisanProfile.brandName}</p>}
                        
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center">
                                <StarRating rating={product.ratingsAverage} />
                                <span className="ml-2 text-sm text-gray-600">({product.ratingsQuantity} reviews)</span>
                            </div>
                            <div className="w-px h-5 bg-gray-300"></div>
                            <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                        </div>
                        
                        <p className="text-gray-700 mt-4 text-lg">{product.description}</p>
                        
                        <div className="text-4xl font-extrabold text-gray-900 my-6">₹{product.price.toLocaleString('en-IN')}</div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-full">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-full"><MinusIcon /></button>
                                <span className="px-4 font-semibold">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-full"><PlusIcon /></button>
                            </div>
                            <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1" variant="primary">Add to Cart</Button>
                        </div>
                        <Button onClick={() => alert("Redirecting to checkout...")} disabled={product.stock === 0} className="mt-4 w-full" variant="secondary">Buy Now</Button>
                        
                        {/* Artisan Info */}
                        <div className="mt-8 p-4 bg-gray-100 rounded-lg flex items-center gap-4">
                             <img src={product.artisanId.profilePicture || 'https://i.pravatar.cc/150'} alt={product.artisanId.name} className="w-12 h-12 rounded-full object-cover" />
                             <div>
                                 <p className="text-sm text-gray-600">Sold by</p>
                                 <Link to={`/artisan/${product.artisanId._id}`} className="font-bold text-gray-800 hover:underline">{product.artisanId.name}</Link>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 pt-10 border-t">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Review Form Container */}
                        {renderReviewSection()}
                        
                        {/* Review List */}
                        <div className="space-y-6">
                            {reviews.length > 0 ? reviews.map(review => (
                                <div key={review._id} className="pb-6 border-b last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <img src={review.userId.profilePicture || 'https://i.pravatar.cc/150'} alt={review.userId.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{review.userId.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <StarRating rating={review.rating} />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-gray-700">{review.comment}</p>
                                </div>
                            )) : <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>}
                        </div>
                    </div>
                </div>

                {/* You Might Also Like */}
                {recommended.length > 0 && (
                    <div className="mt-16 pt-10 border-t">
                         <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {recommended.map(recProduct => (
                                <ProductCard key={recProduct._id} product={recProduct} />
                            ))}
                         </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductDetail;
