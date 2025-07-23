import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const ItemAvatar = ({ src, alt }) => (
  <Avatar className="w-12 h-12 ring-1 ring-gray-300 shadow-sm">
    <AvatarImage src={src} alt={alt || 'Item image'} />
  </Avatar>
);

ItemAvatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

const MenuTable = ({ categories, items, onItemDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);
  const safeItems = Array.isArray(items) ? items : [];

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setDeletingId(itemId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Item deleted');
        if (onItemDeleted) onItemDeleted(itemId);
      } else {
        toast.error(data.error || 'Failed to delete item');
      }
    } catch {
      toast.error('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto p-2 rounded-lg border w-[90%] flex items-center justify-center">
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
                  {
                    categories?.find((cat) => cat._id === item.category)?.name ||
                    item.category ||
                    '-'
                  }
                </TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                <TableCell>
                  <ItemAvatar src={item.image} alt={item.name} />
                </TableCell>
                <TableCell className="flex gap-2">
                  <Link href={`/admin/item/${item._id}`} passHref legacyBehavior>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Edit Item"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    title="Delete Item"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === item._id && (
                      <span className="ml-2 text-xs">Deleting...</span>
                    )}
                  </Button>
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
    </div>
  );
};

MenuTable.propTypes = {
  categories: PropTypes.array,
  items: PropTypes.array,
  onItemDeleted: PropTypes.func, // Optional callback to update parent state
};

export default MenuTable;