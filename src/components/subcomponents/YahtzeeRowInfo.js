import React from 'react';

const YahtzeeRowInfo = ({ title, score}) =>
  <div className="scoreboard-row">
    <div className="scoreboard-field scoreboard-title"><i>{ title }</i></div>
    <div className="scoreboard-field scoreboard-score"><i>{ score }</i></div>
    {
      //<div className="scoreboard-field scoreboard-score"></div>
    }
  </div>

export default YahtzeeRowInfo;