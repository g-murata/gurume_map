import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { About } from './components/About';
import { Blog } from './components/Blog';
import { HogeHoge } from './components/HogeHoge';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { Post } from './components/blogs/Post';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>

      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route exact path="/hogehoge" element={<HogeHoge />} />
          <Route exact path="/signup" element={
            <AuthProvider>
              <SignUp />
            </AuthProvider>
          } />
          <Route exact path="/login" element={
            <AuthProvider>
              <Login />
            </AuthProvider>
          } />

        </Routes>
      </Router>
      {/* <Main /> */}

    </>
  );
}

export default App;
