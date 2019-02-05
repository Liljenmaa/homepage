import React from 'react'

class DoomsDay extends React.Component {
  constructor() {
    super()

    this.maxSeconds = 0x7FFFFFFF

    this.state = {
      msPassed: new Date().getTime()
    }

    this.update = setInterval(() => {
      this.setState({ msPassed: new Date().getTime() })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.update)
  }

  render() {
    const sPassed = parseInt(this.state.msPassed / 1000)
    const secondsLeft = this.maxSeconds - sPassed

    const convertToBinary = (sPassed, currNum = this.maxSeconds + 1) => {
      let returnString = ""

      for(let i = 1;; ++i) {
        if (sPassed / currNum >= 1) {
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

    const getTimeTillDoom = () => {
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
      <div className="main-div">
        <h2><span role="img" aria-label="emoji">💥</span>
          DOOMSDAY<span role="img" aria-label="emoji">💥</span>
        </h2>
        <p>Doomsday Countdown: {getTimeTillDoom()} till 32-bit things break!</p>
        <p>Binary time: {convertToBinary(sPassed)}</p>
        <p>Psst, just a tip: When the first byte turns positive, ALL HELL BREAKS
        LOOSE!<sup> In older systems, that is.</sup></p>
      </div>
    )
  }
}

export default DoomsDay
