// 一時的にコメントアウトすることもあるので
/* eslint no-unused-vars: 0 */

import { auth } from '../firebase';
import { useState, useEffect } from "react";
import { fetchRestaurants, deleteRestraunt } from '../apis/restraunts';
import { fetchShowReview, postReview, CheckUsersWithoutReviews, GetLatestReviews} from '../apis/reviews';
import { fetchTags} from '../apis/tags';
import { fetchAreas } from '../apis/areas';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

import Modal from 'react-modal';
import ReactStarsRating from 'react-awesome-stars-rating';
import Loading from './Loading';
import CreateRestrauntModal from './modal/CreateRestrauntModal';
import EditRestrauntModal from './modal/EditRestrauntModal';
import { ShowRestrauntModal } from './modal/ShowRestrauntModal';
import CreateReviewModal from './modal/CreateReviewModal';
import {TagList} from './TagList';
import {DateTimeConverter} from './DateTimeConverter'
import { AreaList } from './AreaList';

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.50)",
    backdropFilter: "blur(4px)", // 背景を少しぼかす
    zIndex: 1000
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: "scroll",
    borderRadius: "1rem", // モーダル自体の角丸
    border: "none",
    padding: "0"
  },
};

const area_kari = [
  { id: 1, name: "新橋", lat: 35.66630562620729, lng: 139.7581500275268 },
  { id: 2, name: "赤坂見附", lat: 35.676607396575264, lng: 139.73728881531363 },
  { id: 3, name: "新宿", lat: 35.68953440195192, lng: 139.70075664056398 },
  { id: 4, name: "王子", lat: 35.752229730596184, lng: 139.7381560725481 }
]

const divStyle = {
  background: "white",
  fontSize: 7.5,
};

const url = process.env.REACT_APP_GOOGLE_MAP_API_KEY

export const Main = (props) => {
  const user = auth.currentUser;
  const [error, setError] = useState('');

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const { content } = event.target.elements;
    setIsLoading(true);
    postReview({
      restraunt_id: selectedItem,
      evaluation: evaluation,
      content: content.value,
      email: user.email
    })
      .then((res) => {
        closeReviewModal();
        const newReviews = [
        {
          id: res.review.id,
          evaluation: res.review.evaluation,
          content: res.review.content,
          created_at: res.review.created_at,
          updated_at: res.review.updated_at,
          user_name: res.user_name,
          restraunt_id: selectedItem,
          email: user.email
        },
        ...reviews
      ]
        setReview(newReviews)
        setIsLoading(false);
      })
      .catch((error) => {
        switch (error.code) {
          case 'ERR_BAD_RESPONSE':
            setError('不備あり！');
            break;
          default:
            setError('エラーっす！Herokuのデプロイ先どうしようか？');
            break;
        }
        setIsLoading(false);
      });

    setCheckUsersWithoutReviews(false)
  }

  const handleDeleteSubmit = (index) => {
    if (window.confirm("本当に削除してもよろしいですか？\n※このお店に登録されているレビューも全て削除されます。")) {
      deleteRestraunt({
        id: selectedItem
      })
        .then(() => {
          onCloseDialog();
          const restaurantsIndex = restaurants.findIndex(r => r.restaurant.id === selectedItem)
          const newRestaurants = restaurants.slice(0, restaurantsIndex).concat(restaurants.slice(restaurantsIndex + 1));

          setRestraunt(newRestaurants);
        })
        .catch((error) => {
          switch (error.code) {
            case 'ERR_BAD_RESPONSE':
              setError('不備あり！');
              break;
            default:
              setError('エラーっす！Herokuのデプロイ先どうしようか？');
              break;
          }
        });
    }
  }

  const [restaurants, setRestraunt] = useState([])
  const [reviews, setReview] = useState([])
  const [selectedArea, setSelectedArea] = useState(1);

  const [coordinateLat, setCoordinateLat] = useState('');
  const [coordinateLng, setCoordinateLng] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isCheckUserReviewLoading, setIsCheckUserReviewLoading] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [reviewModalIsOpen, setIsReviewOpen] = useState(false);

  const OpenModal = () => {
    if (auth.currentUser.email !== "guest@guest.co.jp") {
      setIsOpen(true)
    }
  }
  const closeModal = () => {
    setError('')
    setEvaluation(3)
    setIsOpen(false);
  }

  const OpenReviewModal = () => {
    setIsReviewOpen(true)
  }
  const closeReviewModal = () => {
    setError('')
    setIsReviewOpen(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchRestaurants()
      .then((data) => {
        setRestraunt(data.restraunts)
        setIsLoading(false);        
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false);        
      })

    fetchTags()      
    .then((data) => {
      setTags(data.tags)
    })
    .catch((error) => console.log(error))

    fetchAreas()      
    .then((data) => {
      setAreas(data.areas)
    })
    .catch((error) => console.log(error))

    GetLatestReviews()
      .then((data) => {
        setGetLatestReviews(data.review)
        setGetLatestReviewsRestraunt(data.restraunt)
      })
      .catch((error) => console.log(error))    
  }, [])

  const [size, setSize] = useState(undefined);
  const infoWindowOptions = { pixelOffset: size };
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };

  const [selectedItem, setSelectedItem] = useState('')

  const [checkUsersWithoutReviews, setCheckUsersWithoutReviews] = useState(false);
  const [getLatestReviews, setGetLatestReviews] = useState("");
  const [getLatestReviewsRestraunt, setGetLatestReviewsRestraunt] = useState("");

  const onOpenDialog = (restaurant) => {
    setSelectedItem(restaurant.id)
    setIsReviewLoading(true)
    setIsCheckUserReviewLoading(true)
    onSelect(restaurant)

    fetchShowReview(restaurant.id)
      .then((data) => {
        setReview(data.review)
        setIsReviewLoading(false)
      })

    CheckUsersWithoutReviews({
      restraunt_id: restaurant.id,
      email: auth.currentUser.email
    })
      .then((result) => {
        setCheckUsersWithoutReviews(result.review);
        setIsCheckUserReviewLoading(false)
      })
      .catch((error) => {
        console.log("レビュー投稿可否チェックでエラー起きとるで★")
        console.log(error)
        setIsCheckUserReviewLoading(false)
      });
  }

  function afterOpenModal() {}
  function afterReviewOpenModal() {}

  const onCloseDialog = () => {
    setSelectedItem(false)
    setEditModalIsOpen(false);
    setError('')
    setEvaluation(3)
  }

  const getLatLng = (event) => {
    setCoordinateLat(event.latLng.lat());
    setCoordinateLng(event.latLng.lng());
    OpenModal()
  };

  const [evaluation, setEvaluation] = useState(3);

  const onChange = (value) => {
    setEvaluation(value)
  };

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const onEditDialog = (value) => {
    setEditModalIsOpen(true)
    setEvaluation(value.evaluation)
  }

  const onCloseEditDialog = () => {
    setEditModalIsOpen(false);
    setError('')
  }
  
  const TOKYO_BOUNDS = {
    north: 35.802229730596184,
    south: 35.613797,
    west: 139.653936,
    east: 139.88256,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedTags([])
  };

  const [tags, setTags] = useState([]);  
  const [areas, setAreas] = useState([]);  
  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tagId) => {
    setIsSelected(!isSelected)
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const filteredRestaurants = Object.values(restaurants).filter((restaurant) => {
    const nameFilter = restaurant.restaurant.name.includes(searchTerm)
    const tagIds = restaurant.tags_tagged_items.map(item => item.tag_id)
    const isTagSelected = Object.keys(selectedTags).length > 0 ? tagIds.some(tagId => selectedTags.includes(tagId)) : true;
    const areaFilter = restaurant.restaurant.area_id === Number(selectedArea) + 1

    return nameFilter && isTagSelected && areaFilter
  })

  const [selectedLocation, setSelectedLocation] = useState({});

  const onSelect = (item) => {
    setSelectedLocation(item);
  }
  const onDeselect = () => {
    setSelectedLocation({});
  }

  const selectedRestaurant = selectedLocation.id ? 
    filteredRestaurants.find(filteredRestaurant => filteredRestaurant.restaurant.id === selectedLocation.id)?.restaurant : undefined;


  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <>
      {props.userRegistered && <h1 className="max-w-screen-2xl px-4 md:px-8 text-primary-600 font-bold py-2">ユーザ登録完了！</h1>}
      {isLoading && <Loading />}
      <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
        
        <div className="flex flex-col h-[90vh] md:h-[88vh] bg-gray-50/50">

          {/* === 検索・フィルターエリア === */}
          <div className="bg-white border-b border-gray-100 shadow-sm z-10 flex-none relative">
            {/* 変更点1: max-w-screen-2xl mx-auto を削除して全画面幅 (w-full) に対応 */}
            <div className="w-full px-4 lg:px-6 py-3 flex justify-between items-center">
              
              <AreaList 
                areas={areas}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
              />

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 shadow-sm ${
                  isSearchOpen || searchTerm || selectedTags.length > 0
                    ? 'bg-primary-50 text-primary-600 border border-primary-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                {searchTerm || selectedTags.length > 0 ? '絞り込み中' : '検索・フィルター'}
              </button>
            </div>

            {/* アコーディオンの中身（ここは既存のまま） */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50 ${isSearchOpen ? 'max-h-[500px] border-b border-gray-200 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col items-center">
                
                <div className="relative w-full max-w-md mb-6">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-sm"
                    type="text"
                    placeholder="店名で検索..."
                    value={searchTerm}
                    onClick={() => onDeselect()}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mb-4">      
                  {Object.keys(tags).map(item => {
                    const isSelected = selectedTags.includes(tags[item].id);
                    return (
                      <button 
                        key={tags[item].id} 
                        className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 border ${
                          isSelected 
                            ? 'bg-primary-50 text-primary-600 border-primary-200 font-bold shadow-sm' 
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handleTagClick(tags[item].id)}
                      >
                        {tags[item].name}
                      </button >  
                    )}
                  )}
                </div>

                {(searchTerm || selectedTags.length > 0) && (
                  <button onClick={() => handleClear()} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    条件をクリア
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* === メインコンテンツ === */}
          {/* 変更点2: max-w-screen-2xl mx-auto を削除して画面幅いっぱいに */}
          <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden w-full">
            
            {/* 左側：レストランリスト */}
            {/* 変更点3: w-[30vw] をやめ、固定幅 (lg:w-[400px]) を指定。境界線 (border-r) も追加 */}
            <div className="overflow-y-auto flex-1 md:flex-none md:h-full w-full md:w-96 lg:w-[400px] px-4 py-4 scrollbar-hide border-r border-gray-200 bg-gray-50/50">
              {Object.keys(filteredRestaurants).map(item => {
                return (
                  <div key={filteredRestaurants[item].restaurant.id}>
                    
                    <div 
                      className="flex mb-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      onClick={() => onOpenDialog(filteredRestaurants[item].restaurant)}
                      onMouseOver={() => onSelect(filteredRestaurants[item].restaurant)} 
                    >
                      <div className="w-1/3 min-w-[120px] bg-gray-50 flex-shrink-0">
                        {filteredRestaurants[item].restaurant.image_url == null ?
                           <img src={`${process.env.PUBLIC_URL}/no_image_square.png`} className="object-cover w-full h-full opacity-50 p-2" alt="no_image" />
                           :
                           <img src={filteredRestaurants[item].restaurant.image_url} className="object-cover w-full h-full" alt={filteredRestaurants[item].restaurant.name} />
                        }
                      </div>
                      
                      <div className="flex flex-col justify-between w-2/3 p-4">
                        <div>
                          <div className="mb-2 text-lg font-bold text-gray-800 line-clamp-1">
                            {filteredRestaurants[item].restaurant.name}
                          </div>
                          <div className="mb-2">
                            <TagList 
                              tags_tagged_items={filteredRestaurants[item].tags_tagged_items}
                              tags={tags}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          <DateTimeConverter 
                            created_at={filteredRestaurants[item].restaurant.created_at}
                          />
                        </div>
                      </div>
                    </div>

                    <Modal isOpen={filteredRestaurants[item].restaurant.id === selectedItem} onAfterOpen={afterOpenModal} onRequestClose={onCloseDialog} style={customStyles} contentLabel="Show Restaurant Modal">
                      {!editModalIsOpen ?
                        <ShowRestrauntModal ReactStarsRating={ReactStarsRating} evaluation={evaluation} setEvaluation={setEvaluation} onChange={onChange} onEditDialog={onEditDialog} handleDeleteSubmit={handleDeleteSubmit} onCloseDialog={onCloseDialog} OpenReviewModal={OpenReviewModal} setReview={setReview} restaurant={filteredRestaurants[item].restaurant} item={item} tags_tagged_items={filteredRestaurants[item].tags_tagged_items} tags={tags} reviews={reviews} checkUsersWithoutReviews={checkUsersWithoutReviews} setCheckUsersWithoutReviews={setCheckUsersWithoutReviews} isLoading={isLoading} isReviewLoading={isReviewLoading} isCheckUserReviewLoading={isCheckUserReviewLoading} error={error} setError={setError} />
                        :
                        <EditRestrauntModal setIsLoading={setIsLoading} selectedItem={selectedItem} onSelect={onSelect} setEditModalIsOpen={setEditModalIsOpen} onCloseEditDialog={onCloseEditDialog} setError={setError} restaurants={restaurants} setRestraunt={setRestraunt} onCloseDialog={onCloseDialog} handleClear={handleClear} error={error} restaurant={filteredRestaurants[item].restaurant} tags_tagged_items={filteredRestaurants[item].tags_tagged_items} tags={tags} />
                      }
                    </Modal>

                    {reviewModalIsOpen &&
                      <Modal isOpen={filteredRestaurants[item].restaurant.id === selectedItem} onAfterOpen={afterReviewOpenModal} onRequestClose={closeReviewModal} style={customStyles} contentLabel="Review Modal">
                        <form onSubmit={handleReviewSubmit}>
                          <CreateReviewModal ReactStarsRating={ReactStarsRating} closeReviewModal={closeReviewModal} evaluation={evaluation} onChange={onChange} error={error} restaurant={filteredRestaurants[item].restaurant} />
                        </form>
                      </Modal>
                    }                  
                  </div>
                )
              })}
            </div>
            
            {/* 右側：マップ */}
            {/* 変更点4: md:w-[70vw] を削除し、flex-1 を指定して残りの幅を100%埋める */}
            <div className="h-[40vh] md:h-full w-full flex-1 relative">
              <GoogleMap
                mapContainerClassName="w-full h-full"
                center={area_kari.find((area) => area.id === Number(selectedArea) + 1)}
                zoom={16}
                options={{
                  fullscreenControl: false, 
                  restriction: { latLngBounds: TOKYO_BOUNDS, strictBounds: true },
                }}
                onClick={getLatLng}
              >
                <div className="overflow-auto h-60vh">
                  {Object.keys(filteredRestaurants).map(item => {               
                    return (
                      <Marker
                        key={filteredRestaurants[item].restaurant.id}
                        className="cursor-pointer" 
                        button onClick={() => onOpenDialog(filteredRestaurants[item].restaurant)}
                        onMouseOver={() => onSelect(filteredRestaurants[item].restaurant)} 
                        onMouseOut={onDeselect}
                        position={{ lat: filteredRestaurants[item].restaurant.lat, lng: filteredRestaurants[item].restaurant.lng }} 
                      />                    
                    )
                  })}
                </div>
                
                {
                  (selectedRestaurant !== undefined) && (
                    <InfoWindow position={{ lat: selectedRestaurant.lat, lng: selectedRestaurant.lng }} options={infoWindowOptions}>
                      <div style={divStyle} className="cursor-pointer font-bold px-2 py-1" button onClick={() => onOpenDialog(selectedRestaurant)}>
                        <h2 className="text-xs md:text-sm text-gray-800">{selectedRestaurant.name}</h2>                    
                      </div>
                    </InfoWindow>
                  )              
                }
              </GoogleMap>
            </div>
          </div>
        </div>

        {/* 新規店名登録モーダル */}
        <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Create Restaurant Modal">
          <CreateRestrauntModal setIsLoading={setIsLoading} restaurants={restaurants} setRestraunt={setRestraunt} user={user} onSelect={onSelect} closeModal={closeModal} handleClear={handleClear} setError={setError} error={error} coordinateLat={coordinateLat} coordinateLng={coordinateLng} tags={tags} areas={areas} selectedArea={selectedArea} />
        </Modal>

      </LoadScript >
    </>
  );
};

export default Main;