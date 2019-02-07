import React from 'react';

const GuidelinesWeb = () =>
  <div className="main-div">
    <h2>Some cool tips for Web Developing if you are just starting:</h2>
    <ul className="top">
      <li>Don't use var, its scope can be confusing.</li>
      <ul><li>Use let and const instead.</li></ul>
      <li>Don't use for-in loop like in Python, you probably don't know what
      you are dealing with.</li>
      <ul><li>Use for-of loop instead.</li></ul>
      <li>Objects in Javascript are like dictionaries in Python: they contain
      a "dictionary" of name-value relations in form name: value. They can be
      really powerful!</li>
      <li>Refactoring your code with destructuring assignments can ease the
      pain of passing objects as arguments and creation of new objects using
      previous objects as "mapping" targets.</li>
      <li>Don't use an array's indexes as keys if you are mapping a new
      array.</li>
      <ul><li>It does a thing akin to removing an element from a
      Python array in a for loop: everything might break.</li></ul>
      <li>Make sure your code doesn't change the state of the component
      directly.</li>
      <ul><li>That means you should use setState().</li>
      <li>Why? The component doesn't know that it should render (again),
      so it won't.</li></ul>
      <li>What is an "event"? Whenever a component assigns an event (such as
      a button could assign a "onClick" function) the callback function will
      receive as the first parameter an <a
        href="https://reactjs.org/docs/events.html">event.</a></li>
      <ul><li>The event will contain important info, like the DOM element
      "target" that contains the event's DOM component. With that you can
      access the component's different values.</li></ul>
    </ul>
  </div>

  export default GuidelinesWeb;
