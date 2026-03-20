import { useState } from "react";
import { postRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem } from '../../apis/tags_tagged_items';

export const CreateRestrauntModal = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagListOpen, setIsTagListOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const checkDirty = () => {
    const name = document.getElementById('name')?.value || '';
    const url = document.getElementById('url')?.value || '';
    const description = document.getElementById('description')?.value || '';
    
    const hasText = name !== '' || url !== '' || description !== '';
    const hasTags = selectedTags.length > 0;
    const hasImage = image !== null;

    props.setIsDirty(hasText || hasTags || hasImage);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        props.setIsDirty(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('');
      setTimeout(checkDirty, 0);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, lat, lng, url, description } = event.target.elements;    
    props.setIsLoading(true);
    postRestraunt({
      name: name.value,
      lat: lat.value,
      lng: lng.value,
      url: url.value,
      description: description.value,
      area_id: Number(props.selectedArea + 1),
      email: props.user.email,
      image: image
    })
      .then((res) => {        
        let tagPromises = selectedTags.map((tag) => {
          return postTagsTaggedItem({
            tagged_item_type: "Restraunt",
            tagged_item_id: res.restraunts.id,
            tag_id: tag
          }) 
        });
        props.onSelect(res.restraunts)
        props.setIsDirty(false);
        props.closeModal();

        Promise.all(tagPromises)
        .then((tagResponses) => {
          let tags_tagged_items = tagResponses.map(response => response.tags_tagged_item);

          const newRestaurant = {
            restaurant: {
              id: res.restraunts.id,
              name: res.restraunts.name,
              lat: res.restraunts.lat,
              lng: res.restraunts.lng,
              url: res.restraunts.url,
              description: res.restraunts.description,       
              area_id: res.restraunts.area_id, 
              user_name: res.user_name,
              created_at: res.restraunts.created_at,
              updated_at: res.restraunts.updated_at,
              user_email: props.user.email,
              image_url: res.restraunts.image_url // ここでサーバーから返された動的URLを使う
            },
            tags_tagged_items: tags_tagged_items,
          };
          
          const newRestaurants = [newRestaurant, ...props.restaurants];
          props.setRestraunt(newRestaurants)
          props.handleClear();
          props.setIsLoading(false);
  
        })  
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          props.setError('不備あり！');
        } else {
          props.setError('通信エラーっす！バックエンド起きてる？');
        }
        props.setIsLoading(false);
      });
  }

  const handleTagClick = (tagId) => {
    setIsSelected(!isSelected)
    let newTags;
    if (selectedTags.includes(tagId)) {
      newTags = selectedTags.filter((id) => id !== tagId);
    } else {
      newTags = [...selectedTags, tagId];
    }
    setSelectedTags(newTags);
    
    const name = document.getElementById('name')?.value || '';
    const url = document.getElementById('url')?.value || '';
    const description = document.getElementById('description')?.value || '';
    const hasText = name !== '' || url !== '' || description !== '';
    const hasImage = image !== null;
    props.setIsDirty(hasText || newTags.length > 0 || hasImage);
  };

  return (
    <form onSubmit={handleSubmit} onChange={checkDirty} className="bg-white p-6 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800">新規店名登録</div>
          <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" onClick={() => props.closeModal()}>✕</button>
        </div>
        
        {props.error && <p className="mb-4 text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg">{props.error}</p>}

        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <label className="text-gray-700 text-sm font-bold" htmlFor="name">
              店名 <span className="text-xs text-red-500 font-normal ml-1">※必須</span>
            </label>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
              エリア：{props.areas[Number(props.selectedArea)].name}
            </span>
          </div>            
          <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" id="name" placeholder="例：美味しいラーメン屋" name="name" required />
        </div>

        <input type="hidden" id="lat" name="lat" value={props.coordinateLat} />
        <input type="hidden" id="lng" name="lng" value={props.coordinateLng} />

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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
            お店のURL <span className="text-xs text-gray-400 font-normal ml-1">(食べログなど)</span>
          </label>
          <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" id="url" placeholder="https://..." name="url" />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            お店の写真 <span className="text-xs text-gray-400 font-normal ml-1">(任意)</span>
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
              onClick={() => props.openImageLightbox(preview)}
            >
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 group-hover:opacity-40 transition-opacity" />
              <img src={preview} alt="Preview" className="relative z-10 max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">画像を拡大</span>
              </div>
              <button 
                type="button" 
                onClick={(e) => {e.stopPropagation(); setImage(null); setPreview(''); document.getElementById('image').value = '';}}
                className="absolute top-2 right-2 z-30 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >✕</button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            お店について一言 <span className="text-xs text-gray-400 font-normal ml-1">※レビューではない</span>
          </label>
          <textarea id="description" name="description" rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all duration-200" 
          placeholder="例：&#13;&#10;・公園の近くにあるカレー屋。&#13;&#10;・週3で食べに行ってます。"></textarea>
        </div>

        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors duration-200">
          このお店を登録する
        </button>
      </div>
    </form >
  )
}

export default CreateRestrauntModal;