import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { About } from './components/About';
import { Blog } from './components/Blog';
import { HogeHoge } from './components/HogeHoge';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { Landing } from "./components/Landing";
import { Post } from './components/blogs/Post';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>

      <Router>
        <AuthProvider>
          <Header />

          <Routes>
            <Route exact path="/" element={<PrivateRoute><Main /></PrivateRoute>} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Post />} />
            <Route exact path="/hogehoge" element={<HogeHoge />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/landing" element={<Landing />} />
          </Routes>

        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
