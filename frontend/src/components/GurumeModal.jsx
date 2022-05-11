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

  const [selectedItem, setSelectedItem] = useState('')
  const ButtonList = ['石井ビル', 'ヨプの王豚塩焼', '常陸秋そば　善三郎', 'Button4', 'Button5']


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
    <>
        { ButtonList.map((item) => {
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
                    <p>{item}</p>
                </p>
            </Modal>
            </>
            )          
          })}
    </>
  )

// { ButtonList.map((item) => {
//   return (
//     <>
//       <div key={item}>
//         <button onClick={ () => onOpenDialog(item)}>モーダルボタン</button>
//       </div>        
//     </>

//       // <button onClick={onOpenDialog}>モーダルボタン</button>
//       // <div class ="bg-black">
//       // <Modal
//       //   isOpen={modalIsOpen}
//       //   onAfterOpen={afterOpenModal}
//       //   onRequestClose={closeModal}
//       //   style={customStyles}
//       //   contentLabel="Example Modal"
//       // >
//       //     <div class="flex place-content-between w-11/12  m-auto">
//       //       <div class="text-3xl font-bold mb-2">ヨプの王豚塩焼</div>
//       //       <button class="font-bold" onClick={onCloseDialog}>close</button>
//       //     </div>
//       //     <img
//       //         class="w-11/12 m-auto"
//       //         src="https://source.unsplash.com/random/1600x900/"
//       //         alt="ほげほげ画像"
//       //       ></img>          
//       //     <p class="text-gray-700 text-base w-11/12 m-auto">
//       //         <p>ほげほげ本文</p>
//       //         <p>ほげほげ</p>
//       //         <p>ほげほげ</p>
//       //         <p>うましうまし</p>              
//       //     </p>
//       // </Modal>
//       // </div>          
//     // </div>
//   )
//  })}
}
