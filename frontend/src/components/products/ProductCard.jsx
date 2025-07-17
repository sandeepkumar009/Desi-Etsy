import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 cursor-pointer"
    >
      <Link to={`/products/${product._id}`} className="block h-full">
        <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex flex-col gap-1">
          {product.tag && (
            <span className="text-xs text-white bg-desi-accent px-2 py-0.5 rounded-full mb-1 w-fit">{product.tag}</span>
          )}
          <span className="text-xs text-desi-accent font-medium mb-1">{product.category}</span>
          <h3 className="font-semibold text-lg text-desi-primary truncate">{product.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-desi-primary font-bold text-base">₹{product.price}</span>
            <span className="ml-auto flex items-center gap-0.5 text-yellow-400">
              {/* Static 5-star rating placeholder */}
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
              ))}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 