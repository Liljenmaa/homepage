import React from 'react'

const ClickableListNode = ({ content, handleClick, id }) =>
  <li>
    <button
      className="clickable-listnode"
      onClick={handleClick}
      id={id}>
      {content}
    </button>
  </li>

export default ClickableListNode
