import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getAllCategories } from '../../services/productService';

// MOCK HOOKS for features not yet implemented
const useNotifications = () => ({ notificationCount: 5 });
const useCart = () => ({ cartItemCount: 3 });
// END MOCK HOOKS


// Helper Hook for clicking outside an element
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};


// Sub-components for Readability
const NavLink = ({ to, children, className = '' }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link 
            to={to} 
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                isActive 
                ? 'bg-orange-100 text-orange-600' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-orange-600'
            } ${className}`}
        >
            {children}
        </Link>
    );
};

const AuthDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setIsOpen(false));
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate('/');
  };

  if (!user) {
    return (
      <Link to="/login">
        <button className="px-5 py-2 rounded-xl bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors duration-200 shadow">
          Login
        </button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 transition-colors">
        <img
          src={user.profilePicture || 'https://i.pravatar.cc/150'}
          alt="Profile"
          className="h-9 w-9 rounded-full border-2 border-orange-300 object-cover"
        />
        <span className="hidden font-semibold text-sm text-gray-700 pr-2 sm:block">
            {user.name.split(' ')[0]}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-2 z-50 border"
          >
            <div className="px-4 py-2 border-b">
              <p className="font-bold text-desi-primary">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link to="/dashboard/profile" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">My Account</Link>
              <Link to="/dashboard/orders" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">My Orders</Link>
              <Link to="/dashboard/wishlist" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Wishlist</Link>
              
              {user.role === 'customer' && (
                <Link to="/apply-artisan" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Become a Seller</Link>
              )}
              {user.role === 'artisan' && (
                 <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Seller Dashboard</Link>
              )}
               {user.role === 'admin' && (
                 <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Admin Panel</Link>
              )}
            </div>
            <div className="border-t pt-1">
              <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 rounded">
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenu = ({ isOpen, setIsOpen, user, onLogout }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        onLogout();
        setIsOpen(false);
        navigate('/');
    };

    useEffect(() => {
        if (isOpen) {
            document.documentElement.classList.add('overflow-hidden');
        } else {
            document.documentElement.classList.remove('overflow-hidden');
        }
        return () => {
            document.documentElement.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl z-50 md:hidden"
                >
                    <div className="flex flex-col p-6">
                        <button onClick={() => setIsOpen(false)} className="self-end mb-6 text-3xl text-gray-500">&times;</button>
                        <Link to="/" onClick={() => setIsOpen(false)} className="py-3 text-lg font-medium text-desi-secondary hover:text-desi-primary">Home</Link>
                        <Link to="/products" onClick={() => setIsOpen(false)} className="py-3 text-lg font-medium text-desi-secondary hover:text-desi-primary">Products</Link>
                        
                        {user && user.role === 'artisan' ? (
                            <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="py-3 text-lg font-medium text-desi-secondary hover:text-desi-primary">Seller Dashboard</Link>
                        ) : (
                            <Link to="/apply-artisan" onClick={() => setIsOpen(false)} className="py-3 text-lg font-medium text-desi-secondary hover:text-desi-primary">Become a Seller</Link>
                        )}

                        <hr className="my-4"/>
                        {user ? (
                            <>
                                <Link to="/dashboard/profile" onClick={() => setIsOpen(false)} className="py-3 text-lg font-medium text-desi-secondary hover:text-desi-primary">My Profile</Link>
                                <Link to="/dashboard/orders" onClick={() => setIsOpen(false)} className="py-3 text-lg font-medium text-desi-secondary hover:text-desi-primary">My Orders</Link>
                                <button onClick={handleLogout} className="py-3 text-lg font-medium text-red-600 text-left">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="mt-4 w-full text-center px-5 py-3 rounded-xl bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors duration-200 shadow">Login / Sign Up</Link>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const UniversalSearch = ({ isMobile = false }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ id: '', name: 'All' });
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const categoryDropdownRef = useRef(null);
    const navigate = useNavigate();
    useOutsideClick(categoryDropdownRef, () => setIsCategoryOpen(false));

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getAllCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Failed to fetch categories for search bar", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // **FIX**: Navigate using URL search parameters for robust filtering
        const params = new URLSearchParams();
        if (searchTerm) {
            params.set('search', searchTerm);
        }
        if (selectedCategory.id) {
            params.set('category', selectedCategory.id);
        }
        navigate(`/products?${params.toString()}`);
    };

    return (
        <div className="relative w-full">
            <form onSubmit={handleSubmit}>
                <div className={`flex items-center border border-gray-300 rounded-full shadow-sm bg-gray-50 focus-within:ring-2 focus-within:ring-orange-400 ${isMobile ? 'shadow-md' : ''}`}>
                    <div className="relative" ref={categoryDropdownRef}>
                        {/* **FIX**: Added CSS to prevent text wrapping and handle overflow */}
                        <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} type="button" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-600 bg-gray-100 border-r border-gray-300 rounded-l-full hover:bg-gray-200 max-w-[150px]">
                            <span className="truncate whitespace-nowrap">{selectedCategory.name}</span>
                            <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
                        </button>
                        <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.div initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} className="absolute top-12 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 max-h-60 overflow-y-auto">
                                <ul className="py-2 text-sm text-gray-700">
                                    <li>
                                        <button onClick={() => { setSelectedCategory({ id: '', name: 'All' }); setIsCategoryOpen(false); }} type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100">All</button>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat._id}>
                                            <button onClick={() => { setSelectedCategory({ id: cat._id, name: cat.name }); setIsCategoryOpen(false); }} type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 truncate">{cat.name}</button>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    <div className="relative w-full">
                        <input
                            type="search"
                            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-transparent rounded-r-full border-l-gray-50 border-l-2 border-transparent focus:outline-none"
                            placeholder="Search for handmade treasures..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-orange-400 rounded-r-full border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/></svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};


// Main Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const { notificationCount } = useNotifications();
  const { cartItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-gray-200 ${scrolled ? "bg-white/90 shadow-md backdrop-blur-sm" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="font-brand font-bold text-3xl text-orange-500 tracking-tight">DesiEtsy</span>
          </Link>

          <div className="flex-1 hidden lg:flex items-center justify-center gap-8">
              <nav className="flex items-center gap-4">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/products">Products</NavLink>
              </nav>
              <div className="w-full max-w-xl">
                  <UniversalSearch />
              </div>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {user && user.role === 'artisan' ? (
                <Link to="/seller/dashboard" className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                    Seller Dashboard
                </Link>
            ) : (
                <NavLink to="/apply-artisan">Become a Seller</NavLink>
            )}
            
            <NavLink to="/notifications" className="p-2 rounded-full">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m8 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white border-2 border-white">
                    {notificationCount}
                  </span>
                )}
              </div>
            </NavLink>

            <NavLink to="/cart" className="p-2 rounded-full">
               <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white border-2 border-white">
                          {cartItemCount}
                      </span>
                  )}
               </div>
            </NavLink>

            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <AuthDropdown user={user} onLogout={logout} />
          </div>

          <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setIsMobileSearchOpen(prev => !prev)} className="p-2 text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
              <button onClick={() => setMenuOpen(true)} className="p-2">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
          </div>
        </div>
        
        <AnimatePresence>
            {isMobileSearchOpen && (
                <motion.div
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    className="absolute top-full left-0 w-full bg-white shadow-lg p-4 lg:hidden"
                >
                    <UniversalSearch isMobile={true} />
                </motion.div>
            )}
        </AnimatePresence>
      </header>
      
      <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} user={user} onLogout={logout} />
    </>
  );
};

export default Navbar;
