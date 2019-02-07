import React from 'react';

const PhoneButtonInterface = ({ func }) =>
  <div className="phone">
    <button className="phone" onClick={func(1)}>1</button>
    <button className="phone" onClick={func(2)}>2</button>
    <button className="phone" onClick={func(3)}>3</button>
  <br/>
    <button className="phone" onClick={func(4)}>4</button>
    <button className="phone" onClick={func(5)}>5</button>
    <button className="phone" onClick={func(6)}>6</button>
  <br/>
    <button className="phone" onClick={func(7)}>7</button>
    <button className="phone" onClick={func(8)}>8</button>
    <button className="phone" onClick={func(9)}>9</button>
  <br/>
    <button className="phone" onClick={func(10)}>*</button>
    <button className="phone" onClick={func(0)}>0</button>
    <button className="phone" onClick={func(11)}>#</button>
  </div>

export default PhoneButtonInterface;
