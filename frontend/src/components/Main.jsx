// 一時的にコメントアウトすることもあるので
/* eslint no-unused-vars: 0 */

import { auth } from '../firebase';
import { useState, useEffect } from "react";
import { fetchRestaurants, postRestraunt, updateRestraunt, deleteRestraunt } from '../apis/restraunts';
import { fetchReviews, fetchShowReview } from '../apis/reviews';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

import Modal from 'react-modal';
import ReactStarsRating from 'react-awesome-stars-rating';
import Loading from './Loading';
import CreateRestrauntModal from './CreateRestrauntModal';


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
    overflow: "hidden",
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


export const Main = () => {
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
        const newRestaurants = [...restaurants,
        {
          id: res.restraunts.id,
          name: res.restraunts.name,
          lat: res.restraunts.lat,
          lng: res.restraunts.lng
        }]
        setRestraunt(newRestaurants)
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("エラー")
        console.log(error.code);
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

  const handleUpdateSubmit = (event) => {

    event.preventDefault();
    const { id, name } = event.target.elements;
    setIsLoading(true);
    updateRestraunt({
      id: id.value,
      name: name.value,
    })
      .then((res) => {
        setEditModalIsOpen(false);
        setError('')

        // UPDATEの参考
        // https://zenn.dev/sprout2000/books/76a279bb90c3f3/viewer/chapter10
        const updateRestaurants = restaurants.map((restaurant) => {
          if (Number(restaurant.id) === Number(id.value)) {
            restaurant.name = res.restraunts.name;
            restaurant.lat = res.restraunts.lat;
            restaurant.lng = res.restraunts.lng;
          }
          return restaurant;
        })
        setRestraunt(updateRestaurants);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("エラー")
        console.log(error.code);
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

    deleteRestraunt({
      id: restaurants[index].id
    })
      .then(() => {
        onCloseDialog();
        const newRestaurants = [...restaurants]
        newRestaurants.splice(index, 1)
        setRestraunt(newRestaurants);
      })
      .catch((error) => {
        console.log("エラー")
        console.log(error.code);
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



  const [restaurants, setRestraunt] = useState([])
  const [reviews, setReview] = useState([])


  const [coordinateLat, setCoordinateLat] = useState('');
  const [coordinateLng, setCoordinateLng] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [editMode, setEditMode] = useState(true);

  const editOnOff = () => {
    setEditMode(!editMode)
  }

  const [modalIsOpen, setIsOpen] = useState(false);

  const OpenModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    // todo:エラーの消し方これでいいんかな？
    // TODO:評価の戻し方これでいいのかなぁ
    alert("aa")
    setError('')
    setEvaluation(3)
    setIsOpen(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchRestaurants()
      .then((data) => {
        console.log(data.restraunts)
        setRestraunt(data.restraunts)
        setIsLoading(false);
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

  const onOpenDialog = (id) => {
    setSelectedItem(id)
    
    setIsLoading(true);
    fetchShowReview(id)
    .then((data) => {
      console.log(data.review)
      setReview(data.review)
      setIsLoading(false);
    }
    )    
  }

  function afterOpenModal() {
    // subtitle.style.color = '#f00';
  }

  const onCloseDialog = () => {
    setSelectedItem(false)
    setEditModalIsOpen(false);
    setEvaluation(3)
  }

  const getLatLng = (event) => {
    setCoordinateLat(event.latLng.lat());
    setCoordinateLng(event.latLng.lng());

    if (editMode) { OpenModal() }
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


  return (
    <>
      <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
        <div className="flex flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17} onClick={getLatLng}>
            <Marker position={positionIshiBill} button onClick={() => alert('開発中！')} />
            {/* <Marker icon={'https://plus1world.com/wp-content/uploads/2011/12/twitter-wadai-photo-0003.png'} position={positionIshiBill} button onClick={() => alert('自社です')}/> */}

            {Object.keys(restaurants).map(item => {
              return (
                <>
                  <Marker position={{
                    lat: restaurants[item].lat,
                    lng: restaurants[item].lng,
                  }} />

                  <InfoWindow position={{
                    lat: restaurants[item].lat,
                    lng: restaurants[item].lng,
                  }} options={infoWindowOptions}>
                    <div style={divStyle} className="cursor-pointer" button onClick={() => onOpenDialog(restaurants[item].id)}>
                      <h1>{restaurants[item].name}</h1>
                    </div>
                  </InfoWindow>

                  <Modal
                    isOpen={restaurants[item].id === selectedItem}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={onCloseDialog}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                  </Modal>
                </>
              )
            })}
          </GoogleMap>
          <div className="h-48 md:w-2/5 md:h-128">
            <div className="max-h-full flex flex-col md:mx-8 overflow-auto md:h-3/5 ">
              {Object.keys(restaurants).map(item => {
                return (
                  <>
                    <button className="p-2 border-b-2 list-none " onClick={() => onOpenDialog(restaurants[item].id)}>{restaurants[item].name}
                    </button>
                    {/* 吹き出しが何個も出る件について。ここに置いたらなんかうまくいったけど、新規登録すると相変わらず出るし、原因を調べる。TODO: */}
                    {/* {isLoading && <Loading />} */}
                    <Modal
                      isOpen={restaurants[item].id === selectedItem}
                      onAfterOpen={afterOpenModal}
                      onRequestClose={onCloseDialog}
                      style={customStyles}
                      contentLabel="Example Modal"
                    >

                      {!editModalIsOpen ?
                        <>
                          <div className="flex place-content-between w-11/12  m-auto">
                            <div className="text-3xl font-bold mb-2">{restaurants[item].name}</div>
                            <button className="font-bold" onClick={() => onEditDialog((restaurants[item]))}>編集</button>
                            <button className="font-bold" onClick={() => handleDeleteSubmit((item))}>削除</button>
                            <button className="font-bold" onClick={onCloseDialog}>Close</button>
                          </div>

                          <p className="text-gray-700 text-base w-11/12 m-auto">
                            {/* TODO:平均評価を計算する */}
                            {/* <span>平均評価：</span>
                            <span className="star5_rating" data-rate={restaurants[item].evaluation}></span> */}
                            {restaurants[item].image == null ?
                              <div className="flex justify-center ">
                                <img src={`${process.env.PUBLIC_URL}/no_image_square.png`} className="w-2/4" alt="Logo" />
                              </div>
                              :
                              <img
                                className="w-7/12 m-auto"
                                src={restaurants[item].image}
                                alt="ほげほげ画像"
                              ></img>
                            }
                            <span>このお店を登録した人：</span>
                            <p className="user_name">{restaurants[item].user_name}</p>
                            <div className='flex justify-center'>
                              <button className="bg-yellow-500 hover:bg-yellow-300 text-white font-bold py-2 px-4 my-6 rounded-full">レビューを投稿する</button>      
                            </div>     
                            <>                 
                            {isLoading ? <h1 className="text-blue-600">レビューを読み込み中........</h1> : 
                            <>                            
                              {reviews.length> 0 ?
                                <div className='overflow-auto h-56'>
                                  {Object.keys(reviews).map(item => {
                                    return(
                                      <>
                                        {console.log("TODO:再レンダリングしすぎ")}
                                        {console.log(item)}
                                        <div class="bg-slate-100 rounded-xl p-8 dark:bg-slate-800 mb-5">
                                          <span>レビューした人：</span>
                                          <p className="user_name">{reviews[item].user_name}</p>
                                          <span>評価：</span>
                                          <span className="star5_rating" data-rate={reviews[item].evaluation}></span>
                                          <p>感想：</p>
                                          <p className="review">{reviews[item].content}</p>
                                          <div>                                          
                                            <button className="font-bold " onClick={() => onEditDialog((restaurants[item]))}>編集(未完成)</button>
                                            <button className="font-bold mx-8" onClick={() => handleDeleteSubmit((item))}>削除(未完成)</button>
                                          </div>
                                        </div>
                                      </>
                                    )        
                                  })}
                                </div>                            
                                :
                                  <div style={{ color: 'red' }}>まだこのお店のレビューをした人はいないみたいです。</div>
                              }
                            </>
                            }
                          </>
                          </p>
                        </>
                        :
                        <>
                          <form onSubmit={handleUpdateSubmit}>

                          </form>
                        </>
                      }
                    </Modal>
                  </>
                )
              })}
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
          <button className="font-bold" onClick={editOnOff} style={{ color: 'red' }}>{(editMode === true) ? "編集モード：ON" : "編集モード：OFF"}</button>
        </div>
        {/* <button onClick={OpenModal}>Open Modal</button> */}
        <Modal isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {/* todo: */}
          <form onSubmit={handleSubmit}>
            <CreateRestrauntModal 
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
