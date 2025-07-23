'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Star, Trash2, UploadCloud } from 'lucide-react';

export default function AdminItemProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized');
      router.push('/auth');
      return;
    }

    fetch(`/api/admin/item/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.item) {
          setItem(data.item);
          setFormValues({
            name: data.item.name || '',
            description: data.item.description || '',
            price: data.item.price || '',
            category: data.item.category || '',
            image: data.item.image || '',
            available: data.item.available ?? true,
          });
        } else {
          toast.error(data?.error || 'Item not found');
        }
      })
      .catch(() => toast.error('Failed to fetch item'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Unauthorized');

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/item/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Item updated');
        setItem(data.item);
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setFormValues((prev) => ({ ...prev, image: data.secure_url }));
        toast.success('Image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const deleteReview = async (index) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/item/${id}?reviewIdx=${index}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Review deleted');
      setItem(data.item);
    } else {
      toast.error(data.error || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 md:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 w-24 rounded-full bg-gray-300 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!item) return <div className="text-red-500 text-center">Item not found</div>;

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 px-4 md:px-8">
        <div className="bg-background border border-orange-400 dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-orange-400">Edit Item</h1>
            <p className="text-muted-foreground">
              Managing item: <span className="text-orange-400 font-medium">{item.name}</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24 ring-2 ring-orange-400 shadow-md">
              <AvatarImage
                src={
                  formValues.image ||
                  'https://res.cloudinary.com/dlpzs4eyw/image/upload/v1750172211/6596121_nab8ff.png'
                }
                alt="Item image"
              />
            </Avatar>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => imageInputRef.current.click()}
              disabled={uploading}
            >
              <UploadCloud className="w-4 h-4 mr-1" />
              {uploading ? 'Uploading...' : 'Change Image'}
            </Button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInputRef}
              onChange={handleImageChange}
            />
          </div>

          {['name', 'description', 'price', 'category'].map((field) => (
            <div
              key={field}
              className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-4"
            >
              <div className="w-full sm:w-auto gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{field}</p>
                <input
                  type={field === 'price' ? 'number' : 'text'}
                  className="font-semibold bg-transparent border-b border-orange-300 focus:outline-none focus:border-orange-500 w-full min-w-[180px]"
                  value={formValues[field]}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, [field]: e.target.value }))
                  }
                  disabled={updating}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-4">
            <div className="w-full sm:w-auto gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">Available</p>
              <select
                className="font-semibold bg-transparent border-b border-orange-300 focus:outline-none focus:border-orange-500 w-full min-w-[180px]"
                value={formValues.available ? 'true' : 'false'}
                onChange={(e) =>
                  setFormValues((v) => ({
                    ...v,
                    available: e.target.value === 'true',
                  }))
                }
                disabled={updating}
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold text-orange-400 mb-2">Item Reviews</h2>
            {item.reviews?.length ? (
              <ul className="space-y-2">
                {item.reviews.map((review, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-2"
                  >
                    <Star className="text-yellow-400 h-4 w-4" />
                    <span className="font-semibold">{review.rating ?? '-'}</span>
                    <span className="ml-2 flex-1">{review.review || JSON.stringify(review)}</span>
                    <Button variant="ghost" size="icon" onClick={() => deleteReview(idx)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews found.</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              variant="outline"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}