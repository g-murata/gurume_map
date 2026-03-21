import React, { useState, useEffect } from "react";
import { postRestraunt, updateRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem, deleteTagsTaggedItem } from '../../apis/tags_tagged_items';
import { Restraunt, Tag, TagsTaggedItem, Area, User } from '../../types/index';

interface RestrauntModalProps {
  mode: 'edit' | 'new';
  restaurant: Restraunt & { image_url?: string };
  tags_tagged_items?: { [key: string]: TagsTaggedItem };
  tags: Tag[];
  areas: { [key: number]: Area };
  selectedArea: number;
  coordinateLat: number;
  coordinateLng: number;
  setIsDirty: (dirty: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  onSelect: (restaurant: Restraunt) => void;
  setRestraunt: (restaurants: any[]) => void;
  handleClear: () => void;
  setError: (error: string) => void;
  error: string | null;
  user: User;
  restaurants: any[];
  closeModal: () => void;
  onCloseEditDialog: () => void;
  openImageLightbox: (url: string) => void;
  ReactStarsRating?: any;
}

export const RestrauntModal: React.FC<RestrauntModalProps> = (props) => {
  const { 
    mode, 
    restaurant, 
    tags_tagged_items, 
    tags, 
    areas, 
    selectedArea, 
    coordinateLat, 
    coordinateLng, 
    setIsDirty, 
    setIsLoading, 
    onSelect, 
    setRestraunt, 
    handleClear, 
    setError, 
    error, 
    user, 
    restaurants, 
    closeModal, 
    onCloseEditDialog, 
    openImageLightbox,
    ReactStarsRating
  } = props;
  
  const isEditMode = mode === 'edit';

  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isTagListOpen, setIsTagListOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [preview, setPreview] = useState(isEditMode ? (restaurant.image_url || '') : '');
  const [reviewPreview, setReviewPreview] = useState('');
  const [initialEvaluation, setInitialEvaluation] = useState(3);

  // 初期化: 編集モードの場合は既存のタグをセット
  useEffect(() => {
    if (isEditMode && tags_tagged_items) {
      const initialTagIds = Object.values(tags_tagged_items).map(value => value.tag_id);
      setSelectedTags(initialTagIds);
      if (initialTagIds.length > 0) setIsTagListOpen(true);
    } else {
      setSelectedTags([]);
      setIsTagListOpen(false);
    }
    setIsDirty(false);
  }, [isEditMode, tags_tagged_items, setIsDirty]);

  // Dirtyチェック (入力内容に変更があるか判定)
  const checkDirty = () => {
    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const urlInput = document.getElementById('url') as HTMLInputElement | null;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement | null;
    const reviewContentInput = document.getElementById('review_content') as HTMLTextAreaElement | null;
    
    const name = nameInput?.value || '';
    const url = urlInput?.value || '';
    const description = descriptionInput?.value || '';
    const reviewContent = reviewContentInput?.value || '';
    
    if (isEditMode) {
      const isTextDirty = name !== restaurant.name || 
                          url !== (restaurant.url || '') || 
                          description !== (restaurant.description || '');
      const initialTagIds = tags_tagged_items ? Object.values(tags_tagged_items).map(value => value.tag_id).sort() : [];
      const isTagsDirty = JSON.stringify(initialTagIds) !== JSON.stringify([...selectedTags].sort());
      const isImageDirty = image !== null || deleteImage;
      setIsDirty(isTextDirty || isTagsDirty || isImageDirty);
    } else {
      const hasText = name !== '' || url !== '' || description !== '';
      const hasReview = reviewContent !== '' || initialEvaluation !== 3;
      const hasTags = selectedTags.length > 0;
      const hasImage = image !== null;
      setIsDirty(hasText || hasTags || hasImage || hasReview);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB制限
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズが大きすぎます。10MB以内の画像を選択してください。');
        e.target.value = '';
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setDeleteImage(false);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(isEditMode ? (restaurant.image_url || '') : '');
      setTimeout(checkDirty, 0);
    }
  };

  const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB制限
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズが大きすぎます。10MB以内の画像を選択してください。');
        e.target.value = '';
        return;
      }
      setReviewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewPreview(reader.result as string);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    } else {
      setReviewImageFile(null);
      setReviewPreview('');
      setTimeout(checkDirty, 0);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (image) {
      setImage(null);
      setPreview(isEditMode ? (restaurant.image_url || '') : '');
    } else if (isEditMode) {
      setDeleteImage(true);
      setPreview('');
    } else {
      setPreview('');
    }
    const fileInput = document.getElementById('image') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    setTimeout(checkDirty, 0);
  };

  const handleRemoveReviewImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReviewImageFile(null);
    setReviewPreview('');
    const fileInput = document.getElementById('review_image') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    setTimeout(checkDirty, 0);
  };

  const handleTagClick = (tagId: number) => {
    setIsSelected(!isSelected);
    let newTags: number[];
    if (selectedTags.includes(tagId)) {
      newTags = selectedTags.filter((id) => id !== tagId);
    } else {
      newTags = [...selectedTags, tagId];
    }
    setSelectedTags(newTags);
    
    // タグ変更後のDirtyチェックを確実に行うためsetTimeoutを使用
    setTimeout(checkDirty, 0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const urlInput = form.elements.namedItem('url') as HTMLInputElement;
    const descriptionInput = form.elements.namedItem('description') as HTMLTextAreaElement;
    const reviewContentInput = form.elements.namedItem('review_content') as HTMLTextAreaElement | null;
    const latInput = form.elements.namedItem('lat') as HTMLInputElement;
    const lngInput = form.elements.namedItem('lng') as HTMLInputElement;

    setIsLoading(true);
    setLocalIsLoading(true);

    try {
      let res: any;
      if (isEditMode) {
        res = await updateRestraunt({
          id: restaurant.id,
          name: nameInput.value,
          url: urlInput.value,
          description: descriptionInput.value,
          image: image,
          delete_image: deleteImage,
        });
        await deleteTagsTaggedItem({tagged_item_id: restaurant.id});
      } else {
        const reviewContent = reviewContentInput?.value;
        const hasReviewData = (reviewContent && reviewContent.trim() !== '') || 
                              reviewImageFile !== null || 
                              initialEvaluation !== 3;

        res = await postRestraunt({
          name: nameInput.value,
          lat: Number(latInput.value),
          lng: Number(lngInput.value),
          url: urlInput.value,
          description: descriptionInput.value,
          area_id: Number(selectedArea + 1),
          email: user.email,
          image: image,
          evaluation: hasReviewData ? initialEvaluation : undefined,
          review_content: hasReviewData ? reviewContent : undefined,
          review_image: hasReviewData ? reviewImageFile : undefined
        });
      }

      const tagPromises = selectedTags.map((tag) => {
        return postTagsTaggedItem({
          tagged_item_type: "Restraunt",
          tagged_item_id: res.restraunt.id,
          tag_id: tag
        });
      });

      const tagResponses = await Promise.all(tagPromises);
      const new_tags_tagged_items = tagResponses.map(response => response.tags_tagged_item);

      if (isEditMode) {
        onSelect(res.restraunt);
        const updatedList = restaurants.map((item) => {
          if (Number(item.restaurant.id) === Number(restaurant.id)) {
            return {
              ...item,
              restaurant: res.restraunt,
              tags_tagged_items: new_tags_tagged_items
            };
          }
          return item;
        });
        setRestraunt(updatedList);
      } else {
        const newEntry = {
          restaurant: res.restraunt,
          tags_tagged_items: new_tags_tagged_items,
        };
        onSelect(newEntry.restaurant);
        setRestraunt([newEntry, ...restaurants]);
      }

      setIsDirty(false);
      setError('');
      handleClear();
      isEditMode ? onCloseEditDialog() : closeModal();

    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setError('不備あり！');
      } else {
        setError('通信エラーっす！バックエンド起きてる？');
      }
    } finally {
      setIsLoading(false);
      setLocalIsLoading(false);
    }
  };

  const handleCancel = () => {
    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const urlInput = document.getElementById('url') as HTMLInputElement | null;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement | null;
    const reviewContentInput = document.getElementById('review_content') as HTMLTextAreaElement | null;
    
    const name = nameInput?.value || '';
    const url = urlInput?.value || '';
    const description = descriptionInput?.value || '';
    const reviewContent = reviewContentInput?.value || '';
    
    let isCurrentlyDirty = false;
    if (isEditMode) {
      const isTextDirty = name !== restaurant.name || 
                          url !== (restaurant.url || '') || 
                          description !== (restaurant.description || '');
      const initialTagIds = tags_tagged_items ? Object.values(tags_tagged_items).map(value => value.tag_id).sort() : [];
      const isTagsDirty = JSON.stringify(initialTagIds) !== JSON.stringify([...selectedTags].sort());
      const isImageDirty = image !== null || deleteImage;
      isCurrentlyDirty = isTextDirty || isTagsDirty || isImageDirty;
    } else {
      isCurrentlyDirty = name !== '' || url !== '' || description !== '' || selectedTags.length > 0 || image !== null || reviewContent !== '' || initialEvaluation !== 3;
    }

    if (isCurrentlyDirty) {
      if (window.confirm("書きかけの内容がありますが、キャンセルしてもよろしいですか？")) {
        isEditMode ? onCloseEditDialog() : closeModal();
      }
    } else {
      isEditMode ? onCloseEditDialog() : closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'お店の編集' : '新規店名登録'}
          </div>
          <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" onClick={handleCancel}>✕</button>
        </div>
        
        {error && <p className="mb-4 text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <label className="text-gray-700 text-sm font-bold" htmlFor="name">
              店名 <span className="text-xs text-red-500 font-normal ml-1">※必須</span>
            </label>
            {!isEditMode && areas && (
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                エリア：{areas[Number(selectedArea)]?.name}
              </span>
            )}
          </div>            
          <input 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            id="name" 
            placeholder="例：美味しいラーメン屋" 
            name="name" 
            defaultValue={isEditMode ? restaurant.name : ''}
            required 
          />
        </div>

        <input type="hidden" id="lat" name="lat" value={isEditMode ? restaurant.lat : coordinateLat} />
        <input type="hidden" id="lng" name="lng" value={isEditMode ? restaurant.lng : coordinateLng} />

        {/* タグ付けアコーディオン */}
        <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setIsTagListOpen(!isTagListOpen)}
            className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-700 text-sm font-bold">🏷️ タグ付け</span>
            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isTagListOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div className={`transition-all duration-300 ease-in-out ${isTagListOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 flex flex-wrap gap-2 border-t border-gray-200 bg-white">
              {tags && Object.keys(tags).map((item: any) => {
                const isTagSelected = selectedTags.includes(tags[item].id);
                return (
                  <button 
                    type="button"
                    className={`text-sm px-3 py-1.5 rounded-full transition-all duration-200 border ${
                      isTagSelected 
                        ? 'bg-primary-50 text-primary-600 border-primary-200 font-bold shadow-sm' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                    key={tags[item].id} 
                    onClick={() => handleTagClick(tags[item].id)}
                  >
                    {tags[item].name}
                  </button >  
                )}
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
            お店の公式URL <span className="text-xs text-gray-400 font-normal ml-1">(食べログなど)</span>
          </label>
          <input 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            id="url" 
            placeholder="https://..." 
            name="url" 
            defaultValue={isEditMode ? restaurant.url : ''}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            お店の紹介・特徴 <span className="text-xs text-gray-400 font-normal ml-1">(公式情報や客観的な特徴)</span>
          </label>
          <textarea 
            id="description" 
            name="description" 
            rows={2} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            placeholder="例：公園の近くにあるカレー屋。テイクアウト可。"
            defaultValue={isEditMode ? restaurant.description : ''}
          ></textarea>
        </div>

        {!isEditMode && (
          <div className="mb-8 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-100 shadow-inner">
            <h3 className="text-yellow-800 font-bold mb-4 flex items-center gap-2">
              ✍️ あなたの最初のレビュー <span className="text-[10px] bg-yellow-200 px-2 py-0.5 rounded text-yellow-700 font-normal">任意</span>
            </h3>
            
            <div className="mb-4">
              <label className="block text-yellow-700 text-xs font-bold mb-1">評価</label>
              {ReactStarsRating && (
                <ReactStarsRating 
                  onChange={(val: number) => {
                    setInitialEvaluation(val);
                    setTimeout(checkDirty, 0);
                  }} 
                  value={initialEvaluation} 
                  className="flex gap-1"
                />
              )}
            </div>

            <div>
              <label className="block text-yellow-700 text-xs font-bold mb-1">感想</label>
              <textarea 
                id="review_content" 
                name="review_content" 
                rows={3} 
                className="w-full bg-white border border-yellow-200 rounded-xl px-4 py-3 text-gray-800 placeholder-yellow-300/60 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all mb-4" 
                placeholder="「ここのランチはコスパ最強！」など..."
              ></textarea>
            </div>

            <div>
              <label className="block text-yellow-700 text-xs font-bold mb-2">レビューの写真 <span className="text-[10px] font-normal ml-1">(今日食べた料理など)</span></label>
              <input 
                type="file" 
                id="review_image" 
                name="review_image" 
                accept="image/*"
                onChange={handleReviewImageChange}
                className="w-full bg-white/50 border border-yellow-200 rounded-xl px-4 py-2 text-gray-800 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200" 
              />
              {reviewPreview && (
                <div className="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-yellow-200 bg-white flex items-center justify-center cursor-pointer group" onClick={() => openImageLightbox(reviewPreview)}>
                  <img src={reviewPreview} alt="Review Preview" className="max-w-full max-h-full object-contain" />
                  <button type="button" onClick={handleRemoveReviewImage} className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-black/70">✕</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            お店の写真 <span className="text-xs text-gray-400 font-normal ml-1">{isEditMode ? '(変更する場合のみ選択)' : '(任意)'}</span>
          </label>
          <input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" 
          />
          {preview && (
            <div 
              className="mt-4 relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer group"
              onClick={() => openImageLightbox(preview)}
            >
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 group-hover:opacity-40 transition-opacity" />
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

        <div className='flex flex-col gap-3'>
          <button 
            type="submit"
            disabled={localIsLoading}
            className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 ${localIsLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white hover:-translate-y-0.5'}`}
          >
            {localIsLoading ? '送信中...' : (isEditMode ? '更新する' : 'このお店を登録する')}
          </button>
          <button 
            type="button" 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3.5 px-4 rounded-xl transition-colors duration-200" 
            onClick={handleCancel}
          >
            {isEditMode ? '詳細画面に戻る' : 'キャンセル'}
          </button>
        </div>
      </div>
    </form >
  );
};

export default RestrauntModal;
