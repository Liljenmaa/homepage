import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import './index.css'
import Hello from './components/Hello'
import NavBar from './components/NavBar'
import Home from './Home'
import Gadgets from './Gadgets'
import Info from './Info'
import Footer from './components/Footer'

const App = () =>
  <Router>
    <div>
      <Hello />
      <NavBar />
      <br/>
      <Route path="/home" component={Home}/>
      <Route path="/info" component={Info}/>
      <Route path="/gadgets" component={Gadgets}/>
      <Route render={() => <Redirect to="/home"/>}/>
      <Footer />
    </div>
  </Router>

ReactDOM.render(<App />, document.getElementById('root'))
