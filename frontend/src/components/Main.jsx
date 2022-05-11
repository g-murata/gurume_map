import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";


import Modal from 'react-modal';

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
  height: "60vh",
  // TODO:widthはスマホの時だけ100%にしたい。
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

const positionKankoku = {
  lat: 35.66702060417376,
  lng: 139.75487166876127,
};

const positionZenSaburo = {
  lat: 35.6666040969312,
  lng: 139.75474687094697,
};


const divStyle = {
  background: "white",
  fontSize: 7.5,
};

const url = process.env.REACT_APP_GOOGLE_MAP_API_KEY

export const Main = () => {

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }


  const [size, setSize] = useState(undefined);
  const infoWindowOptions = {
    pixelOffset: size,
  };
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };

  return (
    <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
      <div class="flex items-center flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
          <Marker position={positionIshiBill} />
          <Marker position={positionKankoku} />
          <Marker position={positionZenSaburo} />          
          <InfoWindow position={positionIshiBill} options={infoWindowOptions}>
            <div style={divStyle} class="cursor-pointer">
              <h1>石井ビル</h1>
            </div>
          </InfoWindow>

          <InfoWindow position={positionKankoku} options={infoWindowOptions}>
            <div style={divStyle} class="cursor-pointer" button onClick={openModal}>
              <h1>ヨプの王豚塩焼</h1>
              <p>韓国料理屋（夜しか行ったことない）</p>
            </div>
          </InfoWindow>

          <InfoWindow position={positionZenSaburo} options={infoWindowOptions}>
            <div style={divStyle} class="cursor-pointer" button onClick={openModal}>
              <h1>常陸秋そば　善三郎</h1>
              <p>蕎麦屋さん</p>
            </div>
          </InfoWindow>
          
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div class="flex place-content-between shadow-lg">
              <div class="text-3xl font-bold mb-2">ヨプの王豚塩焼</div>
              <button class="font-bold" onClick={closeModal}>close</button>
            </div>
            <img
                class="w-full"
                src="https://source.unsplash.com/random/1600x900/"
                alt="ほげほげ画像"
              ></img>          
            <p class="text-gray-700 text-base">
                <p>ほげほげ本文</p>
                <p>ほげほげ</p>
                <p>ほげほげ</p>
                <p>うましうまし</p>              
            </p>

          </Modal>     

        </GoogleMap>
      </div>     
    </LoadScript>
  );
};

export default Main;