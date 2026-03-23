// 一時的にコメントアウトすることもあるので
/* eslint no-unused-vars: 0 */

import React, { useState, useEffect } from "react";
import { auth } from '../firebase';
import { fetchRestaurants, deleteRestraunt } from '../apis/restraunts';
import { fetchShowReview, CheckUsersWithoutReviews } from '../apis/reviews';
import { fetchTags} from '../apis/tags';
import { fetchAreas } from '../apis/areas';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

import Modal from 'react-modal';
// @ts-ignore
import ReactStarsRating from 'react-awesome-stars-rating';
import Loading from './Loading';
import { ShowRestrauntModal } from './modal/ShowRestrauntModal';
import { ReviewModal } from './modal/ReviewModal';
import { RestrauntModal } from './modal/RestrauntModal';
import {TagList} from './TagList';
import {DateTimeConverter} from './DateTimeConverter'
import { AreaList } from './AreaList';
import { User, Restraunt, Review, Tag, TagsTaggedItem, Area } from '../types/index';

const customStyles: any = {
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

const divStyle = {
  background: "white",
  fontSize: 7.5,
};

const url = process.env.REACT_APP_GOOGLE_MAP_API_KEY as string;

interface RestaurantEntry {
  restaurant: Restraunt & { user_email?: string; user_name?: string; image_url?: string; created_at: string; updated_at?: string };
  tags_tagged_items: TagsTaggedItem[];
}

interface MainProps {
  userRegistered?: boolean;
  userInfo: User | false | null;
  openImageLightboxInApp: (url: string) => void;
}

export const Main: React.FC<MainProps> = (props) => {
  const user = auth.currentUser;
  const [error, setError] = useState('');

  const handleDeleteSubmit = (id: number) => {
    if (window.confirm("本当に削除してもよろしいですか？\n※このお店に登録されているレビューも全て削除されます。")) {
      setIsLoading(true);
      deleteRestraunt({
        id: id
      })
        .then(() => {
          onCloseDialog();
          const newRestaurants = restaurants.filter(r => r.restaurant.id !== id);
          setRestaurants(newRestaurants);
          setIsLoading(false);
        })
        .catch((error) => {
          setError('通信エラーっす！バックエンド起きてる？');
          setIsLoading(false);
        });
    }
  }

  const [restaurants, setRestaurants] = useState<RestaurantEntry[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedArea, setSelectedArea] = useState(1);

  const [coordinateLat, setCoordinateLat] = useState<number | string>('');
  const [coordinateLng, setCoordinateLng] = useState<number | string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isCheckUserReviewLoading, setIsCheckUserReviewLoading] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [reviewModalIsOpen, setIsReviewOpen] = useState(false);

  const [isDirty, setIsDirty] = useState(false);

  const guardedClose = (closeFunction: () => void) => {
    if (isDirty) {
      if (window.confirm("書きかけの内容がありますが、閉じてもよろしいですか？")) {
        setIsDirty(false);
        closeFunction();
      }
    } else {
      closeFunction();
    }
  };

  const OpenModal = () => {
    if (user && user.email !== "guest@guest.co.jp") {
      setIsDirty(false);
      setIsOpen(true)
    }
  }
  const closeModal = () => {
    setError('')
    setEvaluation(3)
    setIsOpen(false);
    setIsDirty(false);
  }

  const OpenReviewModal = () => {
    setEvaluation(3);
    setIsDirty(false);
    setIsReviewOpen(true)
  }
  const closeReviewModal = () => {
    setError('')
    setEvaluation(3);
    setIsReviewOpen(false);
    setIsDirty(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchRestaurants()
      .then((data: any) => {
        setRestaurants(data.restraunts)
        setIsLoading(false);        
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false);        
      })

    fetchTags()      
    .then((data: any) => {
      setTags(data.tags)
    })
    .catch((error) => console.log(error))

    fetchAreas()      
    .then((data: any) => {
      setAreas(data.areas)
    })
    .catch((error) => console.log(error))
  }, [])

  const [size, setSize] = useState<google.maps.Size | undefined>(undefined);
  const infoWindowOptions = { pixelOffset: size };
  const createOffsetSize = () => {
    if (window.google) {
      return setSize(new window.google.maps.Size(0, -45));
    }
  };

  const [selectedItem, setSelectedItem] = useState<number | false>(false)

  const [checkUsersWithoutReviews, setCheckUsersWithoutReviews] = useState(false);

  const onOpenDialog = (restaurant: any) => {
    setIsDirty(false);
    setSelectedItem(restaurant.id)
    setIsReviewLoading(true)
    setIsCheckUserReviewLoading(true)
    onSelect(restaurant)

    fetchShowReview(restaurant.id)
      .then((data: any) => {
        setReviews(data.review)
        setIsReviewLoading(false)
      })

    if (user?.email) {
      CheckUsersWithoutReviews({
        restraunt_id: restaurant.id,
        email: user.email
      })
        .then((result: any) => {
          setCheckUsersWithoutReviews(result.review);
          setIsCheckUserReviewLoading(false)
        })
        .catch((error) => {
          console.log("レビュー投稿可否チェックでエラー起きとるで★")
          console.log(error)
          setIsCheckUserReviewLoading(false)
        });
    }
  }

  const onCloseDialog = () => {
    setSelectedItem(false)
    setEditModalIsOpen(false);
    setError('')
    setEvaluation(3)
    setIsDirty(false);
  }

  const getLatLng = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setCoordinateLat(event.latLng.lat());
      setCoordinateLng(event.latLng.lng());
      OpenModal()
    }
  };

  const [evaluation, setEvaluation] = useState(3);

  const onChange = (value: number) => {
    setEvaluation(value)
  };

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const onEditDialog = (value: any) => {
    setIsDirty(false);
    setEditModalIsOpen(true)
    setEvaluation(value.evaluation || 3)
  }

  const onCloseEditDialog = () => {
    setEditModalIsOpen(false);
    setError('')
    setIsDirty(false);
  }
  
  const TOKYO_BOUNDS = {
    north: 35.802229730596184,
    south: 35.613797,
    west: 139.653936,
    east: 139.88256,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedTags([])
  };

  const [tags, setTags] = useState<Tag[]>([]);  
  const [areas, setAreas] = useState<Area[]>([]);  
  const [isSelected, setIsSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const handleTagClick = (tagId: number) => {
    setIsSelected(!isSelected)
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const filteredRestaurants = Object.values(restaurants).filter((entry) => {
    const restaurant = entry.restaurant;
    const nameFilter = restaurant.name.includes(searchTerm)
    const tagIds = entry.tags_tagged_items.map(item => item.tag_id)
    const isTagSelected = selectedTags.length > 0 ? tagIds.some(tagId => selectedTags.includes(tagId)) : true;
    const areaFilter = restaurant.area_id === Number(selectedArea) + 1

    return nameFilter && isTagSelected && areaFilter
  })

  const [selectedLocation, setSelectedLocation] = useState<any>({});

  const onSelect = (item: any) => {
    setSelectedLocation(item);
  }
  const onDeselect = () => {
    setSelectedLocation({});
  }

  const selectedRestaurant = selectedLocation.id ? 
    filteredRestaurants.find(entry => entry.restaurant.id === selectedLocation.id)?.restaurant : undefined;


  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const openImageLightbox = (imageUrl: string) => {
    setEnlargedImage(imageUrl);
  };
  const closeImageLightbox = () => {
    setEnlargedImage(null);
  };

  const lightboxStyles: any = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    content: {
      position: "static",
      inset: "auto",
      background: "none",
      border: "none",
      padding: 0,
      maxWidth: "90vw",
      maxHeight: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  };

  // 暫定的なエリア定義
  const area_kari = [
    { id: 1, name: "新橋", lat: 35.66630562620729, lng: 139.7581500275268 },
    { id: 2, name: "赤坂見附", lat: 35.676607396575264, lng: 139.73728881531363 },
    { id: 3, name: "新宿", lat: 35.68953440195192, lng: 139.70075664056398 },
    { id: 4, name: "王子", lat: 35.752229730596184, lng: 139.7381560725481 }
  ];

  return (
    <>
      {props.userRegistered && <h1 className="max-w-screen-2xl px-4 md:px-8 text-primary-600 font-bold py-2">ユーザ登録完了！</h1>}
      {(isLoading || isReviewLoading || isCheckUserReviewLoading) && <Loading />}
      
      {/* 画像拡大表示用モーダル */}
      <Modal 
        isOpen={!!enlargedImage} 
        onRequestClose={closeImageLightbox} 
        style={lightboxStyles} 
        contentLabel="Image Lightbox"
      >
        <div className="relative group">
          {enlargedImage && (
            <img 
              src={enlargedImage} 
              alt="Enlarged" 
              className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
              onClick={closeImageLightbox}
            />
          )}
          <button 
            onClick={closeImageLightbox}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>
      </Modal>

      <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
        
        <div className="flex flex-col h-[90vh] md:h-[88vh] bg-gray-50/50">

          {/* === 検索・フィルターエリア === */}
          <div className="bg-white border-b border-gray-100 shadow-sm z-10 flex-none relative">
            <div className="w-full px-4 lg:px-6 py-3 flex justify-between items-center">
              
              <AreaList 
                // @ts-ignore
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
                  {Object.keys(tags).map((item: any) => {
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
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden w-full relative">
            
            {/* 左側：レストランリスト */}
            <div className={`overflow-y-auto flex-1 md:flex-none md:h-full w-full md:w-96 lg:w-[400px] px-4 py-4 scrollbar-hide border-r border-gray-200 bg-gray-50/50 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
              {filteredRestaurants.map((entry) => {
                const restaurant = entry.restaurant;
                return (
                  <div key={restaurant.id}>
                    
                    <div 
                      className="flex mb-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      onClick={() => onOpenDialog(restaurant)}
                      onMouseOver={() => onSelect(restaurant)}
                    >
                      <div className="w-1/3 min-w-[120px] bg-gray-50 flex-shrink-0">
                        {restaurant.image_url == null ?
                           <img src={`${process.env.PUBLIC_URL}/no_image_square.png`} className="object-cover w-full h-full opacity-50 p-2" alt="no_image" />
                           :
                           <img src={restaurant.image_url} className="object-cover w-full h-full" alt={restaurant.name} />
                        }
                      </div>
                      
                      <div className="flex flex-col justify-between w-2/3 p-4">
                        <div>
                          <div className="mb-2 text-lg font-bold text-gray-800 line-clamp-1">
                            {restaurant.name}
                          </div>
                          <div className="mb-2">
                            <TagList 
                              // @ts-ignore
                              tags_tagged_items={entry.tags_tagged_items}
                              tags={tags}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          <DateTimeConverter 
                            created_at={restaurant.created_at}
                          />
                        </div>
                      </div>
                    </div>

                    <Modal isOpen={restaurant.id === selectedItem} onAfterOpen={() => {}} onRequestClose={() => guardedClose(onCloseDialog)} style={customStyles} contentLabel="Show Restaurant Modal">
                      {!editModalIsOpen ?
                        <ShowRestrauntModal ReactStarsRating={ReactStarsRating} evaluation={evaluation} setEvaluation={setEvaluation} onChange={onChange} onEditDialog={onEditDialog} handleDeleteSubmit={handleDeleteSubmit} onCloseDialog={() => guardedClose(onCloseDialog)} OpenReviewModal={OpenReviewModal} setReview={setReviews} restaurant={restaurant} item={restaurant.id} tags_tagged_items={entry.tags_tagged_items as any} tags={tags} reviews={reviews} checkUsersWithoutReviews={checkUsersWithoutReviews} setCheckUsersWithoutReviews={setCheckUsersWithoutReviews} isReviewLoading={isReviewLoading} isCheckUserReviewLoading={isCheckUserReviewLoading} setIsLoading={setIsLoading} error={error} setError={setError} setIsDirty={setIsDirty} openImageLightbox={props.openImageLightboxInApp} currentUserInfo={props.userInfo} />
                        :
                        <RestrauntModal mode="edit" setIsLoading={setIsLoading} restaurant={restaurant} tags_tagged_items={entry.tags_tagged_items as any} tags={tags} areas={areas as any} selectedArea={selectedArea} coordinateLat={restaurant.lat} coordinateLng={restaurant.lng} setIsDirty={setIsDirty} onSelect={onOpenDialog} setRestraunt={setRestaurants} handleClear={handleClear} setError={setError} error={error} user={user as any} restaurants={restaurants} closeModal={closeModal} onCloseEditDialog={onCloseEditDialog} openImageLightbox={openImageLightbox} />
                      }
                    </Modal>

                    {reviewModalIsOpen &&
                      <Modal isOpen={restaurant.id === selectedItem} onAfterOpen={() => {}} onRequestClose={() => guardedClose(closeReviewModal)} style={customStyles} contentLabel="Review Modal">
                        <ReviewModal 
                          mode="new"
                          restaurant={restaurant}
                          setIsDirty={setIsDirty}
                          openImageLightbox={openImageLightbox}
                          closeReviewModal={closeReviewModal}
                          error={error}
                          setError={setError}
                          setIsLoading={setIsLoading}
                          user={user as any}
                          reviews={reviews}
                          setReview={setReviews}
                          setCheckUsersWithoutReviews={setCheckUsersWithoutReviews}
                          ReactStarsRating={ReactStarsRating}
                        />
                      </Modal>
                    }
                  
                  </div>
                )
              })}
            </div>
            
            {/* 右側：マップ */}
            <div className={`h-full w-full flex-1 relative ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
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
                  {filteredRestaurants.map((entry) => {
                    const restaurant = entry.restaurant;
                    const isSelected = selectedRestaurant?.id === restaurant.id;
                    return (
                      <Marker
                        key={restaurant.id}
                        onClick={() => onSelect(restaurant)}
                        position={{ lat: restaurant.lat, lng: restaurant.lng }}
                        // 選択されているマーカーを少し強調（オプションがあれば）
                        icon={isSelected ? undefined : {
                          url: `${process.env.PUBLIC_URL}/ishii_marker.png`, // もしカスタムアイコンがあれば
                          scaledSize: new window.google.maps.Size(30, 30)
                        }}
                      />                    
                    )
                  })}
                </div>
                
                {
                  (selectedRestaurant !== undefined) && (
                    <InfoWindow 
                      position={{ lat: selectedRestaurant.lat, lng: selectedRestaurant.lng }} 
                      options={infoWindowOptions}
                      onCloseClick={() => onDeselect()}
                    >
                      <div style={divStyle} className="cursor-pointer font-bold px-2 py-1" onClick={() => onOpenDialog(selectedRestaurant)}>
                        <h2 className="text-xs md:text-sm text-gray-800">{selectedRestaurant.name}</h2>                    
                      </div>
                    </InfoWindow>
                  )              
                }
              </GoogleMap>

              {/* スマホ用：マップ上の浮遊カード */}
              {viewMode === 'map' && selectedRestaurant && (
                <div className="md:hidden absolute bottom-24 left-4 right-4 animate-in slide-in-from-bottom-4 duration-300">
                  <div 
                    className="bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-gray-100"
                    onClick={() => onOpenDialog(selectedRestaurant)}
                  >
                    <div className="w-24 h-24 flex-shrink-0">
                      {selectedRestaurant.image_url ? (
                        <img src={selectedRestaurant.image_url} className="w-full h-full object-cover" alt={selectedRestaurant.name} />
                      ) : (
                        <img src={`${process.env.PUBLIC_URL}/no_image_square.png`} className="w-full h-full object-cover opacity-50 p-2" alt="no-image" />
                      )}
                    </div>
                    <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{selectedRestaurant.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 truncate">{selectedRestaurant.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* スマホ用表示切り替えボタン */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="bg-gray-800/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold active:scale-95 transition-all border border-white/10"
              >
                {viewMode === 'list' ? (
                  <>
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.447-1.894L9 1m0 19l6 3m-6-3V1m6 22l5.447-2.724A2 2 0 0121 18.618V8.382a2 2 0 01-1.447-1.894L15 1m0 22V1m0 0L9 4"></path></svg>
                    マップを表示
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    リストを表示
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 新規店名登録モーダル */}
        <Modal isOpen={modalIsOpen} onAfterOpen={() => {}} onRequestClose={() => guardedClose(closeModal)} style={customStyles} contentLabel="Create Restaurant Modal">
          <RestrauntModal mode="new" setIsLoading={setIsLoading} restaurant={{} as any} tags={tags} areas={areas as any} selectedArea={selectedArea} coordinateLat={Number(coordinateLat)} coordinateLng={Number(coordinateLng)} setIsDirty={setIsDirty} onSelect={onOpenDialog} setRestraunt={setRestaurants} handleClear={handleClear} setError={setError} error={error} user={user as any} restaurants={restaurants} closeModal={closeModal} onCloseEditDialog={onCloseEditDialog} openImageLightbox={openImageLightbox} ReactStarsRating={ReactStarsRating} />
        </Modal>

      </LoadScript >
    </>
  );
};

export default Main;
