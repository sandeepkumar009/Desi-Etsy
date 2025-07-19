import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth';
import * as artisanService from '../../../services/artisanService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';

const SettingsPage = () => {
    const { user, updateUser } = useAuth();
    
    const [formData, setFormData] = useState({ brandName: '', story: '' });
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Populate form with user data from AuthContext
    useEffect(() => {
        if (user) {
            setFormData({
                brandName: user.artisanProfile?.brandName || `${user.name}'s Creations`,
                story: user.artisanProfile?.story || '',
            });
            setBannerPreview(user.artisanProfile?.bannerImage || 'https://placehold.co/1200x400/e2e8f0/4a5568?text=Your+Shop+Banner');
            setProfilePreview(user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`);
        }
    }, [user]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'banner') {
                setBannerImageFile(file);
                setBannerPreview(URL.createObjectURL(file));
            } else {
                setProfileImageFile(file);
                setProfilePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        data.append('brandName', formData.brandName);
        data.append('story', formData.story);
        if (profileImageFile) {
            data.append('profileImage', profileImageFile);
        }
        if (bannerImageFile) {
            data.append('bannerImage', bannerImageFile);
        }

        try {
            const updatedProfile = await artisanService.updateMyArtisanProfile(data);
            updateUser(updatedProfile); // Update global user state
            toast.success("Shop profile updated successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    // The main loading is handled by AuthContext, so we just check if user exists
    if (!user) {
        return <div className="flex justify-center items-center h-96"><Loader /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop Profile Settings</h1>
            {/* Reverted to p-6 and original layout */}
            <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-8">
                {/* Banner Image Upload */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Shop Banner</label>
                    <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-2 bg-cover bg-center" style={{ backgroundImage: `url(${bannerPreview})` }}></div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                </div>

                {/* Profile Picture and Brand Name - Reverted to previous version's style */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Shop Logo</label>
                        <img src={profilePreview} alt="Shop Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                    </div>
                    <div className="w-full">
                        <Input 
                            label="Brand Name"
                            type="text"
                            name="brandName"
                            value={formData.brandName}
                            onChange={handleChange}
                            placeholder="e.g., Creative Crafts Co."
                            required
                        />
                    </div>
                </div>

                {/* Story / Description */}
                <div>
                    <label htmlFor="story" className="block text-lg font-semibold text-gray-700">Your Story</label>
                    <p className="text-sm text-gray-500 mb-2">Tell customers about your passion and what makes your shop unique.</p>
                    <textarea 
                        id="story" 
                        name="story" 
                        rows="6" 
                        value={formData.story} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
