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
  // TODO:widthはスマホの時だけ100%にしたい。
  // 隣の要素を40で固定することで実現できたぞ。（荒業？）
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

  const [restaurants, setRestraunt] = useState([])

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
    console.log(event)
    console.log(event.latLng.lat())
    console.log(event.latLng.lng())

    //marker作成
    var marker = new google.maps.Marker();

    //markerの位置を設定
    //event.latLng.lat()でクリックしたところの緯度を取得
    marker.setPosition(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));
    //marker設置
    // < Marker position={{
    //   lat: event.latLng.lat(),
    //   lng: event.latLng.lng(),
    // }}/>
    // marker.setMap(map);    


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
          <div class="flex flex-col md:mx-8 overflow-auto h-56 md:h-4/5 ">
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
        {/* TODO: HerokuのDBにレコード入れたら消す。 */}
        <h1 class="text-3xl ">試験も終わったので開発再開！<br></br>課題：React思い出す、Herokuの移行先を考える（2022.11.27）</h1>        
      </div>

    </LoadScript >
  );
};

export default Main;
