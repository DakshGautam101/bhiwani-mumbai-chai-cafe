'use client';

import React from 'react';
import UniversalLoader from './UniversalLoader';
import Navbar from './navbar';
import Footer from './footer';

const LoaderWrapper = ({ loading, error, children }) => {
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return <UniversalLoader />;
  }

  return children;
};

export default LoaderWrapper;