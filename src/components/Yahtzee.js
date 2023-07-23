import React from 'react';
import YahtzeeDie from './subcomponents/YahtzeeDie';
import YahtzeeTitle from './subcomponents/YahtzeeTitle';
import YahtzeeRow from './subcomponents/YahtzeeRow';
import YahtzeeRowInfo from './subcomponents/YahtzeeRowInfo';

class Die {
  constructor(id, number) {
    this.id = id;
    this.number = number;
  }
}

class Yahtzee extends React.Component {
  constructor() {
    super();

    this.state = {
      diceImgs: [],
      comment: "Wanna have a match? Start by rolling the dice.",
      showFinalScore: false,
      scoringNotAllowed: true,
      hideDice: true,
      lockedDice: [],
      freeDice: [new Die(0, 1), new Die(1, 1), new Die(2, 1), new Die(3, 1), new Die(4, 1)],
      disappearingLockedDice: [], // IDs of disappearing locked dice for animation purposes
      disappearingFreeDice: [], // IDs of disappearing free dice
      rolls: 0,
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      yahtzee: null,
      chance: null
    }

    this.preloadDiceImages();
  }

  preloadDiceImages = () => {
    const fakeDice = [];

    for (let i = 1; i < 7; ++i) {
      let fakeDie = new Image();
      fakeDie.src = "die" + i + ".svg";
      fakeDice.push(fakeDie);
    }

    // Safe, has not yet mounted
    this.state.diceImgs = fakeDice;
  }

  resetGame = () => {
    this.setState({
      comment: "Have fun!",
      showFinalScore: false,
      scoringNotAllowed: true,
      hideDice: true,
      lockedDice: [],
      freeDice: [new Die(0, 1), new Die(1, 1), new Die(2, 1), new Die(3, 1), new Die(4, 1)],
      disappearingLockedDice: [],
      disappearingFreeDice: [],
      rolls: 0,
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      yahtzee: null,
      chance: null
    })
  }

  fadeInNewDice = (newDiceArray) => {
    this.setState({ freeDice: newDiceArray, disappearingFreeDice: [] });
  }

  rollDice = () => {
    if (this.state.rolls === 3 || this.state.disappearingFreeDice.length > 0 || this.state.disappearingLockedDice.length > 0) return;

    if (this.state.showFinalScore) this.resetGame();

    let newDiceArray = [];

    const diceToRoll = this.state.freeDice.filter((freeDie) => !this.state.disappearingFreeDice.includes(freeDie))

    for (let die of diceToRoll) {
      let newDieResult = Math.floor(Math.random() * 6 + 1);
      newDiceArray.push(new Die(die.id, newDieResult));
    }

    if (this.state.rolls === 0) {
      this.setState((prevState) => {
        return { 
          hideDice: false,
          comment: "Have fun!",
          scoringNotAllowed: false,
          freeDice: newDiceArray,
          rolls: prevState.rolls + 1,
        }
      });

      return;
    }

    this.setState((prevState) => {
      return {
        hideDice: false,
        comment: "Have fun!",
        scoringNotAllowed: false,
        disappearingFreeDice: prevState.freeDice.map((die) => die.id),
        rolls: prevState.rolls + 1,
      }
    });
    
    setTimeout(() => {
      this.fadeInNewDice(newDiceArray);
    }, 450);
  }

  trulyLockDie = (id) => {
    const newFreeDiceArray = this.state.freeDice.filter((die) => die.id !== id);

    this.setState((prevState) => {
      return {
        freeDice: newFreeDiceArray,
        disappearingFreeDice: prevState.disappearingFreeDice.filter((dId) => dId !== id) 
      }
    });
  }

  lockDie = (id) => {
    const correctDie = this.state.freeDice.find((die) => die.id === id);

    if (this.state.disappearingFreeDice.includes(correctDie.id) || this.state.disappearingLockedDice.includes(correctDie.id)) return;

    this.setState((prevState) => {
      return {
        lockedDice: [...prevState.lockedDice, correctDie],
        disappearingFreeDice: [...prevState.disappearingFreeDice, correctDie.id]
      }
    });

    setTimeout(() => this.trulyLockDie(id), 450);
  }

  trulyUnlockDie = (id) => {
    const newLockedDiceArray = this.state.lockedDice.filter((die) => die.id !== id);

    this.setState((prevState) => {
      return {
        lockedDice: newLockedDiceArray,
        disappearingLockedDice: prevState.disappearingLockedDice.filter((dId) => dId !== id)
      }
    });
  }

  unlockDie = (id) => {
    const correctDie = this.state.lockedDice.find((die) => die.id === id);

    if (this.state.disappearingFreeDice.includes(correctDie.id) || this.state.disappearingLockedDice.includes(correctDie.id)) return;

    this.setState((prevState) => {
      return {
        freeDice: [...prevState.freeDice, correctDie],
        disappearingLockedDice: [...prevState.disappearingLockedDice, correctDie.id]
      }
    });

    setTimeout(() => this.trulyUnlockDie(id), 450);
  }

  trulyUnlockAllDice = () => {
    this.setState((prevState) => {
      return {
        hideDice: true,
        lockedDice: [],
        freeDice: [...prevState.freeDice, ...prevState.lockedDice],
        disappearingLockedDice: [],
        disappearingFreeDice: []
      }
    });
  }

  unlockAllDice = () => {
    this.setState((prevState) => {
      return {
        rolls: 0,
        scoringNotAllowed: true,
        disappearingLockedDice: prevState.lockedDice.map((die) => die.id),
        disappearingFreeDice: prevState.freeDice.map((die) => die.id)
      }
    });

    setTimeout(() => this.trulyUnlockAllDice(), 450);
  }

  makeDiceMap = (dice) => {
    let diceMap = new Map();

    for (const die of dice) {
      const dieMapValue = diceMap.get(die);
      
      if (dieMapValue > 0) {
        diceMap.set(die, dieMapValue + 1);
      }

      else {
        diceMap.set(die, 1);
      }
    }

    return diceMap;
  }

  getAllDice() {
    // Avoid animation dupe dice
    return Array.from(new Set (this.state.freeDice.concat(this.state.lockedDice))).map((die) => die.number);
  }

  determineOnesScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();

    return dice.reduce(
      (acc, curr) => acc + (curr === 1 ? 1 : 0),
      0
    )
  }

  determineTwosScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();

    return dice.reduce(
      (acc, curr) => acc + (curr === 2 ? 2 : 0),
      0
    )
  }

  determineThreesScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();

    return dice.reduce(
      (acc, curr) => acc + (curr === 3 ? 3 : 0),
      0
    )
  }

  determineFoursScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();

    return dice.reduce(
      (acc, curr) => acc + (curr === 4 ? 4 : 0),
      0
    )
  }

  determineFivesScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();

    return dice.reduce(
      (acc, curr) => acc + (curr === 5 ? 5 : 0),
      0
    )
  }

  determineSixesScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();

    return dice.reduce(
      (acc, curr) => acc + (curr === 6 ? 6 : 0),
      0
    )
  }

  determineUpperSectionScore = () => {
    return this.state.ones + this.state.twos + this.state.threes + this.state.fours + this.state.fives + this.state.sixes;
  }

  determineBonusScore = () => {
    let totalScore = this.state.ones + this.state.twos + this.state.threes + this.state.fours + this.state.fives + this.state.sixes;
    return totalScore >= 63 ? 35 : 0;
  }

  determineUpperSectionTotalScore = () => {
    return this.determineUpperSectionScore() + this.determineBonusScore();
  }

  determineThreeOfAKindScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();
    let diceMap = this.makeDiceMap(dice);
    
    if (diceMap.size >= 4) return 0;

    let threeValue = 0;

    for (const dieValue of diceMap) {
      if (dieValue[1] >= 3) {
        threeValue = dieValue[0];
        break;
      }; 
    }

    if (threeValue === 0) return 0;
    
    return dice.reduce(
      (acc, curr) => acc + curr,
      0
    )
  }

  determineFourOfAKindScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();
    let diceMap = this.makeDiceMap(dice);
    let amountOfFirstDie = diceMap.values().next().value;

    if (diceMap.size !== 2 || !(amountOfFirstDie === 1 || amountOfFirstDie === 4)) return 0;

    return dice.reduce(
      (acc, curr) => acc + curr,
      0
    )
  }

  determineFullHouseScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();
    let diceMap = this.makeDiceMap(dice);

    if (diceMap.size !== 2) return 0;

    for (const dieValue of diceMap) {
      if (!(dieValue[1] === 2 || dieValue[1] === 3)) return 0;
    }

    return 25;
  }

  determineSmallStraightScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();
    let diceMap = this.makeDiceMap(dice);

    if (
      !(diceMap.size !== 4 || diceMap.size !== 5) ||
      !diceMap.has(3) ||
      !diceMap.has(4) ||
      !((diceMap.has(1) && diceMap.has(2)) ||
      (diceMap.has(2) && diceMap.has(5)) ||
      (diceMap.has(5) && diceMap.has(6)))
    ) return 0;

    return 30;
  }

  determineLargeStraightScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();
    let diceMap = this.makeDiceMap(dice);

    if (
      diceMap.size !== 5 ||
      !((diceMap.has(1) && !diceMap.has(6)) ||
      (!diceMap.has(1) && diceMap.has(6)))
    ) return 0;

    return 40;
  }

  determineYahtzeeScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();
    let diceMap = this.makeDiceMap(dice);

    if (diceMap.size !== 1) return 0;

    return 50;
  }

  determineChanceScore = () => {
    if (this.state.scoringNotAllowed) return null;

    const dice = this.getAllDice();

    return dice.reduce(
      (acc, curr) => acc + curr,
      0
    )
  }

  determineLowerSectionScore = () => {
    return this.state.threeOfAKind +
      this.state.fourOfAKind +
      this.state.fullHouse +
      this.state.smallStraight +
      this.state.largeStraight +
      this.state.yahtzee +
      this.state.chance;
  }

  determineGrandTotalScore = () => {
    return this.determineUpperSectionTotalScore() + this.determineLowerSectionScore();
  }

  checkGameEnd = () => {
    if (
      this.state.ones !== null &&
      this.state.twos !== null &&
      this.state.threes !== null &&
      this.state.fours !== null &&
      this.state.fives !== null &&
      this.state.sixes !== null &&
      this.state.threeOfAKind !== null &&
      this.state.fourOfAKind !== null &&
      this.state.fullHouse !== null &&
      this.state.smallStraight !== null &&
      this.state.largeStraight !== null &&
      this.state.yahtzee !== null &&
      this.state.chance !== null
    ) {
      this.setState({ comment: "Game completed! Start a new one by rolling.", showFinalScore: true });
    }
  }

  scoreOnes = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ ones: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreTwos = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ twos: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreThrees = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ threes: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreFours = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ fours: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreFives = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ fives: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreSixes = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ sixes: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreThreeOfAKind = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ threeOfAKind: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreFourOfAKind = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ fourOfAKind: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreFullHouse = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ fullHouse: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreSmallStraight = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ smallStraight: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreLargeStraight = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ largeStraight: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreYahtzee = (score) => {
    if (this.state.scoringNotAllowed) return null;
    
    this.setState({ yahtzee: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  scoreChance = (score) => {
    if (this.state.scoringNotAllowed) return null;

    this.setState({ chance: score }, () => this.checkGameEnd());
    this.unlockAllDice();
  }

  render() {
    return(
      <div className="main-wrapper width-exception">
        <h2>Yahtzee</h2>
        <p>{this.state.comment}</p>
        <h3 className={this.state.showFinalScore ? "final-score-shown" : "final-score-disappear"}>Final Score: {this.determineGrandTotalScore()}</h3>
        <div className="yahtzee">
          <div className="dice-areas">
            <div className="diceholder">
              <div className="dice-area">
                <div className="dice-area-title">Locked Dice</div>
                <div className="locked-dice">
                  { this.state.hideDice ?
                    <div></div> :
                    this.state.lockedDice.map((die) => (
                      <YahtzeeDie key={die.id} number={die.number} disappearing={this.state.disappearingLockedDice.includes(die.id)} lockFunc={() => this.unlockDie(die.id)} ></YahtzeeDie>
                    ))
                  }
                </div>
              </div>
              <div className="dice-area">
                <div className="dice-area-title">Free Dice</div>
                <div className="free-dice">
                  { this.state.hideDice ?
                    <div></div> :
                    this.state.freeDice.map((die) => (
                      <YahtzeeDie key={die.id} number={die.number} disappearing={this.state.disappearingFreeDice.includes(die.id)} lockFunc={() => this.lockDie(die.id)}></YahtzeeDie>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="cup-area">
              <div className={"cup" + (this.state.rolls === 3 ? " cup-disabled" : " cup-enabled")} onClick={() => this.rollDice()}>
                { this.state.rolls !== 3 ?
                  <div className="rollnumber">{"Roll " + (this.state.rolls + 1)}</div> :
                  <div className="cross-base">
                    <div className="cross-1"></div>
                    <div className="cross-2"></div>
                    <div className="cross-3"></div>
                    <div className="cross-4"></div>
                  </div>
                }
                <div className="cup-felt"></div>
                <div className="cup-base"></div>
              </div>
            </div>
          </div>
          <div className="scoreboard">
            <YahtzeeTitle first="Upper Section" second="Score" third="P2 Score"></YahtzeeTitle>
            <YahtzeeRow
              title="Ones"
              lockedScore={this.state.ones}
              score={this.determineOnesScore()}
              scoreFunc={this.scoreOnes}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Twos"
              lockedScore={this.state.twos}
              score={this.determineTwosScore()}
              scoreFunc={this.scoreTwos}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Threes"
              lockedScore={this.state.threes}
              score={this.determineThreesScore()}
              scoreFunc={this.scoreThrees}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Fours"
              lockedScore={this.state.fours}
              score={this.determineFoursScore()}
              scoreFunc={this.scoreFours}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Fives"
              lockedScore={this.state.fives}
              score={this.determineFivesScore()}
              scoreFunc={this.scoreFives}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Sixes"
              lockedScore={this.state.sixes}
              score={this.determineSixesScore()}
              scoreFunc={this.scoreSixes}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRowInfo
              title="Total Score"
              score={this.determineUpperSectionScore()}
            ></YahtzeeRowInfo>
            <YahtzeeRowInfo
              title="Bonus"
              score={this.determineBonusScore()}
            ></YahtzeeRowInfo>
            <YahtzeeRowInfo
              title="Total"
              score={this.determineUpperSectionTotalScore()}
            ></YahtzeeRowInfo>
            <YahtzeeTitle first="Lower Section"></YahtzeeTitle>
            <YahtzeeRow
              title="Three of a Kind"
              lockedScore={this.state.threeOfAKind}
              score={this.determineThreeOfAKindScore()}
              scoreFunc={this.scoreThreeOfAKind}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Four of a Kind"
              lockedScore={this.state.fourOfAKind}
              score={this.determineFourOfAKindScore()}
              scoreFunc={this.scoreFourOfAKind}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Full House"
              lockedScore={this.state.fullHouse}
              score={this.determineFullHouseScore()}
              scoreFunc={this.scoreFullHouse}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Small Straight"
              lockedScore={this.state.smallStraight}
              score={this.determineSmallStraightScore()}
              scoreFunc={this.scoreSmallStraight}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Large Straight"
              lockedScore={this.state.largeStraight}
              score={this.determineLargeStraightScore()}
              scoreFunc={this.scoreLargeStraight}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Yahtzee"
              lockedScore={this.state.yahtzee}
              score={this.determineYahtzeeScore()}
              scoreFunc={this.scoreYahtzee}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            <YahtzeeRow
              title="Chance"
              lockedScore={this.state.chance}
              score={this.determineChanceScore()}
              scoreFunc={this.scoreChance}
              notAllowed={this.state.scoringNotAllowed}
            ></YahtzeeRow>
            {/* TODO: do Yahtzee Bonus later <YahtzeeRowInfo
              title="Yahtzee Bonus"
              ></YahtzeeRowInfo> */}
            <YahtzeeRowInfo
              title="Total Score"
              score={this.determineLowerSectionScore()}
            ></YahtzeeRowInfo>
            <YahtzeeRowInfo
              title="Grand Total"
              score={this.determineGrandTotalScore()}
            ></YahtzeeRowInfo>
          </div>
        </div>
        <div>
          <h2>Instructions</h2>
          <p>Click on the Dice Cup to roll or reroll dice. Three rolls total!</p>
          <p>Click on dice to lock or unlock them. Only unlocked dice will be rerolled.</p>
          <p>Click on a field in the score sheet to score it. You can score a field only once!</p>
          <p>Game ends when all fields have been scored. Aim to score a high total!</p>
          <p>Explanations for the fields and more detailed rules are available <a target="_blank" rel="noopener noreferrer"href="https://en.wikipedia.org/wiki/Yahtzee#Rules">over here</a>.</p>
        </div>
      </div>
    )
  }
}

export default Yahtzee;
