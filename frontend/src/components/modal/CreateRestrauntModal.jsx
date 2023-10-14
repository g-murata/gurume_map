import { useState, useEffect } from "react";

export const CreateRestrauntModal = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, lat, lng } = event.target.elements;
    props.setIsLoading(true);
    props.postRestraunt({
      name: name.value,
      lat: lat.value,
      lng: lng.value,
      email: props.user.email
    })
      .then((res) => {
        props.onSelect(res.restraunts)
        props.closeModal();
        const newRestaurants = [
        {
          restaurant: {
            id: res.restraunts.id,
            name: res.restraunts.name,
            lat: res.restraunts.lat,
            lng: res.restraunts.lng,
            user_name: res.user_name,
            created_at: res.restraunts.created_at,
            updated_at: res.restraunts.updated_at,
            user_email: props.user.email
          }
          ,
          // TODO:
          tags_tagged_items: []          
        } ,
        ...props.restaurants
        ]

        props.setRestraunt(newRestaurants)
        props.handleClear();
        props.setIsLoading(false);
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
          <div className='flex justify-center '>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">登録</button>
          </div>
        </div>
      </form >
    </>
  )
}

export default CreateRestrauntModal;
