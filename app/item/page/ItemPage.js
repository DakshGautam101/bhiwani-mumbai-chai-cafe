'use client';
import React, { useContext, useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { UserContext } from '@/context/UserContext';
import useCartStore from '@/app/store/cartStore';
import UserDialog from '@/app/components/UserDialog';
import Review from '../components/review';

const ItemPage = ({
  id,
  image,
  images = [],
  name,
  price,
  description,
  inStock,
  category,
  rating,
  reviews = [],
}) => {
  const { user } = useContext(UserContext);
  const { addToCart, isLoading } = useCartStore();
  const [localLoading, setLocalLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReviews, setCurrentReviews] = useState(reviews);
  const [currentRating, setCurrentRating] = useState(rating);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/item/${id}/review`);
        if (response.ok) {
          const data = await response.json();
          setCurrentReviews(data.reviews || []);
          setCurrentRating(data.averageRating || rating);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id, rating]);

  const handleAddToCart = async () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (localLoading || isLoading) return;

    setLocalLoading(true);
    try {
      await addToCart({ userId: user._id, itemId: id });
      toast.success(`${name} added to cart!`);
    } catch (err) {
      toast.error('Failed to add item to cart.');
    } finally {
      setTimeout(() => setLocalLoading(false), 500);
    }
  };

  const handleReviewSubmitted = (updatedItem) => {
    if (updatedItem) {
      setCurrentReviews(updatedItem.reviews || []);
      setCurrentRating(updatedItem.rating || rating);
    }
  };

  const allImages = Array.from(new Set([image, ...images].filter(Boolean)));

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 space-y-8">
      {/* Dialog */}
      <UserDialog open={openDialog} setOpen={setOpenDialog} />

      {/* Image Carousel */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[320px]">
          {allImages.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {allImages.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <img
                      src={img}
                      alt={`${name} image ${idx + 1}`}
                      className="w-full h-80 object-cover rounded-lg"
                      onError={(e) => (e.target.src = '/fallback-image.jpg')}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <img
              src={allImages[0] || '/fallback-image.jpg'}
              alt={name || 'Product image'}
              className="w-full h-80 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400">{name}</h1>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>

          <div className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
            ₹{price?.toFixed(2)}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className={`${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>{' '}
            | Category: {category?.name || category || 'Unknown'}
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(currentRating) ? 'fill-yellow-500' : 'fill-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-700 dark:text-gray-300 ml-1">
              {currentRating?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({currentReviews.length} reviews)
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded-lg transition-all duration-200 ${
                localLoading || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
              disabled={localLoading || isLoading}
              aria-label={`Add ${name} to cart`}
            >
              {localLoading ? (
                <>
                  Adding...
                  <span className="animate-spin ml-2 border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                </>
              ) : (
                <>
                  Add to Cart <ShoppingCartIcon className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Review 
        reviews={currentReviews} 
        itemId={id} 
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default ItemPage;
