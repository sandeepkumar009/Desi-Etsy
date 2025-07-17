/*
================================================================================
File: frontend/src/pages/seller/ProductsPage.jsx (Updated Code)
Description: This page now manages the state for the full CRUD workflow,
             rendering the correct component (List, Add, Edit, View) based on
             user actions.
================================================================================
*/
import React, { useState } from 'react';
import MyProducts from './MyProducts';
import AddProduct from './AddProduct';
// Import the new components from the new file
import { EditProduct, ViewProduct } from './ProductViews';

const ProductsPage = () => {
    // State to manage the current view and the selected product for editing/viewing
    const [view, setView] = useState({ type: 'list', product: null });

    const handleBackToList = () => {
        setView({ type: 'list', product: null });
    };

    const handleSelectProduct = (product, action) => {
        setView({ type: action, product: product });
    };

    const renderContent = () => {
        switch (view.type) {
            case 'list':
                return <MyProducts onSelectProduct={handleSelectProduct} onAddNew={() => setView({ type: 'add', product: null })} />;
            case 'add':
                return <AddProduct onBack={handleBackToList} />;
            case 'edit':
                return <EditProduct product={view.product} onBack={handleBackToList} />;
            case 'view':
                return <ViewProduct product={view.product} onBack={handleBackToList} />;
            default:
                return <MyProducts onSelectProduct={handleSelectProduct} onAddNew={() => setView({ type: 'add', product: null })} />;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {renderContent()}
            </div>
        </div>
    );
};

export default ProductsPage;
