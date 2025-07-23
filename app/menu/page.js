'use client';
import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import ProductCard from '../components/ProductCard';
import { getMenuData, getMenuItems } from './data/menuData';
import { itemContext } from '@/context/itemContext';
import UniversalLoader from '../components/UniversalLoader';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {item, setItem}  = useContext(itemContext);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const data = await getMenuData();
        const itemData = await getMenuItems();
        setItem(itemData);
        setCategories(data);
      } catch (err) {
        setError("Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <UniversalLoader />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Menu</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No Menu Available</h2>
            <p className="text-gray-500">Please check back later for our delicious menu items.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 dark:from-black dark:via-gray-950 dark:to-black">
        {categories.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, itemIndex) => (
                <ProductCard key={itemIndex} product={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
