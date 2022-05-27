import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { About } from './components/About';
import { Blog } from './components/Blog';      
import { HogeHoge } from './components/HogeHoge';
import {Post} from './components/blogs/Post'; 

function App() {
  return (
    <>
    
      <Router>
        <Header />    
        <Routes>
          <Route exact path ="/" element={<Main />} />          
          <Route exact path ="/about" element={<About />} />
          <Route exact path ="/blog" element={<Blog />} /> 
          <Route path ="/blog/:id" element={<Post />} />           
          <Route exact path ="/hogehoge" element={<HogeHoge />} />                   
        </Routes>
      </Router>
      {/* <Main /> */}

    </>
  );
}

export default App;
