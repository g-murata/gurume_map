import React from 'react';
import { LatestReview } from '../types/index';

interface LatestReviewsCarouselProps {
  reviews: LatestReview[];
  onSelectReview: (review: LatestReview) => void;
  className?: string;
}

export const LatestReviewsCarousel: React.FC<LatestReviewsCarouselProps> = ({
  reviews,
  onSelectReview,
  className = '',
}) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // ループアニメーション用にレビュー配列を2回繰り返す（件数が少ない場合でも滑らかに流れるように）
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className={`flex items-center gap-2 overflow-hidden relative ${className}`}>
      {/* 先頭バッジ（大画面で表示） */}
      <div className="hidden lg:flex items-center gap-1 flex-shrink-0 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-lg whitespace-nowrap shadow-2xs z-20">
        <span>🔥</span>
        <span>最新レビュー</span>
      </div>

      {/* 左右のエッジフェード効果 */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 hidden sm:block" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 hidden sm:block" />

      {/* 横に自動で流れるスライドコンテナ */}
      <div className="flex-1 min-w-0 overflow-hidden relative py-0.5">
        <div className="animate-ticker flex gap-2.5 items-center">
          {duplicatedReviews.map((review, index) => {
            return (
              <div
                key={`${review.id}-${index}`}
                onClick={() => onSelectReview(review)}
                className="flex-shrink-0 flex items-center gap-2 bg-gray-50/90 hover:bg-primary-50/70 border border-gray-200 hover:border-primary-300 rounded-xl px-2.5 py-1 cursor-pointer transition-all duration-150 hover:shadow-md w-[180px] sm:w-[200px] md:w-[230px] group select-none"
                title={`${review.restaurant?.name || ''} - ${review.content || ''}`}
              >
                {review.image_url ? (
                  <img
                    src={review.image_url}
                    alt="review"
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    ★
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-1 leading-tight">
                    {review.restaurant?.area_name && (
                      <span className="text-[9px] font-bold text-primary-600 bg-primary-100/70 px-1 py-0.2 rounded truncate max-w-[50px] flex-shrink-0">
                        {review.restaurant.area_name}
                      </span>
                    )}
                    <span className="text-xs font-bold text-gray-800 truncate group-hover:text-primary-600 transition-colors">
                      {review.restaurant?.name || '店舗名'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-500 ml-auto flex-shrink-0">
                      ★{review.evaluation}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                    {review.content || '（コメントなし）'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestReviewsCarousel;
