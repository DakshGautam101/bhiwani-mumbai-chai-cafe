'use client';

import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { toast, Toaster } from 'react-hot-toast';
import { Edit, Power, Star, Trash2, Save, X } from "lucide-react";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UniversalLoader from '../components/UniversalLoader';
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { UserContext } from '@/context/UserContext';

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editValues, setEditValues] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const avatarInputRef = useRef(null);
  const [editingReviewIdx, setEditingReviewIdx] = useState(null);
  const [editReview, setEditReview] = useState({ rating: '', review: '' });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError(data.error || "Failed to fetch profile");
        }
      })
      .catch(() => setError("Something went wrong while fetching profile."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      setEditValues({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    setIsDeleting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem('token');
        setUser(null);
        toast.success("Account deleted successfully");
        router.push('/auth');
      } else {
        toast.error(data.error || "Failed to delete account");
      }
    } catch {
      toast.error("Error deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

  const updateField = async (field, value) => {
    if (!value || value === user[field]) return;

    setIsUpdating(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        body: JSON.stringify({ [field]: value }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.user || data.message) {
        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
        setUser({ ...user, [field]: value });
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch {
      toast.error("Error updating field");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      await updateField("avatar", url);
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  // Edit review handler
  const handleEditReview = (idx) => {
    setEditingReviewIdx(idx);
    setEditReview({
      rating: user.reviews[idx]?.rating ?? '',
      review: user.reviews[idx]?.review ?? ''
    });
  };

  // Save review handler
  const handleSaveReview = async (idx) => {
    setIsUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/review/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ idx, ...editReview })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        toast.success("Review updated");
        setEditingReviewIdx(null);
      } else {
        toast.error(data.error || "Failed to update review");
      }
    } catch {
      toast.error("Error updating review");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete review handler
  const handleDeleteReview = async (idx) => {
    if (!confirm("Delete this review?")) return;
    setIsUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/review/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ idx })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        toast.success("Review deleted");
      } else {
        toast.error(data.error || "Failed to delete review");
      }
    } catch {
      toast.error("Error deleting review");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <UniversalLoader />;
  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!user) return <div className="text-center mt-6">Loading user data...</div>;

  return (
    <>
      {(isDeleting || isUploading || isUpdating) && <UniversalLoader />}
      <div className="max-w-3xl mx-auto py-10 px-4 md:px-8">
        <div className="bg-background border border-orange-400 dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-orange-400">Profile</h1>
            <p className="text-muted-foreground">Welcome back, <span className="text-orange-400 font-medium">{user.name}</span>!</p>
            {/* Role-based navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link href="/menu" passHref legacyBehavior>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" passHref legacyBehavior>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 ring-2 ring-orange-400 shadow-md">
              <AvatarImage
                src={user.avatar || "https://res.cloudinary.com/dlpzs4eyw/image/upload/v1750172211/6596121_nab8ff.png"}
                alt={`${user.name}'s avatar`}
              />
            </Avatar>
            <input
              ref={avatarInputRef}
              type="file"
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
              disabled={isUploading}
            />
            <Button
              onClick={() => avatarInputRef.current?.click()}
              variant="outline"
              className="mt-3 bg-orange-400 text-white hover:bg-orange-500"
              disabled={isUploading}
            >
              <Edit className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Change Avatar"}
            </Button>
          </div>

          {/* Editable Fields */}
          {["name", "phone", "address"].map(field => (
            <div key={field} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-full sm:w-auto">
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{field}</p>
                <input
                  type="text"
                  className="font-semibold bg-transparent border-b border-orange-300 focus:outline-none focus:border-orange-500 w-full min-w-[180px]"
                  value={editValues[field]}
                  onChange={e => setEditValues(v => ({ ...v, [field]: e.target.value }))}
                  disabled={isUpdating}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 sm:mt-0"
                onClick={() => updateField(field, editValues[field])}
                disabled={isUpdating || editValues[field] === user[field]}
              >
                Save
              </Button>
            </div>
          ))}

          {/* Email (non-editable) */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
            <p className="font-semibold select-text">{user.email}</p>
          </div>

          {/* Orders */}
          <div>
            <h2 className="text-xl font-bold text-orange-400 mb-2">Your Orders</h2>
            {user.orders?.length ? (
              <ul className="space-y-2">
                {user.orders.map((order, idx) => (
                  <li key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto">
                    {typeof order === "object" ? JSON.stringify(order, null, 2) : order}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You have no orders yet.</p>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold text-orange-400 mb-2">Your Reviews</h2>
            {user.reviews?.length ? (
              <ul className="space-y-2">
                {user.reviews.map((review, idx) => (
                  <li key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-2">
                    {editingReviewIdx === idx ? (
                      <>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="w-14 border rounded px-1 mr-2"
                          value={editReview.rating}
                          onChange={e => setEditReview(r => ({ ...r, rating: e.target.value }))}
                          disabled={isUpdating}
                        />
                        <input
                          type="text"
                          className="flex-1 border rounded px-2 py-1 mr-2"
                          value={editReview.review}
                          onChange={e => setEditReview(r => ({ ...r, review: e.target.value }))}
                          disabled={isUpdating}
                        />
                        <Button size="icon" variant="ghost" onClick={() => handleSaveReview(idx)} disabled={isUpdating}>
                          <Save className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingReviewIdx(null)} disabled={isUpdating}>
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Star className="text-yellow-400 h-4 w-4" />
                        <span className="font-semibold">{review.rating ?? "-"}</span>
                        <span className="ml-2 flex-1">{review.review || JSON.stringify(review)}</span>
                        <Button size="icon" variant="ghost" onClick={() => handleEditReview(idx)} disabled={isUpdating}>
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteReview(idx)} disabled={isUpdating}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews submitted.</p>
            )}
          </div>

          {/* Account Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              <Power className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="outline"
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ProfilePage;
