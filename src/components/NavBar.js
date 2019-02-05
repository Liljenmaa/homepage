import React from 'react'
import { Link } from 'react-router-dom'


const NavBar = () =>
  <div className="nav-bar">
    <Link className="nav-bar" to="home">
      <button className="nav-bar">
        Home
      </button>
    </Link>
    <Link className="nav-bar" to="info">
      <button className="nav-bar">
        Info
      </button>
    </Link>
    <Link className="nav-bar" to="gadgets">
      <button className="nav-bar">
        Gadgets
      </button>
    </Link>
  </div>

export default NavBar
