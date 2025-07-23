import React from 'react'
import Writeareview from './Writeareview'
import { Star, User } from 'lucide-react'

const Review = ({ reviews = [], itemId, onReviewSubmitted }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-6">Customer Reviews</h2>
      
      {/* Reviews List */}
      <div className="space-y-6 mb-8">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Star className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews yet</p>
            <p className="text-gray-400 dark:text-gray-500">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      {review.userAvatar ? (
                        <img
                          src={review.userAvatar}
                          alt={review.userName || 'User'}
                          className="w-8 h-8 object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {review.userName || review.user || 'Anonymous'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {review.createdAt ? formatDate(review.createdAt) : 'Recently'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                      {review.rating}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.review || review.comment}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review Section */}
      <Writeareview itemId={itemId} onReviewSubmitted={onReviewSubmitted} />
    </div>
  )
}

export default Review
