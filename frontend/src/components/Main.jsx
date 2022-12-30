/*global google*/

import { useState, useEffect } from "react";
import { fetchRestaurants } from '../apis/restraunts';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";


import Modal from 'react-modal';

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

const handleSubmit = (event) => {
  event.preventDefault();
  const { name, evaluation, password, lat, lng } = event.target.elements;
  console.log("★")
  console.log(name.value)
  console.log(evaluation.value)
  console.log("■")
  alert(name)
}

export const Main = () => {

  const [restaurants, setRestraunt] = useState([])

  const [coordinate, setCoordinate] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

  const OpenModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
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
  }

  const getLatLng = (event) => {

    // 座標の取得
    // console.log(event.latLng.lat())
    // console.log(event.latLng.lng())
    // console.log(`${event.latLng.lat()},${event.latLng.lng()}`)

    //marker作成
    // var marker = new google.maps.Marker();

    //markerの位置を設定
    //event.latLng.lat()でクリックしたところの緯度を取得
    // marker.setPosition(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));
    //marker設置
    // < Marker position={{
    //   lat: event.latLng.lat(),
    //   lng: event.latLng.lng(),
    // }}/>
    // marker.setMap(map);    


    // TODO: マーカーが置けないので代替え手段
    setCoordinate(`座標：\n${event.latLng.lat()}\n${event.latLng.lng()}`);
    console.log(`座標：\n${event.latLng.lat()}\n${event.latLng.lng()}`)
    OpenModal()
  };

  return (
    <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
      <div class="flex flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17} onClick={getLatLng}>

          <Marker position={positionIshiBill} button onClick={() => alert('自社です。')} />
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
                  <div style={divStyle} class="cursor-pointer" button onClick={() => onOpenDialog(restaurants[item].id)}>
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
        <div class="md:w-2/5">
          <div class="flex flex-col md:mx-8 overflow-auto max-height:h-56 md:h-4/5 ">
            {Object.keys(restaurants).map(item => {
              return (
                <>
                  <button class="p-2 border-b-2 list-none " onClick={() => onOpenDialog(restaurants[item].id)}>{restaurants[item].name}
                  </button>
                  <Modal
                    isOpen={restaurants[item].id === selectedItem}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={onCloseDialog}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <div class="flex place-content-between w-11/12  m-auto">
                      <div class="text-3xl font-bold mb-2">{restaurants[item].name}</div>
                      <button class="font-bold" onClick={onCloseDialog}>Close</button>
                    </div>
                    <img
                      class="w-7/12 m-auto"
                      src={restaurants[item].image}
                      alt="ほげほげ画像"
                    ></img>
                    <p class="text-gray-700 text-base w-11/12 m-auto">
                      <span>評価：</span>
                      <span className="star5_rating" data-rate={restaurants[item].evaluation}></span>
                      <p className="review">{restaurants[item].review}</p>
                    </p>
                  </Modal>
                </>
              )
            })}
          </div>
        </div>
      </div>
      <div class="max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
        {/* <p class="zahyou" style={{ color: 'red' }}>{coordinate}</p> */}
      </div>

      {/* <button onClick={OpenModal}>Open Modal</button> */}
      <Modal isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form onSubmit={handleSubmit}>
          <div class="max-w-lg px-8 mx-auto md:px-8 md:flex-row">
            <div class="text-3xl font-bold text-center">
              新規店名登録
            </div>
            <div class="text-right">
              <button class="font-bold" onClick={closeModal}>Close</button>
            </div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              店名
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="店名" name="name" />
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="evaluation">
                評価
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="evaluation" name="evaluation" placeholder="評価" />
            </div>
            <div>
              <label for="review" class="block text-gray-700 text-sm font-bold mb-2">感想</label>
              <textarea id="review" name="review" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="感想"></textarea>
            </div>
            <div>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-full">登録</button>
            </div>
            <p class="zahyou" style={{ color: 'red' }}>{coordinate}</p>
          </div>
        </form>
      </Modal>
    </LoadScript >
  );
};

export default Main;
