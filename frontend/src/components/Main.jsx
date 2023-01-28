
import { auth } from '../firebase';
import { useState, useEffect } from "react";
import { fetchRestaurants, postRestraunt, updateRestraunt, deleteRestraunt } from '../apis/restraunts';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

import Modal from 'react-modal';
import ReactStarsRating from 'react-awesome-stars-rating';
import { HogeHoge } from './HogeHoge';


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
    const { name, review, lat, lng } = event.target.elements;
    postRestraunt({
      name: name.value,
      evaluation: evaluation,
      review: review.value,
      lat: lat.value,
      lng: lng.value,
      email: user.email
    })
      .then(() => {
        closeModal();
        const newRestaurants = [...restaurants,
        {
          name: name.value,
          evaluation: evaluation,
          review: review.value,
          lat: Number(lat.value),
          lng: Number(lng.value)
        }]
        setRestraunt(newRestaurants)
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

  const handleUpdateSubmit = (event) => {

    event.preventDefault();
    const { id, name, review, lat, lng } = event.target.elements;
    updateRestraunt({
      id: id.value,
      name: name.value,
      evaluation: evaluation,
      review: review.value,
    })
      .then(() => {
        setEditModalIsOpen(false);
        setError('')

        // UPDATEの参考
        // https://zenn.dev/sprout2000/books/76a279bb90c3f3/viewer/chapter10
        const updateRestaurants = restaurants.map( ( restaurant ) =>{
          if(Number(restaurant.id) === Number(id.value))
          {
            restaurant.name = name.value;
            restaurant.evaluation =  evaluation;
            restaurant.review = review.value;
            restaurant.lat = Number(lat.value);
            restaurant.lng = Number(lng.value);         
          }
          return restaurant;
      })
        setRestraunt(updateRestaurants);
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

  const handleDeleteSubmit = (event) => {

    // event.preventDefault();
    // const { id } = event.id;
    // alert(event.id)

    deleteRestraunt({
      id: event.id
    })
      .then(() => {
        onCloseDialog();
        // setEditModalIsOpen(false);
        // setError('')

      //   const updateRestaurants = restaurants.map( ( restaurant ) =>{
      //     if(Number(restaurant.id) === Number(id.value))
      //     {
      //       restaurant.name = name.value;
      //       restaurant.evaluation =  evaluation;
      //       restaurant.review = review.value;
      //       restaurant.lat = Number(lat.value);
      //       restaurant.lng = Number(lng.value);         
      //     }
      //     return restaurant;
      // })
        // TODO:
        const newRestaurants = [...restaurants]
        console.log(newRestaurants)
        console.log(event.id)
        newRestaurants.splice(event.id, 1)
        console.log(newRestaurants)
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

  const [coordinateLat, setCoordinateLat] = useState('');
  const [coordinateLng, setCoordinateLng] = useState('');

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
    setError('')
    setEvaluation(3)
    setIsOpen(false);
  }

  useEffect(() => {
    fetchRestaurants()
      .then((data) =>
        setRestraunt(data.restraunts)
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

  const onOpenDialog = (name) => {
    setSelectedItem(name)
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


  return (
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
        <div className="md:w-2/5">
          <div className="flex flex-col md:mx-8 overflow-auto max-height:h-56 md:h-4/5 ">
            {Object.keys(restaurants).map(item => {
              return (
                <>
                  <button className="p-2 border-b-2 list-none " onClick={() => onOpenDialog(restaurants[item].id)}>{restaurants[item].name}
                  </button>
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
                          <button className="font-bold" onClick={() => handleDeleteSubmit((restaurants[item]))}>削除</button>
                          <button className="font-bold" onClick={onCloseDialog}>Close</button>
                        </div>
                        <img
                          className="w-7/12 m-auto"
                          src={restaurants[item].image}
                          alt="ほげほげ画像"
                        ></img>

                        <p className="text-gray-700 text-base w-11/12 m-auto">
                          <span>評価：</span>
                          <span className="star5_rating" data-rate={restaurants[item].evaluation}></span>
                          <p className="review">{restaurants[item].review}</p>
                        </p>
                      </>
                      :
                      <>
                        <form onSubmit={handleUpdateSubmit}>
                          <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
                            <div className="text-3xl font-bold text-center">
                              編集
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className="text-right">
                              <button className="font-bold" onClick={onCloseDialog}>Close</button>
                            </div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
                              店名
                            </label>
                            {/* TODO: hiddenはいくないね～書き換えられちゃうからね。リリース前に必ず直す。 */}
                            <input type="hidden" id="id" name="id" value={restaurants[item].id}></input>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="店名" name="name"
                              defaultValue={restaurants[item].name} />
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2" for="evaluation">
                                評価
                              </label>
                              <ReactStarsRating id="evaluation" name="evaluation" placeholder="評価" className="evaluation" onChange={onChange} value={evaluation} />
                            </div>
                            <div>
                              <label for="review" className="block text-gray-700 text-sm font-bold mb-2">
                                感想
                              </label>
                              <textarea id="review" name="review" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="感想"
                                defaultValue={restaurants[item].review}></textarea>
                            </div>
                            <div>
                              {/* <label for="lat" className="block text-gray-700 text-sm font-bold mb-2">
                                経緯
                              </label> */}
                              <input type ="hidden" id="lat" name="lat" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={restaurants[item].lat}></input>
                            </div>
                            <div>
                              {/* <label for="lng" className="block text-gray-700 text-sm font-bold mb-2">
                                経度
                              </label> */}
                              <input type ="hidden" id="lng" name="lng" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={restaurants[item].lng}></input>
                            </div>
                            <div>
                              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">更新</button>
                            </div>
                          </div>
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
          <div className="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
            <div className="text-3xl font-bold text-center">
              新規店名登録
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="text-right">
              <button className="font-bold" onClick={closeModal}>Close</button>
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
              店名
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="店名" name="name" />
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" for="evaluation">
                評価
              </label>
              <ReactStarsRating id="evaluation" name="evaluation" placeholder="評価" className="evaluation" onChange={onChange} value={evaluation} />
            </div>
            <div>
              <label for="review" className="block text-gray-700 text-sm font-bold mb-2">
                感想
              </label>
              <textarea id="review" name="review" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="感想"></textarea>
            </div>
            <div>
              <label for="lat" className="block text-gray-700 text-sm font-bold mb-2">
                経緯
              </label>
              <input id="lat" name="lat" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={coordinateLat}></input>
            </div>
            <div>
              <label for="lng" className="block text-gray-700 text-sm font-bold mb-2">
                経度
              </label>
              <input id="lng" name="lng" rows="4" readonly="true" className="bg-slate-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={coordinateLng}></input>
            </div>
            <div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">登録</button>
            </div>
          </div>
        </form>
      </Modal>
    </LoadScript >
  );
};

export default Main;
