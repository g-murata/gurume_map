import { useState } from 'react';
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

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)

// Modal.setAppElement('#yourAppElement');

export const GurumeModal = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>モーダルボタン</button>
      <div class ="bg-black">
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
          <div class="flex place-content-between w-11/12  m-auto">
            <div class="text-3xl font-bold mb-2">ヨプの王豚塩焼</div>
            <button class="font-bold" onClick={closeModal}>close</button>
          </div>
          <img
              class="w-11/12 m-auto"
              src="https://source.unsplash.com/random/1600x900/"
              alt="ほげほげ画像"
            ></img>          
          <p class="text-gray-700 text-base w-11/12 m-auto">
              <p>ほげほげ本文</p>
              <p>ほげほげ</p>
              <p>ほげほげ</p>
              <p>うましうまし</p>              
          </p>
      </Modal>
      </div>          
    </div>
  );
}
