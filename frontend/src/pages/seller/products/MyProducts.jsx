/*
================================================================================
File: frontend/src/pages/seller/MyProducts.jsx (Updated Code)
Description: The product list now calls handler functions passed via props to
             tell the parent component (ProductsPage) which product to view/edit
             or to switch to the "Add New" form. The price is updated to Rupee.
================================================================================
*/
import React from 'react';
import Button from '../../../components/common/Button';

const mockProducts = [
    { _id: '1', name: 'Hand-painted Ceramic Vase', price: 3500, category: 'Decor', stock: 15, description: 'A beautifully hand-painted ceramic vase, perfect for home decor. Each piece is unique.', status: 'approved', imageUrl: 'https://placehold.co/600x400/a3e635/333?text=Vase' },
    { _id: '2', name: 'Woven Seagrass Basket', price: 1250, category: 'Storage', stock: 30, description: 'Eco-friendly and stylish woven seagrass basket, ideal for storage or as a planter cover.', status: 'pending', imageUrl: 'https://placehold.co/600x400/fcd34d/333?text=Basket' },
    { _id: '3', name: 'Custom Wooden Sign', price: 5500, category: 'Custom Gifts', stock: 10, description: 'A personalized wooden sign, crafted from high-quality pine. Perfect for weddings, new homes, or as a unique gift.', status: 'approved', imageUrl: 'https://placehold.co/600x400/93c5fd/333?text=Sign' },
];

const MyProducts = ({ onSelectProduct, onAddNew }) => {
    const getStatusChip = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        if (status === 'approved') return <span className={`${baseClasses} text-green-800 bg-green-100`}>Approved</span>;
        if (status === 'pending') return <span className={`${baseClasses} text-yellow-800 bg-yellow-100`}>Pending</span>;
        return <span className={`${baseClasses} text-gray-800 bg-gray-100`}>Unknown</span>;
    };

    const handleDelete = (productId) => {
        // Frontend-only confirmation for now
        if (window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
            console.log('Deleting product with ID:', productId);
            // In a real app, you would call an API here and then refresh the product list.
            alert('Product deleted (simulated).');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">My Product Listings</h3>
                <Button onClick={onAddNew}>Add New Product</Button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockProducts.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{product.name}</div></div></div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">₹{product.price.toLocaleString('en-IN')}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(product.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => onSelectProduct(product, 'view')} className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                    <button onClick={() => onSelectProduct(product, 'edit')} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyProducts;
