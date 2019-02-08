import React from 'react';
import CodeDisplay from './subcomponents/CodeDisplay';
import BasicForm from './subcomponents/BasicForm';
import axios from 'axios';

const randomInt = (start, end) =>
  Math.floor((end-start+1) * Math.random() + start);

class CurrencyQuiz extends React.Component {
  constructor() {
    super();

    this.state = {
      listOfCountries: [],
      currentCountry: {},
      display: "Fetching data...",
      currGuess: ""
    }
  }

  cancelToken = axios.CancelToken;
  source = this.cancelToken.source();

  componentDidMount() {
    axios
      .get('https://restcountries.eu/rest/v2/all', {
        cancelToken: this.source.token
      })
      .then(response => {
        this.setState({ listOfCountries: response.data });
        this.selectRandomCountry();
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          this.setState({ display: "Error fetching data." });
        }
      })
  }

  componentWillUnmount() {
    clearInterval(this.countryUpdate);
    this.source.cancel();
  }

  selectRandomCountry = () => {
    const random = randomInt(0, this.state.listOfCountries.length-1);
    const selectedCountry = this.state.listOfCountries[random];

    this.setState({
      currentCountry: selectedCountry,
      display: `What is the currency of ${selectedCountry.name}?`,
    });
  }

  checkAnswer = (event) => {
    event.preventDefault();

    const allWrong = () =>
      this.state.currentCountry.currencies.every((currency) => {
        const splitCurrency = currency.name.split(" ");
        const actualCurrency = splitCurrency[splitCurrency.length-1];

        return actualCurrency.toLowerCase() !==
          this.state.currGuess.toLowerCase();
      })

    allWrong() ?
      this.setState({
        display: "I'm afraid that's wrong.",
        currGuess: ""
      }) :
      this.setState({
        display: "That's correct!",
        currGuess: ""
      });

    this.countryUpdate = setTimeout(this.selectRandomCountry, 1500);
  }

  handleGuessChange = (event) =>
    this.setState({ currGuess: event.target.value });

  render() {
    return(
      <div className="main-wrapper">
        <h2> Currency Quiz! </h2>
        <p>Country information taken from<a
          href="https://restcountries.eu">REST Countries</a>.
        </p>
        <br/>
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

export default CurrencyQuiz;
