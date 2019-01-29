import React from 'react'
import ReactDOM from 'react-dom'

function showStuff(element)
{
  let info = document.getElementById(element)
  console.log(info)
  if (info.style.display === "none")
  {
    info.style.display = "block"
  }
  else
  {
    info.style.display = "none";
  }
}

const Hello = () =>
{
  return(
    <div>
      <h1>Hello visitor!</h1>
      <p>This page contains a random assortment of things. Feel free to try them
      out!</p>
    </div>
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

  render(){

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
        <code>{this.state.counter}</code>
        <br></br>
        <button id="buttonClick" onClick={counterUp}>
          Click me!
        </button>
        <button id="buttonReset" onClick={counterReset}>
          Reset
        </button>
        <p>Printing out info from CodeStuff props: {this.props.info}</p>
      </div>
    )
  }
}

const Footer = () =>
{
  console.log("I can print in the console as well!")
  return(
    <div>
      <p>This website was constructed using React! Very poorly though.</p>
        <img src="/gambler.svg" className="App-logo" alt="Gambler Logo"
          height ="75"/>
    </div>
  )
}

const App = () =>
{
  return(
    <div>
      <Hello />
      <DoomsDay />
      <Info />
      <Knowledge />
      <GuidelinesWeb />
      <CodeStuff info="some random info"/>
      <Footer />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
