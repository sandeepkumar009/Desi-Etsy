import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetails } from '../services/productService';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [personalization, setPersonalization] = useState('');

  // All hooks must be before any return or conditional
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, text: '', image: null });
  const [expandedReviews, setExpandedReviews] = useState([]);

  useEffect(() => {
    setLoading(true);
    getProductDetails(id).then((data) => {
      setProduct(data);
      setSelectedVariant(data?.variants?.[0] || '');
      setLoading(false);
    });
  }, [id]);

  if (loading || !product) return <Loader />;

  // Demo reviews per product
  const demoReviewsMap = {
    1: [
      { name: 'Aarav S.', rating: 5, text: 'Absolutely loved the craftsmanship! The product exceeded my expectations and the packaging was beautiful.', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=thumb&w=80&q=80' },
      { name: 'Priya K.', rating: 4, text: 'Very nice and unique. Delivery was quick and the seller was responsive.', image: '' },
      { name: 'Rohan M.', rating: 4, text: 'Good quality, but the color was slightly different than shown. Still happy with my purchase.', image: '' },
      { name: 'Simran L.', rating: 5, text: 'Handmade touch is evident. Will buy again for gifts!', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=thumb&w=80&q=80' },
    ],
    2: [
      { name: 'Meera P.', rating: 5, text: 'The scarf is so soft and the print is beautiful. Got many compliments!', image: '' },
      { name: 'Vikram T.', rating: 3, text: 'Nice product but shipping took longer than expected.', image: '' },
      { name: 'Sana R.', rating: 4, text: 'Colors are vibrant and material is good. Would recommend.', image: '' },
      { name: 'Ritu J.', rating: 5, text: 'Perfect for gifting. My mom loved it!', image: '' },
    ],
  };
  const reviews = demoReviewsMap[product.id] || demoReviewsMap[1];
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  const handleExpand = idx => {
    setExpandedReviews(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleAddReview = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewFormChange = e => {
    const { name, value, files } = e.target;
    setReviewForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleReviewSubmit = e => {
    e.preventDefault();
    // Demo: just close modal and reset form
    setShowReviewModal(false);
    setReviewForm({ rating: 0, text: '', image: null });
    // In real app, would POST to backend
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-8 min-h-screen bg-gray-50 font-poppins"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col gap-4 items-center">
          <div className="aspect-square w-full max-w-xs bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={product.image} alt={product.title} className="object-cover w-full h-full" />
          </div>
          {/* Gallery thumbnails (demo) */}
          <div className="flex gap-2 mt-2 overflow-x-auto">
            <img src={product.image} alt="thumb-main" className="w-12 h-12 rounded border object-cover" />
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=thumb&w=80&q=80" alt="thumb-demo1" className="w-12 h-12 rounded border object-cover" />
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=thumb&w=80&q=80" alt="thumb-demo2" className="w-12 h-12 rounded border object-cover" />
          </div>
        </div>
        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-4">
          <span className="text-xs text-desi-accent font-medium">{product.category}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-desi-primary mb-2">{product.title}</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
              ))}
            </span>
            <span className="text-sm text-gray-500">({product.rating || '4.5'})</span>
          </div>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <div className="text-2xl font-bold text-desi-primary mb-2">₹{product.price}</div>
          <div className="text-sm text-gray-500 mb-2">Stock: {product.stock}</div>
          {/* Personalization input (optional) */}
          <input
            type="text"
            placeholder="Add personalization (optional)"
            value={personalization}
            onChange={e => setPersonalization(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-2 focus:outline-desi-accent"
          />
          {/* Variant select */}
          {product.variants && product.variants.length > 0 && (
            <select
              value={selectedVariant}
              onChange={e => setSelectedVariant(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-2 focus:outline-desi-accent"
            >
              {product.variants.map((variant, idx) => (
                <option key={idx} value={variant}>{variant}</option>
              ))}
            </select>
          )}
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <button
              aria-label="Add to Cart"
              className="rounded-full px-6 py-3 bg-blue-500 text-white hover:scale-[1.02] transition-all font-semibold w-full md:w-auto"
              onClick={() => {}}
            >
              Add to Cart
            </button>
            <button
              aria-label="Buy Now"
              className="rounded-full px-6 py-3 bg-blue-500 text-white hover:scale-[1.02] transition-all font-semibold w-full md:w-auto"
              onClick={() => alert('Buy Now clicked!')}
            >
              Buy Now
            </button>
          </div>
          {/* Highlights */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-100 rounded-lg p-3">
              <span className="font-semibold">Artisan:</span> {product.artisan}
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <span className="font-semibold">Material:</span> {product.material}
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <span className="font-semibold">Shipping:</span> {product.shipping}
            </div>
          </div>
        </div>
      </div>
      {/* Customer Reviews Section */}
      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-md p-6 md:p-10">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        <div className="flex items-center gap-2 mb-6">
          <span className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400' : 'fill-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
            ))}
          </span>
          <span className="text-gray-700 font-medium ml-2">{avgRating} out of 5</span>
          <span className="text-gray-500 ml-2">({totalReviews} reviews)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => {
            const isExpanded = expandedReviews.includes(idx);
            const shortText = review.text.length > 80 && !isExpanded ? review.text.slice(0, 80) + '...' : review.text;
            return (
              <div key={idx} className="bg-gray-50 rounded-md p-4 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-desi-primary">{review.name}</span>
                  <span className="flex items-center text-yellow-400 ml-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400' : 'fill-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    ))}
                  </span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {shortText}
                  {review.text.length > 80 && (
                    <button className="text-blue-500 ml-1 text-xs underline" onClick={() => handleExpand(idx)}>
                      {isExpanded ? 'See less' : 'See more'}
                    </button>
                  )}
                </p>
                {review.image && (
                  <img src={review.image} alt="review" className="w-16 h-16 rounded-md object-cover mt-2" />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleAddReview} className="rounded-full px-6 py-3" variant="primary">
            Add a Review
          </Button>
        </div>
        <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Add a Review">
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <button type="button" key={star} onClick={() => setReviewForm(f => ({ ...f, rating: star }))}>
                    <svg className={`w-7 h-7 ${reviewForm.rating >= star ? 'fill-yellow-400' : 'fill-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Your Review"
              name="text"
              value={reviewForm.text}
              onChange={handleReviewFormChange}
              placeholder="Write your review..."
              required
              className=""
            />
            <div>
              <label className="block mb-1 font-medium">Upload Image (optional)</label>
              <input type="file" name="image" accept="image/*" onChange={handleReviewFormChange} />
            </div>
            <Button type="submit" variant="primary" className="mt-2">Submit Review</Button>
          </form>
        </Modal>
      </div>
    </motion.div>
  );
};

export default ProductDetail; 