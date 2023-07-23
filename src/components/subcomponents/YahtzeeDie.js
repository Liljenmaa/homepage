import React from 'react';

const YahtzeeDie = ({number, disappearing, lockFunc}) => 
  <img
    src={"die" + number + ".svg"}
    className={"die" + (disappearing ? " disappearing-die" : "")}
    alt={"Die showing " + number}
    onClick={lockFunc}
    height ="75"
  />

export default YahtzeeDie;