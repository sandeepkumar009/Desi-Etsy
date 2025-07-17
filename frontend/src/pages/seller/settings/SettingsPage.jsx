/*
================================================================================
File: frontend/src/pages/seller/SettingsPage.jsx (Updated Code)
Description: This page allows an artisan to view and update their shop profile
             details including Brand Name, Story, and Banner Image. It now correctly
             includes the 'story' field in the form.
================================================================================
*/
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const SettingsPage = () => {
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        brandName: '',
        story: '',
    });
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);

    const [bannerPreview, setBannerPreview] = useState('https://placehold.co/1200x400/e2e8f0/4a5568?text=Your+Shop+Banner');
    const [profilePreview, setProfilePreview] = useState(`https://i.pravatar.cc/150`);


    useEffect(() => {
        if (user) {
            setFormData({
                brandName: user.artisanProfile?.brandName || `${user.name}'s Creations`,
                story: user.artisanProfile?.story || '',
            });
            if (user.artisanProfile?.bannerImage && user.artisanProfile.bannerImage !== 'default-banner-url.jpg') {
                setBannerPreview(user.artisanProfile.bannerImage);
            }
            if (user.profilePicture && user.profilePicture !== 'default-avatar-url.jpg') {
                setProfilePreview(user.profilePicture);
            } else {
                setProfilePreview(`https://i.pravatar.cc/150?u=${user._id}`);
            }
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

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving Shop Details:", {
            ...formData,
            bannerImage: bannerImageFile ? bannerImageFile.name : 'No new banner',
            profileImage: profileImageFile ? profileImageFile.name : 'No new profile pic'
        });
        alert("Shop details saved (simulated). Check the console for data.");
        // Here you would call an API to update the user's artisanProfile and profilePicture
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop Profile Settings</h1>
            <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-8">
                {/* Banner Image Upload */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Shop Banner</label>
                    <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-2" style={{ backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                </div>

                {/* Profile Picture and Brand Name */}
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
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="submit">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
