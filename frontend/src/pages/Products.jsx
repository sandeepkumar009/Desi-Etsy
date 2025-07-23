import { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- COMPONENTS ---
const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="aspect-square w-full bg-gray-200"></div>
        <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
);

// --- MODIFIED: Smart Pagination Component ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Max buttons to show (e.g., 1 ... 4 5 6 ... 10)
        const ellipsis = '...';

        if (totalPages <= maxPagesToShow + 2) {
            // If total pages is small, show all numbers
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1); // Always show first page

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                startPage = 2;
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }

            if (startPage > 2) {
                pageNumbers.push(ellipsis);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push(ellipsis);
            }

            pageNumbers.push(totalPages); // Always show last page
        }
        return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-12">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 sm:px-4 bg-white border border-gray-300 rounded-lg disabled:opacity-50 text-sm sm:text-base">&laquo;</button>
            {pageNumbers.map((num, index) => (
                <button 
                    key={`${num}-${index}`} 
                    onClick={() => typeof num === 'number' && onPageChange(num)} 
                    disabled={typeof num !== 'number'}
                    className={`px-3 py-2 sm:px-4 border rounded-lg text-sm sm:text-base ${
                        currentPage === num 
                        ? 'bg-orange-500 text-white border-orange-500' 
                        : 'bg-white border-gray-300'
                    } ${typeof num !== 'number' ? 'cursor-default' : ''}`}
                >
                    {num}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 sm:px-4 bg-white border border-gray-300 rounded-lg disabled:opacity-50 text-sm sm:text-base">&raquo;</button>
        </div>
    );
};


const FilterSidebar = ({ filters, setFilters, categories, isMobile, onClose }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handleRatingChange = (newRating) => {
        setFilters(prev => ({ ...prev, rating: prev.rating === newRating ? 0 : newRating, page: 1 }));
    };
    
    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            rating: 0,
            sort: 'createdAt-desc',
            page: 1,
        });
    }

    const filterContent = (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
                <button onClick={clearFilters} className="text-sm font-medium text-orange-600 hover:text-orange-800">Clear All</button>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">Category</label>
                <select name="category" value={filters.category} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500">
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                    <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                    <span>-</span>
                    <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">Rating</label>
                <div className="flex space-x-1">
                    {[4, 3, 2, 1].map(star => (
                        <button key={star} onClick={() => handleRatingChange(star)} className={`w-full p-2 border rounded-lg text-sm ${filters.rating === star ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-300'}`}>
                            {star}+ ★
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'tween', ease: 'easeInOut' }}
                    className="fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl z-50"
                >
                    <div className="flex justify-end p-4">
                        <button onClick={onClose}><XIcon /></button>
                    </div>
                    {filterContent}
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <aside className="w-full md:w-72 lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm border p-2">
                {filterContent}
            </div>
        </aside>
    );
};

// --- MAIN PAGE COMPONENT ---
const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        rating: Number(searchParams.get('rating')) || 0,
        sort: searchParams.get('sort') || 'createdAt-desc',
        page: Number(searchParams.get('page')) || 1,
    });
    
    // --- MODIFIED: This effect now ONLY reacts to external search/category changes ---
    const searchFromUrl = searchParams.get('search') || '';
    const categoryFromUrl = searchParams.get('category') || '';

    useEffect(() => {
        // This effect syncs the state if the user performs a new search from the navbar
        // It now correctly resets the page to 1 ONLY for a new search/category filter
        setFilters(prevFilters => ({
            ...prevFilters,
            search: searchFromUrl,
            category: categoryFromUrl,
            page: 1 
        }));
    }, [searchFromUrl, categoryFromUrl]);


    const fetchProductsAndCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (categories.length === 0) {
                const categoriesData = await getAllCategories();
                setCategories(categoriesData);
            }
            
            const productsData = await getAllProducts({
                page: filters.page,
                limit: 12,
                search: filters.search,
                category: filters.category,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                rating: filters.rating,
                sort: filters.sort.split('-')[0],
                order: filters.sort.split('-')[1],
            });

            setProducts(productsData.products);
            setPagination(productsData.pagination);
            
        } catch (err) {
            setError('Failed to fetch data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters, categories.length]);

    useEffect(() => {
        fetchProductsAndCategories();
    }, [fetchProductsAndCategories]);

    useEffect(() => {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.rating) params.rating = String(filters.rating);
        if (filters.sort !== 'createdAt-desc') params.sort = filters.sort;
        if (filters.page > 1) params.page = String(filters.page);
        
        setSearchParams(params, { replace: true });
    }, [filters, setSearchParams]);
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
            window.scrollTo(0, 0);
        }
    };

    const handleSortChange = (e) => {
        setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }));
    };
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 font-brand">Our Treasures</h1>
                    <p className="mt-2 text-lg text-gray-600">Discover authentic handmade products from talented artisans.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="hidden md:block">
                        <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} />
                    </div>

                    <main className="flex-1">
                        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm border mb-6 gap-4">
                            <div className="text-sm text-gray-600 font-medium">
                                {loading ? 'Loading...' : `Showing ${products.length} of ${pagination.totalProducts || 0} products`}
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button onClick={() => setIsFilterOpen(true)} className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-semibold">
                                    <FilterIcon /> Filters
                                </button>
                                <select value={filters.sort} onChange={handleSortChange} className="p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 font-semibold text-sm">
                                    <option value="createdAt-desc">Newest</option>
                                    <option value="ratingsAverage-desc">Top Rated</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
                        
                        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {loading ? (
                                Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : products.length > 0 ? (
                                <AnimatePresence>
                                    {products.map(product => <ProductCard key={product._id} product={product} />)}
                                </AnimatePresence>
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <h3 className="text-2xl font-semibold text-gray-700">No Products Found</h3>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                                </div>
                            )}
                        </motion.div>

                        {!loading && products.length > 0 && (
                            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                        )}
                    </main>
                </div>
            </div>
            
            {isFilterOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsFilterOpen(false)}></div>}
            {isFilterOpen && <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} isMobile={true} onClose={() => setIsFilterOpen(false)} />}
        </div>
    );
};

export default Products;
