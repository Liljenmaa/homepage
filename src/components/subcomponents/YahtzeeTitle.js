import React from 'react';

const YahtzeeTitle = ({ first, second, third }) =>
  <div className="scoreboard-row">
    <div className="scoreboard-field scoreboard-title"><b>{first}</b></div>
    <div className="scoreboard-field scoreboard-score"><b>{second}</b></div>
    {
      // <div className="scoreboard-field scoreboard-score"><b>{third}</b></div>
    }
  </div>

export default YahtzeeTitle;