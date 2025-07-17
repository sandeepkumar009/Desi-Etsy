// 404 page for handling routes that don't exist in the app
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-lg">
        <h1 className="text-9xl font-extrabold text-orange-400 tracking-widest">404</h1>
        <div className="bg-gray-800 text-white px-2 text-sm rounded rotate-12 absolute">
          Page Not Found
        </div>
        <p className="text-2xl md:text-3xl font-light text-gray-700 mt-4 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link 
          to="/" 
          className="inline-block px-8 py-4 text-white font-semibold bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
