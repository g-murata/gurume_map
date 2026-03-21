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

  return (
    <>
      <Router>
        <AuthProvider>
          <Header
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setUserRegistered={setUserRegistered}
          />

          <Routes>
            <Route path="/" element={<PrivateRoute><Main userRegistered={userRegistered} /></PrivateRoute>} />
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
