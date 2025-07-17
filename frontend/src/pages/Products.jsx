import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getApprovedProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';

const PRODUCTS_PER_PAGE = 6;

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getApprovedProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Pre-select category if passed from navigation
  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  // Filter products by category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-8 min-h-screen bg-gray-50 font-poppins"
    >
      {/* Dropdown Category Menu */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-semibold flex items-center gap-2 hover:bg-gray-100"
          >
            <span>Categories</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-desi-primary/10 ${selectedCategory === cat ? 'bg-desi-primary/10 font-bold' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-lg font-semibold text-desi-primary">{selectedCategory}</span>
      </div>

      {/* Horizontal Scrollable Category Bar */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar whitespace-nowrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex flex-col items-center min-w-[120px] px-6 py-2 rounded-lg font-brand font-semibold text-lg transition-all duration-200 whitespace-nowrap shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 scale-100 active:scale-95 mx-1
              ${selectedCategory === cat
                ? 'bg-orange-300 text-white hover:bg-orange-400 focus:ring-orange-400'
                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-400'}
              ${selectedCategory === cat ? 'hover:scale-105' : ''}
            `}
            style={{ outline: selectedCategory === cat ? '2px solid #f59e42' : 'none', maxWidth: 180 }}
          >
            <span className="truncate w-full">{cat}</span>
          </button>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-desi-primary mb-8 text-center">All Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg">
            {/* Previous Button */}
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1 transition-all duration-150
                ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-orange-400 hover:bg-orange-50 hover:text-orange-500'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              <span className="hidden sm:inline">Previous</span>
            </button>
            {/* Page Numbers with Ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num, idx, arr) => {
              if (
                num === 1 ||
                num === totalPages ||
                Math.abs(num - page) <= 1
              ) {
                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-2 rounded-lg font-semibold border transition-all duration-150 mx-0.5
                      ${page === num
                        ? 'bg-orange-400 text-white shadow border-orange-400 scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50 hover:text-orange-500'}
                    `}
                    style={{ minWidth: 40 }}
                  >
                    {num}
                  </button>
                );
              }
              if (
                (num === page - 2 && num > 1) ||
                (num === page + 2 && num < totalPages)
              ) {
                return (
                  <span key={num} className="px-2 text-xl text-gray-300 select-none">…</span>
                );
              }
              return null;
            })}
            {/* Next Button */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1 transition-all duration-150
                ${page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-orange-400 hover:bg-orange-50 hover:text-orange-500'}`}
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </nav>
        </div>
      )}
    </motion.div>
  );
};

export default Products; 