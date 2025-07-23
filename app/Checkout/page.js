'use client';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import useCartStore from '../store/cartStore';
import Footer from '../components/footer';

const CheckoutPage = () => {
  const { user } = useContext(UserContext);
  const { cart } = useCartStore();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', form, groupedCart);
    // trigger order API here
  };

  return (
    <>
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
              className="input-style"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="input-style"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="input-style"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="input-style"
            />
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
              className="input-style"
            />
            <input
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="Convenient Time"
              className="input-style"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="input-style"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street Address"
              className="input-style md:col-span-2"
            />
            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="ZIP Code"
              className="input-style"
            />
          </div>

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
            Proceed to Checkout →
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
                Checkout →
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
