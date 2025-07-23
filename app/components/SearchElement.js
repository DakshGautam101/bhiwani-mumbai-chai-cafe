'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaArrowRight, FaArrowDown } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const SearchElement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        setIsLoading(true);
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

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Search Input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search items..."
          className="w-full border rounded-lg p-3 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        />
        <span className="bg-orange-400 p-3 rounded-lg text-white">
          <FaSearch />
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex gap-4 items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4"
            >
              <div className="w-16 h-16 bg-gray-300 dark:bg-zinc-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-zinc-700 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-zinc-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Results */}
      {!isLoading && results.length > 0 && (
        <div
          ref={resultsRef}
          onScroll={handleScroll}
          className="relative bg-white dark:bg-zinc-900 border rounded-lg max-h-[20vh] overflow-auto shadow p-4 space-y-4 scroll-auto"
        >
          {results.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 border-b last:border-none pb-4 group"
            >
              {/* Image + Info */}
              <div className="flex items-center gap-4">
                <Image
                  src={item.image || '/fallback.jpg'}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover w-16 h-16"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  <p className="text-sm font-semibold text-orange-400 dark:text-gray-400">₹{item.price}</p>
                  <p className="text-yellow-500 text-sm mt-1">
                    ⭐ {item.rating?.toFixed(1) || '4.0'} / 5
                  </p>
                </div>
              </div>

              {/* Arrow (Hover) */}
              <Link
                href={`/item/${item._id}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600"
              >
                <FaArrowRight />
              </Link>
            </div>
          ))}

          {/* Down Arrow Scroll Indicator */}
          {showScrollArrow && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
              <FaArrowDown className="text-orange-500 animate-bounce" />
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchTerm && results.length === 0 && (
        <p className="text-gray-400 text-sm italic text-center">No results found.</p>
      )}
    </div>
  );
};

export default SearchElement;
