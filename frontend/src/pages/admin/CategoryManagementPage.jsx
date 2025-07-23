import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/productService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Form state
    const [formState, setFormState] = useState({ id: null, name: '', description: '' });
    const isEditMode = formState.id !== null;

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const resetForm = () => {
        setFormState({ id: null, name: '', description: '' });
    };

    const handleEditClick = (category) => {
        setFormState({
            id: category._id,
            name: category.name,
            description: category.description || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formState.name) {
            toast.error('Category name is required.');
            return;
        }

        try {
            if (isEditMode) {
                const response = await updateCategory(formState.id, { name: formState.name, description: formState.description });
                toast.success(response.message);
            } else {
                const response = await createCategory({ name: formState.name, description: formState.description });
                toast.success(response.message);
            }
            resetForm();
            fetchCategories(); // Refresh the list
        } catch (error) {
            toast.error(error.message || 'An error occurred.');
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            const response = await deleteCategory(categoryToDelete._id);
            toast.success(response.message);
            fetchCategories(); // Refresh the list
        } catch (error) {
            toast.error(error.message || 'Failed to delete category.');
        } finally {
            setIsModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-admin-primary mb-4">🏷️ Category Management</h1>
                <p className="text-gray-600 mb-6">Create, view, update, and delete product categories.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg border">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{isEditMode ? 'Edit Category' : 'Add New Category'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Category Name"
                                    id="name"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Handmade Jewelry"
                                    required
                                />
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={formState.description}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent sm:text-sm"
                                        placeholder="A short description of the category."
                                    ></textarea>
                                </div>
                                <div className="flex items-center gap-4 pt-2">
                                    <button type="submit" className="w-full px-4 py-2 rounded-lg bg-admin-accent text-white font-semibold hover:bg-blue-600 transition-colors">
                                        {isEditMode ? 'Update Category' : 'Create Category'}
                                    </button>
                                    {isEditMode && (
                                        <button type="button" onClick={resetForm} className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Column */}
                    <div className="lg:col-span-2">
                        {loading ? <Loader text="Loading categories..." /> : (
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.map(cat => (
                                            <tr key={cat._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                                    <button onClick={() => handleEditClick(cat)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                    <button onClick={() => handleDeleteClick(cat)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal isOpen title="Confirm Deletion" onClose={() => setIsModalOpen(false)}>
                    <p className="text-gray-600 mb-6">Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">Cancel</button>
                        <button type="button" onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold">Confirm Delete</button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default CategoryManagementPage;
