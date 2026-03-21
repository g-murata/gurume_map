import React, { useState, useEffect, useCallback } from "react";
import { postReview, updateReview } from '../../apis/reviews';
import { Restraunt, Review, User } from '../../types/index';

interface ReviewModalProps {
  mode: 'edit' | 'new';
  restaurant: Restraunt;
  review?: Review;
  setIsDirty: (isDirty: boolean) => void;
  openImageLightbox: (url: string) => void;
  closeReviewModal: () => void;
  reviews: Review[];
  setReview: (reviews: Review[]) => void;
  user: User;
  setCheckUsersWithoutReviews?: (val: boolean) => void;
  ReactStarsRating: any; // Type from library if known
  setIsLoading?: (loading: boolean) => void;
  error?: string;
  setError?: (error: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = (props) => {
  const { mode, restaurant, review, setIsDirty, openImageLightbox, closeReviewModal, reviews, setReview, user, setCheckUsersWithoutReviews, ReactStarsRating } = props;
  const isEditMode = mode === 'edit';

  const [evaluation, setEvaluation] = useState(isEditMode && review ? review.evaluation : 3);
  const [reviewImageFile, setLocalReviewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(isEditMode && review ? (review.image_url || '') : '');
  const [deleteImage, setDeleteImage] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localIsLoading, setLocalIsLoading] = useState(false);

  const checkDirty = useCallback(() => {
    const contentElement = document.getElementById('content') as HTMLTextAreaElement | null;
    const content = contentElement?.value || '';
    
    if (isEditMode && review) {
      const isEvaluationDirty = Number(evaluation) !== Number(review.evaluation);
      const isContentDirty = content !== (review.content || '');
      const isImageDirty = reviewImageFile !== null || deleteImage;
      setIsDirty(isEvaluationDirty || isContentDirty || isImageDirty);
    } else {
      const hasContent = content !== '';
      const hasImage = reviewImageFile !== null;
      const hasEvaluation = Number(evaluation) !== 3;
      setIsDirty(hasContent || hasImage || hasEvaluation);
    }
  }, [isEditMode, evaluation, review, reviewImageFile, deleteImage, setIsDirty]);

  useEffect(() => {
    checkDirty();
  }, [checkDirty]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalReviewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setDeleteImage(false);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    } else {
      setLocalReviewImage(null);
      setPreview(isEditMode && review ? (review.image_url || '') : '');
      setTimeout(checkDirty, 0);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reviewImageFile) {
      setLocalReviewImage(null);
      setPreview(isEditMode && review ? (review.image_url || '') : '');
    } else if (isEditMode) {
      setDeleteImage(true);
      setPreview('');
    } else {
      setPreview('');
    }
    const fileInput = document.getElementById('review_image_input') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    setTimeout(checkDirty, 0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const contentElement = form.elements.namedItem('content') as HTMLTextAreaElement;
    const contentValue = contentElement.value;
    
    setLocalIsLoading(true);
    if (props.setIsLoading) props.setIsLoading(true);
    setLocalError('');

    try {
      if (isEditMode && review) {
        const res = await updateReview({
          id: review.id,
          evaluation: evaluation,
          content: contentValue,
          image: reviewImageFile,
          delete_image: deleteImage
        });
        const updatedReviews = reviews.map((r) => {
          if (Number(r.id) === Number(review.id)) {
            // @ts-ignore - API response might be nested
            return { ...r, ...(res.review || res.reviews) };
          }
          return r;
        });
        setReview(updatedReviews);
      } else {
        const res = await postReview({
          restraunt_id: restaurant.id,
          evaluation: evaluation,
          content: contentValue,
          email: user.email,
          image: reviewImageFile
        });
        const newReview: Review = {
          ...res.review,
          // @ts-ignore
          user_name: res.user_name || user.name,
          user: user,
          restraunt_id: restaurant.id
        };
        setReview([newReview, ...reviews]);
        if (setCheckUsersWithoutReviews) setCheckUsersWithoutReviews(false);
      }

      setIsDirty(false);
      closeReviewModal();
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setLocalError('不備あり！');
      } else {
        setLocalError('通信エラーっす！バックエンド起きてる？');
      }
    } finally {
      setLocalIsLoading(false);
      if (props.setIsLoading) props.setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const contentElement = document.getElementById('content') as HTMLTextAreaElement | null;
    const content = contentElement?.value || '';
    let isCurrentlyDirty = false;

    if (isEditMode && review) {
      const isEvaluationDirty = Number(evaluation) !== Number(review.evaluation);
      const isContentDirty = content.trim() !== (review.content || '').trim();
      const isImageDirty = reviewImageFile !== null || deleteImage;
      isCurrentlyDirty = isEvaluationDirty || isContentDirty || isImageDirty;
    } else {
      isCurrentlyDirty = content.trim() !== '' || reviewImageFile !== null || Number(evaluation) !== 3;
    }

    if (isCurrentlyDirty) {
      if (window.confirm("書きかけの内容がありますが、キャンセルしてもよろしいですか？")) {
        closeReviewModal();
      }
    } else {
      closeReviewModal();
    }
  };

  return (
    <form onSubmit={handleSubmit} onChange={() => checkDirty()} className="bg-white p-6 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'レビュー編集' : '新規レビュー登録'}
          </div>
          <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" onClick={handleCancel}>✕</button>
        </div>

        {(localError || props.error) && <p className="mb-4 text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg">{localError || props.error}</p>}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">店名</label>
          <div className="text-gray-800">{restaurant.name}</div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="evaluation">評価</label>
          <div className="py-2">
            <ReactStarsRating 
              id="evaluation" 
              name="evaluation" 
              className="evaluation flex gap-1" 
              onChange={(val: number) => {
                setEvaluation(val);
                setTimeout(checkDirty, 0);
              }} 
              value={evaluation} 
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="review_image_input">
            写真 <span className="text-xs text-gray-400 font-normal ml-1">{isEditMode ? '(変更する場合のみ選択)' : '(任意)'}</span>
          </label>
          <input 
            type="file" 
            id="review_image_input" 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" 
          />
          {preview && (
            <div 
              className="mt-4 relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer group"
              onClick={() => openImageLightbox(preview)}
            >
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 group-hover:opacity-50 transition-opacity" />
              <img src={preview} alt="Preview" className="relative z-10 max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">画像を拡大</span>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 z-30 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                title="画像を削除"
              >✕</button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">感想</label>
          <textarea 
            id="content" 
            name="content" 
            rows={6} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            placeholder="このお店の良かったところ、おすすめメニューなど..."
            defaultValue={isEditMode && review ? review.content : ''}
          ></textarea>
        </div>

        <div className='flex flex-col gap-3'>
          <button 
            type="submit"
            disabled={localIsLoading}
            className={`w-full font-bold py-3 px-4 rounded-xl shadow-sm transition-colors duration-200 ${localIsLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
          >
            {localIsLoading ? '送信中...' : (isEditMode ? '更新する' : 'レビューを投稿する')}
          </button>
          <button 
            type="button" 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-xl transition-colors duration-200" 
            onClick={handleCancel}
          >
            キャンセル
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewModal;
