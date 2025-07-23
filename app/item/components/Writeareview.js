'use client';
import UserDialog from '@/app/components/UserDialog';
import { Textarea } from '@/components/ui/textarea'
import { UserContext } from '@/context/UserContext';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const Writeareview = ({ itemId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [itemReview, setitemReview] = useState('');
  const { user, setUser } = useContext(UserContext);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      toast.error("Please log in to submit a review");
      setOpenUserDialog(true);
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!itemReview.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/item/${itemId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          rating: rating,
          review: itemReview.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setitemReview('');
        // Call the callback to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted(data.item);
        }
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
      <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-4">Write a Review</h3>
      
      <div className="flex justify-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`cursor-pointer text-3xl transition-colors duration-200 ${
              star <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => setRating(star)}
            disabled={isSubmitting}
          >
            ★
          </button>
        ))}
      </div>
      
      <form onSubmit={handleFormSubmit}>
        <Textarea 
          placeholder="Write your review here..."
          value={itemReview}
          onChange={(e) => setitemReview(e.target.value)}
          disabled={isSubmitting}
          className="mt-4 mb-4"
          rows={4}
        />
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
      
      <UserDialog open={openUserDialog} setOpen={setOpenUserDialog} />
    </div>
  )
}

export default Writeareview