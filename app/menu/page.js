"use client";

import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../components/navbar";
import ProductCard from "../components/ProductCard";
import { getMenuData } from "./data/menuData";
import { itemContext } from "@/context/itemContext";
import UniversalLoader from "../components/UniversalLoader";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  ShoppingCartIcon,
  ArrowRight,
  Search,
  Filter,
  X,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import useCartStore from "@/app/store/cartStore";
import { UserContext } from "@/context/UserContext";
import UserDialog from "@/app/components/UserDialog";
import { motion, AnimatePresence } from "framer-motion";
import { set } from "mongoose";
import { Router } from "next/router";

const Menu = () => {
  // State Management
  const [categories, setCategories] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [error, setError] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // Context & Store
  const { setItem } = useContext(itemContext);
  const { addToCart, isLoading } = useCartStore();
  const { user } = useContext(UserContext);
  const [localLoading, setLocalLoading] = useState({});
  const [isNavigating, setIsNavigating] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);

  // Optimized Add to Cart Handler
  const handleAddToCart = useCallback(
    async (item) => {
      if (!user) {
        setOpenDialog(true);
        return;
      }

      if (localLoading[item._id] || isLoading) return;

      setLocalLoading((prev) => ({ ...prev, [item._id]: true }));
      try {
        await addToCart({ userId: user._id, itemId: item._id });
        toast.success(`${item.name} added to cart!`, {
          icon: "🛒",
          duration: 2000,
        });
      } catch (err) {
        toast.error(err.message || "Failed to add item to cart.");
      } finally {
        setTimeout(
          () => setLocalLoading((prev) => ({ ...prev, [item._id]: false })),
          500
        );
      }
    },
    [user, localLoading, isLoading, addToCart]
  );

  // Fetch Menu Data with Error Handling
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        setError(null);
        const menuData = await getMenuData();

        if (!menuData || !Array.isArray(menuData)) {
          throw new Error("Invalid menu data received");
        }

        setCategories(menuData);

        // Set items in context
        const allItems = menuData.reduce(
          (acc, category) => acc.concat(category.items || []),
          []
        );
        setItem?.(allItems);
      } catch (err) {
        console.error("Menu fetch error:", err);
        setError(err.message || "Failed to load menu.");
        toast.error("Failed to load menu");
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, [setItem]);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoadingFeatured(true);

        const response = await fetch("/api/featured-items");
        if (!response.ok) {
          throw new Error("Failed to fetch featured items");
        }

        const data = await response.json();

        setFeaturedItems(data.items || []);
        console.log("Featured items fetched:", data.items || []);
      } catch (error) {
        console.error("Error fetching featured items:", error);
        // Intentionally silent to avoid UI noise
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedItems();
  }, []);


  // Filter and Sort Logic
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories.map((category) => {
      let items = category.items || [];

      // Search filter
      if (searchQuery) {
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Price filter
      if (priceFilter !== "all") {
        items = items.filter((item) => {
          const price = item.price;
          switch (priceFilter) {
            case "under-200":
              return price < 200;
            case "200-500":
              return price >= 200 && price <= 500;
            case "above-500":
              return price > 500;
            default:
              return true;
          }
        });
      }

      // Sort items
      items = [...items].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      return { ...category, items };
    });

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (category) => category._id === selectedCategory
      );
    }

    // Remove empty categories
    return filtered.filter((category) => category.items.length > 0);
  }, [categories, searchQuery, selectedCategory, priceFilter, sortBy]);

  // Calculate totals for display
  const totalItems = useMemo(() => {
    return filteredAndSortedCategories.reduce(
      (sum, category) => sum + category.items.length,
      0
    );
  }, [filteredAndSortedCategories]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceFilter("all");
    setSortBy("default");
  };
  const handleRouteChange = (url) => {
      setIsNavigating(true);
  }

  // Loading State
  if (loadingMenu) {
    return (
      <>
        <Navbar />
        <UniversalLoader />
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="text-center max-w-md mx-auto p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Error Loading Menu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {isNavigating && <UniversalLoader />}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Our Menu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Discover delicious dishes crafted with love
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 w-full text-lg rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedCategory !== "all" ||
                priceFilter !== "all" ||
                sortBy !== "default") && (
                  <span className="ml-1 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {[
                      selectedCategory !== "all",
                      priceFilter !== "all",
                      sortBy !== "default",
                    ].filter(Boolean).length}
                  </span>
                )}
            </Button>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-orange-500 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-orange-500 outline-none"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {(searchQuery ||
              selectedCategory !== "all" ||
              priceFilter !== "all" ||
              sortBy !== "default") && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  Clear All
                </Button>
              )}
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    Price Range
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all", label: "All Prices" },
                      { value: "under-200", label: "Under ₹200" },
                      { value: "200-500", label: "₹200 - ₹500" },
                      { value: "above-500", label: "Above ₹500" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPriceFilter(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${priceFilter === option.value
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Counter */}
          <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
            {totalItems > 0 ? (
              <p>
                Showing <span className="font-semibold text-orange-600">{totalItems}</span> item
                {totalItems !== 1 ? "s" : ""}
              </p>
            ) : (
              <p className="text-lg">No items found. Try adjusting your filters.</p>
            )}
          </div>
        </motion.div>

        {/* Featured Items Section */}
        {!loadingFeatured && featuredItems.length > 0 && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Featured Specials
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hand-picked favorites just for you
                  </p>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item, index) => (
                <motion.article
                  key={item._id}
                  className="relative rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    FEATURED
                  </div>

                  {/* Discount Badge */}
                  {item.featured?.[0]?.discount > 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <motion.span
                        className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        {item.featured[0].discount}% OFF
                      </motion.span>
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative overflow-hidden h-64 bg-gray-100 dark:bg-gray-700">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      loading="lazy"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-medium">
                          {item.featured?.[0]?.heading || "Special Offer"}
                        </p>
                      </div>
                    </div>

                    {/* Quick View Button */}
                    <Link href={`/item/${item._id}`}>
                      <Button
                        variant="secondary"
                        onClick={()=>handleRouteChange(`/item/${item._id}`)}
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white hover:bg-gray-100 text-gray-900 shadow-xl"
                        aria-label={`View details of ${item.name}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(item.rating || 0)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.rating ? item.rating.toFixed(1) : "New"}
                      </span>
                    </div>



                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className={`w-full flex items-center justify-center gap-2 py-6 rounded-xl font-semibold transition-all duration-200 ${localLoading[item._id] || isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                      disabled={localLoading[item._id] || isLoading}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      {localLoading[item._id] ? (
                        <>
                          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}

        {/* Menu Categories */}
        {filteredAndSortedCategories.length > 0 ? (
          filteredAndSortedCategories.map((category, index) => (
            <motion.section
              key={category._id}
              className="mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {category.items.length} item{category.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: itemIndex * 0.05, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={item} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={clearFilters}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* User Login Dialog */}
      <UserDialog open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
};

export default Menu;
