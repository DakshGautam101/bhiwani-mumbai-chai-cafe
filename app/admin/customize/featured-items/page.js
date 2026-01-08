"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  RefreshCw,
  Star,
  Trash2,
  Search,
  X,
  TrendingUp,
  DollarSign,
  Package,
  AlertCircle,
  Eye,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedItemsPage() {
  // State Management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);

  // Fetch featured items
  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  // Filter items based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.featured[0]?.heading?.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const fetchFeaturedItems = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await fetch("/api/admin/featured-items", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch featured items");
      }

      const data = await response.json();
      setItems(data.items || []);
      setFilteredItems(data.items || []);
      
      if (isRefresh) {
        toast.success("Featured items refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching featured items:", error);
      toast.error(error.message || "Failed to load featured items");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUnfeature = async (itemId) => {
    setDeletingItemId(itemId);
    
    try {
      const response = await fetch(`/api/admin/featured-items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove featured item");
      }

      // Update local state
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      setFilteredItems((prev) => prev.filter((item) => item._id !== itemId));
      
      toast.success("Item removed from featured successfully");
    } catch (error) {
      console.error("Error removing featured item:", error);
      toast.error(error.message || "Failed to remove item");
    } finally {
      setDeletingItemId(null);
      setShowDeleteDialog(false);
      setSelectedItem(null);
    }
  };

  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!discount || discount <= 0) return originalPrice;
    return Math.round(originalPrice * (1 - discount / 100));
  };

  const calculateSavings = (originalPrice, discount) => {
    if (!discount || discount <= 0) return 0;
    return originalPrice - calculateDiscountedPrice(originalPrice, discount);
  };

  // Statistics
  const stats = {
    total: items.length,
    totalSavings: items.reduce(
      (sum, item) => sum + calculateSavings(item.price, item.featured[0]?.discount),
      0
    ),
    averageDiscount:
      items.length > 0
        ? Math.round(
            items.reduce((sum, item) => sum + (item.featured[0]?.discount || 0), 0) /
              items.length
          )
        : 0,
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        <p className="text-gray-600 dark:text-gray-400">Loading featured items...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Items
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your featured menu items and special offers
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fetchFeaturedItems(true)}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="default"
              onClick={() => (window.location.href = "/admin/customize/menu-customization")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
            >
              <Edit className="w-4 h-4" />
              Customize Menu
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Total Featured
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Total Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{stats.totalSavings}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Avg. Discount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.averageDiscount}%
                    </p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        {items.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search featured items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Found {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                <Star className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Featured Items
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                You haven't featured any items yet. Start showcasing your best dishes to
                customers!
              </p>
              <Button
                variant="default"
                onClick={() =>
                  (window.location.href = "/admin/customize/menu-customization")
                }
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Edit className="w-4 h-4" />
                Go to Menu Customization
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No featured items match your search query
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-white" />
                        FEATURED
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-500 text-white font-bold shadow-lg">
                        {item.featured[0]?.discount}% OFF
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h3>
                      
                      {item.featured[0]?.heading && (
                        <p className="text-orange-600 dark:text-orange-400 font-medium text-sm mb-2 line-clamp-1">
                          {item.featured[0].heading}
                        </p>
                      )}
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {item.description || "No description available"}
                      </p>

                      {/* Price Section */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Original Price
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ₹{item.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Discounted Price
                          </span>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ₹
                            {calculateDiscountedPrice(
                              item.price,
                              item.featured[0]?.discount
                            )}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              You Save
                            </span>
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                              ₹{calculateSavings(item.price, item.featured[0]?.discount)} (
                              {item.featured[0]?.discount}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`/item/${item._id}`, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDeleteDialog(true);
                        }}
                        disabled={deletingItemId === item._id}
                      >
                        {deletingItemId === item._id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Featured Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{selectedItem?.name}" from featured items?
              This will stop displaying it as a featured item to customers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedItem(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedItem && handleUnfeature(selectedItem._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}