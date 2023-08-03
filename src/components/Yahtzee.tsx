import { useState, useEffect, ChangeEvent } from 'react';
import BasicForm from './subcomponents/BasicForm';
import YahtzeeDie from './subcomponents/YahtzeeDie';
import YahtzeeTitle from './subcomponents/YahtzeeTitle';
import YahtzeeRow from './subcomponents/YahtzeeRow';
import YahtzeeRowInfo from './subcomponents/YahtzeeRowInfo';
import axios from 'axios';

interface Highscore {
  nick: string;
  score: number;
}

interface Die {
  id: number;
  number: number;
}

function Yahtzee() {
  const [_, setDiceImgs] = useState<HTMLImageElement[]>([]);
  const [highscores, setHighscores] = useState<Highscore[]>([]);
  const [playable, setPlayable] = useState<boolean>(true);
  const [nick, setNick] = useState<string>("");
  const [comment, setComment] = useState<string>("Wanna have a match? Start by rolling the dice.");
  const [showFinalScore, setShowFinalScore] = useState<boolean>(false);
  const [allowHighscoreSubmit, setAllowHighscoreSubmit] = useState<boolean>(false);
  const [scoringNotAllowed, setScoringNotAllowed] = useState<boolean>(true);
  const [hideDice, setHideDice] = useState<boolean>(true);
  const [lockedDice, setLockedDice] = useState<Die[]>([]);
  const [freeDice, setFreeDice] = useState<Die[]>([{ id: 0, number: 1 }, { id: 1, number: 1 }, { id: 2, number: 1 }, { id: 3, number: 1 }, { id: 4, number: 1 }]);
  const [disappearingLockedDice, setDisappearingLockedDice] = useState<number[]>([]); // IDs of disappearing locked dice for animation purposes
  const [disappearingFreeDice, setDisappearingFreeDice] = useState<number[]>([]); // IDs of disappearing free dice
  const [rolls, setRolls] = useState<number>(0);
  const [ones, setOnes] = useState<number | null>(null);
  const [twos, setTwos] = useState<number | null>(null);
  const [threes, setThrees] = useState<number | null>(null);
  const [fours, setFours] = useState<number | null>(null);
  const [fives, setFives] = useState<number | null>(null);
  const [sixes, setSixes] = useState<number | null>(null);
  const [threeOfAKind, setThreeOfAKind] = useState<number | null>(null);
  const [fourOfAKind, setFourOfAKind] = useState<number | null>(null);
  const [fullHouse, setFullHouse] = useState<number | null>(null);
  const [smallStraight, setSmallStraight] = useState<number | null>(null);
  const [largeStraight, setLargeStraight] = useState<number | null>(null);
  const [yahtzee, setYahtzee] = useState<number | null>(null);
  const [chance, setChance] = useState<number | null>(null);

  useEffect(() => {
    preloadDiceImages();
    fetchHighscores();
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  useEffect(() => {
    checkGameEnd();
  }, [
    ones,
    twos,
    threes,
    fours,
    fives,
    sixes,
    threeOfAKind,
    fourOfAKind,
    fullHouse,
    smallStraight,
    largeStraight,
    yahtzee,
    chance
  ]);

  const cancelToken = axios.CancelToken;
  const source = cancelToken.source();

  useEffect(() => () => {
    source.cancel();
    window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = (): void => {
    if (playable && window.innerWidth < 800) {
      setPlayable(false);
      setComment("Sorry! You'll need to have a bigger screen to play Yahtzee.");
    }
    else if (!playable && window.innerWidth >= 800) {
      setPlayable(true);
      setComment("Wanna have a match? Start by rolling the dice.");
    }
  }

  const preloadDiceImages = (): void => {
    const fakeDice: HTMLImageElement[] = [];

    for (let i = 1; i < 7; ++i) {
      let fakeDie: HTMLImageElement = new Image();
      fakeDie.src = "die" + i + ".svg";
      fakeDice.push(fakeDie);
    }

    setDiceImgs(fakeDice);
  }

  const fetchHighscores = (): void => {
    axios
      .get('https://lilj.fi/api/highscores', {
        cancelToken: source.token
      })
      .then(response => setHighscores(response.data.splice(0, 5)))
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log("Connection not established.");
        }
      })
  }

  const resetGame = (): void => {
    setComment("Have fun!");
    setShowFinalScore(false);
    setScoringNotAllowed(true);
    setAllowHighscoreSubmit(false);
    setHideDice(true);
    setLockedDice([]);
    setFreeDice([{ id: 0, number: 1 }, { id: 1, number: 1 }, { id: 2, number: 1 }, { id: 3, number: 1 }, { id: 4, number: 1 }]);
    setDisappearingLockedDice([]);
    setDisappearingFreeDice([]);
    setRolls(0);
    setOnes(null);
    setTwos(null);
    setThrees(null);
    setFours(null);
    setFives(null);
    setSixes(null);
    setThreeOfAKind(null);
    setFourOfAKind(null);
    setFullHouse(null);
    setSmallStraight(null);
    setLargeStraight(null);
    setYahtzee(null);
    setChance(null);
  }

  const fadeInNewDice = (newDiceArray: Die[]): void => {
    setFreeDice(newDiceArray);
    setDisappearingFreeDice([]);
  }

  const rollDice = (): void => {
    if (rolls === 3 || disappearingFreeDice.length > 0 || disappearingLockedDice.length > 0) return;

    if (showFinalScore) resetGame();

    const newDiceArray: Die[] = [];

    const diceToRoll: Die[] = freeDice.filter((freeDie) => !disappearingFreeDice.includes(freeDie.id))

    for (const die of diceToRoll) {
      let newDieResult: number = Math.floor(Math.random() * 6 + 1);
      newDiceArray.push({ id: die.id, number: newDieResult });
    }

    if (rolls === 0) {
      setHideDice(false);
      setComment("Have fun!");
      setScoringNotAllowed(false);
      setFreeDice(newDiceArray);
      setRolls(rolls + 1);

      return;
    }

    setHideDice(false);
    setComment("Have fun!");
    setScoringNotAllowed(false);
    setDisappearingFreeDice(freeDice.map((die) => die.id));
    setRolls(rolls + 1);
    
    setTimeout(() => fadeInNewDice(newDiceArray), 450);
  }

  const trulyLockDie = (id: number): void => {
    const newFreeDiceArray = freeDice.filter((die) => die.id !== id);

    setFreeDice(newFreeDiceArray);
    setDisappearingFreeDice(disappearingFreeDice.filter((dId) => dId !== id)); 
  }

  const lockDie = (id: number): void => {
    const correctDie = freeDice.find((die) => die.id === id);

    if (!correctDie || disappearingFreeDice.includes(correctDie.id) || disappearingLockedDice.includes(correctDie.id)) return;

    setLockedDice([...lockedDice, correctDie]);
    setDisappearingFreeDice([...disappearingFreeDice, correctDie.id]);

    setTimeout(() => trulyLockDie(id), 450);
  }

  const trulyUnlockDie = (id: number): void => {
    const newLockedDiceArray = lockedDice.filter((die) => die.id !== id);

    setLockedDice(newLockedDiceArray);
    setDisappearingLockedDice(disappearingLockedDice.filter((dId) => dId !== id));
  }

  const unlockDie = (id: number): void => {
    const correctDie = lockedDice.find((die) => die.id === id);

    if (!correctDie || disappearingFreeDice.includes(correctDie.id) || disappearingLockedDice.includes(correctDie.id)) return;

    setFreeDice([...freeDice, correctDie]);
    setDisappearingLockedDice([...disappearingLockedDice, correctDie.id]);

    setTimeout(() => trulyUnlockDie(id), 450);
  }

  const trulyUnlockAllDice = (): void => {
    setHideDice(true);
    setLockedDice([]);
    setFreeDice([...freeDice, ...lockedDice]),
    setDisappearingLockedDice([]);
    setDisappearingFreeDice([]);
  }

  const unlockAllDice = (): void => {
    setRolls(0);
    setScoringNotAllowed(true);
    setDisappearingLockedDice(lockedDice.map((die) => die.id));
    setDisappearingFreeDice(freeDice.map((die) => die.id));

    setTimeout(() => trulyUnlockAllDice(), 450);
  }

  const makeDiceMap = (diceValues: number[]): Map<number, number> => {
    const diceMap = new Map<number, number>();

    for (const dieValue of diceValues) {
      const dieMapValue = diceMap.get(dieValue);
      
      if (dieMapValue) {
        diceMap.set(dieValue, dieMapValue + 1);
      }

      else {
        diceMap.set(dieValue, 1);
      }
    }

    return diceMap;
  }

  const getAllDiceValues = (): number[] => {
    // Avoid animation dupe dice
    return Array.from<Die>(new Set<Die>(freeDice.concat(lockedDice))).map((die) => die.number);
  }

  const determineOnesScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();

    return diceValues.reduce(
      (acc, curr) => acc + (curr === 1 ? 1 : 0),
      0
    )
  }

  const determineTwosScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();

    return diceValues.reduce(
      (acc, curr) => acc + (curr === 2 ? 2 : 0),
      0
    )
  }

  const determineThreesScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();

    return diceValues.reduce(
      (acc, curr) => acc + (curr === 3 ? 3 : 0),
      0
    )
  }

  const determineFoursScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();

    return diceValues.reduce(
      (acc, curr) => acc + (curr === 4 ? 4 : 0),
      0
    )
  }

  const determineFivesScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();

    return diceValues.reduce(
      (acc, curr) => acc + (curr === 5 ? 5 : 0),
      0
    )
  }

  const determineSixesScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();

    return diceValues.reduce(
      (acc, curr) => acc + (curr === 6 ? 6 : 0),
      0
    )
  }

  const determineUpperSectionScore = (): number => {
    const totalScore =
      (ones ? ones : 0) +
      (twos ? twos : 0) +
      (threes ? threes : 0) +
      (fours ? fours : 0) +
      (fives ? fives : 0) +
      (sixes ? sixes : 0);

    return totalScore;
  }

  const determineBonusScore = (): number => {
    return determineUpperSectionScore() >= 63 ? 35 : 0;
  }

  const determineUpperSectionTotalScore = (): number => {
    return determineUpperSectionScore() + determineBonusScore();
  }

  const determineThreeOfAKindScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();
    const diceMap = makeDiceMap(diceValues);
    
    if (diceMap.size >= 4) return 0;

    let threeValue = 0;

    for (const dieValue of diceMap) {
      if (dieValue[1] >= 3) {
        threeValue = dieValue[0];
        break;
      };
    }

    if (threeValue === 0) return 0;
    
    return diceValues.reduce(
      (acc, curr) => acc + curr,
      0
    )
  }

  const determineFourOfAKindScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();
    const diceMap = makeDiceMap(diceValues);

    if (diceMap.size >= 3) return 0;

    let fourValue = 0;

    for (const dieValue of diceMap) {
      if (dieValue[1] >= 4) {
        fourValue = dieValue[0];
        break;
      }
    }

    if (fourValue === 0) return 0;

    return diceValues.reduce(
      (acc, curr) => acc + curr,
      0
    )
  }

  const determineFullHouseScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();
    const diceMap = makeDiceMap(diceValues);

    if (diceMap.size !== 2) return 0;

    for (const dieValue of diceMap) {
      if (!(dieValue[1] === 2 || dieValue[1] === 3)) return 0;
    }

    return 25;
  }

  const determineSmallStraightScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();
    const diceMap = makeDiceMap(diceValues);

    if (
      !(diceMap.size === 4 || diceMap.size === 5) ||
      !diceMap.has(3) ||
      !diceMap.has(4) ||
      !((diceMap.has(1) && diceMap.has(2)) ||
      (diceMap.has(2) && diceMap.has(5)) ||
      (diceMap.has(5) && diceMap.has(6)))
    ) return 0;

    return 30;
  }

  const determineLargeStraightScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();
    const diceMap = makeDiceMap(diceValues);

    if (
      diceMap.size !== 5 ||
      !((diceMap.has(1) && !diceMap.has(6)) ||
      (!diceMap.has(1) && diceMap.has(6)))
    ) return 0;

    return 40;
  }

  const determineYahtzeeScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const diceValues = getAllDiceValues();
    const diceMap = makeDiceMap(diceValues);

    if (diceMap.size !== 1) return 0;

    return 50;
  }

  const determineChanceScore = (): number | null => {
    if (scoringNotAllowed) return null;

    const dice = getAllDiceValues();

    return dice.reduce(
      (acc, curr) => acc + curr,
      0
    )
  }

  const determineLowerSectionScore = (): number => {
    const totalScore =
      (threeOfAKind ? threeOfAKind : 0) +
      (fourOfAKind ? fourOfAKind : 0) +
      (fullHouse ? fullHouse : 0) +
      (smallStraight ? smallStraight : 0) +
      (largeStraight ? largeStraight : 0) +
      (yahtzee ? yahtzee : 0) + 
      (chance ? chance : 0);

    return totalScore;
  }

  const determineGrandTotalScore = (): number => {
    return determineUpperSectionTotalScore() + determineLowerSectionScore();
  }

  const determineHighscoreDisplay = (): string => {
    return showFinalScore ?
      allowHighscoreSubmit ?
        "final-score-full" :
        "final-score-half" :
        "final-score-none";
  }

  const handleNickChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNick(event?.target.value.slice(0, 3).toUpperCase());
  }

  const postHighscore = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();

    const score = determineGrandTotalScore();
    const highscore: Highscore = { nick, score };

    axios
      .post('https://lilj.fi/api/highscores', highscore)
      .then(_ => {
        fetchHighscores();
        setComment("Highscore saved! Start a new game by rolling.")
        setAllowHighscoreSubmit(false);
      })
      .catch(error => console.log(error));
  }

  const checkGameEnd = (): void => {
    if (
      ones !== null &&
      twos !== null &&
      threes !== null &&
      fours !== null &&
      fives !== null &&
      sixes !== null &&
      threeOfAKind !== null &&
      fourOfAKind !== null &&
      fullHouse !== null &&
      smallStraight !== null &&
      largeStraight !== null &&
      yahtzee !== null &&
      chance !== null
    ) {
      const fourthPlace = highscores.at(4);

      if (!fourthPlace || fourthPlace.score < determineGrandTotalScore()) {
        setComment("New highscore! Insert your three letter nick to be placed in the highscores.");
        setShowFinalScore(true);
        setAllowHighscoreSubmit(true);
      }

      else {
        setComment("Aw shucks! You didn't qualify for the top 5. Click on the cup to start again.");
        setShowFinalScore(true);
      }
    }
  }

  const scoreOnes = (score: number): void => {
    if (scoringNotAllowed) return;

    setOnes(score);
    unlockAllDice();
  }

  const scoreTwos = (score: number): void => {
    if (scoringNotAllowed) return;

    setTwos(score);
    unlockAllDice();
  }

  const scoreThrees = (score: number): void => {
    if (scoringNotAllowed) return;

    setThrees(score);
    unlockAllDice();
  }

  const scoreFours = (score: number): void => {
    if (scoringNotAllowed) return;

    setFours(score);
    unlockAllDice();
  }

  const scoreFives = (score: number): void => {
    if (scoringNotAllowed) return;

    setFives(score);
    unlockAllDice();
  }

  const scoreSixes = (score: number): void => {
    if (scoringNotAllowed) return;

    setSixes(score);
    unlockAllDice();
  }

  const scoreThreeOfAKind = (score: number): void => {
    if (scoringNotAllowed) return;

    setThreeOfAKind(score);
    unlockAllDice();
  }

  const scoreFourOfAKind = (score: number): void => {
    if (scoringNotAllowed) return;

    setFourOfAKind(score);
    unlockAllDice();
  }

  const scoreFullHouse = (score: number): void => {
    if (scoringNotAllowed) return;

    setFullHouse(score);
    unlockAllDice();
  }

  const scoreSmallStraight = (score: number): void => {
    if (scoringNotAllowed) return;

    setSmallStraight(score);
    unlockAllDice();
  }

  const scoreLargeStraight = (score: number): void => {
    if (scoringNotAllowed) return;

    setLargeStraight(score);
    unlockAllDice();
  }

  const scoreYahtzee = (score: number): void => {
    if (scoringNotAllowed) return;
    
    setYahtzee(score);
    unlockAllDice();
  }

  const scoreChance = (score: number): void => {
    if (scoringNotAllowed) return;

    setChance(score);
    unlockAllDice();
  }

  return (
    <div className="main-wrapper width-exception">
      <h2>Yahtzee</h2>
      <p>{comment}</p>
      { playable &&
        <div>
          <div className={determineHighscoreDisplay()}>
            <h3 className="highscore-header">Final Score: {determineGrandTotalScore()}</h3>
            <div className="highscores">
              { highscores.map((hs, idx) => (
                  <p className="highscore">
                    <span><b>{idx + 1}.</b></span>
                    <span><b>{hs.nick}</b></span>
                    <span><b>{hs.score.toString().padStart(3, "0")}</b></span>
                  </p>
                ))
              }
            </div>
            <BasicForm
              handleSubmit={postHighscore}
              inputValue={nick}
              handleChange={handleNickChange}
              buttonDesc="Submit"
            />
          </div>
          <div className="yahtzee">
            <div className="dice-areas">
              <div className="diceholder">
                <div className="dice-area">
                  <div className="dice-area-title">Locked Dice</div>
                  <div className="locked-dice">
                    { !hideDice && lockedDice.map((die) =>
                      <YahtzeeDie key={die.id} number={die.number} disappearing={disappearingLockedDice.includes(die.id)} lockFunc={() => unlockDie(die.id)}/> 
                    )}
                  </div>
                </div>
                <div className="dice-area">
                  <div className="dice-area-title">Free Dice</div>
                  <div className="free-dice">
                    { !hideDice && freeDice.map((die) => (
                      <YahtzeeDie key={die.id} number={die.number} disappearing={disappearingFreeDice.includes(die.id)} lockFunc={() => lockDie(die.id)}/>
                    ))}
                  </div>
                </div>
              </div>
              <div className="cup-area">
                <div className={"cup" + (rolls === 3 ? " cup-disabled" : " cup-enabled")} onClick={() => rollDice()}>
                  { rolls !== 3 ?
                    <div className="rollnumber">{"Roll " + (rolls + 1)}</div> :
                    <div className="cross-base">
                      <div className="cross-1"/>
                      <div className="cross-2"/>
                      <div className="cross-3"/>
                      <div className="cross-4"/>
                    </div>
                  }
                  <div className="cup-felt"/>
                  <div className="cup-base"/>
                </div>
              </div>
            </div>
            <div className="scoreboard">
              <YahtzeeTitle first="Upper Section" second="Score" third=""/>
              <YahtzeeRow
                title="Ones"
                lockedScore={ones}
                score={determineOnesScore()}
                scoreFunc={scoreOnes}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Twos"
                lockedScore={twos}
                score={determineTwosScore()}
                scoreFunc={scoreTwos}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Threes"
                lockedScore={threes}
                score={determineThreesScore()}
                scoreFunc={scoreThrees}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Fours"
                lockedScore={fours}
                score={determineFoursScore()}
                scoreFunc={scoreFours}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Fives"
                lockedScore={fives}
                score={determineFivesScore()}
                scoreFunc={scoreFives}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Sixes"
                lockedScore={sixes}
                score={determineSixesScore()}
                scoreFunc={scoreSixes}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRowInfo
                title="Total Score"
                score={determineUpperSectionScore()}
              />
              <YahtzeeRowInfo
                title="Bonus"
                score={determineBonusScore()}
              />
              <YahtzeeRowInfo
                title="Total"
                score={determineUpperSectionTotalScore()}
              />
              <YahtzeeTitle first="Lower Section" second="" third=""/>
              <YahtzeeRow
                title="Three of a Kind"
                lockedScore={threeOfAKind}
                score={determineThreeOfAKindScore()}
                scoreFunc={scoreThreeOfAKind}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Four of a Kind"
                lockedScore={fourOfAKind}
                score={determineFourOfAKindScore()}
                scoreFunc={scoreFourOfAKind}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Full House"
                lockedScore={fullHouse}
                score={determineFullHouseScore()}
                scoreFunc={scoreFullHouse}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Small Straight"
                lockedScore={smallStraight}
                score={determineSmallStraightScore()}
                scoreFunc={scoreSmallStraight}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Large Straight"
                lockedScore={largeStraight}
                score={determineLargeStraightScore()}
                scoreFunc={scoreLargeStraight}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Yahtzee"
                lockedScore={yahtzee}
                score={determineYahtzeeScore()}
                scoreFunc={scoreYahtzee}
                notAllowed={scoringNotAllowed}
              />
              <YahtzeeRow
                title="Chance"
                lockedScore={chance}
                score={determineChanceScore()}
                scoreFunc={scoreChance}
                notAllowed={scoringNotAllowed}
              />
              { /*TODO: do Yahtzee Bonus later <YahtzeeRowInfo
                title="Yahtzee Bonus"
                ></YahtzeeRowInfo> */ }
              <YahtzeeRowInfo
                title="Total Score"
                score={determineLowerSectionScore()}
              />
              <YahtzeeRowInfo
                title="Grand Total"
                score={determineGrandTotalScore()}
              />
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
      }
  </div>
  )
}

export default Yahtzee;