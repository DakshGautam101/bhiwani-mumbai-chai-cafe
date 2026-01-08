"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Package, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import WhatsappDialog from "@/app/admin/components/whatsappDialog";
import { orderContext } from "@/context/orderContext";

const badgeClass = (s) =>
  `px-3 py-1 rounded-full text-xs font-semibold ${s === "Completed"
    ? "bg-green-100 text-green-700"
    : s === "Cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"
  }`;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {order, setOrder} = useContext(orderContext);

  // const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch order");
      setOrder(data.order);
      setStatus(data.order?.status || "Pending");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const items = useMemo(() => {
    if (!order?.items) return [];
    // Each item: { itemId: { name, price }, quantity }
    return order.items.map((it) => ({
      name: it?.itemId?.name ?? `#${it?.itemId?._id ?? "—"}`,
      price: Number(it?.itemId?.price ?? 0),
      quantity: Number(it?.quantity ?? 0),
    }));
  }, [order]);

  const computedTotal = useMemo(
    () =>
      items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0),
    [items]
  );

  const updateStatus = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      setOrder(data.order);
      toast.success(`Status set to ${status}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm("Cancel this order? This cannot be undone.")) return;
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel");
      toast.success("Order cancelled");
      router.push("/admin/customize/order-management");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-700">Loading order…</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="text-gray-600">Order not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back */}
      <button
        onClick={() => router.push("/admin/customize/order-management")}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </button>

      <div className="mx-auto max-w-5xl rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          </div>
          <span className={badgeClass(order.status)}>{order.status}</span>
        </div>

        {/* Customer */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Customer Details
          </h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="mb-1">
              <span className="font-semibold">Name: </span>
              {order?.contactInfo?.firstName || "—"}{" "}
              {order?.contactInfo?.lastName || ""}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Email: </span>
              {order?.contactInfo?.email || "—"}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Phone: </span>
              {order?.contactInfo?.phone || "—"}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Address: </span>
              {order?.deliveryAddress?.address || "—"},{" "}
              {order?.deliveryAddress?.city || "—"}{" "}
              {order?.deliveryAddress?.zip ? `- ${order.deliveryAddress.zip}` : ""}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Delivery: {order?.deliveryDate || "—"}{" "}
              {order?.deliveryTime ? `• ${order.deliveryTime}` : ""}
            </p>
          </div>
        </section>

        {/* Items */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Items Ordered
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No items in this order.
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{it.name}</td>
                      <td className="px-4 py-3">{it.quantity}</td>
                      <td className="px-4 py-3">₹{it.price.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{(it.price * it.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-right font-semibold">
                    Total Amount:
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    ₹{(order?.totalAmount ?? computedTotal).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={updateStatus}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Updating…" : "Update Status"}
            </button>
          </div>

          <button
            onClick={cancelOrder}
            disabled={saving || order.status === "Cancelled"}
            className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white shadow hover:bg-red-700 disabled:opacity-60"
          >
            Cancel Order
          </button>
          <Button className={'cursor-pointer'} onClick={() => setOpen(true)}>
            <Bell className=" h-4 w-4 " />
            Notify Customer
          </Button>
        </section>
      </div>
      <WhatsappDialog open={open} setOpen={setOpen} />
    </div>
  );
}
