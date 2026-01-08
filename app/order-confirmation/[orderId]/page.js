"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId; // Change: Use orderId from params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Debug logs
        console.log("Starting fetch...");
        console.log("OrderId:", orderId);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Make the API call
        const response = await fetch(`/api/order/${orderId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have an orderId
    if (orderId) {
      console.log("Initiating fetch for orderId:", orderId);
      fetchOrder();
    } else {
      console.log("No orderId available");
      setLoading(false);
    }
  }, [orderId]); // Change: Dependency on orderId instead of id

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/menu"
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Return to Menu
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
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">No order found.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            {/* ✅ Success header */}
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600">
                Thank you for your order. Your order number is #{orderId}
              </p>
            </div>

            <div className="space-y-6">
              {/* ✅ Order Details */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Delivery Method</p>
                    <p className="font-medium">
                      {order.deliveryMethod === "delivery"
                        ? "Home Delivery"
                        : order.deliveryMethod || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delivery Date & Time</p>
                    <p className="font-medium">
                      {order.deliveryDate} at {order.deliveryTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Status</p>
                    <p className="font-medium">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <p className="font-medium">{order.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {/* ✅ Home Delivery Address */}
              {order.deliveryMethod === "delivery" && order.deliveryAddress && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                  <p className="text-gray-600">
                    {order.deliveryAddress.address}
                    <br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.zip}
                  </p>
                </div>
              )}

              {/* ✅ Customer Info */}
              {order.contactInfo && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
                  <p className="text-gray-600">
                    {order.contactInfo.firstName} {order.contactInfo.lastName}
                    <br />
                    Phone: {order.contactInfo.phone}
                    <br />
                    Email: {order.contactInfo.email}
                  </p>
                </div>
              )}

              {/* ✅ Items Ordered */}
              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Payment Details */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment ID</p>
                    <p className="font-medium">{order.razorpayPaymentId}</p>
                  </div>
                </div>
              </div>

              {/* ✅ Total */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold">
                    ₹{order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              {/* ✅ CTA */}
              <div className="flex justify-center pt-6">
                <Link
                  href="/menu"
                  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
