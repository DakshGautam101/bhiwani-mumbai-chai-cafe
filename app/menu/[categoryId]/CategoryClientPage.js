'use client';

import React, { useContext, useState } from 'react';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import { ShoppingCartIcon, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import useCartStore from '@/app/store/cartStore';
import { UserContext } from '@/context/UserContext';
import UserDialog from '@/app/components/UserDialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const CategoryItemCard = ({ item, user, addToCart, isLoadingGlobal }) => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const allImages = Array.from(new Set([item.image, ...(item.images || [])].filter(Boolean)));

  const handleAdd = async () => {
    if (!user) return setOpenDialog(true);
    if (loading || isLoadingGlobal) return;

    setLoading(true);
    try {
      await addToCart({ userId: user._id, itemId: item._id });
      toast.success(`${item.name} added to cart`);
    } catch {
      toast.error("Error adding item to cart");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="rounded-xl p-4 shadow border hover:scale-105 transition-transform bg-white dark:bg-neutral-900 flex flex-col gap-3">
      {/* Image Carousel */}
      <div className="w-full">
        {allImages.length > 1 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {allImages.map((img, idx) => (
                <CarouselItem key={idx}>
                  <img
                    src={img}
                    alt={`${item.name} image ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-md"
                    onError={e => (e.target.src = '/fallback-image.jpg')}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <img
            src={allImages[0] || '/fallback-image.jpg'}
            className="w-full h-40 object-cover mb-3 rounded-md"
            alt={item.name}
          />
        )}
      </div>
      <h4 className="text-lg font-semibold text-orange-700 dark:text-orange-400 line-clamp-1">{item.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
      <div className="text-orange-600 dark:text-orange-400 font-bold mt-2">₹{item.price?.toFixed(2)}</div>
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.round(item.rating) ? 'fill-yellow-500' : 'fill-gray-300'}`}
          />
        ))}
        <span className="text-xs text-gray-700 dark:text-gray-300 ml-1">{item.rating || 'N/A'}</span>
      </div>
      <Button
        onClick={handleAdd}
        className={`mt-3 w-full flex items-center justify-center gap-2 ${
          loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
        } text-white rounded-md py-2`}
        disabled={loading || isLoadingGlobal}
      >
        {loading ? (
          <>
            Adding...
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 ml-2" />
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

export default function CategoryClientPage({ category, items }) {
  const { addToCart, isLoading } = useCartStore();
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <img src={category.image} alt={category.name} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-orange-600">{category.name}</h1>
            <p className="text-gray-700 mt-2">{category.description}</p>
          </div>
        </div>

        <h2 className="text-2xl text-center font-semibold mt-8 mb-4 text-orange-700">Dishes in this Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
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
