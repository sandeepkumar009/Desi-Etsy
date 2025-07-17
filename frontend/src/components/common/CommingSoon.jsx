/*
================================================================================
File: frontend/src/components/common/CommingSoon.jsx (New File)
Description: A user-friendly placeholder page for features that are planned
             but not yet implemented.
================================================================================
*/
import React from 'react';
import { Link } from 'react-router-dom';

const CommingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="max-w-md">
        <div className="text-6xl font-bold text-orange-400 mb-4">🚧</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Coming Soon!</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're working hard to bring this feature to you. Please check back later!
        </p>
        <Link 
          to="/" 
          className="inline-block px-8 py-3 text-white font-semibold bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition-transform transform hover:scale-105"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default CommingSoon;
