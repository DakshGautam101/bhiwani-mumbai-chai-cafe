"use client";
import React, { useState, useEffect, useRef } from "react";
import Typed from "typed.js";
import SearchElement from "./SearchElement";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, TrendingUp, Award, Users } from "lucide-react";

const HeroSection = () => {
  const typedElement = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: [
        "Chatpata Mumbai Flavors! 🌶️",
        "Tandoori Tadka, Street Style! 🔥",
        "Spicy, Crispy, Full Tandoor! ✨",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => typed.destroy();
  }, []);

  // Stats data
  const stats = [
    { icon: Users, value: "10K+", label: "Happy Customers" },
    { icon: Award, value: "50+", label: "Menu Items" },
    { icon: TrendingUp, value: "4.8", label: "Average Rating" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-orange-950/20 dark:to-gray-900">
        {/* Animated Blobs - Adjusted for mobile */}
        <motion.div
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-orange-300/30 dark:bg-orange-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-300/30 dark:bg-yellow-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-56 sm:w-80 h-56 sm:h-80 bg-red-300/20 dark:bg-red-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Decorative Pattern - Hidden on mobile for performance */}
        <div className="hidden md:block absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <motion.main
        style={{ y, opacity }}
        className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between w-full max-w-7xl py-12 sm:py-16 md:py-20 gap-8 sm:gap-10 lg:gap-12"
      >
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left w-full lg:w-1/2 space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 px-3 sm:px-4 py-2 rounded-full border border-orange-200 dark:border-orange-800 text-xs sm:text-sm"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <span className="font-semibold text-orange-900 dark:text-orange-200 whitespace-nowrap overflow-hidden text-ellipsis">
              Welcome to Bhiwani Mumbai Chai Cafe
            </span>
          </motion.div>

          {/* Main Heading - Responsive text sizes */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-gray-900 dark:text-white"
              >
                Embark on a
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent"
              >
                Culinary Journey
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-gray-900 dark:text-white"
              >
                of Flavors
              </motion.span>
            </h1>

            {/* Typed Text - Responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start"
            >
              <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 min-h-[2rem] sm:min-h-[2.5rem]">
                <span ref={typedElement}></span>
              </span>
            </motion.div>
          </div>

          {/* Description - Responsive */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0 px-4 sm:px-0"
          >
            Experience authentic flavors that transport you to the streets of Mumbai.
          </motion.p>

          {/* Search Element - Fully Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-xl mx-auto lg:mx-0"
          >
            <div className="w-full px-0 sm:px-0">
              <SearchElement />
            </div>
          </motion.div>

          {/* Stats - Responsive Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-lg mx-auto lg:mx-0 pt-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center lg:items-start p-2 sm:p-3 md:p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400 mb-1 sm:mb-2 flex-shrink-0" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center lg:text-left leading-tight mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Image - Responsive */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[280px] xs:max-w-sm sm:max-w-md lg:max-w-lg lg:w-1/2 flex justify-center"
        >
          <div className="relative w-full aspect-square">
            {/* Decorative Rings - Adjusted for mobile */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 sm:border-4 border-dashed border-orange-300/30 dark:border-orange-600/30"
              style={{ transform: "scale(1.1)" }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 sm:border-4 border-dotted border-yellow-300/30 dark:border-yellow-600/30"
              style={{ transform: "scale(1.2)" }}
            />

            {/* Main Image Container */}
            <motion.div
              className="relative w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 dark:from-orange-600/30 dark:to-red-600/30 rounded-full blur-2xl sm:blur-3xl" />

              {/* Image */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 sm:border-6 md:border-8 border-white dark:border-gray-800 shadow-xl sm:shadow-2xl">
                <img
                  className="w-full h-full object-cover"
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20240910124734/restaurant-app-imag.jpeg"
                  alt="Delicious Food - Bhiwani Mumbai Chai Cafe"
                  loading="eager"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating Badge - Responsive positioning */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-gradient-to-br from-orange-500 to-red-500 text-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black">4.8★</div>
                  <div className="text-[10px] sm:text-xs font-semibold opacity-90">Rating</div>
                </div>
              </motion.div>

              {/* Floating Elements - Hidden on small mobile */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="hidden xs:block absolute -top-4 sm:-top-8 -left-4 sm:-left-8 bg-white dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                      Fresh Daily
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                      Authentic Taste
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.main>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="hidden sm:flex absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400"
        >
          <span className="text-xs font-medium tracking-wider uppercase">
            Scroll to Explore
          </span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-current rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;