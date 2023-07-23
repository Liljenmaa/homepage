import React from 'react';
import DoomsDay from './components/DoomsDay';
import Yahtzee from './components/Yahtzee';

const Home = () =>
  <div className="home">
    <DoomsDay />
    <br/>
    <Yahtzee />
    <br/>
  </div>

export default Home;
