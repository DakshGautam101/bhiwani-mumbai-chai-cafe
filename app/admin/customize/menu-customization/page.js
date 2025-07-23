'use client';

import React, { useContext, useEffect, useState } from 'react';
import { itemContext } from '@/context/itemContext';
import { getCategories, getMenuItems } from '@/app/menu/data/menuData';
import MenuTable from '../../components/MenuTable';
import ItemTable from '../../components/ItemTable'; // <-- Import your ItemTable component
import { Button } from '@/components/ui/button';
import ItemDialog from '../../components/ItemDialog';
import CategoryTable from '../../components/CategoryTable';
import CategoryDialog from '../../components/CategoryDialog';

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [toggle, setToggle] = useState('Item');

  const context = useContext(itemContext);
  const setItem = context?.setItem;
  const item = context?.item || [];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const categoryData = await getCategories();
      const itemData = await getMenuItems();
      setCategories(categoryData);
      setItem?.(itemData);
    } catch (err) {
      console.error(err);
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered items based on search
  const filteredItems = item.filter((itm) =>
    itm.name.toLowerCase().includes(search.toLowerCase()) ||
    itm.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Menu Customization
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            className={toggle === 'Item' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
            onClick={() => setToggle('Item')}
          >
            Items
          </Button>
          <Button
            className={toggle === 'Category' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
            onClick={() => setToggle('Category')}
          >
            Categories
          </Button>
        </div>

        {/* Items Section */}
        {toggle === 'Item' && (
          <>
            <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <input
                type="text"
                placeholder="Search menu items by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
              <Button 
                onClick={() => setOpenDialog(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                + Add Item
              </Button>
            </div>
            {loading ? (
              <div className="space-y-4 flex items-center justify-center flex-col">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                ))}
                <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              // Use ItemTable instead of MenuTable for better UI and features
              <ItemTable categories={categories} items={filteredItems} />
            )}
            <ItemDialog open={openDialog} setOpen={setOpenDialog} onItemAdded={fetchMenu} />
          </>
        )}

        {/* Categories Section */}
        {toggle === 'Category' && (
          <>
            <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <input
                type="text"
                placeholder="Search categories by name..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
              <Button 
                onClick={() => setOpenCategoryDialog(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                + Add Category
              </Button>
            </div>
            {loading ? (
              <div className="space-y-4 flex items-center justify-center flex-col">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                ))}
                <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <CategoryTable categories={filteredCategories} onCategoryChanged={fetchMenu} />
            )}
            <CategoryDialog open={openCategoryDialog} setOpen={setOpenCategoryDialog} onCategoryAdded={fetchMenu} />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;