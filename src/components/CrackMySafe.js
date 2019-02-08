import React from 'react';
import CodeDisplay from './subcomponents/CodeDisplay';
import PhoneButtonInterface from './subcomponents/PhoneButtonInterface';

const randomInt = (start, end) =>
  Math.floor((end-start+1) * Math.random() + start);

class CrackMySafe extends React.Component {
  constructor() {
    super();
    this.state = {
      secretCode : new Array(4),
      display: "[The safe is silent.]",
      currIndex: 0,
      currCode: "",
      unavailable: false
    }

    for(let i = 0; i < this.state.secretCode.length; ++i)
      this.state.secretCode[i] = randomInt(0, 9);
  }

  componentWillUnmount() {
    clearTimeout(this.beepUpdate);
    clearTimeout(this.clankUpdate);
  }

  randomizeCode = () => {
    const x = this.state.secretCode.map(digit => randomInt(0,9));
    this.setState({secretCode: x});
  }

  updateDisplay = (input) => () => {
    if (!this.state.unavailable) {
      if (input == null)
        this.setState({
          display: "[The safe is silent.]"
        });

      else if (input === this.state.secretCode[this.state.currIndex]) {
        this.setState((prevState) => ({
          display: "Beep!",
          currIndex: prevState.currIndex + 1,
          currCode: prevState.currCode + input
        }));

        this.beepUpdate = setTimeout(() => {
          if (this.state.currIndex === this.state.secretCode.length)
            this.setState({
              display: "Congrats! Reset: * or #",
            });
          else
            this.setState({ display: this.state.currCode });
        }, 500);
      }

      else if (input === 10)
        this.setState({
          display: "Reset activated.",
          currIndex: 0,
          currCode: ""
        });

      else if (input === 11) {
        this.setState({
          display: "Full reset activated.",
          currIndex: 0,
          currCode: ""
        });
        this.randomizeCode();
      }

      else if (!(this.state.currIndex === 0)) {
        this.setState({
          display: "Clank!",
          currIndex: 0,
          currCode: ""
        });

        this.clankUpdate = setTimeout(() => {
          this.setState({
            display: "[The safe is silent.]",
          });
        }, 500);
      }

      else
        this.setState({
          display: "[The safe is silent.]"
        });
      }
    }

  render() {
    return(
      <div className="main-wrapper">
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

export default CrackMySafe;
