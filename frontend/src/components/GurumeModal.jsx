import { useState } from 'react';
import Modal from 'react-modal';

import Data from './../data.json'; // 追加
import Restaurants from './../restaurants.json'; // 追加

const restaurants = Restaurants.data;
console.log(restaurants)
console.log(Object.keys(restaurants).length)
const titleText = Data.data.header.title;

// const descriptionText = Data.data.header.text;


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

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)

// Modal.setAppElement('#yourAppElement');

export const GurumeModal = () => {
  let subtitle;

  const [selectedItem, setSelectedItem] = useState('')

  const onOpenDialog = (name) => {
    console.log(name)
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
    <>
      {Object.keys(restaurants).map(item => {
        return (
          <>
            <button onClick={() => onOpenDialog(restaurants[item].id)}>{restaurants[item].name}</button>
            <div class="bg-black"></div>
            <Modal
              isOpen={restaurants[item].id === selectedItem}
              onAfterOpen={afterOpenModal}
              onRequestClose={onCloseDialog}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div class="flex place-content-between w-11/12  m-auto">
                <div class="text-3xl font-bold mb-2">{restaurants[item].name}</div>
                <button class="font-bold" onClick={onCloseDialog}>close</button>
              </div>
              <img
                class="w-11/12 m-auto"
                src="https://source.unsplash.com/random/1600x900/"
                alt="ほげほげ画像"
              ></img>
              <p class="text-gray-700 text-base w-11/12 m-auto">
                <p>評価{restaurants[item].evaluation}</p>
                <p>{restaurants[item].review}</p>
              </p>
            </Modal>
          </>
        )
      })}
    </>
  )
}

  // return (
  //   <>
  //     {Object.keys(restaurants).map(item => {
  //       return (
  //         <>
  //           <button onClick={() => onOpenDialog(item)}>{item}</button>
  //           <div class="bg-black"></div>
  //           <Modal
  //             isOpen={item === selectedItem}
  //             onAfterOpen={afterOpenModal}
  //             onRequestClose={onCloseDialog}
  //             style={customStyles}
  //             contentLabel="Example Modal"
  //           >
  //             <div class="flex place-content-between w-11/12  m-auto">
  //               <div class="text-3xl font-bold mb-2">{item}</div>
  //               <button class="font-bold" onClick={onCloseDialog}>close</button>
  //             </div>
  //             <img
  //               class="w-11/12 m-auto"
  //               src="https://source.unsplash.com/random/1600x900/"
  //               alt="ほげほげ画像"
  //             ></img>
  //             <p class="text-gray-700 text-base w-11/12 m-auto">
  //               <p>評価{titleText}</p>
  //               <p>{restaurants}</p>
  //             </p>
  //           </Modal>
  //         </>
  //       )
  //       )}}
  //   </>
  // )
