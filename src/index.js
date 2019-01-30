import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function randomInt(start, end)
{
  return Math.floor((end-start) * Math.random() + start)
}

const Display = ({ content }) => <div>{content}</div>

const CodeDisplay = ({ data }) => <code>{data}</code>

const Button = ({handleClick, text}) =>
{
  return(
    <button onClick={handleClick}>
      {text}
      </button>
  )
}

const PhoneButtonInterface = ({ func }) =>
{
  return(
    <div>
      <button class="phone" onClick={func(1)}>1</button>
      <button class="phone" onClick={func(2)}>2</button>
      <button class="phone" onClick={func(3)}>3</button>
    <br/>
      <button class="phone" onClick={func(4)}>4</button>
      <button class="phone" onClick={func(5)}>5</button>
      <button class="phone" onClick={func(6)}>6</button>
    <br/>
      <button class="phone" onClick={func(7)}>7</button>
      <button class="phone" onClick={func(8)}>8</button>
      <button class="phone" onClick={func(9)}>9</button>
    <br/>
      <button class="phone" onClick={func(10)}>*</button>
      <button class="phone" onClick={func(0)}>0</button>
      <button class="phone" onClick={func(11)}>#</button>
    </div>
  )
}

const Hello = () =>
{
  return(
    <header>
      <h1>Hello visitor!</h1>
      <p>This page contains a random assortment of things. Feel free to try them
      out!</p>
    </header>
  )
}

class DoomsDay extends React.Component
{
  constructor()
  {
    super()
    this.state =
    {
      msPassed: new Date().getTime()
    }

    setInterval(() =>
    {
      this.setState({ msPassed: new Date().getTime() })
    }, 1000)
  }

  render(){

    const maxSeconds = 0x7FFFFFFF
    const sPassed = parseInt(this.state.msPassed / 1000)

    const convertToBinary = (sPassed, currNum = maxSeconds + 1) =>
    {
      let returnString = ""

      for(let i = 1;; ++i)
      {
        if (sPassed / currNum >= 1)
        {
          returnString += "1"
          sPassed = sPassed % currNum
        }
        else
          returnString += "0"

        currNum = parseInt(currNum/2)

        if (i % 4 === 0)
          returnString += " "

        if (currNum < 1)
          return returnString
      }
    }

    const secondsLeft = maxSeconds - sPassed

    const getTimeTillDoom = () =>
    {
      let returnString = ""

      const dLeft = parseInt(secondsLeft / 86400)
      const hLeft = parseInt((secondsLeft % 86400) / 3600)
      const mLeft = parseInt(((secondsLeft % 86400) % 3600) / 60)
      const sLeft = parseInt(((secondsLeft % 86400) % 3600) % 60)

      returnString += dLeft + " days "
      returnString += hLeft + " hours "
      returnString += mLeft + " minutes "
      returnString += sLeft + " seconds "

      return returnString
    }

    return(
      <div>
        <h2>DOOMSDAY</h2>
        <p>Doomsday Countdown: {getTimeTillDoom()} till 32-bit things break!</p>
        <p>Binary time: {convertToBinary(sPassed)}</p>
        <p>Psst, just a tip: When the first byte turns positive, ALL HELL BREAKS
        LOOSE!<sup> In older systems, that is.</sup></p>
      </div>
    )
  }
}

class CrackMySafe extends React.Component
{
  constructor()
  {
    super()
    this.state =
    {
      secretCode : new Array(4),
      display: "[The safe doesn't make any noise right now.]",
      currIndex: 0,
      currCode: "",
      unavailable: false
    }

    for(let i = 0; i < this.state.secretCode.length; ++i)
    {
      this.state.secretCode[i] = randomInt(0, 9)
    }
  }

  render()
  {
    const randomizeCode = () =>
    {
      let x = new Array(4)

      for(let i = 0; i < this.state.secretCode.length; ++i)
      {
        x[i] = randomInt(0,9)
        this.setState({secretCode: x})
      }

      console.log(this.state.secretCode)
    }

    const updateDisplay = (input) => () =>
    {
      if (!this.state.unavailable)
      {
        if (input == null)
          this.setState({
            display: "[The safe doesn't make any noise right now.]"
          })

        else if (input === this.state.secretCode[this.state.currIndex])
        {
          this.setState((prevState) =>({
            display: "Beep!",
            currIndex: prevState.currIndex + 1,
            currCode: prevState.currCode + input
          }))

          setTimeout(() =>
          {
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
          randomizeCode()
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

    return(
      <div>
        <h2>Can you crack my safe?</h2>
        <CodeDisplay data={this.state.display}/>
        <br/>
        <br/>
        <PhoneButtonInterface func={updateDisplay}/>
      </div>
    )
  }
}

const Info = () =>
{
  return(
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
        My GitHub page: <a href="https://github.com/Liljenmaa">Liljenmaa</a>
      </p>
    </div>
  )
}

const Knowledge = () =>
{
  return(
    <div>
      <h2>Coding skills:</h2>
      <ul>
        <li>C (99 and forwards)</li>
        <li>C++ (03 and forwards) (fundamentals)</li>
        <li>Java</li>
        <li>Python (2.7 and >3.0)</li>
        <li>SQL (PostgreSQL)</li>
        <li>Web (HTML, CSS, React)</li>
        <li>Javascript (Node.js, ES6 and forwards)</li>
      </ul>
    </div>
  )
}

const GuidelinesWeb = () =>
{
  return(
    <div>
      <h2>Some cool guidelines for Web developing if you are just starting:</h2>
      <ul>
        <li>Don't use var, its scope can be confusing.</li>
        <ul><li>Use let and const instead.</li></ul>
        <li>Don't use for-in loop like in Python, you probably don't know what
        you are dealing with.</li>
        <ul><li>Use for-of loop instead.</li></ul>
        <li>Objects in Javascript are like dictionaries in Python: they contain
        a "dictionary" of name-value relations in form name: value. They can be
        really powerful!</li>
      </ul>
    </div>
  )
}

class CodeStuff extends React.Component
{
  constructor()
  {
    super()
    this.state =
    {
      counter: 0
    }
  }

  render()
  {
    const counterUp = () =>
    {
      this.setState((prevState) => ({
        counter: prevState.counter + 1
      }))
    }

    const counterReset = () =>
    {
      this.setState({counter: 0})
    }

    return(
      <div>
        <h2>Experimenting with stuff! Will be broken!</h2>
        <CodeDisplay data={this.state.counter}/>
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

const Footer = () =>
{
  console.log("I can print in the console as well!")
  return(
    <footer>
      <p>This website was constructed using React! Very poorly though.</p>
        <img src="/gambler.svg" className="App-logo" alt="Gambler Logo"
          height ="75"/>
    </footer>
  )
}

const App = () =>
{
  return(
    <div>
      <Hello />
      <DoomsDay />
      <CrackMySafe />
      <Info />
      <Knowledge />
      <GuidelinesWeb />
      <CodeStuff info="some random info"/>
      <Footer />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
