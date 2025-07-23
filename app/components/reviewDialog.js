"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UserContext } from "@/context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import UniversalLoader from "./UniversalLoader";
import { toast } from "react-hot-toast";

const ReviewDialog = ({ open, onOpenChange }) => {
  const [rating, setRating] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const handleSubmitReview = async (e, rating, review) => {
    e.preventDefault();
    if (!user || !user.token) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating, review })
      });
      
      if (response.ok) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setReview("");
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      {isSubmitting && <UniversalLoader />}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md rounded-xl p-6 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Review us
            </DialogTitle>
            <DialogDescription className="mt-3 text-gray-600 dark:text-gray-300">
              How was your experience?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-3xl transition-colors duration-200 ${
                  star <= rating ? "text-yellow-500" : "text-gray-400"
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          
          <div>
            <form>
              <Textarea 
                placeholder="Write your review here..." 
                value={review} 
                onChange={(e) => setReview(e.target.value)}
                disabled={isSubmitting}
                className="mt-4"
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => handleSubmitReview(e, rating, review)}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewDialog;
