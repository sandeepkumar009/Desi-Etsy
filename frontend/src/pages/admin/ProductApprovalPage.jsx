import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getProductsForAdmin, updateProductStatusByAdmin } from '../../services/productService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        pending_approval: 'bg-yellow-100 text-yellow-800',
        active: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-purple-100 text-purple-800', // Add this line
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-200'}`}>
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
    );
};

const ProductDetailModal = ({ isModalOpen, product, onClose }) => {
    if (!product) return null;
    return (
        <Modal isOpen={isModalOpen} title="Product Details" onClose={onClose}>
            <div className="space-y-4">
                <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded-lg bg-gray-200" />
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">by {product.artisanId?.name || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700">Description</h4>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><h4 className="font-semibold text-gray-700">Price</h4><p>₹{product.price.toFixed(2)}</p></div>
                    <div><h4 className="font-semibold text-gray-700">Stock</h4><p>{product.stock}</p></div>
                    <div><h4 className="font-semibold text-gray-700">Category</h4><p>{product.category?.name || 'N/A'}</p></div>
                    <div><h4 className="font-semibold text-gray-700">Status</h4><StatusBadge status={product.status} /></div>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">Close</button>
                </div>
            </div>
        </Modal>
    );
};

const ProductApprovalPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actionType, setActionType] = useState(''); // 'active', 'rejected'

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProductsForAdmin(statusFilter);
            setProducts(data);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleActionClick = (product, type) => {
        setSelectedProduct(product);
        setActionType(type);
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedProduct || !actionType) return;
        try {
            const response = await updateProductStatusByAdmin(selectedProduct._id, actionType);
            toast.success(response.message);
            fetchProducts();
        } catch (error) {
            toast.error(error.message || `Failed to update product status.`);
        } finally {
            setIsModalOpen(false);
            setSelectedProduct(null);
            setActionType('');
        }
    };

    const getButtonClasses = (action) => {
        const base = 'px-3 py-1 text-xs font-semibold rounded-md shadow-sm transition-colors';
        if (action === 'details') return `${base} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`;
        if (action === 'active') return `${base} bg-green-600 text-white hover:bg-green-700`;
        if (action === 'rejected') return `${base} bg-red-600 text-white hover:bg-red-700`;
        if (action === 'suspended') return `${base} bg-purple-600 text-white hover:bg-purple-700`; // Add this line
        return `${base} bg-gray-500 text-white hover:bg-gray-600`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-admin-primary">📦 Product Approval</h1>
                    <p className="text-gray-600 mt-1">Review and approve new products submitted by artisans.</p>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Filter by status:</label>
                    <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent">
                        <option value="all">All</option>
                        <option value="pending_approval">Pending Approval</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option> {/* Add this line */}
                        <option value="rejected">Rejected</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {loading ? <Loader text="Fetching products..." /> : (
                <div className="overflow-x-auto">
                    {products.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artisan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4"><div className="flex items-center"><img className="h-10 w-10 rounded-md object-cover" src={product.images[0]} alt={product.name} /><div className="ml-4 text-sm font-medium text-gray-900">{product.name}</div></div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.artisanId?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={product.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button type="button" onClick={() => handleActionClick(product, 'details')} className={getButtonClasses('details')}>Details</button>
                                            {product.status === 'pending_approval' && (
                                                <>
                                                    <button type="button" onClick={() => handleActionClick(product, 'active')} className={getButtonClasses('active')}>Approve</button>
                                                    <button type="button" onClick={() => handleActionClick(product, 'rejected')} className={getButtonClasses('rejected')}>Reject</button>
                                                </>
                                            )}
                                            {product.status === 'active' && (
                                                <button type="button" onClick={() => handleActionClick(product, 'suspended')} className={getButtonClasses('suspended')}>Suspend</button>
                                            )}
                                            {product.status === 'suspended' && (
                                                <button type="button" onClick={() => handleActionClick(product, 'active')} className={getButtonClasses('active')}>Re-Approve</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className="text-center py-12"><p className="text-gray-500">No products found with status "{statusFilter.replace('_', ' ')}".</p></div>}
                </div>
            )}

            {isModalOpen && actionType !== 'details' && (
                <Modal isOpen={isModalOpen} title={`Confirm Action`} onClose={() => setIsModalOpen(false)}>
                    <p className="text-gray-600 mb-6">Are you sure you want to {actionType === 'active' ? 'approve' : actionType} the product "{selectedProduct?.name}"?</p>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">Cancel</button>
                        <button type="button" onClick={handleConfirmAction} className={`px-4 py-2 rounded-lg font-semibold text-white ${actionType === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm</button>
                    </div>
                </Modal>
            )}

            {isModalOpen && actionType === 'details' && (
                <ProductDetailModal isModalOpen product={selectedProduct} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default ProductApprovalPage;
