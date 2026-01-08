"use client";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Package,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  Home,
  Banknote,
  ShieldCheck,
  Truck,
  Store,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import useCartStore from "../store/cartStore";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CheckoutPage = () => {
  // 1. Context & Router
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [routeChange, setRouteChange] = useState(false);
  // 2. Store
  const { cart, clearCart } = useCartStore();

  // 3. State
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    deliveryMethod: "store",
    address: "",
    city: "",
    zip: "",
    date: "",
    time: "",
    paymentMethod: "pay now",
  });

  // 4. Derived cart calculations
  const normalizedCart = Array.isArray(cart)
    ? cart.map((item) => ({
      ...item,
      quantity: Number(item.quantity || item.qty || 0),
      price:
        typeof item.price === "string"
          ? parseFloat(item.price)
          : Number(item.price || 0),
    }))
    : [];

  const subtotal = normalizedCart.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0);

  const deliveryFee = form.deliveryMethod === "delivery" ? 50 : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  // 5. Effects
  useEffect(() => {
    if (user) {
      const [firstName = "", lastName = ""] = (user.name || "").split(" ");
      setForm((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 6. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "deliveryMethod" && value === "store") {
      setForm((prev) => ({ ...prev, address: "", city: "", zip: "" }));
      setErrors((prev) => ({ ...prev, address: "", city: "", zip: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address"
          : "";
      case "phone":
        return !/^\d{10}$/.test(value)
          ? "Please enter a valid 10-digit phone number"
          : "";
      case "zip":
        return form.deliveryMethod === "delivery" && !/^\d{6}$/.test(value)
          ? "Please enter a valid 6-digit ZIP code"
          : "";
      case "date":
        return !value ? "Please select a delivery date" : "";
      case "time":
        return !value ? "Please enter a preferred time" : "";
      default:
        return !value ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required` : "";
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      ["firstName", "lastName", "email", "phone"].forEach((field) => {
        const error = validateField(field, form[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 2) {
      const deliveryFields = ["date", "time"];
      if (form.deliveryMethod === "delivery") {
        deliveryFields.push("address", "city", "zip");
      }
      deliveryFields.forEach((field) => {
        const error = validateField(field, form[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(1) || !validateStep(2)) {
      toast.error("Please complete all required information");
      setCurrentStep(1);
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        router.push("/auth/login");
        return;
      }

      const orderData = {
        userId: user._id,
        items: normalizedCart.map((item) => ({
          itemId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        deliveryMethod: form.deliveryMethod,
        deliveryAddress:
          form.deliveryMethod === "delivery"
            ? { city: form.city, address: form.address, zip: form.zip }
            : null,
        deliveryDate: form.date,
        deliveryTime: form.time,
        contactInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        paymentMethod:
          form.paymentMethod === "pay now" ? "razorpay" : "cash on delivery",
        paymentStatus: "Pending",
        status: "Pending",
      };

      if (form.paymentMethod === "pay now") {
        const orderRes = await fetch("/api/payments/razorpay-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: Math.round(total), currency: "INR" }),
        });

        if (!orderRes.ok) throw new Error("Failed to create payment order");

        const { orderId, key } = await orderRes.json();

        const options = {
          key,
          amount: Math.round(total),
          currency: "INR",
          name: "Bhiwani Mumbai Chai Cafe",
          description: "Order Payment",
          order_id: orderId,
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          handler: async function (response) {
            try {

              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData,
                }),
              });

              if (!verifyRes.ok) throw new Error("Payment verification failed");

              const data = await verifyRes.json();
              await clearCart({ userId: user._id });
              toast.success("Payment successful! 🎉");
              setRouteChange(true);

              router.push(`/order-confirmation/${data.order._id}`);
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(error.message || "Payment verification failed");
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast.error("Payment cancelled");
            },
          },
          theme: { color: "#F97316" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // COD
        const orderRes = await fetch("/api/order/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!orderRes.ok) throw new Error("Failed to create order");

        const data = await orderRes.json();
        await clearCart({ userId: user._id });
        toast.success("Order placed successfully! 🎉");
        setRouteChange(true);
        router.push(`/order-confirmation/${data.order._id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Helper Components
  const StepIndicator = () => {
    const steps = [
      { number: 1, title: "Contact", icon: User },
      { number: 2, title: "Delivery", icon: Truck },
      { number: 3, title: "Payment", icon: CreditCard },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                      ? "bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900/30"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </motion.div>
                <span
                  className={`mt-2 text-xs font-medium ${isCurrent
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-600 dark:text-gray-400"
                    }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const InputField = ({ name, type = "text", placeholder, icon: Icon, ...props }) => {
    const hasError = touched[name] && errors[name];

    return (

      
      <div className="space-y-1">
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            placeholder={placeholder}
            className={`w-full border rounded-xl p-3 transition-all ${Icon ? "pl-11" : ""
              } ${hasError
                ? "border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900/30"
              } dark:bg-gray-800 dark:text-white`}
            {...props}
          />
        </div>
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-1 text-red-500 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors[name]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const CartItem = ({ item }) => {
    const itemPrice = item.price;
    const itemQuantity = item.quantity;
    const itemTotal = itemPrice * itemQuantity;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
      >
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.image || "/fallback.jpg"}
            fill
            alt={item.name}
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {item.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Qty: {itemQuantity} × ₹{itemPrice.toFixed(2)}
          </p>
        </div>
        <div className="font-bold text-gray-900 dark:text-white">
          ₹{itemTotal.toFixed(2)}
        </div>
      </motion.div>
    );
  };

  if (!user) return null;

  // 8. Main Render
  return (
    <>
    { routeChange && <UniversalLoader /> }
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Cart</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your order in a few simple steps
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <Card className="shadow-xl border-2 border-gray-100 dark:border-gray-800">
                <CardContent className="p-6 md:p-8">
                  <StepIndicator />

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1: Contact Information */}
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              <User className="w-6 h-6 text-orange-500" />
                              Contact Information
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              We'll use this to send you order updates
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div className="flex items-center gap-2">
                              <User size={20} className="text-muted-foreground" />
                              <InputField
                                name="firstName"
                                placeholder="First Name"
                                className="w-full"
                              />
                            </div>

                            {/* Last Name */}
                            <div className="flex items-center gap-2">
                              <User size={20} className="text-muted-foreground" />
                              <InputField
                                name="lastName"
                                placeholder="Last Name"
                                className="w-full"
                              />
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-2">
                              <Mail size={20} className="text-muted-foreground" />
                              <InputField
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                className="w-full"
                              />
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-2">
                              <Phone size={20} className="text-muted-foreground" />
                              <InputField
                                name="phone"
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              type="button"
                              onClick={handleNextStep}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8"
                            >
                              Continue to Delivery
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Delivery Information */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              <Truck className="w-6 h-6 text-orange-500" />
                              Delivery Details
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Choose how you'd like to receive your order
                            </p>
                          </div>

                          {/* Delivery Method */}
                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Delivery Method
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                {
                                  value: "store",
                                  label: "Store Pickup",
                                  icon: Store,
                                  desc: "Free • Ready in 30 mins",
                                },
                                {
                                  value: "delivery",
                                  label: "Home Delivery",
                                  icon: Truck,
                                  desc: "₹50 • Delivered to you",
                                },
                              ].map((method) => {
                                const Icon = method.icon;
                                const isSelected = form.deliveryMethod === method.value;

                                return (
                                  <motion.button
                                    key={method.value}
                                    type="button"
                                    onClick={() =>
                                      setForm((f) => ({
                                        ...f,
                                        deliveryMethod: method.value,
                                      }))
                                    }
                                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                      : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                                      }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`p-2 rounded-lg ${isSelected
                                          ? "bg-orange-500 text-white"
                                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                          }`}
                                      >
                                        <Icon className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                          {method.label}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          {method.desc}
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <Check className="w-5 h-5 text-orange-500" />
                                      )}
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              name="date"
                              type="date"
                              placeholder="Delivery Date"
                              // icon={Calendar}
                              min={new Date().toISOString().split("T")[0]}
                            />

                            <InputField
                              name="time"
                              type="time"
                              placeholder="Preferred Time"
                            // icon={Clock}
                            />
                          </div>


                          {/* Address Fields for Delivery */}
                          <AnimatePresence>
                            {form.deliveryMethod === "delivery" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                              >
                                <Separator />
                                <div className="space-y-4">
                                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Delivery Address
                                  </label>

                                  <InputField
                                    name="address"
                                    placeholder="Street Address"
                                    // icon={Home}
                                    required
                                  />

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                      name="city"
                                      placeholder="City"
                                      // icon={MapPin}
                                      required
                                    />

                                    <InputField
                                      name="zip"
                                      placeholder="ZIP Code"
                                      // icon={Package}
                                      inputMode="numeric"
                                      pattern="[0-9]{6}"
                                      maxLength={6}
                                      required
                                    />
                                  </div>
                                </div>

                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="flex justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePrevStep}
                            >
                              Back
                            </Button>
                            <Button
                              type="button"
                              onClick={handleNextStep}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8"
                            >
                              Continue to Payment
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Payment */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              <CreditCard className="w-6 h-6 text-orange-500" />
                              Payment Method
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Choose how you'd like to pay
                            </p>
                          </div>

                          <div className="space-y-3">
                            {[
                              {
                                value: "pay now",
                                label: "Pay Online",
                                icon: CreditCard,
                                desc: "Secure payment via Razorpay",
                                badge: "Recommended",
                              },
                              {
                                value: "cash on delivery",
                                label: "Cash on Delivery",
                                icon: Banknote,
                                desc: "Pay when you receive",
                              },
                            ].map((method) => {
                              const Icon = method.icon;
                              const isSelected = form.paymentMethod === method.value;

                              return (
                                <motion.button
                                  key={method.value}
                                  type="button"
                                  onClick={() =>
                                    setForm((f) => ({ ...f, paymentMethod: method.value }))
                                  }
                                  className={`w-full relative p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                                    }`}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${isSelected
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                        }`}
                                    >
                                      <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {method.label}
                                        </span>
                                        {method.badge && (
                                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            {method.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {method.desc}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <Check className="w-5 h-5 text-orange-500" />
                                    )}
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>

                          {/* Security Badge */}
                          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <div className="text-sm">
                              <span className="font-semibold text-green-900 dark:text-green-100">
                                Secure Payment
                              </span>
                              <p className="text-green-700 dark:text-green-300">
                                Your payment information is encrypted and secure
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePrevStep}
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={isProcessing}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 font-semibold"
                            >
                              {isProcessing ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                  />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Place Order • ₹{total.toFixed(2)}
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-96"
            >
              <Card className="sticky top-4 shadow-xl border-2 border-gray-100 dark:border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Order Summary
                  </h3>

                  {normalizedCart.length > 0 ? (
                    <>
                      {/* Cart Items */}
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 mb-4 custom-scrollbar">
                        <AnimatePresence>
                          {normalizedCart.map((item, idx) => (
                            <CartItem key={item._id || idx} item={item} />
                          ))}
                        </AnimatePresence>
                      </div>

                      <Separator className="my-4" />

                      {/* Price Breakdown */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Subtotal</span>
                          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Delivery Fee</span>
                          <span className="font-medium">
                            {deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : "FREE"}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Tax (5%)</span>
                          <span className="font-medium">₹{tax.toFixed(2)}</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>

                      {/* Items Count */}
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          {normalizedCart.length} item{normalizedCart.length !== 1 ? "s" : ""}{" "}
                          in cart
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>

      <Footer />
    </>
  );
};

export default CheckoutPage;