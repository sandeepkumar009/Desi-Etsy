import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

// View Product Component
export const ViewProduct = ({ product, onBack }) => {
    if (!product) return null;

    const DetailItem = ({ label, value }) => (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
        </div>
    );

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
                    <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
                </div>
                <div className="md:col-span-2">
                    <dl className="space-y-4">
                        <DetailItem label="Product Name" value={product.name} />
                        <DetailItem label="Price" value={`₹${product.price.toLocaleString('en-IN')}`} />
                        <DetailItem label="Category" value={product.category} />
                        <DetailItem label="Stock Quantity" value={product.stock} />
                        <DetailItem label="Status" value={<span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'approved' ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>{product.status}</span>} />
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
export const EditProduct = ({ product, onBack }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
    const [productImage, setProductImage] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
            });
        }
    }, [product]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setProductImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Form Data:", formData, "New Image:", productImage);
        alert("Check console for updated data. API not connected.");
        onBack();
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
                    <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Price (₹)" type="number" name="price" value={formData.price} onChange={handleChange} min="0" required />
                    <Input label="Category" type="text" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <Input label="Stock Quantity" type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" required />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Change Product Image (Optional)</label>
                    <div className="mt-2 flex items-center gap-4">
                        <img src={product.imageUrl} alt="Current" className="h-16 w-16 rounded-md object-cover" />
                        <input id="productImage" name="productImage" type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" onChange={handleFileChange} />
                    </div>
                     {productImage && <p className="text-sm text-green-600 mt-2">New image selected: {productImage.name}</p>}
                </div>
                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={onBack} variant="secondary">Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    );
};
