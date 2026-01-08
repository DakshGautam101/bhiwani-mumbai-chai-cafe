'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Typed from 'typed.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';

const UniversalLoader = ({ className, onComplete }) => {
  const typedElement = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [floatingElements, setFloatingElements] = useState([]);

  // Handle progress simulation and typed text
  useEffect(() => {
    // Generate floating elements on client side only
    setFloatingElements(
      [...Array(6)].map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
      }))
    );

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
        'Brewing your experience... ☕',
        'Crafting moments of joy... ✨',
        'Stirring up delightful flavors... 🌶️',
        'Preparing your perfect cup... 🔥',
        'Almost ready... 💫',
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-950 dark:via-orange-950/20 dark:to-gray-950',
            className
          )}
        >
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-300/20 dark:bg-yellow-600/10 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, -50, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Main Loader Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-orange-200/50 dark:border-orange-800/50 max-w-md w-full mx-4"
          >
            {/* Sparkle Effects */}
            <div className="absolute -top-6 -right-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-orange-400 dark:text-orange-500" />
              </motion.div>
            </div>

            {/* Coffee Cup Icon with Animation */}
            <div className="flex justify-center mb-8">
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-2xl opacity-50 scale-150" />
                
                {/* Main Cup */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
                  <Coffee className="w-10 h-10 text-white" />
                </div>

                {/* Steam Animation */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-6 bg-gradient-to-t from-orange-400 to-transparent rounded-full"
                        animate={{
                          height: ["24px", "32px", "24px"],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-orange-400 rounded-full"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${-20 - i * 10}%`,
                    }}
                    animate={{
                      y: [-20, -40],
                      opacity: [1, 0],
                      scale: [1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <span>Loading</span>
                <motion.span
                  key={Math.round(progress)}
                  initial={{ scale: 1.2, color: "#f97316" }}
                  animate={{ scale: 1, color: "#6b7280" }}
                  className="text-orange-600 dark:text-orange-400"
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>

              {/* Progress Bar Container */}
              <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                {/* Progress Bar */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>

                {/* Progress Glow */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-md opacity-50"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Typed Text */}
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-3 min-h-[28px]">
                <span ref={typedElement} className="text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we prepare everything for you
              </p>
            </div>

            {/* Animated Loading Dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Decorative Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
          </motion.div>

          {/* Floating Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingElements.map((el) => (
              <motion.div
                key={el.id}
                className="absolute w-4 h-4 bg-orange-400/20 dark:bg-orange-600/20 rounded-full"
                style={{
                  top: `${el.top}%`,
                  left: `${el.left}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: el.id * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Custom Shimmer Animation */}
          <style jsx global>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(200%);
              }
            }

            .animate-shimmer {
              animation: shimmer 2s infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UniversalLoader;