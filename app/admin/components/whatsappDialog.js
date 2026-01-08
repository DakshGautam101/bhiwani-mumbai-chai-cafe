"use client";

import React, { useContext, useState, useMemo } from "react";
import { RiAiGenerate2 } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { UserContext } from "@/context/UserContext";
import { orderContext } from "@/context/orderContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function WhatsappDialog({ open, setOpen }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);
  const { order } = useContext(orderContext);

  // ✅ Safely construct customerInfo (prevents crashes)
  const customerInfo = useMemo(() => {
    if (!order) return null;

    return {
      orderId: order._id ?? "Unknown",
      customerName: `${order.contactInfo?.firstName ?? ""} ${order.contactInfo?.lastName ?? ""}`.trim(),
      orderDate: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : "<DATE>",
      orderTime: order.createdAt
        ? new Date(order.createdAt).toLocaleTimeString()
        : "<TIME>",
      totalAmount: order.totalAmount ?? "<TOTAL_AMOUNT>",
      email: order.contactInfo?.email ?? "",
      phone: order.contactInfo?.phone ?? "",
    };
  }, [order]);

  const commonMessages = [
    "Your order has been confirmed!",
    "Your order has been shipped!",
    "Your order has been delivered!",
    "Your order has been cancelled.",
  ];

  // ✅ Send WhatsApp message
  const handleSend = async () => {
    if (!user?.phone) {
      toast.error("Customer phone number not found!");
      return;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = user.phone.startsWith("+")
        ? user.phone
        : `+91${user.phone}`;

      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formattedPhone,
          body: message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send message");

      toast.success("WhatsApp message sent successfully");
      setMessage("");
      setOpen(false);
    } catch (error) {
      console.error("WhatsApp API Error:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate AI message
  const handleAIGenerate = async () => {
    if (!customerInfo) {
      toast.error("Order data not available");
      return;
    }

    const toastId = toast.loading("Generating AI message...");
    try {
      const res = await fetch("/api/whatsapp/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          customerInfo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "AI generation failed");

      setMessage(data.message);
      toast.success("AI message generated", { id: toastId });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to generate AI message", { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-5 p-6 rounded-2xl max-w-md mx-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <FaWhatsapp className="text-green-500" /> Notify Customer
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Send a WhatsApp message to the customer about their order status.
          </DialogDescription>
        </DialogHeader>

        {/* Common Messages */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Commonly used messages:</span>
          {commonMessages.map((msg, idx) => (
            <div
              key={idx}
              className="cursor-pointer flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-100 text-sm"
              onClick={() => setMessage(msg)}
            >
              <span>{msg}</span>
              <ArrowRight size={16} />
            </div>
          ))}
        </div>

        {/* Message Box */}
        <div className="relative">
          <RiAiGenerate2
            className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
            title="AI Generate Message"
            onClick={handleAIGenerate}
          />
          <Textarea
            rows={4}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pr-8 max-h-40"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white flex gap-2"
          >
            <FaWhatsapp /> {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WhatsappDialog;
