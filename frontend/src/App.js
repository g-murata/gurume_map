// 使用していない変数があってもエラーにならないよう。
/* eslint-disable no-unused-vars */

import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { About } from './components/About';
import { Blog } from './components/Blog';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { Landing } from "./components/Landing";
import { Post } from './components/blogs/Post';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import { useState, useEffect } from "react";
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchShowUser } from './apis/users';

function App() {

  const [userInfo, setUserInfo] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchShowUser(auth.currentUser.email)
          .then((data) => {
            setUserInfo(data.user)
          })
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {/* <h1 className="text-5xl">しばしお待ちを！（2023/12/5）</h1>
      <h1 className="text-3xl">flyioのサーバは起動できた。タグ設定機能がうまくいってないのでそこだけ直す。</h1> */}

      <Router>
        <AuthProvider>
          <Header
            userInfo={userInfo}
            setUserRegistered={setUserRegistered}
          />

          <Routes>
            <Route exact path="/" element={<PrivateRoute><Main userRegistered={userRegistered} /></PrivateRoute>} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Post />} />
            <Route exact path="/signup" element={<SignUp setUserInfo={setUserInfo} setUserRegistered={setUserRegistered} />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/landing" element={<Landing />} />
          </Routes>

        </AuthProvider>
        {/* <div className="flex flex-col items-center justify-center text-9xl">工事中!</div> */}
      </Router>
    </>
  );
}

export default App;
