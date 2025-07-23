'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaArrowRight, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const SearchElement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        setIsLoading(true);
        setHasSearched(true);
        fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data.items || []);
            setTimeout(() => {
              if (resultsRef.current) {
                const { scrollHeight, clientHeight } = resultsRef.current;
                setShowScrollArrow(scrollHeight > clientHeight);
              }
            }, 50);
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
      } else {
        setResults([]);
        setShowScrollArrow(false);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleScroll = () => {
    if (resultsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = resultsRef.current;
      setShowScrollArrow(scrollTop + clientHeight < scrollHeight - 5);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative flex items-center mb-6">
        <div className="absolute left-4 text-gray-400">
          <FaSearch />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, categories..."
          className="w-full pl-12 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-400"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Results Container */}
      <AnimatePresence>
        {(isLoading || results.length > 0 || (hasSearched && !isLoading)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-3 p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex gap-4 items-center p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/30"
                  >
                    <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-600 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-600 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-zinc-600 rounded" />
                      <div className="h-3 w-1/4 bg-gray-200 dark:bg-zinc-600 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <div className="relative">
                <div
                  ref={resultsRef}
                  onScroll={handleScroll}
                  className="max-h-[60vh] overflow-y-auto p-2"
                >
                  <div className="space-y-2">
                    {results.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="group"
                      >
                        <Link
                          href={`/item/${item._id}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={item.image || '/fallback.jpg'}
                                alt={item.name}
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-orange-500 font-medium">
                                  ₹{item.price}
                                </span>
                                <span className="flex items-center text-xs text-yellow-500">
                                  ⭐ {item.rating?.toFixed(1) || '4.0'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 group-hover:text-orange-500">
                            <FaArrowRight />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Scroll Indicator */}
                {showScrollArrow && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FaChevronDown className="text-orange-500 text-sm" />
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {!isLoading && hasSearched && results.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No results found for <span className="font-medium">"{searchTerm}"</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try different keywords or check spelling
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchElement;