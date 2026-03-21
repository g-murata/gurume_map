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

import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchShowUser } from './apis/users';

function App() {

  const [userInfo, setUserInfo] = useState<any>(false);
  const [userRegistered, setUserRegistered] = useState<boolean>(false);

  useEffect(() => {
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

  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const openImageLightbox = (imageUrl: string) => {
    setEnlargedImage(imageUrl);
  };
  const closeImageLightbox = () => {
    setEnlargedImage(null);
  };

  const lightboxStyles: any = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
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
      maxWidth: "90vw",
      maxHeight: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  };

  return (
    <>
      <Router>
        <AuthProvider>
          <Header
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setUserRegistered={setUserRegistered}
            openImageLightbox={openImageLightbox}
          />

          <Modal 
            isOpen={!!enlargedImage} 
            onRequestClose={closeImageLightbox} 
            style={lightboxStyles} 
            contentLabel="Image Lightbox"
          >
            <div className="relative group">
              {enlargedImage && (
                <img 
                  src={enlargedImage} 
                  alt="Enlarged" 
                  className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
                  onClick={closeImageLightbox}
                />
              )}
              <button 
                onClick={closeImageLightbox}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
          </Modal>

          <Routes>
            <Route path="/" element={<PrivateRoute><Main userRegistered={userRegistered} userInfo={userInfo} openImageLightboxInApp={openImageLightbox} /></PrivateRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Post />} />
            <Route path="/signup" element={<SignUp setUserInfo={setUserInfo} setUserRegistered={setUserRegistered} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/landing" element={<Landing />} />
          </Routes>

        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
