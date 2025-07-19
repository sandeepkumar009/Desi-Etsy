import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllProducts, getAllCategories } from '../services/productService';
import ProductCard from "../components/products/ProductCard";
import Loader from "../components/common/Loader";

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch latest 8 products and all categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts({ limit: 8, sort: 'createdAt', order: 'desc' }),
          getAllCategories()
        ]);
        setProducts(productsData.products);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load homepage data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoize category images to avoid re-computation
  const categoriesWithImages = useMemo(() => {
    return categories.slice(0, 4).map(cat => {
      const productForImage = products.find(p => p.category._id === cat._id);
      return {
        ...cat,
        // Use the first image of the found product, or a placeholder
        imageUrl: productForImage?.images[0] || `https://placehold.co/400x400/FFF7ED/D97706?text=${cat.name}`
      };
    });
  }, [categories, products]);
  
  const featuredProducts = products.slice(0, 4);

  if (loading) {
    return <Loader />;
  }
  
  if (error) {
      return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      {/* Full-Screen Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-100 via-amber-50 to-white relative px-4">
        <motion.h1
          className="font-brand text-4xl md:text-6xl font-bold text-gray-800 mb-6 text-center drop-shadow-lg"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          custom={1}
        >
          Handmade with Love, From Artisans to You
        </motion.h1>
        <motion.p
          className="text-gray-600 text-lg md:text-2xl mb-8 text-center max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          custom={2}
        >
          Explore curated, handcrafted treasures for your home & soul.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          custom={3}
        >
          <button
            className="bg-orange-500 text-white px-10 py-4 rounded-xl font-brand text-lg md:text-xl shadow-lg hover:bg-orange-600 transition-colors duration-200 scale-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 mt-6"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </motion.div>
      </section>

      {/* Shop by Category Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <motion.h2
          className="font-brand text-3xl font-bold text-gray-800 mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Shop by Category
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categoriesWithImages.map((cat, i) => (
            <motion.div
              key={cat._id}
              className="rounded-xl shadow-lg overflow-hidden bg-white flex flex-col items-center p-6 cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: 'easeOut' }}
              onClick={() => navigate(`/products?category=${cat._id}`)}
            >
              <img src={cat.imageUrl} alt={cat.name} className="h-24 w-24 object-cover rounded-full mb-4 border-4 border-amber-200 group-hover:border-orange-500 transition-all duration-300" />
              <span className="font-semibold text-gray-800 text-lg mt-2 font-brand tracking-wide">{cat.name}</span>
            </motion.div>
          ))}
        </motion.div>
        {categories.length > 4 && (
          <div className="flex justify-center mt-12">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-brand font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200"
              onClick={() => navigate('/products')}
            >
              View All Categories
            </button>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-12 px-4"
      >
        <h2 className="font-brand text-3xl font-bold text-gray-800 mb-8 text-center">Newest Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-brand font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200"
            onClick={() => navigate('/products')}
          >
            Explore All Products
          </button>
        </div>
      </motion.section>
      
    </div>
  );
};

export default Home;
