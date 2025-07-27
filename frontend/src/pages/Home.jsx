import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllProducts, getAllCategories } from '../services/productService';
import ProductCard from "../components/products/ProductCard";
import Loader from "../components/common/Loader";
import hero1 from '/assets/hero1.png';
import hero2 from '/assets/hero2.png';
import hero3 from '/assets/hero3.png';
const sliderImages = [hero1, hero2, hero3];

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect for background image slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearTimeout(timer);
  }, [currentImageIndex]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      {/* Full-Screen Hero Section with Background Slider */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-4 overflow-hidden">
        {/* Background Image Slider */}
        <AnimatePresence>
            <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{
                    backgroundImage: `url(${sliderImages[currentImageIndex]})`,
                }}
                className="absolute inset-0 w-full h-full bg-cover bg-center"
            />
        </AnimatePresence>
        
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Hero Content - positioned above the background */}
        <div className="relative z-10 text-center">
            <motion.h1
              className="font-brand text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl"
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              custom={1}
            >
              Handmade with Love, From Artisans to You
            </motion.h1>
            <motion.p
              className="text-gray-200 text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-xl"
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
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <motion.h2
          className="font-brand text-3xl font-bold text-desi-primary mb-10 text-center"
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
        <h2 className="font-brand text-3xl font-bold text-desi-primary mb-8 text-center">Newest Arrivals</h2>
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
