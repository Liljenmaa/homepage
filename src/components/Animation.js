import React from 'react'

const WIDTH = 300;
const HEIGHT = 300;

class Animation extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      drawX: 10,
      drawY: 10,
      horDirection: 1,
      verDirection: 0,
      marginX: 10,
      marginY: 10,
      bounces: 0
    }

    this.updateAnimationState = this.updateAnimationState.bind(this);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  updateAnimationState() {
    this.setState((prevState) => ({
      drawX: prevState.drawX + prevState.horDirection,
      drawY: prevState.drawY + prevState.verDirection
    }));

    if(
      this.state.drawX === WIDTH - this.state.marginX &&
      this.state.bounces === 0
      ){
        this.setState({
          horDirection: 0,
          verDirection: 1,
          bounces: 1
        });
      }

    if(
      this.state.drawY === HEIGHT - this.state.marginY &&
      this.state.bounces === 1
      ){
        this.setState({
          horDirection: -1,
          verDirection: 0,
          bounces: 2
        });
      }

    if(
      this.state.drawX === this.state.marginX &&
      this.state.bounces === 2
      ){
        this.setState((prevState) => ({
          horDirection: 0,
          verDirection: -1,
          bounces: 3,
          marginY: prevState.marginY + 10
        }));
      }

    if(
      this.state.drawY === this.state.marginY &&
      this.state.bounces === 3
      ){
        this.setState((prevState) => ({
          horDirection: 1,
          verDirection: 0,
          bounces: 0,
          marginX: prevState.marginX + 10
        }));
      }

    this.rAF = requestAnimationFrame(this.updateAnimationState);

    this.state.marginX === WIDTH/2 ? cancelAnimationFrame(this.rAF) : void(0);
  }

  render() {
    return <Spiral drawX={this.state.drawX} drawY={this.state.drawY} />
  }
}

class Spiral extends React.Component {
  componentDidUpdate() {
    const { drawX, drawY } = this.props;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    ctx.fillRect(drawX, drawY, 1, 1);
  }

  render() {
    return(
      <div className="main-wrapper">
        <h2>Filling Spiral</h2>
        <p>Uses Animation Frames, so it shouldn't lag on mobile.</p>
        <canvas
          className="boarding"
          ref="canvas"
          width="300"
          height="300">
        </canvas>
      </div>
    )
  }
}

export default Animation;
