import React from 'react';

const YahtzeeRow = ({ title, lockedScore, score, scoreFunc, notAllowed }) =>
  <div className="scoreboard-row">
    <div className="scoreboard-field scoreboard-title">{ title }</div>
    { lockedScore !== null ? 
      <div className="scoreboard-field scoreboard-score"><b>{ lockedScore }</b></div> :
      <div className={"scoreboard-field scoreboard-score " + (notAllowed ? "" : "clickable")} onClick={() => scoreFunc(score)}>{ score }</div>
    }
    {
      //<div className="scoreboard-field scoreboard-score"></div>
    }
  </div>

export default YahtzeeRow;