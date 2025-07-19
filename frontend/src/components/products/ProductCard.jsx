import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StarRating = ({ rating, ratingCount }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      ))}
      {halfStar && (
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.196-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.28 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
         <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      ))}
      {ratingCount > 0 && <span className="text-xs text-gray-500 ml-1">({ratingCount})</span>}
    </div>
  );
};


const ProductCard = ({ product }) => {
  // Use the first image as the primary image for the card
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x600/F7FAFC/E2E8F0?text=No+Image';

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/products/${product._id}`} className="h-full flex flex-col">
        <div className="aspect-square w-full bg-gray-100 overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x600/F7FAFC/E2E8F0?text=Image+Error'; }}
          />
        </div>
        <div className="p-4 flex flex-col gap-2 flex-grow">
          <span className="text-xs text-orange-600 font-semibold mb-1 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</span>
          <h3 className="font-semibold text-base text-gray-800 truncate flex-grow" title={product.name}>{product.name}</h3>
          
          <div className="flex items-center mt-2">
            <StarRating rating={product.ratingsAverage} ratingCount={product.ratingsQuantity} />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-gray-800 font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</span>
            {/* You could add a discounted price here if applicable */}
            {/* <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span> */}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
