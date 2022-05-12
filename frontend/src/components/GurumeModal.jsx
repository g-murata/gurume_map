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
    <>
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
    </>
  )
}
