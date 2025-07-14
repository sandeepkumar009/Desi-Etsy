import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from '../services/api';
import { toast } from 'react-toastify';
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const GOOGLE_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.5 24.5C47.5 22.5 47.3 20.7 47 19H24V29H37.5C37 31.5 35.5 34 33 35.7V41H40.5C44.5 37.3 47.5 31.5 47.5 24.5Z" fill="#4285F4"/><path d="M24 48C30.5 48 35.8 45.8 40.5 41L33 35.7C30.7 37.3 27.7 38.3 24 38.3C17.8 38.3 12.3 34.2 10.4 28.7H2.6V34.1C7.3 42.1 15.1 48 24 48Z" fill="#34A853"/><path d="M10.4 28.7C9.9 27.1 9.6 25.5 9.6 24C9.6 22.5 9.9 20.9 10.4 19.3V13.9H2.6C0.9 17.1 0 20.5 0 24C0 27.5 0.9 30.9 2.6 34.1L10.4 28.7Z" fill="#FBBC05"/><path d="M24 9.7C27.2 9.7 29.9 10.8 31.9 12.7L39.1 5.5C35.8 2.5 30.5 0 24 0C15.1 0 7.3 5.9 2.6 13.9L10.4 19.3C12.3 13.8 17.8 9.7 24 9.7Z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>
);

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      const { token } = response.data.data;
      await login(token);
      toast.success("Login successful!");
      navigate('/dashboard/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 md:p-10 font-brand">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <span className="text-5xl md:text-6xl">🧵</span>
          <h1 className="text-3xl md:text-4xl font-bold text-desi-primary">Welcome Back</h1>
          <p className="text-desi-secondary text-lg">Login to explore handmade treasures.</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6">
          <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`}>
            <Button variant="secondary" className="w-full">
              {GOOGLE_ICON}
              Continue with Google
            </Button>
          </a>
          <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="email"
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Login
            </Button>
          </form>
          <div className="text-center text-desi-secondary text-sm mt-2">
            Don&apos;t have an account? <Link to="/register" className="text-desi-primary font-semibold hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
