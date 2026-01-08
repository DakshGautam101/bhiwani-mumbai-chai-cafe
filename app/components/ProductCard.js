'use client';

import React, { useContext, useMemo, useState } from 'react';
import { ArrowRight, ShoppingCart, Star, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useCartStore from '@/app/store/cartStore';
import { UserContext } from '@/context/UserContext';
import UserDialog from '@/app/components/UserDialog';
import UniversalLoader from '@/app/components/UniversalLoader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, isLoading, isItemInCart } = useCartStore();
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [localLoading, setLocalLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const inCart = isItemInCart(product._id);

  const { discount, rating, reviewCount } = useMemo(() => ({
    discount:
      product.originalPrice && product.originalPrice > product.price
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) * 100
          )
        : null,
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
  }), [product]);

  const handleAddToCart = async () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (localLoading || isLoading || inCart) return;

    setLocalLoading(true);
    try {
      await addToCart({
        userId: user._id,
        itemId: product._id,
        price: product.price,
        quantity: 1,
      });

      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch {
      toast.error('Failed to add item to cart.');
    } finally {
      setTimeout(() => setLocalLoading(false), 500);
    }
  };

  const handleRouteChange = async (href) => {
    setIsNavigating(true);
    try {
      await router.push(href);
    } catch (err) {
      setIsNavigating(false);
      toast.error('Failed to navigate.');
      // eslint-disable-next-line no-console
      console.error('Navigation error:', err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isNavigating && <UniversalLoader />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8 }}
        className="group relative"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-red-500/0 to-orange-500/0 group-hover:from-orange-500/20 group-hover:via-red-500/20 group-hover:to-orange-500/20 rounded-2xl blur-xl transition-all duration-300 -z-10" />

        <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 dark:border-gray-700 group-hover:border-orange-300 dark:group-hover:border-orange-700">
          {/* Image */}
          <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Link 
              href={`/item/${product._id}`}
              onClick={() => handleRouteChange(`/item/${product._id}`)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full cursor-pointer"
              >
                <Image
                  src={product.image || '/fallback-image.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            </Link>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                  {discount}% OFF
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  New
                </Badge>
              )}
              {product.isTrending && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </Badge>
              )}
            </div>

            {/* Quick View */}
            <Link 
              href={`/item/${product._id}`}
              onClick={() => handleRouteChange(`/item/${product._id}`)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           px-4 py-2 rounded-full shadow-lg hover:shadow-xl
                           flex items-center gap-2 text-sm font-semibold cursor-pointer"
                aria-label="Quick view product"
              >
                <Eye className="w-4 h-4" />
                Quick View
              </motion.div>
            </Link>

            {/* Rating */}
            {rating > 0 && (
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {product.category && (
              <Badge variant="outline" className="mb-2 text-xs">
                {typeof product.category === 'object'
                  ? product.category.name
                  : product.category}
              </Badge>
            )}

            <Link 
              href={`/item/${product._id}`}
              onClick={() => handleRouteChange(`/item/${product._id}`)}
            >
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer">
                {product.name}
              </h4>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                    }`}
                  />
                ))}
              </div>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({reviewCount} reviews)
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={localLoading || isLoading}
                className={`flex-1 ${
                  inCart
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                } text-white font-bold shadow-md hover:shadow-lg transition-all`}
              >
                {localLoading ? (
                  <span className="flex items-center gap-2">
                    Adding...
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </span>
                ) : inCart ? (
                  <span className="flex items-center gap-2">
                    In Cart <ShoppingCart className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Add to Cart <ShoppingCart className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRouteChange(`/item/${product._id}`);
                }}
                className="relative z-40 pointer-events-auto cursor-pointer flex items-center justify-center px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="View product details"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Decoration */}
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <UserDialog open={openDialog} setOpen={setOpenDialog} />
      </motion.div>
    </>
  );
} 