import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

// Reusable Components
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function ApplyArtisan() {
  const [formData, setFormData] = useState({ brandName: '', story: '' });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const applicationData = new FormData();
    applicationData.append('brandName', formData.brandName);
    applicationData.append('story', formData.story);
    if (file) {
      applicationData.append('bannerImage', file);
    }

    try {
      const response = await api.post('/artisans/apply', applicationData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message);
      // Redirect to dashboard or a "pending approval" page
      navigate('/dashboard/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 md:p-10 font-brand">
      <div className="text-center mb-10">
        <span className="text-5xl md:text-6xl">🎨</span>
        <h1 className="text-3xl md:text-4xl font-bold text-desi-primary mt-4">Become a Seller on Desi Etsy</h1>
        <p className="text-desi-secondary text-lg mt-2">Share your craft with the world.</p>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            id="brandName"
            label="Brand Name"
            type="text"
            name="brandName"
            placeholder="Your unique brand name"
            value={formData.brandName}
            onChange={handleChange}
            required
          />
          <div>
            <label htmlFor="story" className="block text-desi-secondary font-medium mb-1">
              Your Story
            </label>
            <textarea
              id="story"
              name="story"
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-desi-accent focus:outline-none focus:ring-2 focus:ring-desi-primary text-desi-secondary transition-all duration-200"
              placeholder="Tell us about your craft and passion..."
              value={formData.story}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <Input
            id="bannerImage"
            label="Banner Image (Optional)"
            type="file"
            name="bannerImage"
            onChange={handleFileChange}
          />
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
}
