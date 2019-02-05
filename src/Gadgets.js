import React from 'react'
import ShoppingList from './components/ShoppingList'
import CurrencyQuiz from './components/CurrencyQuiz'
import CrackMySafe from './components/CrackMySafe'

const Gadgets = () =>
  <div className="gadgets">
    <CrackMySafe />
    <br/>
    <CurrencyQuiz />
    <br/>
    <ShoppingList />
  </div>

export default Gadgets
