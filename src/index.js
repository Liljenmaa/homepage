import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Hello from './components/Hello';
import NavBar from './components/NavBar';
import Home from './Home';
import Gadgets from './Gadgets';
import Info from './Info';
import Footer from './components/Footer';

const App = () =>
  <BrowserRouter>
    <div>
      <div id="content">
        <Hello />
        <NavBar />
        <br/>
        <Routes>
          <Route path="/" element={<Home /> } />
          <Route path="/home" element={<Home />} />
          <Route path="/info" element={<Info />} />
          <Route path="/gadgets" element={<Gadgets />} />
        </Routes>
      </div>
      <Footer />
    </div>
  </BrowserRouter>

ReactDOM.render(<App />, document.getElementById('root'));
