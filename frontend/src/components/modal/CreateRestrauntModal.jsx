import { useState } from "react";
import { postRestraunt } from '../../apis/restraunts';
import { postTagsTaggedItem } from '../../apis/tags_tagged_items';

export const CreateRestrauntModal = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

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
      email: props.user.email
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
        props.closeModal();

        Promise.all(tagPromises)
        .then((tagResponses) => {
          let tags_tagged_items = tagResponses.map(response => response.tags_tagged_item);

          // tagResponsesには、各postTagsTaggedItemのレスポンスが含まれています。
          const newRestaurant = {
            restaurant: {
              id: res.restraunts.id,
              name: res.restraunts.name,
              lat: res.restraunts.lat,
              lng: res.restraunts.lng,
              url: res.restraunts.url,
              description: res.restraunts.description,        
              user_name: res.user_name,
              created_at: res.restraunts.created_at,
              updated_at: res.restraunts.updated_at,
              user_email: props.user.email,
            },
            tags_tagged_items: tags_tagged_items, // ここにレスポンスを追加
          };
          
          // 新しいrestaurantを既存のリストに追加
          const newRestaurants = [newRestaurant, ...props.restaurants];
          // 状態を更新するロジックをここに追加します（例：setStateなど）
          
          props.setRestraunt(newRestaurants)
          props.handleClear();
          props.setIsLoading(false);
  
        })  
      })
      .catch((error) => {
        switch (error.code) {
          case 'ERR_BAD_RESPONSE':
            props.setError('不備あり！');
            break;
          default:
            props.setError('エラーっす！Herokuのデプロイ先どうしようか？');
            break;
        }
        props.setIsLoading(false);
      });
  }

  const handleTagClick = (tagId) => {
    // 選択されたタグを追加または削除する処理
    setIsSelected(!isSelected)
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
          <div className="text-3xl font-bold text-center">
            新規店名登録
          </div>
          {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
          <div className="text-right">
            <button className="font-bold" onClick={() => props.closeModal()}>Close</button>
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
            店名
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="店名" name="name" />
          {/* TODO:hiddenはあんまし使いたくはない */}
          <div>
            <input type="hidden" id="lat" name="lat" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.coordinateLat}></input>
          </div>
          <div>
            <input type="hidden" id="lng" name="lng" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={props.coordinateLng}></input>
          </div>
          <div className="my-4">
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

        <label className="block text-gray-700 text-sm font-bold mb-2 my-3" for="url">
          お店のURL
        </label>
        <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="url" placeholder="https://gurume-map.netlify.app" name="url" />

        <div>
          <label for="description" className="block text-gray-700 text-sm font-bold mb-2 my-3">
            お店について一言
          </label>
          <textarea id="description" name="description" rows="4" className="h-30 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="例：
          ・公園の近くにあるカレー屋。
          ・週3で食べに行ってます。"></textarea>
        </div>

          <div className='flex justify-center '>
            <button className="bg-yellow-500 hover:bg-yellow-300 text-white font-bold py-2 px-8 my-8 rounded-full">登録</button>
          </div>
        </div>
      </form >
    </>
  )
}

export default CreateRestrauntModal;
