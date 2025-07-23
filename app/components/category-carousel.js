'use client';

import React, { useEffect, useState } from 'react';
import { getCategories } from '../menu/data/menuData';
import { Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-center">Explore Categories</h2>

      <div className="flex flex-wrap gap-4 justify-center">
        {loading ? (
          <div className="animate-spin text-orange-500">
            <Circle className="w-6 h-6" />
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="group relative w-52 p-4 border-2 border-gray-100 hover:border-orange-300 rounded-xl shadow-sm transition duration-300 dark:border-orange-900/40 hover:shadow-2xl hover:-translate-y-1"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="text-sm font-semibold text-center">{category.name}</h3>

              {/* Arrow Button */}
              <Link
                href={`/menu/${category._id}`}
                className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-opacity duration-300"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          href="/menu"
          className="text-orange-500 font-semibold hover:text-orange-700 transition"
        >
          View All Categories
        </Link>
      </div>
    </>
  );
};

export default CategoryCarousel;
