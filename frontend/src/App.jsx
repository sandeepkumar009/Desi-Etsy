import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout and Common Components
import Layout from "./components/layout/layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Page Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyArtisan from "./pages/ApplyArtisan";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import { ProfilePage, OrdersPage, WishlistPage, SecurityPage } from "./pages/dashboard/PlaceholderPages";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";


function App() {
  return (
    <Layout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />

        {/* Protected Routes */}
        <Route 
          path="/apply-artisan" 
          element={
            <ProtectedRoute>
              <ApplyArtisan />
            </ProtectedRoute>
          } 
        />
        
        {/* Nested Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          {/* Default dashboard route redirects to profile */}
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
        
        {/* Add other routes like Products, Cart, etc. here */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
