'use client';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import useCartStore from '@/app/store/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  Package,
  AlertCircle,
  Sparkles,
  Tag,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Link from 'next/link';
import UniversalLoader from '../components/UniversalLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton Loader Component
const CartSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-2" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-24 h-24 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-px w-full my-4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-12 w-full mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { user } = useContext(UserContext);
  const { cart, displayCart, clearCart, updateQuantity, removeItem } = useCartStore();

  const [groupedCart, setGroupedCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await displayCart(user._id);
      } catch (err) {
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCart();
    else setLoading(false);
  }, [user, displayCart]);

  useEffect(() => {
    const grouped = Object.values(
      cart.reduce((acc, item) => {
        const key = item._id || item.id;
        if (!acc[key]) {
          acc[key] = { ...item, quantity: 1 };
        } else {
          acc[key].quantity += 1;
        }
        return acc;
      }, {})
    );
    setGroupedCart(grouped);
  }, [cart]);

  const handleRouteChange = () => {
    window.scrollTo(0, 0);
    setCheckoutLoading(true);
  };

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setIsClearing(true);
    try {
      await clearCart({ userId: user._id });
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveItem = async (item) => {
    setRemovingItemId(item._id || item.id);
    try {
      await removeItem({ userId: user._id, itemId: item._id || item.id });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }

    setUpdatingItemId(item._id || item.id);
    try {
      await updateQuantity({
        userId: user._id,
        itemId: item._id || item.id,
        quantity: newQuantity,
      });
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const subtotal = groupedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;
  const savings = groupedCart.reduce(
    (total, item) => total + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0),
    0
  );

  // Show checkout loading
  if (checkoutLoading) {
    return <UniversalLoader />;
  }

  // Not Logged In
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
              Please Log In
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You need to be logged in to view your cart and checkout
            </p>
            <Link href="/auth/login">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold">
                Login to Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  // Loading
  if (loading) {
    return (
      <>
        <Navbar />
        <CartSkeleton />
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isClearing && <UniversalLoader />}
      </AnimatePresence>

      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0 px-4 py-2 text-sm font-semibold mb-4">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shopping Cart
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
              Your Cart
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {groupedCart.length} {groupedCart.length === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </motion.div>

          {/* Empty Cart */}
          {groupedCart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Add some delicious items to get started!
              </p>
              <Link href="/menu">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold">
                  <Package className="w-5 h-5 mr-2" />
                  Browse Menu
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-6"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      Cart Items
                    </h2>
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-800"
                      disabled={isClearing}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isClearing ? 'Clearing...' : 'Clear All'}
                    </Button>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {groupedCart.map((item, index) => {
                        const isItemUpdating = updatingItemId === (item._id || item.id);
                        const isItemRemoving = removingItemId === (item._id || item.id);
                        const itemTotal = item.price * item.quantity;

                        return (
                          <motion.div
                            key={item._id || item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                          >
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item)}
                              disabled={isItemRemoving}
                              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>

                            <div className="flex items-center gap-4">
                              {/* Image */}
                              <div className="relative flex-shrink-0">
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                                  <Image
                                    src={item.image || "https://via.placeholder.com/80"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                {item.discount && (
                                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                                    {item.discount}% OFF
                                  </Badge>
                                )}
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl font-black text-orange-600 dark:text-orange-400">
                                    ₹{item.price}
                                  </span>
                                  {item.originalPrice && item.originalPrice > item.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{item.originalPrice}
                                    </span>
                                  )}
                                </div>
                                {/* {item.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.category}
                                  </Badge>
                                )} */}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full p-1 border-2 border-gray-200 dark:border-gray-700">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleQuantityChange(item, -1)}
                                    disabled={isItemUpdating}
                                    className="h-8 w-8 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>

                                  <span className="w-10 text-center font-bold text-gray-900 dark:text-white">
                                    {item.quantity}
                                  </span>

                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleQuantityChange(item, 1)}
                                    disabled={isItemUpdating}
                                    className="h-8 w-8 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="text-right">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Subtotal
                                  </div>
                                  <div className="text-xl font-black text-gray-900 dark:text-white">
                                    ₹{itemTotal}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Loading Overlay */}
                            {(isItemUpdating || isItemRemoving) && (
                              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-6 sticky top-4"
                >
                  <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal ({groupedCart.length} items)</span>
                      <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        Delivery Fee
                        {deliveryFee === 0 && subtotal > 0 && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                            FREE
                          </Badge>
                        )}
                      </span>
                      <span className="font-semibold">
                        {deliveryFee === 0 && subtotal > 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Tax (5%)</span>
                      <span className="font-semibold">₹{tax.toFixed(2)}</span>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Total Savings
                        </span>
                        <span className="font-semibold">-₹{savings.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

                    <div className="flex justify-between font-black text-xl text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link href="/Checkout" onClick={handleRouteChange} className="block mb-4">
                    <Button
                      size="lg"
                      className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                      disabled={groupedCart.length === 0}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/menu" className="block">
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <Package className="w-5 h-5 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;