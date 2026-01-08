'use client';

import React, { useEffect, useState } from 'react';
import { getCategories } from '../menu/data/menuData';
import { 
  Circle, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  UtensilsCrossed,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UniversalLoader from './UniversalLoader';

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false)
  const handleRouteChange = (url) => {
    setIsNavigating(true);
  }
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoryData = await getCategories();

        // Validate the response
        if (!Array.isArray(categoryData)) {
          throw new Error('Invalid category data received');
        }

        setCategories(categoryData);
      } catch (error) {
        console.error('Category fetch error:', error);
        setError(error.message);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-16 px-4"
      >
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Categories
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
    {isNavigating && <UniversalLoader/>}
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-orange-950/10 dark:to-gray-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-200/20 dark:bg-yellow-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-800 mb-4"
          >
            <UtensilsCrossed className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-semibold text-orange-900 dark:text-orange-200">
              Browse Categories
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            <span className="text-gray-900 dark:text-white">Explore Our </span>
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              Categories
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover delicious dishes organized just for you
          </p>
        </motion.div>

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 sm:py-20"
            >
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
            </motion.div>
          ) : categories.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Categories Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for new categories
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="categories"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-12"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  {/* Card */}
                  <Link href={`/menu/${category._id}`}
                  onClick={()=>handleRouteChange(`/menu/${category._id}`)}
                  className="block">
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700">
                      {/* Image Container */}
                      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <motion.img
                          src={category.image || '/placeholder-category.jpg'}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                          onError={(e) => {
                            e.target.src = '/placeholder-category.jpg';
                            e.target.onerror = null;
                          }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Quick View Button */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-full shadow-xl">
                            <ArrowRight className="w-6 h-6" />
                          </div>
                        </motion.div>

                        {/* Category Badge */}
                        {index < 3 && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span className="text-xs font-bold">Popular</span>
                            </Badge>
                          </div>
                        )}

                        {/* Items Count (if available) */}
                        {category.itemCount && (
                          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                              {category.itemCount} items
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {category.description}
                          </p>
                        )}

                        {/* View Category Link */}
                        <div className="flex items-center gap-2 mt-4 text-orange-600 dark:text-orange-400 font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>View Category</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Button */}
        {!loading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-full"
              >
                <span className="flex items-center gap-2">
                  View All Categories
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
    </>
  );
};

export default CategoryCarousel;