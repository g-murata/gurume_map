import React, { useRef, useState, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // マウスドラッグでスライドするための状態管理
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  // 日付フォーマット関数（例: "3/25"）
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '';
      const m = d.getMonth() + 1;
      const date = d.getDate();
      return `${m}/${date}`;
    } catch {
      return '';
    }
  };

  // 左右に隠れている要素があるかチェック
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reviews]);

  const handleArrowScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = 220;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (review: LatestReview) => {
    if (hasMovedRef.current) return;
    onSelectReview(review);
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  // 1件目は最新固定カード、2件目以降をスライドコンテナに配置
  const latestOne = reviews[0];
  const otherReviews = reviews.slice(1);

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 relative w-full overflow-hidden ${className}`}>
      {/* 【一番最新のレビュー】左端に固定表示（日付バッジ付きで最新の更新がすぐわかる） */}
      <div
        onClick={() => handleCardClick(latestOne)}
        className="flex-shrink-0 flex items-center gap-2 bg-amber-50/90 hover:bg-amber-100/90 border border-amber-300/90 rounded-xl px-2.5 py-1.5 cursor-pointer transition-all duration-150 hover:shadow-md w-[190px] sm:w-[210px] md:w-[230px] group select-none shadow-2xs"
        title={`【最新】${latestOne.restaurant?.name || ''} (${formatDate(latestOne.created_at)}) - ${latestOne.content || ''}`}
      >
        {latestOne.image_url ? (
          <img
            src={latestOne.image_url}
            alt="latest review"
            draggable={false}
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-amber-200 pointer-events-none"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center text-xs font-bold flex-shrink-0 pointer-events-none">
            ★
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center pointer-events-none">
          <div className="flex items-center gap-1 leading-tight">
            <span className="text-[9px] font-bold text-amber-800 bg-amber-200/90 px-1 py-0.2 rounded flex-shrink-0 flex items-center gap-0.5">
              <span>🔥</span>
              <span>最新</span>
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-white/80 px-1 py-0.2 rounded flex-shrink-0">
              {formatDate(latestOne.created_at)}
            </span>
            <span className="text-xs font-bold text-gray-800 truncate group-hover:text-primary-600 transition-colors ml-0.5">
              {latestOne.restaurant?.name || '店舗名'}
            </span>
            <span className="text-[10px] font-bold text-amber-600 ml-auto flex-shrink-0">
              ★{latestOne.evaluation}
            </span>
          </div>
          <p className="text-[10px] text-gray-600 truncate leading-tight mt-0.5">
            {latestOne.content || '（コメントなし）'}
          </p>
        </div>
      </div>

      {/* 2件目以降がある場合のみ、区切り線とスワイプエリアを表示 */}
      {otherReviews.length > 0 && (
        <>
          {/* 区切り線 */}
          <div className="h-6 w-px bg-gray-200 flex-shrink-0 mx-0.5 hidden sm:block" />

          {/* 左スクロールボタン */}
          {canScrollLeft && (
            <button
              onClick={() => handleArrowScroll('left')}
              className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-white/95 border border-gray-200 shadow-sm text-gray-500 hover:text-primary-600 hover:bg-gray-50 flex-shrink-0 z-10 transition-all"
              aria-label="左にスクロール"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* 横スワイプコンテナ（2件目以降をつまんでスライドして選べる） */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex-1 min-w-0 flex gap-2.5 overflow-x-auto scrollbar-hide py-1 items-center select-none cursor-grab active:cursor-grabbing"
          >
            {otherReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => handleCardClick(review)}
                className="flex-shrink-0 flex items-center gap-2 bg-gray-50/90 hover:bg-primary-50/70 border border-gray-200 hover:border-primary-300 rounded-xl px-2.5 py-1.5 cursor-pointer transition-all duration-150 hover:shadow-md w-[180px] sm:w-[200px] md:w-[220px] group select-none"
                title={`${review.restaurant?.name || ''} (${formatDate(review.created_at)}) - ${review.content || ''}`}
              >
                {review.image_url ? (
                  <img
                    src={review.image_url}
                    alt="review"
                    draggable={false}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-gray-100 pointer-events-none"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center text-xs font-bold flex-shrink-0 pointer-events-none">
                    ★
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-center pointer-events-none">
                  <div className="flex items-center gap-1 leading-tight">
                    {review.restaurant?.area_name && (
                      <span className="text-[9px] font-bold text-primary-600 bg-primary-100/70 px-1 py-0.2 rounded truncate max-w-[45px] flex-shrink-0">
                        {review.restaurant.area_name}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">
                      {formatDate(review.created_at)}
                    </span>
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
            ))}
          </div>

          {/* 右スクロールボタン */}
          {canScrollRight && (
            <button
              onClick={() => handleArrowScroll('right')}
              className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-white/95 border border-gray-200 shadow-sm text-gray-500 hover:text-primary-600 hover:bg-gray-50 flex-shrink-0 z-10 transition-all"
              aria-label="右にスクロール"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default LatestReviewsCarousel;
