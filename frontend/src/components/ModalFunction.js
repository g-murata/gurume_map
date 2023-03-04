import { createContext, useState } from "react";

export const ModalContext = createContext({});

const ModalFunction = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  // const OpenModal = () => {
  //   ModalFunction.setIsOpen(true)
  // }

  const closeModal = () => {
    // todo:エラーの消し方これでいいんかな？
    // TODO:評価の戻し方これでいいのかなぁ
    // setError('')
    // setEvaluation(3)
    setIsOpen(false);
  }
}
export default ModalFunction;




export const UserContext = createContext({});

export const UserProvider = (props) => {
  const [userInfo, setUserInfo] = useState({userName: "shinya"});
  return(
    <UserContext.Provider value={{userInfo, setUserInfo}}>
      {props.children}
    </UserContext.Provider>
  )
}