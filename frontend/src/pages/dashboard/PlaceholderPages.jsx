import React from 'react';

export const ProfilePage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-desi-primary mb-4">My Profile</h1>
            <p>Here you can view and edit your profile information.</p>
        </div>
    );
};

export const OrdersPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-desi-primary mb-4">My Orders</h1>
            <p>A list of your past and current orders will be displayed here.</p>
        </div>
    );
};

export const WishlistPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-desi-primary mb-4">My Wishlist</h1>
            <p>Your favorite products will be shown here.</p>
        </div>
    );
};

export const SecurityPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-desi-primary mb-4">Security</h1>
            <p>Here you can manage your password and other security settings.</p>
        </div>
    );
};
