'use client';
import React from 'react';
import Card from '../components/card';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CustomizePage = () => {
  const customizeCards = [
    {
      src: '/user-interface.png',
      altText: 'Customize Users',
      captionText: 'Manage and customize user profiles and settings.',
      title: 'User Management',
    },
    {
      src: '/menu-interface.png',
      altText: 'Customize Menu',
      captionText: 'Edit and manage the menu items and categories.',
      title: 'Menu Customization',
    },
    {
      src: '/customize-orders.png',
      altText: 'Customize Orders',
      captionText: 'View and manage customer orders and preferences.',
      title: 'Order Management',
    },
    {
      src: '/customize-featured.png',
      altText: 'Customize Featured Items',
      captionText: 'Adjust the featured items displayed on the menu.',
      title: 'Featured Items',
    }
  ];

  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Customize Your Experience</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">Adjust your preferences and settings below:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {customizeCards.map((item, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-orange-100 dark:border-orange-900/40 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="w-full flex flex-col items-center">
              <Card
                src={item.src}
                altText={item.altText}
                captionText={item.captionText}
              />
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white text-center">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-2 mb-4">{item.captionText}</p>
            </div>
            <button
              onClick={() => router.push(`/admin/customize/${item.title.toLowerCase().replace(/\s+/g, '-')}`)}
              className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition group-hover:scale-105"
              aria-label={`Customize ${item.title}`}
            >
              <span>Go</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizePage;
