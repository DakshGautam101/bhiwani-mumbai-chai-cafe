import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import FeatureDialog from "./FeatureDialog";

const ItemTable = ({ categories, items, onItemDeleted, onFeatureToggled }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const safeItems = Array.isArray(items) ? items : [];

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeletingId(itemId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/item/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Item deleted");
        if (onItemDeleted) onItemDeleted(itemId);
      } else {
        toast.error(data.error || "Failed to delete item");
      }
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFeatureToggle = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    if (item.isFeatured) {
      if (!window.confirm("Are you sure you want to remove this item from featured?")) {
        return;
      }
      await unfeatureItem(item._id);
    } else {
      setSelectedItem(item);
      setFeatureDialogOpen(true);
    }
  };

  const unfeatureItem = async (itemId) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/feature/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ heading: "", discount: 0 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Item removed from featured");
      onFeatureToggled?.(itemId, false);
    } catch (error) {
      toast.error(error.message || "Failed to update feature status");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeatureConfirmed = async (heading, discount) => {
    if (!selectedItem) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/feature/${selectedItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ heading, discount: Number(discount) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Item featured successfully");
      onFeatureToggled?.(selectedItem._id, true, { heading, discount });
    } catch (error) {
      toast.error(error.message || "Failed to feature item");
    } finally {
      setIsProcessing(false);
      setFeatureDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const renderFeatureStatus = (item) => (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => handleFeatureToggle(item)}
        disabled={isProcessing}
        variant={item.isFeatured ? "outline" : "default"}
        size="icon"
        className={`w-8 h-8 ${
          item.isFeatured
            ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200"
            : "hover:bg-yellow-50"
        }`}
        title={item.isFeatured ? "Remove from featured" : "Add to featured"}
      >
        <Star
          className={`w-4 h-4 ${
            item.isFeatured
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-500"
          }`}
        />
      </Button>
      {item.isFeatured && (
        <span className="text-xs text-gray-500">
          Original: ₹{item.originalPrice}
        </span>
      )}
    </div>
  );

  return (
    <div className="overflow-x-auto p-2 rounded-lg border w-full flex items-center justify-center">
      <Table>
        <TableHeader className="bg-gray-100 rounded-lg dark:bg-gray-800">
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead className="min-w-[150px]">Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeItems.length > 0 ? (
            safeItems.map((item, index) => (
              <TableRow key={item._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  {typeof item.category === "object"
                    ? item.category?.name
                    : categories?.find((cat) => cat._id === item.category)?.name || "-"}
                </TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                <TableCell>
                  <img
                    src={item.image || "/fallback-image.jpg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded shadow"
                  />
                </TableCell>
                <TableCell className="flex gap-2">
                  <Link href={`/admin/item/${item._id}`} passHref legacyBehavior>
                    <Button variant="outline" size="sm" title="Edit Item">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    title="Delete Item"
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === item._id && <span className="ml-2 text-xs">Deleting...</span>}
                  </Button>
                  {renderFeatureStatus(item)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Feature Dialog */}
      <FeatureDialog
        open={featureDialogOpen}
        onClose={() => setFeatureDialogOpen(false)}
        itemId={selectedItem?._id}
        onConfirm={handleFeatureConfirmed}
      />
    </div>
  );
};

ItemTable.propTypes = {
  categories: PropTypes.array,
  items: PropTypes.array,
  onItemDeleted: PropTypes.func,
  onFeatureToggled: PropTypes.func,
};

export default ItemTable;
