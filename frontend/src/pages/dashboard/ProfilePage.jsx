import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import * as userService from '../../services/userService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

// Address Form Component (No changes needed here)
const AddressForm = ({ initialData = {}, onSave, onCancel }) => {
    const [address, setAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        ...initialData
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(address);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Address Line 1" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
            <Input label="Address Line 2 (Optional)" name="addressLine2" value={address.addressLine2} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
                <Input label="City" name="city" value={address.city} onChange={handleChange} required />
                <Input label="State" name="state" value={address.state} onChange={handleChange} required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <Input label="Postal Code" name="postalCode" value={address.postalCode} onChange={handleChange} required />
                <Input label="Country" name="country" value={address.country} onChange={handleChange} required />
            </div>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Address</Button>
            </div>
        </form>
    );
};


// Main Profile Page Component
const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [formData, setFormData] = useState({ name: '' });
    const [profilePicture, setProfilePicture] = useState(null);
    
    const [preview, setPreview] = useState(user?.profilePicture || null);
    
    const [isSaving, setIsSaving] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name });
            if (!profilePicture) {
                setPreview(user.profilePicture);
            }
        }
    }, [user, profilePicture]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const data = new FormData();
        data.append('name', formData.name);
        if (profilePicture) {
            data.append('profilePicture', profilePicture);
        }

        try {
            const updatedUser = await userService.updateUserProfile(data);
            updateUser(updatedUser);
            toast.success("Profile updated successfully!");
            setProfilePicture(null);
            setIsEditMode(false);
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({ name: user.name });
        setPreview(user.profilePicture);
        setProfilePicture(null);
        setIsEditMode(false);
    };

    const handleAddressSave = async (addressData) => {
        try {
            const updatedUser = editingAddress?._id
                ? await userService.updateUserAddress(editingAddress._id, addressData)
                : await userService.addUserAddress(addressData);
            updateUser(updatedUser);
            toast.success(`Address ${editingAddress ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            toast.error(error.message || "Failed to save address.");
        } finally {
            setIsModalOpen(false);
            setEditingAddress(null);
        }
    };
    
    const handleAddressDelete = async (addressId) => {
        if (confirm("Are you sure you want to delete this address?")) {
            try {
                const updatedUser = await userService.deleteUserAddress(addressId);
                updateUser(updatedUser);
                toast.success("Address deleted successfully!");
            } catch (error) {
                toast.error(error.message || "Failed to delete address.");
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const updatedUser = await userService.setDefaultUserAddress(addressId);
            updateUser(updatedUser);
            toast.success("Default address updated!");
        } catch (error) {
            toast.error(error.message || "Failed to set default address.");
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-12">
            {/* Personal Information Section */}
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-desi-primary">My Profile</h1>
                    {!isEditMode && (
                         <Button onClick={() => setIsEditMode(true)} variant="outline" size="sm">
                            Edit Profile
                        </Button>
                    )}
                </div>
                <form onSubmit={handleProfileSubmit} className="p-6 border rounded-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            {preview ? (
                                <img src={preview} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover ring-4 ring-orange-200"/>
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-orange-200">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            {isEditMode && (
                                <label htmlFor="profilePictureInput" className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                                   ✏️
                                    <input id="profilePictureInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                        <div className="flex-grow w-full space-y-4">
                            {isEditMode ? (
                                <>
                                    <Input label="Full Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-lg text-gray-800">{user.name}</p>
                                    <p className="text-sm font-medium text-gray-500 pt-2">Email Address</p>
                                    <p className="text-lg text-gray-800">{user.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {isEditMode && (
                        <div className="flex justify-end gap-4 mt-6">
                            <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                            <Button type="submit" isLoading={isSaving} disabled={isSaving}>Save Changes</Button>
                        </div>
                    )}
                </form>
            </div>

            {/* Address Book Section */}
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-desi-primary">Address Book</h2>
                    <Button onClick={() => { setEditingAddress(null); setIsModalOpen(true); }} size="sm">Add New Address</Button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses?.length > 0 ? user.addresses.map(addr => (
                        <div key={addr._id} className={`p-4 rounded-lg border-2 ${addr.isDefault ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                            {addr.isDefault && <div className="text-xs font-bold text-orange-600 mb-2">DEFAULT</div>}
                            <address className="not-italic text-gray-700">
                                {addr.addressLine1}<br />
                                {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                                {addr.city}, {addr.state} {addr.postalCode}<br />
                                {addr.country}
                            </address>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button onClick={() => { setEditingAddress(addr); setIsModalOpen(true); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                                <span className="text-gray-300">|</span>
                                <button onClick={() => handleAddressDelete(addr._id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                                {!addr.isDefault && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={() => handleSetDefault(addr._id)} className="text-sm font-medium text-gray-600 hover:text-gray-900">Set as Default</button>
                                    </>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 md:col-span-2">You haven't added any addresses yet.</p>
                    )}
                </div>
            </div>
            
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAddress ? "Edit Address" : "Add New Address"}>
                <AddressForm 
                    initialData={editingAddress || undefined} 
                    onSave={handleAddressSave}
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>
        </div>
    );
};

export default ProfilePage;
