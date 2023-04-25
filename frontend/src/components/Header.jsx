import { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi"

import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthContext } from '../context/AuthContext';

export const Header = (props) => {
  const { user } = useAuthContext();

  const handleLogout = () => {
    signOut(auth);
  };

  const [openMenu, setOpenMenu] = useState(false);

  const menuFunction = () => {
    setOpenMenu(!openMenu);
  };

  const testFunction = (e, setter) => {

    if (e.target === e.currentTarget) {
      //メニューの外側をクリックしたときだけメニューを閉じる
      console.log("メニューの外側をクリックした");
      setter(false);
    } else {
      console.log("メニューの内側をクリックした");
    }
  }

  const HeaderLink = () => {
    return (
      <>
        <li className='p-8 md:p-4 border-b-2 list-none md:border-none'>
          <Link to="/about" className="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block" onClick={menuFunction} >GurumeMapとは</Link>
        </li>
        <li className='p-8 md:p-4 border-b-2 list-none md:border-none'>
          <Link to="/blog" className="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block" onClick={menuFunction} >開発者ブログ</Link>
          <div className="text-red-400 text-xs md:text-right"></div>
        </li>

        {user
          ? <>
            <li className='p-8 md:p-4 border-b-2 list-none md:border-none'>
              <span className="text-gray-500 active:text-yellow-700 text-lg font-semibold block">ログインユーザ：{props.userInfo ? props.userInfo.name : "名無しさん"}</span>
            </li>
            <li className='p-8 md:p-4 border-b-2 list-none md:border-none'>
              <Link to="/" className="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block" onClick={handleLogout} >ログアウト</Link>
            </li>
          </>
          :
          <>
            <>
              <li className='p-8 md:p-4 border-b-2 list-none md:border-none'>
                <Link to="/signup" className="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block" onClick={menuFunction} >新規会員登録</Link>
              </li>
            </>
            <li className='p-8 md:p-4 border-b-2 list-none md:border-none'>
              <Link to="/login" className="text-gray-600 hover:text-red-500 active:text-yellow-700 text-lg font-semibold block" onClick={menuFunction} >ログイン</Link>
            </li>
          </>
        }

      </>


    )
  }


  return (
    <>
      <div className="h-10vh bg-white md:h-20vh">
        <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
          <header className="flex justify-between items-center py-4 md:py-8">
            <Link to="/" className="inline-flex items-center text-black-800 text-2xl md:text-3xl font-bold gap-2.5">
              GurumeMap
              <img src={`${process.env.PUBLIC_URL}/fork_knife.png`} className="w-9" alt="Logo" />
            </Link>

            <nav className="hidden md:flex gap-12">
              <HeaderLink />
            </nav>
            <div className={`md:hidden menuWrapper ${openMenu ? "menuWrapper__active" : ""}`} onClick={(e) => { testFunction(e, setOpenMenu) }}>
              {openMenu ? (
                <div className='flex flex-row absolute top-0 right-0 h-screen min-h-fit'>
                  <div className='bg-white'>
                    <ul className=' text-center border-l-2 '>
                      <li className='p-2 border-b-2'>
                        <button onClick={menuFunction} className="text-blue-400 hover:text-blue-600 active:text-blue-700 text-lg font-bold p-2">
                          close
                        </button>
                      </li>
                      <HeaderLink />
                    </ul>
                  </div>
                </div>
              ) : undefined}
            </div>

            <button type="button" onClick={menuFunction} className="inline-flex items-center md:hidden bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2">
              <label className="text-2xl text-gray-600 "><GiHamburgerMenu /></label>
            </button>
          </header>

        </div>
      </div>
    </>
  )
}
