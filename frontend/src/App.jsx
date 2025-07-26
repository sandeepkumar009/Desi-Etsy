import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout and Common Components
import Layout from "./components/layout/layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFoundPage from "./components/common/NotFoundPage";

// Page Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyArtisan from "./pages/ApplyArtisan";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import DashboardLayout from "./components/layout/Sidebar";
import ProfilePage from "./pages/dashboard/ProfilePage"; 
import SecurityPage from "./pages/dashboard/SecurityPage";
import CustomerOrdersPage from "./pages/dashboard/CustomerOrdersPage";
import WishlistPage from "./pages/dashboard/WishlistPage";
import CartPage from "./pages/CartPage";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ArtisanShopPage from './pages/ArtisanShopPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotificationsPage from "./pages/NotificationsPage";

// SELLER PORTAL IMPORTS
import SellerLayout from "./components/layout/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProductsPage from "./pages/seller/products/ProductsPage";
import SellerOrdersPage from "./pages/seller/orders/OrdersPage";
import PayoutsPage from "./pages/seller/PayoutsPage";

// ADMIN PORTAL IMPORTS
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArtisanVerificationPage from "./pages/admin/ArtisanVerificationPage";
import ProductApprovalPage from "./pages/admin/ProductApprovalPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import PayoutManagementPage from "./pages/admin/PayoutManagementPage";


function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
        {/* CUSTOMER FACING ROUTES */}
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<GoogleAuthCallback />} />
            
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/artisan/:artisanId" element={<ArtisanShopPage />} />

            {/* PROTECTED ROUTES */}
            <Route path="/apply-artisan" element={<ProtectedRoute><ApplyArtisan /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success/:orderGroupId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} >
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<CustomerOrdersPage />} />
              <Route path="orders/:orderId" element={<CustomerOrdersPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
        </Route>
        
        {/* SELLER PORTAL ROUTES */}
        <Route path="/seller" element={<ProtectedRoute allowedRoles={['artisan']}><SellerLayout /></ProtectedRoute>} >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProductsPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
            <Route path="payouts" element={<PayoutsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* ADMIN PORTAL ROUTES */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>} >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="artisan-verification" element={<ArtisanVerificationPage />} />
          <Route path="product-approval" element={<ProductApprovalPage />} />
          <Route path="payouts" element={<PayoutManagementPage />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
