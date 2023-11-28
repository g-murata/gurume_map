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
import { fetchShowUser } from './apis/users';

function App() {

  const [userInfo, setUserInfo] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);

  useEffect(() => {
    // TODO: ここらの理解がよくできてないので、要宿題
    // Firebase Authenticationのログイン状態が変化した場合に呼び出されるコールバック関数
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("ログイン状態確認")
      if (user) {
        fetchShowUser(auth.currentUser.email)
          .then((data) => {
            console.log("ユーザ取得")
            setUserInfo(data.user)
          })
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <h1 className="text-5xl">工事中！！（2023/11/23）</h1>
      <h1 className="text-3xl">デプロイ先（fly.io）のサーバが起動しなくなってしまったため。</h1>

      {/* <Router>
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
      </Router> */}
    </>
  );
}

export default App;
