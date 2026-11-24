import React from 'react';
import { LatestReview } from '../types/index';

interface LatestReviewsCarouselProps {
  reviews: LatestReview[];
  onSelectReview: (review: LatestReview) => void;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const LatestReviewsCarousel: React.FC<LatestReviewsCarouselProps> = ({
  reviews,
  onSelectReview,
  isCollapsible = false,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return `${m}/${d}`;
    } catch {
      return '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white/95">
        <div className="flex items-center gap-1.5">
          <span className="text-base" role="img" aria-label="latest-reviews">🔥</span>
          <span className="text-xs font-bold text-gray-700 tracking-wide">最新レビュー</span>
          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {reviews.length}
          </span>
        </div>
        {isCollapsible && onToggleCollapse && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            className="text-[11px] font-bold text-gray-400 hover:text-gray-600 flex items-center gap-0.5 px-2 py-0.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? '最新レビューを展開' : '最新レビューを最小化'}
          >
            {isCollapsed ? (
              <>
                <span>展開</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            ) : (
              <>
                <span>最小化</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Cards list / collapsed state */}
      {!isCollapsed && (
        <div className="p-3 bg-gray-50/70 border-b border-gray-100">
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {reviews.map((review) => {
              const ratingRate = Math.round((review.evaluation || 0) * 2) / 2;
              return (
                <div
                  key={review.id}
                  onClick={() => onSelectReview(review)}
                  className="w-[220px] flex-shrink-0 bg-white border border-gray-200/80 hover:border-primary-400 rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  {/* Top: Area badge & Date */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    {review.restaurant?.area_name ? (
                      <span className="bg-primary-50 text-primary-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-primary-100 truncate max-w-[120px]">
                        📍 {review.restaurant.area_name}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formatDate(review.created_at)}
                    </span>
                  </div>

                  {/* Middle: Restaurant name & Rating */}
                  <div className="mb-1.5">
                    <div className="text-xs font-bold text-gray-800 truncate group-hover:text-primary-600 transition-colors">
                      {review.restaurant?.name || '店舗名'}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="star5_rating text-[10px]" data-rate={ratingRate}></span>
                      <span className="text-[10px] font-bold text-amber-500">
                        {review.evaluation}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Image (if any) + Review Content */}
                  <div className="flex gap-2 items-start pt-1 border-t border-gray-50">
                    {review.image_url && (
                      <img
                        src={review.image_url}
                        alt="review"
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                      />
                    )}
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed flex-1">
                      {review.content || '（コメントなし）'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestReviewsCarousel;
