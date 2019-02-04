import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Hello from './components/Hello'
import DoomsDay from './components/DoomsDay'
import NavBar from './components/NavBar'
import LoginScreen from './components/LoginScreen'
import ShoppingList from './components/ShoppingList'
import CurrencyQuiz from './components/CurrencyQuiz'
import CrackMySafe from './components/CrackMySafe'
import Info from './components/Info'
import Knowledge from './components/Knowledge'
import GuidelinesWeb from './components/GuidelinesWeb'
import Footer from './components/Footer'

const App = () =>
  <div>
    <Hello />
    <NavBar />
    <br/>
    <DoomsDay />
    <br/>
    <LoginScreen />
    <br/>
    <CurrencyQuiz />
    <br/>
    <ShoppingList />
    <br/>
    <CrackMySafe />
    <br/>
    <Info />
    <br/>
    <Knowledge />
    <br/>
    <GuidelinesWeb />
    <br/>
    <Footer />
  </div>

ReactDOM.render(<App />, document.getElementById('root'))
