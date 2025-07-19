import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../components/common/Button';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import * as productService from '../../../services/productService';

const MyProducts = ({ products, onSelectProduct, onAddNew, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const getStatusChip = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
        switch (status) {
            case 'active':
                return <span className={`${baseClasses} text-green-800 bg-green-100`}>Approved</span>;
            case 'pending_approval':
                return <span className={`${baseClasses} text-yellow-800 bg-yellow-100`}>Pending</span>;
            case 'rejected':
                return <span className={`${baseClasses} text-red-800 bg-red-100`}>Rejected</span>;
            case 'inactive':
                 return <span className={`${baseClasses} text-gray-800 bg-gray-100`}>Inactive</span>;
            default:
                return <span className={`${baseClasses} text-gray-800 bg-gray-100`}>{status}</span>;
        }
    };

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setProductToDelete(null);
        setIsModalOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;
        try {
            await productService.deleteProduct(productToDelete._id);
            toast.success(`Product "${productToDelete.name}" deleted successfully!`);
            onRefresh(); // Refresh the product list
        } catch (error) {
            toast.error('Failed to delete product.');
            console.error('Delete error:', error);
        } finally {
            closeDeleteModal();
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
                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-md object-cover" src={product.images[0] || 'https://placehold.co/40x40/eee/ccc?text=No-Img'} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">₹{product.price.toLocaleString('en-IN')}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{product.stock}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(product.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => onSelectProduct(product, 'view')} className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                    <button onClick={() => onSelectProduct(product, 'edit')} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button onClick={() => openDeleteModal(product)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    <h4 className="text-lg font-medium">No products found.</h4>
                                    <p className="mt-1">Why not add your first product?</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                productName={productToDelete?.name}
            />
        </div>
    );
};

export default MyProducts;
