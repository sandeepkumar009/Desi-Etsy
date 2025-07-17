/*
================================================================================
File: frontend/src/App.jsx (Updated Code)
Description: The routing structure has been updated to render the new functional
             AnalyticsPage component for the /seller/analytics route.
================================================================================
*/
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout and Common Components
import Layout from "./components/layout/layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFoundPage from "./components/common/NotFoundPage";
import CommingSoon from "./components/common/CommingSoon";

// Page Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyArtisan from "./pages/ApplyArtisan";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import { ProfilePage, OrdersPage as CustomerOrdersPage, WishlistPage, SecurityPage } from "./pages/dashboard/PlaceholderPages";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

// --- SELLER PORTAL IMPORTS ---
import SellerLayout from "./components/layout/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProductsPage from "./pages/seller/products/ProductsPage";
import SellerOrdersPage from "./pages/seller/orders/OrdersPage";
import SellerNotificationsPage from "./pages/seller/notifications/NotificationsPage";
import SellerMessagesPage from "./pages/seller/messages/MessagesPage";
import SellerSettingsPage from "./pages/seller/settings/SettingsPage";
import SellerAnalyticsPage from "./pages/seller/analytics/AnalyticsPage";
import { SellerDiscountsPage } from "./pages/seller/PlaceholderSellerPages";


function App() {
  return (
    <>
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
        {/* --- CUSTOMER FACING ROUTES --- */}
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<GoogleAuthCallback />} />
            
            <Route 
              path="/apply-artisan" 
              element={<ProtectedRoute><ApplyArtisan /></ProtectedRoute>} 
            />
            
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} 
            >
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<CustomerOrdersPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="security" element={<SecurityPage />} />
            </Route>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="*" element={<CommingSoon />} />
        </Route>
        
        {/* --- SELLER PORTAL ROUTES --- */}
        <Route 
          path="/seller" 
          element={
            <ProtectedRoute allowedRoles={['artisan']}> 
              <SellerLayout />
            </ProtectedRoute>
          } 
        >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProductsPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
            <Route path="notifications" element={<SellerNotificationsPage />} />
            <Route path="messages" element={<SellerMessagesPage />} />
            <Route path="analytics" element={<SellerAnalyticsPage />} />
            <Route path="discounts" element={<SellerDiscountsPage />} />
            <Route path="settings" element={<SellerSettingsPage />} />

            <Route path="*" element={<CommingSoon />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
