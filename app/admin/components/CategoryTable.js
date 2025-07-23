'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CategoryTable = ({ categories, onCategoryChanged }) => {
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    setEditForm({ name: cat.name, description: cat.description || '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (catId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/category/${catId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Category updated');
        setEditingId(null);
        setEditForm({ name: '', description: '' });
        onCategoryChanged?.();
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setDeletingId(catId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/category/${catId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Category deleted');
        onCategoryChanged?.();
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeCategories.length > 0 ? (
            safeCategories.map((cat) => (
              <TableRow key={cat._id || cat.name}>
                {/* Image Preview */}
                <TableCell>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-14 h-14 rounded object-cover border shadow-sm"
                  />
                </TableCell>

                {/* Editable Name */}
                <TableCell>
                  {editingId === cat._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="input input-bordered w-full"
                    />
                  ) : (
                    cat.name
                  )}
                </TableCell>

                {/* Editable Description */}
                <TableCell>
                  {editingId === cat._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="input input-bordered w-full"
                    />
                  ) : (
                    cat.description || '-'
                  )}
                </TableCell>

                {/* Item Count */}
                <TableCell>

                  {cat.itemsCount ?? 0}
                </TableCell>


                {/* Actions */}
                <TableCell className="flex gap-2">
                  {editingId === cat._id ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSave(cat._id)}
                        disabled={deletingId === cat._id}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={deletingId === cat._id}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Edit"
                        onClick={() => handleEditClick(cat)}
                        disabled={deletingId === cat._id}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        title="Delete"
                        onClick={() => handleDelete(cat._id)}
                        disabled={deletingId === cat._id}
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === cat._id && (
                          <span className="ml-2 text-xs">Deleting...</span>
                        )}
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

CategoryTable.propTypes = {
  categories: PropTypes.array,
  onCategoryChanged: PropTypes.func,
};

export default CategoryTable;
