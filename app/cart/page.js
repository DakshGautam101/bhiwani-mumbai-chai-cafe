'use client';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import useCartStore from '@/app/store/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Link from 'next/link';
import UniversalLoader from '../components/UniversalLoader';
import LoaderWrapper from '@/app/components/LoaderWrapper';

const CartPage = () => {
  const { user } = useContext(UserContext);
  const { cart, displayCart, clearCart, updateQuantity } = useCartStore();

  const [groupedCart, setGroupedCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await displayCart(user._id);
      } catch (err) {
        setError('Failed to load cart');
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

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setIsClearing(true);
    try {
      await clearCart({ userId: user._id });
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setIsClearing(false);
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

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

  const totalPrice = groupedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-200 mb-2">Please Log In</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You need to be logged in to view your cart.</p>
            <Link href="/auth/login">
              <Button className="bg-orange-500 hover:bg-orange-600">Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <UniversalLoader />
        <Footer />
      </>
    );
  }

  return (
    <>
      {isClearing && <UniversalLoader />}
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Your Cart</h1>

          {groupedCart.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-200 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Add some delicious items to get started!</p>
              <Link href="/menu">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Cart Items ({groupedCart.length})
                    </h2>
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50"
                      disabled={isClearing}
                    >
                      {isClearing ? 'Clearing...' : 'Clear Cart'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {groupedCart.map((item, index) => {
                      const isItemUpdating = updatingItemId === (item._id || item.id);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image || "https://via.placeholder.com/80"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300">₹{item.price}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={isItemUpdating}
                            >
                              {isItemUpdating ? (
                                <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-black dark:border-white rounded-full" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </Button>

                            <span className="w-8 text-center font-semibold text-gray-800 dark:text-gray-100">
                              {item.quantity}
                            </span>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={isItemUpdating}
                            >
                              {isItemUpdating ? (
                                <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-black dark:border-white rounded-full" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Order Summary</h2>

                  <div className="space-y-3 mb-6 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>₹{totalPrice > 0 ? 50 : 0}</span>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-700" />
                    <div className="flex justify-between font-semibold text-lg text-gray-900 dark:text-white">
                      <span>Total:</span>
                      <span>
                        ₹{(totalPrice + (totalPrice > 0 ? 50 : 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={groupedCart.length === 0}
                  >
                    <Link href="/Checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>

                  <div className="mt-4 text-center">
                    <Link href="/menu" className="text-orange-500 hover:underline">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
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
