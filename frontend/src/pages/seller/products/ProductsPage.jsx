import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import MyProducts from './MyProducts';
import AddProduct from './AddProduct';
import { EditProduct, ViewProduct } from './ProductViews';
import Loader from '../../../components/common/Loader';
import * as productService from '../../../services/productService';

const ProductsPage = () => {
    const [view, setView] = useState({ type: 'list', product: null });
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await productService.getMyProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            toast.error('Failed to fetch products.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleBackToList = () => {
        setView({ type: 'list', product: null });
    };

    const handleOperationSuccess = () => {
        fetchProducts();
        handleBackToList();
    };

    const handleSelectProduct = (product, action) => {
        setView({ type: action, product: product });
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><Loader /></div>;
        }

        if (error) {
            return <div className="text-center text-red-500">{error}</div>;
        }

        switch (view.type) {
            case 'list':
                return (
                    <MyProducts
                        products={products}
                        onSelectProduct={handleSelectProduct}
                        onAddNew={() => setView({ type: 'add', product: null })}
                        onRefresh={fetchProducts}
                    />
                );
            case 'add':
                return <AddProduct onBack={handleBackToList} onSuccess={handleOperationSuccess} />;
            case 'edit':
                return <EditProduct product={view.product} onBack={handleBackToList} onSuccess={handleOperationSuccess} />;
            case 'view':
                return <ViewProduct product={view.product} onBack={handleBackToList} />;
            default:
                return (
                     <MyProducts
                        products={products}
                        onSelectProduct={handleSelectProduct}
                        onAddNew={() => setView({ type: 'add', product: null })}
                        onRefresh={fetchProducts}
                    />
                );
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default ProductsPage;
