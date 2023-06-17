// 一時的にコメントアウトすることもあるので
/* eslint no-unused-vars: 0 */

import { auth } from '../firebase';
import { useState, useEffect } from "react";
import { fetchRestaurants, postRestraunt, updateRestraunt, deleteRestraunt } from '../apis/restraunts';
import { fetchShowReview, postReview, CheckUsersWithoutReviews, GetLatestReviews} from '../apis/reviews';
import { fetchTags} from '../apis/tags';
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


// import Restaurants from './../restaurants.json';
// const restaurants = Restaurants.data;


const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.50)"
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: "scroll",
  },
};


const containerStyle = {
  height: "55vh",
  width: "100%",
};

const center = {
  lat: 35.666333273506176,
  lng: 139.75424473120108,
};

const positionIshiBill = {
  lat: 35.666333273506176,
  lng: 139.75424473120108,
};

const divStyle = {
  background: "white",
  fontSize: 7.5,
};

const url = process.env.REACT_APP_GOOGLE_MAP_API_KEY


export const Main = (props) => {
  const user = auth.currentUser;
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, lat, lng } = event.target.elements;
    setIsLoading(true);
    postRestraunt({
      name: name.value,
      lat: lat.value,
      lng: lng.value,
      email: user.email
    })
      .then((res) => {
        closeModal();
        const newRestaurants = [
        ...restaurants,
        {
          restaurant: {
            id: res.restraunts.id,
            name: res.restraunts.name,
            lat: res.restraunts.lat,
            lng: res.restraunts.lng,
            user_name: res.user_name,
            user_email: user.email
          }
          // TODO:
          ,
          tags_tagged_items: []          
        }]

        setRestraunt(newRestaurants)
        handleClear();
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
  }

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
        const newReviews = [...reviews,
        {
          id: res.review.id,
          evaluation: res.review.evaluation,
          content: res.review.content,
          user_name: res.user_name,
          restraunt_id: selectedItem,
          email: user.email
        }]
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

  const handleUpdateSubmit = (event) => {

    event.preventDefault();
    const { name } = event.target.elements;
    setIsLoading(true);
    updateRestraunt({
      id: selectedItem,
      name: name.value,
    })
      .then((res) => {
        setEditModalIsOpen(false);
        setError('')

        // TODO: これ見直さないと駄目かも。なんでfilteredの方まで更新されるのかわからん。
        // TODO:　たぶんこれ非推奨なんじゃないかな。setStateで更新してあげないと。
        // UPDATEの参考
        // https://zenn.dev/sprout2000/books/76a279bb90c3f3/viewer/chapter10
        const updateRestaurants = restaurants.map((restaurant) => {
          if (Number(restaurant.restaurant.id) === Number(selectedItem)) {
            restaurant.restaurant.name = res.restraunts.name;
            restaurant.restaurant.lat = res.restraunts.lat;
            restaurant.restaurant.lng = res.restraunts.lng;
          }
          return restaurant;
        })
        setRestraunt(updateRestaurants);
        handleClear();
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
    // todo:エラーの消し方これでいいんかな？
    // TODO:評価の戻し方これでいいのかなぁ
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
        console.log(data.restraunts)
        setRestraunt(data.restraunts)
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      }
      )

    fetchTags()      
    .then((data) => {
      console.log("tag")      
      console.log(data.tags)
      setTags(data.tags)
      // setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
    }
    )

    GetLatestReviews()
      .then((data) => {
        setGetLatestReviews(data.review)
        setGetLatestReviewsRestraunt(data.restraunt)
      })
      .catch((error) => {

      }
      )

  }, [])


  const [size, setSize] = useState(undefined);
  const infoWindowOptions = {
    pixelOffset: size,
  };
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };

  const [selectedItem, setSelectedItem] = useState('')

  const [checkUsersWithoutReviews, setCheckUsersWithoutReviews] = useState(false);
  const [getLatestReviews, setGetLatestReviews] = useState("");
  const [getLatestReviewsRestraunt, setGetLatestReviewsRestraunt] = useState("");

  const onOpenDialog = (id) => {
    setSelectedItem(id)
    setIsReviewLoading(true)
    setIsCheckUserReviewLoading(true)

    fetchShowReview(id)
      .then((data) => {
        setReview(data.review)
        setIsReviewLoading(false)
      }
      )

    CheckUsersWithoutReviews({
      restraunt_id: id,
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

  function afterOpenModal() {
    // subtitle.style.color = '#f00';
  }
  function afterReviewOpenModal() {

  }

  const onCloseDialog = () => {
    setSelectedItem(false)
    setEditModalIsOpen(false);
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
  }
  // 北は千代田区、東は江戸川区、南は港区、西は渋谷区
  const TOKYO_BOUNDS = {
    north: 35.701007,
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

  const [showMap, setShowMap] = useState(true);

  const toggleMapDisplay = () => {
    setShowMap(!showMap)
  }

  const [tags, setTags] = useState([]);  
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

  const filteredRestaurants = Object.values(restaurants).filter((restaurant) => {
    const nameFilter = restaurant.restaurant.name.includes(searchTerm)

    // TODO: 新規登録した際のエラー対処考える
    const tagIds = restaurant.tags_tagged_items.map(item => item.tag_id)
    const isTagSelected = Object.keys(selectedTags).length > 0 ? tagIds.some(tagId => selectedTags.includes(tagId)) : true; // 選択されたタグが含まれているかチェック
    // const tagFilter = Object.keys(selectedTags).length > 0 ? restaurant.tags_tagged_items.every(item => Object.values(selectedTags).every(tag => tag.id === item.tag_id)) : true
    return nameFilter && isTagSelected
  })



  return (
    <>
      {props.userRegistered && <h1 className="max-w-screen-2xl px-4 md:px-8 text-blue-600">ユーザ登録完了！</h1>}
      {isLoading && <Loading />}
      <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
        <div class="flex flex-col items-center justify-center">
          {/* <div className="cursor-pointer" button onClick={() => onOpenDialog(getLatestReviewsRestraunt.id)}> */}
            {/* <h1>お店：{getLatestReviewsRestraunt.name && getLatestReviewsRestraunt.name}</h1> */}
            {/* <h1>最新レビュー：{getLatestReviews.content ? getLatestReviews.content.slice(0, 8) + "..." : ""}</h1> */}
            {/* <label>投稿日時：{getLatestReviews.created_at}　</label> */}
          {/* </div> */}

          <div className="my-2">                           
            {Object.keys(tags).map(item => {
              return (
                <>
                  <button 
                  className={`bg-blue-400 text-white font-bold mx-2 px-2 rounded ${selectedTags.includes(tags[item].id) ? 'bg-red-700' : ''}`} 
                  key={tags[item].id} 
                  tag={tags[item]} 
                  onClick={() => handleTagClick(tags[item].id)}
                  >
                  {tags[item].name}
                  </button >  
                </>
              )}
              )
            }
          </div>
          <button onClick={() => handleClear()} class="px-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-500">クリア</button>

        </div>

        <div className="max-w-screen-2xl px-4 md:px-8 mx-auto cursor-pointer" button onClick={() => toggleMapDisplay()}>{showMap ? "マップ非表示" : "マップ表示"}</div>
        {showMap &&
          <div className="flex flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={positionIshiBill}
              zoom={17}
              options={{
                restriction: {
                  latLngBounds: TOKYO_BOUNDS,
                  strictBounds: true,
                },
              }}
              onClick={getLatLng}
            >
              {Object.keys(filteredRestaurants).map(item => {
                return (
                  <>
                    <Marker
                      className="cursor-pointer" button onClick={() => onOpenDialog(filteredRestaurants[item].restaurant.id)}
                      position={{
                        lat: filteredRestaurants[item].restaurant.lat,
                        lng: filteredRestaurants[item].restaurant.lng,
                      }} />

                    <InfoWindow position={{
                      lat: filteredRestaurants[item].restaurant.lat,
                      lng: filteredRestaurants[item].restaurant.lng,
                    }} options={infoWindowOptions}>
                      <div style={divStyle} className="cursor-pointer" button onClick={() => onOpenDialog(filteredRestaurants[item].restaurant.id)}>
                        <h1>{filteredRestaurants[item].restaurant.name}</h1>
                      </div>
                    </InfoWindow>
                  </>
                )
              })}

              <Marker icon={{ url: `${process.env.PUBLIC_URL}/ishii_marker.png` }}
                position={positionIshiBill} button onClick={() => alert('石井ビル')} />

            </GoogleMap>
          </div>
        }

        {!showMap &&
          <div class="flex flex-col items-center justify-center">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" class="w-5 h-5 pb-1 text-gray-500 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                className="shadow appearance-none border pl-10 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="店名検索"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>
          </div>
        }

        <div className="flex flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {Object.keys(filteredRestaurants).map(item => {
              return (
                <>
                  <div className="max-w-md mx-auto rounded-lg overflow-hidden shadow-lg cursor-pointer px-6 py-4" onClick={() => onOpenDialog(filteredRestaurants[item].restaurant.id)}>
                    <img className="w-full" src="https://source.unsplash.com/random/800x600" alt="画像"></img>
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{filteredRestaurants[item].restaurant.name}</div>
                      <p className="text-gray-700 text-base">{filteredRestaurants[item].restaurant.evaluation}</p>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                    </div>
                  </div>
                  <Modal
                    isOpen={filteredRestaurants[item].restaurant.id === selectedItem}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={onCloseDialog}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >

                    {!editModalIsOpen ?
                      <>
                        <ShowRestrauntModal
                          ReactStarsRating={ReactStarsRating}
                          evaluation={evaluation}
                          setEvaluation={setEvaluation}
                          onChange={onChange}
                          onEditDialog={onEditDialog}
                          handleDeleteSubmit={handleDeleteSubmit}
                          onCloseDialog={onCloseDialog}
                          OpenReviewModal={OpenReviewModal}
                          setReview={setReview}
                          restaurant={filteredRestaurants[item].restaurant}
                          item={item}
                          reviews={reviews}
                          checkUsersWithoutReviews={checkUsersWithoutReviews}
                          setCheckUsersWithoutReviews={setCheckUsersWithoutReviews}
                          isLoading={isLoading}
                          isReviewLoading={isReviewLoading}
                          isCheckUserReviewLoading={isCheckUserReviewLoading}
                          error={error}
                          setError={setError}
                        />

                      </>
                      :
                      <>
                        <form onSubmit={handleUpdateSubmit}>
                          <EditRestrauntModal
                            onCloseEditDialog={onCloseEditDialog}
                            onCloseDialog={onCloseDialog}
                            error={error}
                            restaurant={filteredRestaurants[item].restaurant}
                          />
                        </form>
                      </>
                    }
                  </Modal>

                  {/* レビューモーダル */}
                  {reviewModalIsOpen &&
                    <Modal isOpen={filteredRestaurants[item].restaurant.id === selectedItem}
                      onAfterOpen={afterReviewOpenModal}
                      onRequestClose={closeReviewModal}
                      style={customStyles}
                      contentLabel="Example Modal"
                    >
                      <form onSubmit={handleReviewSubmit}>
                        <CreateReviewModal
                          ReactStarsRating={ReactStarsRating}
                          closeReviewModal={closeReviewModal}
                          evaluation={evaluation}
                          onChange={onChange}
                          error={error}
                          restaurant={filteredRestaurants[item].restaurant}
                        />
                      </form>
                    </Modal>
                  }
                </>
              )
            })}
          </div>
        </div>
        <Modal isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <form onSubmit={handleSubmit}>
            <CreateRestrauntModal
              closeModal={closeModal}
              error={error}
              coordinateLat={coordinateLat}
              coordinateLng={coordinateLng}
            />
          </form>
        </Modal>

      </LoadScript >
    </>
  );
};

export default Main;
