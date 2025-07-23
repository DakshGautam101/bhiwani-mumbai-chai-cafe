'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getCategories } from "@/app/menu/data/menuData";

const initialState = {
  name: "",
  category: "",
  description: "",
  price: "",
  image: "",
  images: []
};

const ItemDialog = ({ open, setOpen, onItemAdded }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const fetchCategories = async () => {
    try {
      const categoryData = await getCategories();
      setCategories(categoryData || []);
    } catch (err) {
      console.error("Category fetch failed", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
          if (!form.image) {
            setForm(prev => ({ ...prev, image: data.secure_url }));
          }
        }
      }

      setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Image upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, category, description, price, image } = form;
    if (!name || !category || !description || !price || !image) {
      toast.error("All fields including image are required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Item added successfully");
        setForm(initialState);
        setOpen(false);
        if (onItemAdded) onItemAdded(data.item);
      } else {
        toast.error(data.error || "Failed to add item");
      }
    } catch {
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md space-y-6 p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add New Menu Item</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter item details and upload an image to create a new menu item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Eg. Margherita Pizza"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-input bg-background px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            >
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Write a short description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="Eg. 299"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              multiple
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition"
            />
            {form.images.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Image Previews</p>
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="rounded-lg w-full h-24 object-cover border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition"
          >
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
