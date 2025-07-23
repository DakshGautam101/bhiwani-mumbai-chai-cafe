'use client';
import React, { useContext, useState } from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import useCartStore from '@/app/store/cartStore';
import { UserContext } from '@/context/UserContext';
import UserDialog from '@/app/components/UserDialog';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

const CategoryItemCard = ({ item, user, addToCart, isLoadingGlobal }) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (localLoading || isLoadingGlobal) return;

    setLocalLoading(true);
    try {
      await addToCart({ userId: user._id, itemId: item._id });
      toast.success(`${item.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart.");
    } finally {
      setTimeout(() => setLocalLoading(false), 500);
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <img
        src={item.image || '/fallback-image.jpg'}
        alt={item.name}
        className="w-full h-40 object-cover rounded-md mb-3"
        loading="lazy"
      />
      <h4 className="text-lg font-semibold text-orange-700 mb-1">{item.name}</h4>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
      <div className="text-lg font-bold text-orange-600 mb-3">₹{item.price}</div>

      <Button
        onClick={handleAddToCart}
        className={`w-full flex justify-center items-center gap-2 
          ${localLoading || isLoadingGlobal ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"} 
          text-white transition-colors rounded-md py-2`}
        disabled={localLoading || isLoadingGlobal}
        aria-label={`Add ${item.name} to cart`}
      >
        {localLoading ? (
          <>
            Adding...
            <span className="animate-spin ml-2 border-2 border-white border-t-transparent rounded-full w-4 h-4" />
          </>
        ) : (
          <>
            Add to Cart <ShoppingCartIcon className="w-5 h-5" />
          </>
        )}
      </Button>

      <UserDialog open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
};

export default function CategoryPage({ category, items }) {
  const { addToCart, isLoading } = useCartStore();
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-orange-600 mb-4">{category.name}</h1>
            <p className="text-gray-700 text-base">{category.description}</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mt-10 mb-4 text-orange-700">
          Dishes in this Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map(item => (
              <CategoryItemCard
                key={item._id}
                item={item}
                user={user}
                addToCart={addToCart}
                isLoadingGlobal={isLoading}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No items found in this category.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}