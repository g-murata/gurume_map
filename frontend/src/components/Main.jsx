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

const positionKankoku = {
  lat: 35.66702060417376,
  lng: 139.75487166876127,
};

const positionZenSaburo = {
  lat: 35.6666040969312,
  lng: 139.75474687094697,
};

const positionEbiPota = {
  lat: 35.66646119314796, 
  lng: 139.75629483927176,
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

  let subtitle;
  
  const [selectedItem, setSelectedItem] = useState('')

  const restaurants = {
    id: [1,2,3,4,5],
    name: ['ヨプの王豚塩焼', '常陸秋そば　善三郎', 'SHRIMP NOODLE海老ポタ', 'Button4', 'Button5'],
    evaluation: ['3.5','3.5','4.0','',''],
    review: ['焼肉うまし','卵はINしない方が良い。','クリーミーでうまい','','']
  }

  const onOpenDialog = (name) => {
    setSelectedItem(name)
  }

  const onCloseDialog = () => {
    setSelectedItem(false)
  }  

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  return (
    <LoadScript googleMapsApiKey={url} onLoad={() => createOffsetSize()}>
      <div class="flex flex-col max-w-screen-2xl px-4 md:px-8 mx-auto md:items-left md:flex-row">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>

          <Marker position={positionIshiBill} />
          <Marker position={positionKankoku} />
          <Marker position={positionZenSaburo} />          
          <Marker position={positionEbiPota} />    

          <InfoWindow position={positionIshiBill} options={infoWindowOptions}>
            <div style={divStyle} class="cursor-pointer">
              <h1>シェルト</h1>
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
              <p>肉汁そば</p>
            </div>
          </InfoWindow>

          <InfoWindow position={positionEbiPota} options={infoWindowOptions}>
            <div style={divStyle} class="cursor-pointer" button onClick={openModal}>
              <h1>SHRIMP NOODLE海老ポタ</h1>
              <p>雰囲気がお洒落</p>
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

        <div class="w-2/5 ">
          <div class="md:mx-8">
          { restaurants.name.map((item) => {
          return(
            <>
              <button onClick={ () => onOpenDialog(item)}>{item}</button>
              <div class ="bg-black"></div>     
             <Modal
              isOpen={item === selectedItem}
              onAfterOpen={afterOpenModal}
              onRequestClose={onCloseDialog}
              style={customStyles}
              contentLabel="Example Modal"
            >
                <div class="flex place-content-between w-11/12  m-auto">
                  <div class="text-3xl font-bold mb-2">{item}</div>
                  <button class="font-bold" onClick={onCloseDialog}>close</button>
                </div>
                <img
                    class="w-11/12 m-auto"
                    src="https://source.unsplash.com/random/1600x900/"
                    alt="ほげほげ画像"
                  ></img>          
                <p class="text-gray-700 text-base w-11/12 m-auto">
                    <p>評価{}</p>
                    <p>{item}</p>
                </p>
            </Modal>
            </>
            )          
          })}
          </div>
        </div> 

      </div>   
    </LoadScript>
  );
};

export default Main;