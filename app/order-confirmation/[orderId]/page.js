'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Clock, MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import UniversalLoader from '@/app/components/UniversalLoader';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your order');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/order/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setOrder(data.order);
        } else {
          setError(data.error || 'Failed to fetch order details');
        }
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return <UniversalLoader />;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">Go Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Order Not Found</h1>
            <p className="text-gray-500 mb-4">The order you &apos;re looking for doesn&apos;t exist.</p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">Go Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-orange-600 bg-orange-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'delivered': return 'text-green-700 bg-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">Thank you for your order. We&apos;ll prepare it with care.</p>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-xl font-mono font-bold text-gray-800">{order.orderId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Details
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-semibold text-gray-800">₹{item.total}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Delivery:</span>
                  <span>₹{order.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Order Status & Info */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Order Status
                </h2>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Ordered on {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Information
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Method:</span> {order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </p>
                  {order.deliveryAddress && (
                    <p className="text-sm">
                      <span className="font-medium">Address:</span> {order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.zip}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {order.deliveryDate}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Time:</span> {order.deliveryTime}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {order.contactInfo.firstName} {order.contactInfo.lastName}
                  </p>
                  <p className="text-sm flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {order.contactInfo.phone}
                  </p>
                  <p className="text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {order.contactInfo.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 text-center space-x-4">
            <Link href="/menu">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/auth/profile">
              <Button variant="outline">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmationPage;