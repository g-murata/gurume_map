import { useState, useEffect } from "react";
import { updateRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem, deleteTagsTaggedItem } from '../../apis/tags_tagged_items';

export const EditRestrauntModal = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagListOpen, setIsTagListOpen] = useState(false); // アコーディオン用ステート
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(props.restaurant.image_url || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagClick = (tagId) => {
    setIsSelected(!isSelected)
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const { name, url, description } = event.target.elements;
    props.setIsLoading(true);
    
    try {
      const res = await updateRestraunt({
        id: props.selectedItem,
        name: name.value,
        url: url.value,
        description: description.value,
        image: image,
      });
  
      await deleteTagsTaggedItem({tagged_item_id: props.restaurant.id});
  
      const tagPromises = selectedTags.map((tag) => {
        return postTagsTaggedItem({
          tagged_item_type: "Restraunt",
          tagged_item_id: res.restraunts.id,
          tag_id: tag
        });
      });
  
      const tagResponses = await Promise.all(tagPromises);
      let tags_tagged_items = tagResponses.map(response => response.tags_tagged_item);
  
      props.onSelect(res.restraunts)        
      props.setEditModalIsOpen(false);
      props.setError('');
  
      const updateRestaurants = props.restaurants.map((restaurant) => {
        if (Number(restaurant.restaurant.id) === Number(props.selectedItem)) {
          return {
            ...restaurant,
            restaurant: {
              ...restaurant.restaurant,
              name: res.restraunts.name,
              lat: res.restraunts.lat,
              lng: res.restraunts.lng,
              updated_at: res.restraunts.updated_at,    
              url: res.restraunts.url,
              description: res.restraunts.description,
              image_url: res.restraunts.image_url,
            },
            tags_tagged_items: tags_tagged_items
          }
        }
        return restaurant;
      });
      props.setRestraunt(updateRestaurants);
      props.handleClear();
  
    } catch (error) {
      if (error.response && error.response.status === 422) {
        props.setError('不備あり！');
      } else {
        props.setError('通信エラーっす！バックエンド起きてる？');
      }
    } finally {

      props.setIsLoading(false);
    }
  };  

  useEffect(() => {
    const initialTagIds = Object.values(props.tags_tagged_items).map(value => value.tag_id);
    setSelectedTags(initialTagIds);
    
    // すでにタグが設定されている場合は、最初からアコーディオンを開いておく親切設計
    if (initialTagIds.length > 0) {
      setIsTagListOpen(true);
    }
  }, [props.tags_tagged_items])  

  return (
    <form onSubmit={handleUpdateSubmit} className="bg-white p-6 md:p-8">
      <div className="max-w-lg mx-auto">
        
        {/* ヘッダーと閉じるボタン */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800">お店の編集</div>
          <button 
            type="button" 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" 
            onClick={() => props.onCloseDialog()}
          >
            ✕
          </button>
        </div>

        {props.error && <p className="mb-4 text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg">{props.error}</p>}

        {/* 店名入力 */}
        <div className="mb-6">
          <label className="text-gray-700 text-sm font-bold block mb-2" htmlFor="name">
            店名
          </label>
          <input 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            id="name" 
            placeholder="店名" 
            name="name"
            defaultValue={props.restaurant.name} 
            required
          />
        </div>

        {/* 座標データ (Hidden) */}
        <input type="hidden" id="lat" name="lat" value={props.restaurant.lat} />
        <input type="hidden" id="lng" name="lng" value={props.restaurant.lng} />

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
              {Object.keys(props.tags).map(item => {
                const isSelected = selectedTags.includes(props.tags[item].id);
                return (
                  <button 
                    type="button"
                    className={`text-sm px-3 py-1.5 rounded-full transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-primary-50 text-primary-600 border-primary-200 font-bold shadow-sm' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                    key={props.tags[item].id} 
                    onClick={() => handleTagClick(props.tags[item].id)}
                  >
                    {props.tags[item].name}
                  </button >  
                )}
              )}
            </div>
          </div>
        </div>

        {/* URL入力 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
            お店のURL
          </label>
          <input 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            id="url"
            placeholder="https://..." 
            name="url" 
            defaultValue={props.restaurant.url}
          />
        </div>

        {/* 写真編集 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            お店の写真 <span className="text-xs text-gray-400 font-normal ml-1">(変更する場合のみ選択)</span>
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
            <div className="mt-4 w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative flex items-center justify-center">
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110" />
              <img src={preview} alt="Preview" className="relative z-10 max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>

        {/* 説明入力 */}
        <div className="mb-8">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            お店について一言 <span className="text-xs text-gray-400 font-normal ml-1">(100文字まで)</span>
          </label>
          <textarea 
            id="description" 
            name="description" 
            rows="4" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
            placeholder="例：&#13;&#10;・公園の近くにあるカレー屋。&#13;&#10;・週3で食べに行ってます。"
            defaultValue={props.restaurant.description}
          ></textarea>
        </div>          

        {/* ボタンエリア */}
        <div className='flex flex-col gap-3'>
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors duration-200">
            更新する
          </button>
          <button 
            type="button" 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-xl transition-colors duration-200" 
            onClick={() => props.onCloseEditDialog()}
          >
            詳細画面に戻る
          </button>
        </div>

      </div>
    </form>
  )
}

export default EditRestrauntModal;