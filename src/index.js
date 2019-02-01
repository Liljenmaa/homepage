import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import './index.css'
import DoomsDay from './components/DoomsDay'

const randomInt = (start, end) =>
  Math.floor((end-start+1) * Math.random() + start)

const ClickableListNode = ({ content, handleClick, id }) =>
  <li>
    <button
      className="clickable-listnode"
      onClick={handleClick}
      id={id}>
      {content}
    </button>
  </li>

const CodeDisplay = ({ content }) =>
  <code>
    {content}
  </code>

const Button = ({handleClick, text}) =>
  <button
    onClick={handleClick}>
    {text}
  </button>

const BasicForm = ({handleSubmit, inputValue, handleChange, buttonDesc }) =>
  <form
    onSubmit={handleSubmit}>
    <input
      value={inputValue}
      onChange={handleChange}
    />
    <button
      type="submit">
      {buttonDesc}
    </button>
  </form>

const PhoneButtonInterface = ({ func }) =>
  <div>
    <button className="phone" onClick={func(1)}>1</button>
    <button className="phone" onClick={func(2)}>2</button>
    <button className="phone" onClick={func(3)}>3</button>
  <br/>
    <button className="phone" onClick={func(4)}>4</button>
    <button className="phone" onClick={func(5)}>5</button>
    <button className="phone" onClick={func(6)}>6</button>
  <br/>
    <button className="phone" onClick={func(7)}>7</button>
    <button className="phone" onClick={func(8)}>8</button>
    <button className="phone" onClick={func(9)}>9</button>
  <br/>
    <button className="phone" onClick={func(10)}>*</button>
    <button className="phone" onClick={func(0)}>0</button>
    <button className="phone" onClick={func(11)}>#</button>
  </div>

const Hello = () =>
  <header>
    <h1>Hello visitor!<span role="img" aria-label="emoji">🖐️</span></h1>
    <p>This page contains a random assortment of things. Feel free to try them
    out!<span role="img" aria-label="emoji">👌</span></p>
  </header>

class CurrencyQuiz extends React.Component {
  constructor() {
    super()

    this.state = {
      listOfCountries: [],
      currentCountry: {},
      display: "What is the currency of ",
      currGuess: ""
    }
  }

  componentDidMount() {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        this.setState({ listOfCountries: response.data })
        this.selectRandomCountry()
      })
  }

  selectRandomCountry = () => {
    const random = randomInt(0, this.state.listOfCountries.length-1)
    const selectedCountry = this.state.listOfCountries[random]

    this.setState({
      currentCountry: selectedCountry,
      display: "What is the currency of " + selectedCountry.name + "?",
    })
  }

  checkAnswer = (event) => {
    event.preventDefault()

    const allWrong = () =>
      this.state.currentCountry.currencies.every((currency) => {
        const splitCurrency = currency.name.split(" ")
        const actualCurrency = splitCurrency[splitCurrency.length-1]

        return actualCurrency.toLowerCase() !==
          this.state.currGuess.toLowerCase()
      })

    allWrong() ?
      this.setState({
        display: "I'm afraid that's wrong.",
        currGuess: ""
      }) :
      this.setState({
        display: "That's correct!",
        currGuess: ""
      })

    setTimeout(this.selectRandomCountry, 1500)
  }

  handleGuessChange = (event) =>
    this.setState({ currGuess: event.target.value })

  render() {
    return(
      <div>
        <h2> Currency Quiz! </h2>
        <p>Country information taken from <a
          href="https://restcountries.eu">REST Countries</a>.
        </p>
        <CodeDisplay
          content={this.state.display}
        />
        <br/><br/>
        <BasicForm
          handleSubmit={this.checkAnswer}
          inputValue={this.state.currGuess}
          handleChange={this.handleGuessChange}
          buttonDesc="Guess"
        />
      </div>
    )
  }
}

class ShoppingList extends React.Component {
  constructor() {
    super()

    this.state = {
      shoppingList: [],
      idCounter: 0,
      newItem: "",
      visible: true
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:3001/shoppingList')
      .then(response => {
        this.setState({
          shoppingList: response.data
        })

        this.state.idCounter = this.state.shoppingList.length-1
      })
  }

  addOne = (event) => {
    event.preventDefault()

    if (this.state.newItem === "")
      return

    const notDupe = (obj) => obj.content !== this.state.newItem

    if (!(this.state.shoppingList.every(notDupe))) {
      this.setState({ newItem: "" })
      return
    }

    const newItem = {
      id: this.state.idCounter+1,
      content: this.state.newItem
    }

    const shoppingList = this.state.shoppingList.concat(newItem)

    this.setState((prevState) => ({
      idCounter: prevState.idCounter + 1,
      shoppingList,
      newItem: ""
    }))
  }

  removeOne = (event) => {
    const shoppingList = this.state.shoppingList.filter(
      obj => obj.id != event.target.id
    )

    this.setState({ shoppingList })
  }

  handleItemChange = (event) =>
    this.setState({ newItem: event.target.value })

  showItems = () => {
    this.setState((prevState) => ({
      visible: !prevState.visible
    }))
  }


  render() {

    const itemsToShow =
      this.state.visible ?
        this.state.shoppingList.map(object =>
          <ClickableListNode
            key={object.id}
            id={object.id}
            content={object.content}
            handleClick={this.removeOne}
          />
        ) : []

    return(
      <div>
        <h2>
          My current shopping list
        </h2>
        <p>
          Remove entries by clicking on them. Will not accept duplications.
        </p>
        <button
          onClick={this.showItems}>
          Toggle items
        </button>
        <ul>
          {itemsToShow}
        </ul>
        <BasicForm
          handleSubmit={this.addOne}
          inputValue={this.state.newItem}
          handleChange={this.handleItemChange}
          buttonDesc="Add"
        />
      </div>
    )
  }
}

const ShoppingInterface = () =>
  <div>
    <h2>Shopping Interface</h2>
    <p>Coming soon!</p>
  </div>

class CrackMySafe extends React.Component {
  constructor() {
    super()
    this.state = {
      secretCode : new Array(4),
      display: "[The safe doesn't make any noise right now.]",
      currIndex: 0,
      currCode: "",
      unavailable: false
    }

    for(let i = 0; i < this.state.secretCode.length; ++i)
      this.state.secretCode[i] = randomInt(0, 9)
  }

  randomizeCode = () => {
    let x = this.state.secretCode.map(digit => randomInt(0,9))
    this.setState({secretCode: x})
  }

  updateDisplay = (input) => () => {
    if (!this.state.unavailable) {
      if (input == null)
        this.setState({
          display: "[The safe doesn't make any noise right now.]"
        })

      else if (input === this.state.secretCode[this.state.currIndex]) {
        this.setState((prevState) => ({
          display: "Beep!",
          currIndex: prevState.currIndex + 1,
          currCode: prevState.currCode + input
        }))

        setTimeout(() => {
          if (this.state.currIndex === this.state.secretCode.length)
            this.setState({
              display: "Congrats! Reset by pressing * or #.",
            })
          else
            this.setState({ display: this.state.currCode })
        }, 500)
      }

      else if (input === 10)
        this.setState({
          display: "Reset activated.",
          currIndex: 0,
          currCode: ""
        })

      else if (input === 11)
      {
        this.setState({
          display: "Full reset activated.",
          currIndex: 0,
          currCode: ""
        })
        this.randomizeCode()
      }

      else if (!(this.state.currIndex === 0))
        this.setState({
          display: "Clank!",
          currIndex: 0,
          currCode: ""
        })

      else
        this.setState({
          display: "[The safe doesn't make any noise right now.]"
        })
    }
  }

  render() {
    return(
      <div>
        <h2>Can you crack my safe?<span role="img" aria-label="emoji">💣</span>
        </h2>
        <CodeDisplay
          content={this.state.display}
        />
        <br/>
        <br/>
        <PhoneButtonInterface
          func={this.updateDisplay}
        />
      </div>
    )
  }
}

const Info = () =>
  <div>
    <h2>Info about me:</h2>
    <p>I am a Finnish first year Computer Science student. I started
    studying in Tampere University in 2016, albeit at the Literature
    department. In 2018, I changed to CS and started honing my coding skills
    way back from around 2011, when I coded my very first program in BASIC
    language. Somewhere in 2012-2013 I coded my first Python program, which is
    sadly lost in the history of time with the other silly scripts I made. I
    learned other languages through taking courses at the university, with
    some exceptions in Web Developing, which I mainly learned using tutorials
    available from <a href="https://fullstackopen.github.io">this site.</a>
    </p>
    <p>
      I am also a member of <a href="https://www.mensa.fi/"
        title="They give out a pretty cool card to put in your wallet too."
        >a certain group of people.</a>
    </p>
    <p>
      My GitHub page: <a href="https://github.com/Liljenmaa">Liljenmaa</a>
    </p>
  </div>

const Knowledge = () =>
  <div>
    <h2>Coding skills:</h2>
    <ul>
      <li>C (99 and forwards)</li>
      <li>C++ (03 and forwards) (fundamentals)</li>
      <li>Java</li>
      <li>Python (2.7 and >3.0)</li>
      <li>SQL (PostgreSQL)</li>
      <li>Web (HTML, CSS, React)</li>
      <li>Javascript (Node.js, Axios, JSON servers, ES6 and forwards)</li>
    </ul>
  </div>

const GuidelinesWeb = () =>
  <div>
    <h2>Some cool tips for Web Developing if you are just starting:</h2>
    <ul>
      <li>Don't use var, its scope can be confusing.</li>
      <ul><li>Use let and const instead.</li></ul>
      <li>Don't use for-in loop like in Python, you probably don't know what
      you are dealing with.</li>
      <ul><li>Use for-of loop instead.</li></ul>
      <li>Objects in Javascript are like dictionaries in Python: they contain
      a "dictionary" of name-value relations in form name: value. They can be
      really powerful!</li>
      <li>Refactoring your code with destructuring assignments can ease the
      pain of passing objects as arguments and creation of new objects using
      previous objects as "mapping" targets.</li>
      <li>Don't use an array's indexes as keys if you are mapping a new
      array.</li>
      <ul><li>It does a thing akin to removing an element from a
      Python array in a for loop: everything might break.</li></ul>
      <li>Make sure your code doesn't change the state of the component
      directly.</li>
      <ul><li>That means you should use setState().</li>
      <li>Why? The component doesn't know that it should render (again),
      so it won't.</li></ul>
      <li>What is an "event"? Whenever a component assigns an event (such as
      a button could assign a "onClick" function) the callback function will
      receive as the first parameter an <a
        href="https://reactjs.org/docs/events.html">event.</a></li>
      <ul><li>The event will contain important info, like the DOM element
      "target" that contains the event's DOM component. With that you can
      access the component's different values.</li></ul>
    </ul>
  </div>

class CodeStuff extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0
    }
  }

  render() {
    const counterUp = () => {
      this.setState((prevState) => ({
        counter: prevState.counter + 1
      }))
    }

    const counterReset = () =>
      this.setState({counter: 0})

    return(
      <div>
        <h2>Experimenting with stuff! Will be broken!</h2>
        <CodeDisplay
          content={this.state.counter}
        />
        <div>
          <Button
            handleClick={counterUp}
            text="Click me!"
          />
          <Button
            handleClick={counterReset}
            text="Reset"
          />
        </div>
        <p>Printing out info from CodeStuff props: {this.props.info}</p>
      </div>
    )
  }
}

const Footer = () => {
  console.log("I can print in the console as well!")
  return(
    <footer>
      <p>This website was constructed using React! Very poorly though.</p>
        <a href="https://rinkkaaj.at">
          <img src="/gambler.svg" className="App-logo"
            title="Part of the rinkkaaj.at empire."
            alt="Gambler logo"
            height ="75"
            />
        </a>
    </footer>
  )
}

const App = () =>
  <div>
    <Hello />
    <DoomsDay />
    <CurrencyQuiz />
    <ShoppingList />
    <ShoppingInterface />
    <CrackMySafe />
    <Info />
    <Knowledge />
    <GuidelinesWeb />
    <CodeStuff info="some random info"/>
    <Footer />
  </div>

ReactDOM.render(<App />, document.getElementById('root'))
