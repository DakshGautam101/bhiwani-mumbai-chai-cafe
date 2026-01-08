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

const calculateDiscountedPrice = (originalPrice, discount) => {
  if (!discount || discount <= 0) return originalPrice;
  return Math.round(originalPrice * (1 - discount / 100));
};

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
    <div className="rounded-2xl p-4 shadow-md border border-neutral-200 dark:border-neutral-800 hover:scale-[1.03] transition-transform bg-white dark:bg-neutral-900 flex flex-col gap-3">
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
      <div className="text-orange-600 dark:text-orange-400 font-bold mt-2">
        {item.isFeatured && item.featured?.[0] ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-600">
                ₹{calculateDiscountedPrice(item.price, item.featured[0].discount)}
              </span>
              <span className="text-base text-gray-500 line-through">
                ₹{item.price}
              </span>
            </div>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              {item.featured[0].discount}% off
            </span>
          </div>
        ) : (
          <span className="text-xl font-bold">₹{item.price}</span>
        )}
      </div>
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.round(item.rating) ? 'fill-yellow-500' : 'fill-gray-300 dark:fill-neutral-700'}`}
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Portrait Image Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-center p-6">
          <img
            src={category.image}
            alt={category.name}
            className="w-72 h-96 object-cover rounded-xl shadow-md"
          />
          <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400">{category.name}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md">{category.description}</p>
          </div>
        </div>

        <h2 className="text-3xl text-center font-semibold mt-12 mb-6 text-orange-700 dark:text-orange-400">
          Dishes in this Category
        </h2>

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
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              No items found in this category.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
