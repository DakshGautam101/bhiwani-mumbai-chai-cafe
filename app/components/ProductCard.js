'use client';

import React, { useContext, useState } from 'react';
import { ArrowRight, ShoppingCartIcon, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import useCartStore from '@/app/store/cartStore';
import { UserContext } from '@/context/UserContext';
import UserDialog from '@/app/components/UserDialog';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const { addToCart, isLoading } = useCartStore();
  const { user } = useContext(UserContext);
  const [localLoading, setLocalLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (localLoading || isLoading) return;

    setLocalLoading(true);
    try {
      await addToCart({ userId: user._id, itemId: product._id });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error('Failed to add item to cart.');
    } finally {
      setTimeout(() => setLocalLoading(false), 500);
    }
  };

  return (
    <div className="relative rounded-xl border bg-white dark:bg-neutral-900 p-4 shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-[1.02] group">
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={product.image || '/fallback-image.jpg'}
          alt={product.name}
          className="w-full h-60 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <Link href={`/item/${product._id}`}>
        <Button
          variant="ghost"
          className="absolute right-3 top-[80%] cursor-pointer -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-md"
          aria-label={`View details of ${product.name}`}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
        </Link>
      </div>

      {/* Details */}
      <div className="mt-4">
        <h4 className="text-base font-semibold text-orange-700 dark:text-orange-400 line-clamp-1">
          {product.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
          {product.description}
        </p>
        {/* Overall Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
            {product.rating ? product.rating.toFixed(1) : 'N/A'}
          </span>
        </div>
        <div className="mt-2 text-base font-bold text-orange-600 dark:text-orange-400">
          ₹{product.price}
        </div>
      </div>

      {/* Button */}
      <Button
        onClick={handleAddToCart}
        className={`mt-4 w-full flex items-center justify-center gap-2 text-white py-2 rounded-lg transition-all duration-200 ${
          localLoading || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600'
        }`}
        disabled={localLoading || isLoading}
        aria-label={`Add ${product.name} to cart`}
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
}
