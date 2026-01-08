"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 7;
  const router = useRouter();

  // Format date to human-readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found");
      toast.error("Please login again");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const baseUrl = "http://localhost:3000";

      const res = await fetch(`${baseUrl}/api/admin/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data || !Array.isArray(data.orders)) {
        throw new Error("Invalid data format received from server");
      }

      setOrders(data.orders);
      setFilteredOrders(data.orders);
    } catch (err) {
      console.error("Fetch error details:", err);
      setError(err.message || "Failed to fetch orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search + status
  useEffect(() => {
    let updatedOrders = [...orders];

    // Search filter
    if (search.trim() !== "") {
      updatedOrders = updatedOrders.filter(
        (order) =>
          order._id.toLowerCase().includes(search.toLowerCase()) ||
          order.contactInfo?.firstName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          order.contactInfo?.lastName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          order.contactInfo?.email
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "All") {
      updatedOrders = updatedOrders.filter(
        (order) => order.status === filterStatus
      );
    }

    setFilteredOrders(updatedOrders);
    setPage(1); // Reset to first page when filter changes
  }, [search, filterStatus, orders]);

  // Fetch data on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Paginated data
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredOrders.slice(start, start + perPage);
  }, [filteredOrders, page]);

  const totalPages = Math.ceil(filteredOrders.length / perPage);

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Recent Orders</h1>

        {/* Search & Filter Controls */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative w-full md:w-64">
            <Search className="absolute top-3 left-3 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                {filterStatus} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-white shadow-md rounded-md p-2">
              <DropdownMenuItem onClick={() => setFilterStatus("All")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600 text-lg">Loading orders...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500 font-medium">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders found.</div>
      ) : (
        <>
          <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {order.contactInfo?.firstName}{" "}
                        {order.contactInfo?.lastName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {order.contactInfo?.email || "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {order.contactInfo?.phone || "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-xs truncate">
                    {order.deliveryAddress
                      ? `${order.deliveryAddress.address}, ${order.deliveryAddress.city} - ${order.deliveryAddress.zip}`
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Completed"
                          ? "success"
                          : order.status === "Pending"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "Paid" ? "success" : "destructive"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>

                  <TableCell className="capitalize">
                    {order.paymentMethod || "N/A"}
                  </TableCell>

                  <TableCell>
                    {order.items?.length || 0} item
                    {order.items?.length > 1 ? "s" : ""}
                  </TableCell>

                  <TableCell>{formatDate(order.createdAt)}</TableCell>

                  <TableCell className="text-center">
                    <Button
                      onClick={() =>
                        router.push(
                          `/admin/customize/order-management/${order._id}`
                        )
                      }
                      variant="outline"
                      className="text-orange-600 hover:bg-orange-50 transition"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-gray-600 text-sm">
                Showing {(page - 1) * perPage + 1}-
                {Math.min(page * perPage, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Prev
                </Button>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderTable;
