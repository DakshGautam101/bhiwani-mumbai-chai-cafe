'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Typed from 'typed.js';

const UniversalLoader = ({ className, onComplete }) => {
  const typedElement = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Handle progress simulation and typed text
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15;
        const clamped = Math.min(next, 100);
        if (clamped >= 100) clearInterval(progressInterval);
        return clamped;
      });

    }, 200);

    const typed = new Typed(typedElement.current, {
      strings: [
        'Brewing your experience...',
        'Crafting moments of joy...',
        'Stirring up delightful flavors...',
        'Preparing your perfect cup...',
        'Almost ready...',
      ],
      typeSpeed: 40,
      backSpeed: 25,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });

    return () => {
      clearInterval(progressInterval);
      typed.destroy();
    };
  }, []);

  // Handle completion when progress hits 100
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-black dark:via-gray-950 dark:to-black backdrop-blur-md transition-all duration-500',
        className
      )}
    >
      {/* Main container with glass effect */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-orange-200/50 dark:border-orange-700/50 max-w-md w-full mx-4">
        {/* Logo/Brand area */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Animated cup icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white dark:bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-orange-500 dark:bg-orange-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            {/* Steam effect */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-3 bg-orange-300 dark:bg-orange-400 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Loading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Typed text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <span ref={typedElement} className="text-orange-600 dark:text-orange-400"></span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare everything for you
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center mt-4 space-x-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200/30 dark:bg-orange-600/20 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-200/30 dark:bg-yellow-600/20 rounded-full animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-20 w-12 h-12 bg-amber-200/30 dark:bg-amber-600/20 rounded-full animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
    </div>
  );
};

export default UniversalLoader;
