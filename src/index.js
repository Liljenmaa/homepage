import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import './index.css'
import Hello from './components/Hello'
import DoomsDay from './components/DoomsDay'
import Info from './components/Info'
import Knowledge from './components/Knowledge'
import GuidelinesWeb from './components/GuidelinesWeb'
import Footer from './components/Footer'

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
  <code
    className="display">
    {content}
  </code>

const BasicForm = ({handleSubmit, inputValue, handleChange, buttonDesc }) =>
  <form
    className="basic-form"
    onSubmit={handleSubmit}>
    <input
      className="basic-form"
      value={inputValue}
      onChange={handleChange}
    />
    <button
      className="basic-form"
      type="submit">
      {buttonDesc}
    </button>
  </form>

const LoginForm = ({
  handleSubmit, handleUserChange, handlePassChange, handleLoginButton,
    handleRegisterButton, username, password, mode
  }) =>
  <div>
    <h2>Login Screen (Mockup)</h2>
    <button
      type="button"
      className={mode ? "mode-selector-active" : "mode-selector-inactive"}
      onClick={handleLoginButton}>
      Login
    </button>
    <button
      type="button"
      className={mode ? "mode-selector-inactive" : "mode-selector-active"}
      onClick={handleRegisterButton}>
      Register
    </button>
    <br/>
    <form
      className="login-form"
      onSubmit={handleSubmit}>
      <label htmlFor="uname" className="login">Username:</label>
      <input
        id="uname"
        className="login-form"
        value={username}
        onChange={handleUserChange}
      />
      <br/>
      <label htmlFor="pword" className="login">Password:</label>
      <input
        id="pword"
        className="login-form"
        value={"*".repeat(password.length)}
        onChange={handlePassChange}
      />
      <br/>
      <button
        className="login-confirm"
        type="submit">
        Login
      </button>
    </form>
  </div>

const PhoneButtonInterface = ({ func }) =>
  <div className="phone">
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

class LoginScreen extends React.Component {
  constructor() {
    super()

    this.state = {
      currUsername: "",
      currPassword: "",
      loginMode: true
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    console.log("Submitted")

    this.setState({
      currUsername: "",
      currPassword: ""
    })
  }

  handleUserChange = (event) =>
    this.setState({
      currUsername: event.target.value
    })

  handlePassChange = (event) =>
    this.setState({
      currPassword: event.target.value
    })

  handleRegisterButton = (event) =>
    this.setState({
      loginMode: false
    })

  handleLoginButton = (event) =>
    this.setState({
      loginMode: true
    })

  render() {
    return(
      <div className="login-screen">
        <LoginForm
          username={this.state.currUsername}
          password={this.state.currPassword}
          handleSubmit={this.handleSubmit}
          handleUserChange={this.handleUserChange}
          handlePassChange={this.handlePassChange}
          handleLoginButton={this.handleLoginButton}
          handleRegisterButton={this.handleRegisterButton}
          mode={this.state.loginMode}
        />
      </div>
    )
  }
}

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
      display: `What is the currency of ${selectedCountry.name}?`,
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
      <div className="main-div">
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

        this.setState({
          idCounter: this.state.shoppingList.length-1
        })
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

    axios
      .post('http://localhost:3001/shoppingList', newItem)
      .catch(error =>
        alert("Cannot connect to server. Made changes have not been applied.")
      )

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

    axios
      .delete(`http://localhost:3001/shoppingList/${event.target.id}`)
      .catch(error =>
        alert("The item is already deleted.")
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

    const toggleItemsTitle = () =>
      this.state.visible ?
        "Hide items" :
        "Show items"

    return(
      <div className="main-div">
        <h2>
          My current shopping list
        </h2>
        <p>
          Remove entries by clicking on them. Will not accept duplications.
        </p>
        <button
          className="toggle-button"
          onClick={this.showItems}>
          {toggleItemsTitle()}
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
  <div className="main-div">
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
      <div className="main-div">
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
      <div className="main-div">
        <h2>Experimenting with stuff! Will be broken!</h2>
        <CodeDisplay
          content={this.state.counter}
        />
        <button
          onClick={counterUp}>
          Click me!
        </button>
        <button
          onClick={counterReset}>
          Reset
        </button>
        <p>Printing out info from CodeStuff props: {this.props.info}</p>
      </div>
    )
  }
}

const App = () =>
  <div>
    <Hello />
    <DoomsDay />
    <LoginScreen />
    <CurrencyQuiz />
    <ShoppingList />
    <ShoppingInterface />
    <CrackMySafe />
    <Info />
    <Knowledge />
    <GuidelinesWeb />
    <Footer />
  </div>

ReactDOM.render(<App />, document.getElementById('root'))
