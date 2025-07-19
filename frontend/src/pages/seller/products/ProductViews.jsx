import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import * as productService from '../../../services/productService';

// --- View Product Component ---
export const ViewProduct = ({ product, onBack }) => {
    if (!product) return null;

    const DetailItem = ({ label, value }) => (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
        </div>
    );
    
    const getStatusChip = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
        switch (status) {
            case 'active':
                return <span className={`${baseClasses} text-green-800 bg-green-100`}>Approved</span>;
            case 'pending_approval':
                return <span className={`${baseClasses} text-yellow-800 bg-yellow-100`}>Pending Approval</span>;
            case 'rejected':
                return <span className={`${baseClasses} text-red-800 bg-red-100`}>Rejected</span>;
            case 'inactive':
                 return <span className={`${baseClasses} text-gray-800 bg-gray-100`}>Inactive</span>;
            default:
                return <span className={`${baseClasses} text-gray-800 bg-gray-100`}>{status}</span>;
        }
    };

    return (
        <div>
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                    &larr; Back to Products
                </button>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <img src={product.images[0] || 'https://placehold.co/600x400/eee/ccc?text=No+Image'} alt={product.name} className="w-full h-auto rounded-lg shadow-md object-cover aspect-square" />
                </div>
                <div className="md:col-span-2">
                    <dl className="space-y-4">
                        <DetailItem label="Product Name" value={product.name} />
                        <DetailItem label="Price" value={`₹${product.price.toLocaleString('en-IN')}`} />
                        <DetailItem label="Category" value={product.category?.name || 'N/A'} />
                        <DetailItem label="Stock Quantity" value={product.stock} />
                        <DetailItem label="Status" value={getStatusChip(product.status)} />
                        {product.tags && product.tags.length > 0 && <DetailItem label="Tags" value={product.tags.join(', ')} />}
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{product.description}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};


// --- Edit Product Component ---
export const EditProduct = ({ product, onBack, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '', tags: '' });
    const [productImage, setProductImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await productService.getAllCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                toast.error("Could not fetch categories.");
            }
        };
        fetchCategories();

        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category?._id || '',
                stock: product.stock || '',
                tags: product.tags?.join(', ') || '',
            });
        }
    }, [product]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setProductImage(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        
        // Only append fields that have actually changed from their initial values
        if (formData.name !== product.name) data.append('name', formData.name);
        if (formData.description !== product.description) data.append('description', formData.description);
        if (String(formData.price) !== String(product.price)) data.append('price', formData.price);
        if (formData.category !== product.category?._id) data.append('category', formData.category);
        if (String(formData.stock) !== String(product.stock)) data.append('stock', formData.stock);
        if (formData.tags !== (product.tags?.join(', ') || '')) data.append('tags', formData.tags);

        if (productImage) {
            data.append('productImage', productImage);
        }

        // If no data has changed, just go back
        if ([...data.entries()].length === 0) {
            toast.info("No changes were made.");
            onBack();
            return;
        }

        try {
            await productService.updateProduct(product._id, data);
            toast.success("Product updated successfully!");
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!product) return null;

    return (
        <div>
             <div className="flex items-center mb-4">
                <button onClick={onBack} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                    &larr; Back to Products
                </button>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Product</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Product Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Price (₹)" type="number" name="price" value={formData.price} onChange={handleChange} min="0" required />
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        {/* FIX: Added consistent styling to the select element */}
                        <select id="category" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Input label="Stock Quantity" type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" required />
                <Input label="Tags (comma-separated)" type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., home decor, gift, pottery" />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Change Product Image (Optional)</label>
                    <div className="mt-2 flex items-center gap-4">
                        <img src={product.images[0] || 'https://placehold.co/64x64/eee/ccc?text=No-Img'} alt="Current" className="h-16 w-16 rounded-md object-cover" />
                        <input id="productImage" name="productImage" type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" onChange={handleFileChange} accept="image/*" />
                    </div>
                     {productImage && <p className="text-sm text-green-600 mt-2">New image selected: {productImage.name}</p>}
                </div>
                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={onBack} variant="secondary" disabled={isLoading}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </form>
        </div>
    );
};
