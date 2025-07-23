// frontend/src/pages/OrderSuccessPage.jsx
// A new page to show after a successful order.

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';

const CheckCircleIcon = () => (
    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const OrderSuccessPage = () => {
  const { orderGroupId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
        <div className="flex justify-center mb-4">
            <CheckCircleIcon />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You can view the status of your items in your dashboard.
        </p>
        <p className="text-gray-600 mb-1">
          Your Order Group ID is:
        </p>
        <p className="text-lg font-mono bg-gray-100 px-3 py-1 rounded-md inline-block mb-8 break-all">
            {orderGroupId}
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/products">
                <Button className="w-full">
                    Continue Shopping
                </Button>
            </Link>
            <Link to="/dashboard/orders">
                <Button variant="outline" className="w-full">
                    View My Orders
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
