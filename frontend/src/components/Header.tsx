import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi"
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthContext } from '../context/AuthContext';
import { UserProfileModal } from './modal/UserProfileModal';
import { User } from '../types/index';

interface HeaderProps {
  userInfo: User | false | null;
  setUserInfo: (user: User) => void;
  setUserRegistered: (registered: boolean) => void;
  openImageLightbox: (url: string) => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateName = () => {
    if (!props.userInfo) return;
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    signOut(auth);
    menuFunction();
    props.setUserRegistered(false)
  };

  const [openMenu, setOpenMenu] = useState(false);

  const menuFunction = () => {
    setOpenMenu(!openMenu);
  };

  const testFunction = (e: React.MouseEvent<HTMLDivElement>, setter: (val: boolean) => void) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  }

  const HeaderLink = () => {
    return (
      <>
        {(process.env.NODE_ENV === 'development') && <div className='p-4 text-xs font-bold text-yellow-800 bg-yellow-200 rounded-lg md:mr-4'>開発環境</div>}
        <li className='p-4 border-b border-gray-100 list-none md:p-2 md:border-none'>
          <Link to="/about" className="block text-base font-semibold text-gray-600 transition-colors hover:text-primary-500" onClick={menuFunction} >使い方</Link>
        </li>
        {/* <li className='p-4 border-b border-gray-100 list-none md:p-2 md:border-none'>
          <Link to="/blog" className="block text-base font-semibold text-gray-600 transition-colors hover:text-primary-500" onClick={menuFunction} >開発者ブログ</Link>
        </li> */}

        {user
          ? <>
            <li className='p-4 border-b border-gray-100 list-none md:p-2 md:border-none md:ml-4'>
              <button 
                onClick={handleUpdateName}
                title={props.userInfo && props.userInfo.email !== 'guest@guest.co.jp' ? "クリックしてプロフィールを変更" : ""}
                className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
              >
                {props.userInfo && (props.userInfo as User).image_url ? (
                  <img src={(props.userInfo as User).image_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm image-render-smooth" />
                ) : (
                  <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-sm text-white border-2 border-white shadow-sm">
                    {props.userInfo ? (props.userInfo as User).name.charAt(0) : "?"}
                  </div>
                )}
                <span>{props.userInfo ? props.userInfo.name : "名無しさん"}</span>
              </button>
            </li>
            <li className='p-4 list-none md:p-2 md:border-none'>
              <Link to="/landing" className="block text-base font-semibold text-gray-500 transition-colors hover:text-red-500" onClick={handleLogout} >ログアウト</Link>
            </li>
          </>
          :
          <>
            <li className='p-4 border-b border-gray-100 list-none md:p-2 md:border-none md:ml-4'>
              <Link to="/signup" className="block px-4 py-2 text-sm font-semibold text-white transition-all rounded-full bg-primary-500 hover:bg-primary-600 hover:shadow-md" onClick={menuFunction} >新規会員登録</Link>
            </li>
            <li className='p-4 list-none md:p-2 md:border-none'>
              <Link to="/login" className="block text-base font-semibold text-gray-600 transition-colors hover:text-primary-500" onClick={menuFunction} >ログイン</Link>
            </li>
          </>
        }
      </>
    )
  }

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center h-[10vh] md:h-[12vh] bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="w-full max-w-screen-2xl px-4 mx-auto md:px-8">
          <header className="flex items-center justify-between py-2 md:py-4">
            
            <Link to="/" className="flex items-center gap-2 w-1/3 text-2xl font-extrabold text-gray-800 md:text-3xl tracking-tight hover:opacity-80 transition-opacity">
              GurumeMap
              <img src={`${process.env.PUBLIC_URL}/fork_knife.png`} className="w-8 drop-shadow-sm" alt="Logo" />
            </Link>

            <nav className="hidden items-center justify-end w-2/3 md:flex gap-4">
              <HeaderLink />
            </nav>

            <div className={`md:hidden menuWrapper ${openMenu ? "menuWrapper__active" : ""}`} onClick={(e) => { testFunction(e, setOpenMenu) }}>
              {openMenu ? (
                <div className='absolute top-0 right-0 flex flex-row h-screen min-h-fit shadow-2xl'>
                  <div className='bg-white/95 backdrop-blur-xl w-64'>
                    <ul className='border-l border-gray-100 text-left pl-4 pt-4'>
                      <li className='p-2 mb-4'>
                        <button onClick={menuFunction} className="text-gray-400 hover:text-gray-600 text-lg font-bold p-2 transition-colors">
                          ✕ 閉じる
                        </button>
                      </li>
                      <HeaderLink />
                    </ul>
                  </div>
                </div>
              ) : undefined}
            </div>

            <button type="button" onClick={menuFunction} className="inline-flex items-center px-3 py-2 text-gray-500 transition-colors bg-gray-100 rounded-xl md:hidden hover:bg-gray-200 active:bg-gray-300">
              <label className="text-2xl cursor-pointer"><GiHamburgerMenu /></label>
            </button>
          </header>
        </div>
      </div>

      {props.userInfo && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userInfo={props.userInfo}
          setUserInfo={props.setUserInfo}
          openImageLightbox={props.openImageLightbox}
        />
      )}
    </>
  )
}
