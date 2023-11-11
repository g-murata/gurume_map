import { useState, useEffect } from "react";
import { updateRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem, deleteTagsTaggedItem } from '../../apis/tags_tagged_items';


export const EditRestrauntModal = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tagId) => {
    // 選択されたタグを追加または削除する処理
    setIsSelected(!isSelected)
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const { name } = event.target.elements;
    props.setIsLoading(true);
  
    try {
      const res = await updateRestraunt({
        id: props.selectedItem,
        name: name.value,
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
  
      // UIの更新処理
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
            },
            tags_tagged_items: tags_tagged_items
          }
        }
        return restaurant;
      });
      props.setRestraunt(updateRestaurants);
      props.handleClear();
  
    } catch (error) {
      // エラー処理
      switch (error.code) {
        case 'ERR_BAD_RESPONSE':
          props.setError('不備あり！');
          break;
        default:
          props.setError('エラーっす！Herokuのデプロイ先どうしようか？');
          break;
      }
    } finally {
      props.setIsLoading(false);
    }
  };  


  useEffect(() => {
    // `props.tags_tagged_items`からタグIDの配列を作成します。
    const initialTagIds = Object.values(props.tags_tagged_items).map(value => value.tag_id);

    // `setSelectedTags`を使って初期タグの状態を設定します。
    setSelectedTags(initialTagIds);
    // ここで`isSelected`の初期状態も設定する必要がありますが、
    // そのロジックは`isSelected`の使われ方に依存します。
    // 例えば、すべてのタグが選択されている場合は以下のようにします。
    setIsSelected(true);
  }, [props.tags_tagged_items])

  return (
    <>
      <form onSubmit={handleUpdateSubmit}>
        <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
          <div className="text-3xl font-bold text-center">
            編集
          </div>
          {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
          <div className="text-right">
            <button className="font-bold" onClick={() => props.onCloseDialog()}>Close</button>
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
            店名
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="店名" name="name"
            defaultValue={props.restaurant.name} />
          <div>
            {/* <label for="lat" className="block text-gray-700 text-sm font-bold mb-2">
              経緯
            </label> */}
            <input type="hidden" id="lat" name="lat" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.restaurant.lat}></input>
          </div>
          <div>
            {/* <label for="lng" className="block text-gray-700 text-sm font-bold mb-2">
              経度
            </label> */}
            <input type="hidden" id="lng" name="lng" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.restaurant.lng}></input>
          </div>

          <div className="my-2">                           
            {Object.keys(props.tags).map(item => {
              return (
                <>
                  <button 
                    type="button"
                    className={`bg-blue-500 text-white font-bold mx-2 px-2 rounded ${selectedTags.includes(props.tags[item].id) ? 'bg-red-500' : ''}`} 
                    key={props.tags[item].id} 
                    onClick={() => handleTagClick(props.tags[item].id)}
                  >
                    {props.tags[item].name}
                  </button >  
                </>
              )}
              )
            }
          </div>

          <div className='flex justify-center '>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">更新</button>
          </div>
          <div className="text-right">
            <button className="font-bold" onClick={() => props.onCloseEditDialog()}>詳細画面に戻る</button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditRestrauntModal;
