import React from 'react';
import ShoppingList from './components/ShoppingList';
import CurrencyQuiz from './components/CurrencyQuiz';
import CrackMySafe from './components/CrackMySafe';
import Animation from './components/Animation';

const Gadgets = () =>
  <div className="gadgets">
    <Animation />
    <br/>
    <CrackMySafe />
    <br/>
    <CurrencyQuiz />
    <br/>
    <ShoppingList />
  </div>

export default Gadgets;
