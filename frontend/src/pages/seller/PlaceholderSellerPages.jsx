// Contains reusable placeholder pages for unimplemented seller portal features
import React from 'react';

const Placeholder = ({ title, icon, children }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
            <span className="text-4xl">{icon}</span>
            {title}
        </h1>
        <div className="mt-8 p-10 bg-white rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700">This page is under construction.</h2>
            <p className="mt-2 text-gray-500">{children}</p>
        </div>
    </div>
);

export const SellerOrdersPage = () => (
    <Placeholder title="Order Management" icon="📋">
        Here you will be able to view and manage all incoming orders.
    </Placeholder>
);

export const SellerMessagesPage = () => (
    <Placeholder title="Customer Messages" icon="💬">
        This will be your inbox for communicating with buyers.
    </Placeholder>
);

export const SellerAnalyticsPage = () => (
    <Placeholder title="Sales Analytics" icon="📈">
        This page will display charts and stats about your sales performance.
    </Placeholder>
);

export const SellerDiscountsPage = () => (
    <Placeholder title="Discounts & Coupons" icon="🏷️">
        Here you will be able to create and manage promotional discount codes.
    </Placeholder>
);

export const SellerSettingsPage = () => (
    <Placeholder title="Store Settings" icon="⚙️">
        Manage your shop profile, payment information, and other settings here.
    </Placeholder>
);
