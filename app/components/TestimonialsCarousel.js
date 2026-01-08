"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TestimonialsCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/review/display", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Loading State
  if (loading) {
    return (
      <div className="py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-20"
      >
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to Load Reviews
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  // Empty State
  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-20"
      >
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to share your experience!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-200/20 dark:bg-yellow-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-800 mb-4"
          >
            <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-semibold text-orange-900 dark:text-orange-200">
              Customer Reviews
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            What Our <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Discover why people love our authentic flavors
          </p>

          {/* Rating Summary */}
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  {averageRating}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{reviews.length} reviews</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            autoplay={{ 
              delay: 5000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="testimonials-swiper pb-12"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 h-full flex flex-col group">
                    {/* Quote Icon */}
                    <div className="absolute -top-2 -left-3 bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                      <Quote className="w-6 h-6 text-white" />
                    </div>

                    {/* Top Badge (if high rating) */}
                    {review.rating >= 5 && (
                      <div className="absolute -top-0.5 -right-3">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 border-0 shadow-lg">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          Top Review
                        </Badge>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                        <Avatar className="relative w-14 h-14 border-2 border-white dark:border-gray-700 shadow-lg">
                          <AvatarImage 
                            src={review.avatar} 
                            alt={review.name || 'Customer'}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                            {getInitials(review.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                          {review.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="flex-1 mb-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base line-clamp-4">
                        &ldquo;{review.review}&rdquo;
                      </p>
                    </div>

                    {/* Date (if available) */}
                    {review.date && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    )}

                    {/* Decorative Corner */}
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="hidden lg:block">
            <button
              className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white dark:bg-gray-800 hover:bg-orange-500 dark:hover:bg-orange-500 text-gray-900 dark:text-white hover:text-white p-3 rounded-full shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white dark:bg-gray-800 hover:bg-orange-500 dark:hover:bg-orange-500 text-gray-900 dark:text-white hover:text-white p-3 rounded-full shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .testimonials-swiper .swiper-pagination {
          bottom: 0;
        }
        
        .testimonials-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s;
        }
        
        .testimonials-swiper .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 6px;
          background: linear-gradient(to right, #f97316, #ef4444);
        }
        
        .dark .testimonials-swiper .swiper-pagination-bullet {
          background: #4b5563;
        }
        
        .testimonials-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
        
        .testimonials-swiper .swiper-slide > div {
          width: 100%;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;