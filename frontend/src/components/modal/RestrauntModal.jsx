import { useState, useEffect } from "react";
import { postRestraunt, updateRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem, deleteTagsTaggedItem } from '../../apis/tags_tagged_items';

export const RestrauntModal = (props) => {
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
    openImageLightbox 
  } = props;
  
  const isEditMode = mode === 'edit';

  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagListOpen, setIsTagListOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [preview, setPreview] = useState(isEditMode ? (restaurant.image_url || '') : '');

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
    const name = document.getElementById('name')?.value || '';
    const url = document.getElementById('url')?.value || '';
    const description = document.getElementById('description')?.value || '';
    
    if (isEditMode) {
      const isTextDirty = name !== restaurant.name || 
                          url !== (restaurant.url || '') || 
                          description !== (restaurant.description || '');
      const initialTagIds = Object.values(tags_tagged_items).map(value => value.tag_id).sort();
      const isTagsDirty = JSON.stringify(initialTagIds) !== JSON.stringify([...selectedTags].sort());
      const isImageDirty = image !== null || deleteImage;
      setIsDirty(isTextDirty || isTagsDirty || isImageDirty);
    } else {
      const hasText = name !== '' || url !== '' || description !== '';
      const hasTags = selectedTags.length > 0;
      const hasImage = image !== null;
      setIsDirty(hasText || hasTags || hasImage);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setDeleteImage(false);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(isEditMode ? (restaurant.image_url || '') : '');
      setTimeout(checkDirty, 0);
    }
  };

  const handleRemoveImage = (e) => {
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
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
    setTimeout(checkDirty, 0);
  };

  const handleTagClick = (tagId) => {
    setIsSelected(!isSelected);
    let newTags;
    if (selectedTags.includes(tagId)) {
      newTags = selectedTags.filter((id) => id !== tagId);
    } else {
      newTags = [...selectedTags, tagId];
    }
    setSelectedTags(newTags);
    
    // タグ変更後のDirtyチェックを確実に行うためsetTimeoutを使用
    setTimeout(checkDirty, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, url, description, lat, lng } = event.target.elements;    
    setIsLoading(true);
    setLocalIsLoading(true);

    try {
      let res;
      if (isEditMode) {
        res = await updateRestraunt({
          id: restaurant.id,
          name: name.value,
          url: url.value,
          description: description.value,
          image: image,
          delete_image: deleteImage,
        });
        await deleteTagsTaggedItem({tagged_item_id: restaurant.id});
      } else {
        res = await postRestraunt({
          name: name.value,
          lat: lat.value,
          lng: lng.value,
          url: url.value,
          description: description.value,
          area_id: Number(selectedArea + 1),
          email: user.email,
          image: image
        });
      }

      const tagPromises = selectedTags.map((tag) => {
        return postTagsTaggedItem({
          tagged_item_type: "Restraunt",
          tagged_item_id: res.restraunts.id,
          tag_id: tag
        });
      });

      const tagResponses = await Promise.all(tagPromises);
      const new_tags_tagged_items = tagResponses.map(response => response.tags_tagged_item);

      if (isEditMode) {
        onSelect(res.restraunts);
        const updatedList = restaurants.map((item) => {
          if (Number(item.restaurant.id) === Number(restaurant.id)) {
            return {
              ...item,
              restaurant: { ...item.restaurant, ...res.restraunts },
              tags_tagged_items: new_tags_tagged_items
            };
          }
          return item;
        });
        setRestraunt(updatedList);
      } else {
        const newEntry = {
          restaurant: { ...res.restraunts, user_email: user.email, user_name: res.user_name },
          tags_tagged_items: new_tags_tagged_items,
        };
        onSelect(res.restraunts);
        setRestraunt([newEntry, ...restaurants]);
      }

      setIsDirty(false);
      setError('');
      handleClear();
      isEditMode ? onCloseEditDialog() : closeModal();

    } catch (error) {
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
    const name = document.getElementById('name')?.value || '';
    const url = document.getElementById('url')?.value || '';
    const description = document.getElementById('description')?.value || '';
    
    let isCurrentlyDirty = false;
    if (isEditMode) {
      const isTextDirty = name !== restaurant.name || 
                          url !== (restaurant.url || '') || 
                          description !== (restaurant.description || '');
      const initialTagIds = Object.values(tags_tagged_items).map(value => value.tag_id).sort();
      const isTagsDirty = JSON.stringify(initialTagIds) !== JSON.stringify([...selectedTags].sort());
      const isImageDirty = image !== null || deleteImage;
      isCurrentlyDirty = isTextDirty || isTagsDirty || isImageDirty;
    } else {
      isCurrentlyDirty = name !== '' || url !== '' || description !== '' || selectedTags.length > 0 || image !== null;
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
    <form onSubmit={handleSubmit} onChange={checkDirty} className="bg-white p-6 md:p-8">
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
              {tags && Object.keys(tags).map(item => {
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
            お店のURL <span className="text-xs text-gray-400 font-normal ml-1">(食べログなど)</span>
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

        <div className="mb-8">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            お店について一言 <span className="text-xs text-gray-400 font-normal ml-1">{isEditMode ? '(100文字まで)' : '※レビューではない'}</span>
          </label>
          <textarea 
            id="description" 
            name="description" 
            rows="4" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            placeholder="例：&#13;&#10;・公園の近くにあるカレー屋。&#13;&#10;・週3で食べに行ってます。"
            defaultValue={isEditMode ? restaurant.description : ''}
          ></textarea>
        </div>

        <div className='flex flex-col gap-3'>
          <button 
            disabled={localIsLoading}
            className={`w-full font-bold py-3 px-4 rounded-xl shadow-sm transition-colors duration-200 ${localIsLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
          >
            {localIsLoading ? '送信中...' : (isEditMode ? '更新する' : 'このお店を登録する')}
          </button>
          <button 
            type="button" 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-xl transition-colors duration-200" 
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
