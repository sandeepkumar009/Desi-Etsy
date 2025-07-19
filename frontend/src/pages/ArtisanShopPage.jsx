import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getArtisanProfile } from '../services/artisanService.js';
import { getAllProducts } from '../services/productService.js';
import Loader from '../components/common/Loader';
import ProductCard from '../components/products/ProductCard';
import { motion } from 'framer-motion';
import Button from '../components/common/Button.jsx';

const StarIcon = () => <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>;
const MailIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;


const ArtisanShopPage = () => {
    const { artisanId } = useParams();
    const [artisan, setArtisan] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                setLoading(true);
                // Fetch artisan profile and products in parallel
                const [profileData, productsData] = await Promise.all([
                    getArtisanProfile(artisanId),
                    getAllProducts({ artisanId: artisanId, limit: 100 }) // Fetch all products for this artisan
                ]);
                setArtisan(profileData);
                setProducts(productsData.products);
            } catch (err) {
                setError('Could not find this artisan\'s shop.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, [artisanId]);

    const productsByCategory = useMemo(() => {
        if (!products) return {};
        return products.reduce((acc, product) => {
            const categoryName = product.category?.name || 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(product);
            return acc;
        }, {});
    }, [products]);

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!artisan) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 min-h-screen">
            {/* Shop Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative">
                    <div className="h-48 bg-gray-200 rounded-lg -m-6 mb-0" style={{ backgroundImage: `url(${artisan.artisanProfile?.bannerImage || 'https://placehold.co/1200x400/FFF7ED/D97706?text=Handmade+Creations'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 px-4">
                        <img 
                            src={artisan.profilePicture || `https://i.pravatar.cc/150?u=${artisan._id}`} 
                            alt={artisan.name} 
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover" 
                        />
                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">{artisan.artisanProfile?.brandName || artisan.name}</h1>
                            <p className="text-sm text-gray-500">by {artisan.name}</p>
                        </div>
                        <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-auto">
                            <Button className='px-5'>
                                <MailIcon />
                                Contact Seller
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">My Story</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{artisan.artisanProfile?.story || 'Discover a collection of unique, handcrafted items made with passion.'}</p>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {Object.keys(productsByCategory).length > 0 ? (
                    <div className="space-y-16">
                        {Object.entries(productsByCategory).map(([category, products]) => (
                            <div key={category}>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">{category}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-semibold text-gray-700">No products to display.</h3>
                        <p className="text-gray-500 mt-2">This artisan hasn't listed any products yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ArtisanShopPage;
