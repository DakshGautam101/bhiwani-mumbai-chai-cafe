'use client';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import useCartStore from '../store/cartStore';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import UniversalLoader from '../components/UniversalLoader';

const CheckoutPage = () => {
  const { user } = useContext(UserContext);
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const groupedCart = Object.values(
    cart.reduce((acc, item) => {
      const id = item._id || item.id;
      if (!acc[id]) acc[id] = { ...item, quantity: 1 };
      else acc[id].quantity += 1;
      return acc;
    }, {})
  );

  const subtotal = groupedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  const [form, setForm] = useState({
    firstName: user?.name || '',
    lastName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryMethod: 'delivery',
    date: '',
    time: '',
    city: '',
    address: user?.address || '',
    zip: '',
    paymentMethod: 'visa',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.date) newErrors.date = 'Delivery date is required';
    if (!form.time.trim()) newErrors.time = 'Delivery time is required';
    
    if (form.deliveryMethod === 'delivery') {
      if (!form.city.trim()) newErrors.city = 'City is required';
      if (!form.address.trim()) newErrors.address = 'Address is required';
      if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (form.phone && !phoneRegex.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    if (groupedCart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: groupedCart.map(item => ({
          itemId: item._id || item.id,
          quantity: item.quantity
        })),
        deliveryMethod: form.deliveryMethod,
        deliveryAddress: form.deliveryMethod === 'delivery' ? {
          city: form.city,
          address: form.address,
          zip: form.zip
        } : null,
        contactInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone
        },
        paymentMethod: form.paymentMethod,
        totalAmount: total,
        deliveryDate: form.date,
        deliveryTime: form.time
      };
      
      const response = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Clear the cart
        await clearCart({ userId: user._id });
        
        toast.success('Order placed successfully!');
        
        // Redirect to order confirmation page
        router.push(`/order-confirmation/${data.order.orderId}`);
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-200 mb-2">Please Log In</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You need to be logged in to checkout.</p>
            <Link href="/auth/login">
              <Button className="bg-orange-500 hover:bg-orange-600">Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    {isProcessing && <UniversalLoader />}
    <Navbar/>
    <div className="min-h-screen bg-gray-100 text-gray-800 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left - Checkout Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-xl shadow-md p-8 space-y-6"
        >
          <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-black mb-6">
            <ArrowLeft /> Back to Cart
          </Link>

          {/* 1. Contact Info */}
          <h2 className="text-2xl font-semibold">1. Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className={`input-style ${errors.firstName ? 'border-red-500' : ''}`}
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={`input-style ${errors.lastName ? 'border-red-500' : ''}`}
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={`input-style ${errors.phone ? 'border-red-500' : ''}`}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={`input-style ${errors.email ? 'border-red-500' : ''}`}
              type="email"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* 2. Delivery Method */}
          <h2 className="text-2xl font-semibold">2. Delivery Method</h2>
          <div className="flex gap-4">
            {['store', 'delivery'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setForm((f) => ({ ...f, deliveryMethod: method }))}
                className={`delivery-toggle ${form.deliveryMethod === method ? 'bg-orange-100 border-orange-500' : ''}`}
              >
                {method === 'store' ? 'Store' : 'Delivery'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className={`input-style ${errors.date ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            <input
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="Convenient Time"
              className={`input-style ${errors.time ? 'border-red-500' : ''}`}
              required
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>

          {form.deliveryMethod === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className={`input-style ${errors.city ? 'border-red-500' : ''}`}
              required={form.deliveryMethod === 'delivery'}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street Address"
              className={`input-style md:col-span-2 ${errors.address ? 'border-red-500' : ''}`}
              required={form.deliveryMethod === 'delivery'}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1 md:col-span-2">{errors.address}</p>}
            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="ZIP Code"
              className={`input-style ${errors.zip ? 'border-red-500' : ''}`}
              required={form.deliveryMethod === 'delivery'}
            />
            {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
            </div>
          )}

          {/* 3. Payment Method */}
          <h2 className="text-2xl font-semibold">3. Payment Method</h2>
          <div className="flex gap-4">
            {['mastercard', 'visa', 'apple', 'other'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setForm((f) => ({ ...f, paymentMethod: method }))}
                className={`payment-option ${form.paymentMethod === method ? 'border-blue-600' : ''}`}
              >
                {method === 'visa' ? 'VISA' : method === 'apple' ? ' Pay' : method.toUpperCase()}
              </button>
            ))}
          </div>

          <Button type="submit" className="w-full mt-6 bg-orange-500 hover:bg-orange-600">
            {isProcessing ? 'Processing...' : 'Place Order →'}
          </Button>
        </form>

        {/* Right - Order Summary */}
        <div className="w-full lg:max-w-md bg-white rounded-xl shadow-md p-6 space-y-4">
          <h3 className="text-xl font-semibold">Order</h3>

          {groupedCart.length > 0 ? (
            <>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {groupedCart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b pb-4">
                    <Image
                      src={item.image || "/fallback.jpg"}
                      width={64}
                      height={64}
                      alt={item.name}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <div className="font-semibold text-gray-800">
                      ₹{item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>

              <hr />
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹{delivery}</span>
                </div>
              </div>
              <hr />
              <div className="text-lg font-bold flex justify-between">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Place Order →
              </Button>
              <p className="text-xs text-gray-400 text-center mt-2">
                By confirming the order, I accept the{' '}
                <span className="underline cursor-pointer">terms of the user agreement</span>.
              </p>
            </>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CheckoutPage;
