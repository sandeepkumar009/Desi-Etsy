/*
================================================================================
File: frontend/src/pages/seller/AddProduct.jsx (Updated Code)
Description: The form now has a "Back to List" button and uses the Rupee
             symbol for the price.
================================================================================
*/
import React, { useState } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const AddProduct = ({ onBack }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
    const [productImage, setProductImage] = useState(null);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setProductImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData, "Image:", productImage);
        alert("Check console for form data. API not connected.");
        onBack(); // Go back to the list after submission
    };

    return (
        <div>
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                    &larr; Back to Products
                </button>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Add a New Product</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Product Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Hand-painted Ceramic Mug" required />
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Describe your product in detail..." required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Price (₹)" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 1250" min="0" required />
                    <Input label="Category" type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Pottery, Woodwork" required />
                </div>
                <Input label="Stock Quantity" type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="e.g., 15" min="0" required />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <div className="flex text-sm text-gray-600"><label htmlFor="productImage" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"><span>Upload a file</span><input id="productImage" name="productImage" type="file" className="sr-only" onChange={handleFileChange} /></label><p className="pl-1">or drag and drop</p></div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            {productImage && <p className="text-sm text-green-600 mt-2">{productImage.name}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={onBack} variant="secondary">Cancel</Button>
                    <Button type="submit">Add Product</Button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
