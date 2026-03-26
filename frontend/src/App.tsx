import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { About } from './components/About';
import { Blog } from './components/Blog';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { ForgotPassword } from './components/ForgotPassword';
import { Landing } from "./components/Landing";
import { Post } from './components/blogs/Post';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './components/AdminPage';

import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchShowUser } from './apis/users';
import { LoadScript } from "@react-google-maps/api";

Modal.setAppElement('#root');

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY as string;

function App() {

  const [userInfo, setUserInfo] = useState<any>(false);
  const [userRegistered, setUserRegistered] = useState<boolean>(false);

  useEffect(() => {
    // Development環境のみ: localStorageにモックユーザーがいればそれを使ってuserInfoを取得する
    const mockEmail = localStorage.getItem('MOCK_AUTH_USER');
    if (mockEmail && process.env.NODE_ENV === 'development') {
      fetchShowUser(mockEmail, 'Test User')
        .then((data: any) => {
          setUserInfo(data.user)
        })
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        fetchShowUser(user.email, user.displayName)
          .then((data: any) => {
            setUserInfo(data.user)
          })
      }
    });

    return unsubscribe;
  }, []);

  const [enlargedImageData, setEnlargedImage] = useState<{ url: string, isProfile: boolean } | null>(null);
  const openImageLightbox = (imageUrl: string, isProfile: boolean = false) => {
    setEnlargedImage({ url: imageUrl, isProfile });
  };
  const closeImageLightbox = () => {
    setEnlargedImage(null);
  };

  const lightboxStyles: any = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(8px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    content: {
      position: "static",
      inset: "auto",
      background: "none",
      border: "none",
      padding: 0,
      maxWidth: "95vw",
      maxHeight: "95vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <Router>
        <AuthProvider>
          {/* 全体をFlex columnにして、ヘッダーとコンテンツを分離 */}
          <div className="flex flex-col h-screen h-[100dvh] overflow-hidden">
            
            <Header
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              setUserRegistered={setUserRegistered}
              openImageLightbox={openImageLightbox}
            />

            <main className="flex-1 min-h-0 relative overflow-y-auto">
              <Routes>
                <Route path="/" element={<PrivateRoute><Main userRegistered={userRegistered} userInfo={userInfo} openImageLightboxInApp={openImageLightbox} /></PrivateRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<Post />} />
                <Route path="/signup" element={<SignUp setUserInfo={setUserInfo} setUserRegistered={setUserRegistered} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>

          </div>

          <Modal 
            isOpen={!!enlargedImageData} 
            onRequestClose={closeImageLightbox} 
            style={lightboxStyles} 
            contentLabel="Image Lightbox"
          >
            <div className="relative flex items-center justify-center w-full h-full">
              {enlargedImageData && (
                <div className="relative animate-in zoom-in duration-300">
                  <img 
                    src={enlargedImageData.url} 
                    alt="Enlarged" 
                    className={`${
                      enlargedImageData.isProfile 
                        ? "w-64 h-64 md:w-[400px] md:h-[400px] rounded-full border-[6px] border-white shadow-2xl object-cover" 
                        : "max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                    } image-render-smooth`}
                    onClick={closeImageLightbox}
                  />
                  <button 
                    onClick={closeImageLightbox}
                    className="absolute -top-12 right-0 md:-right-12 md:top-0 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
              )}
            </div>
          </Modal>

        </AuthProvider>
      </Router>
    </LoadScript>
  );
}

export default App;
