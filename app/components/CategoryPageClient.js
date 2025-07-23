'use client';

import React from 'react';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Link from 'next/link';

export default function CategoryPageClient({ category, items = [] }) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          {category && (
            <>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 text-orange-600">
                  {category.name}
                </h1>
                <p className="text-gray-700 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
            </>
          )}

          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">
              Items in this Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {safeItems.length > 0 ? (
                safeItems.map((item) => (
                  <Link
                    key={item._id}
                    href={`/item/${item._id}`}
                    className="group bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow block"
                  >
                    <img
                      src={item.image || '/fallback-image.jpg'}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="text-orange-600 dark:text-orange-400 font-bold mb-2">
                      ₹{item.price}
                    </div>

                    {/* Arrow that appears on hover */}
                    <div className="text-sm text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View More →
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No items found in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}