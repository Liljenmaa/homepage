import React from 'react';
import ClickableListNode from './subcomponents/ClickableListNode';
import BasicForm from './subcomponents/BasicForm';
import axios from 'axios';

class ShoppingList extends React.Component {
  constructor() {
    super();

    this.state = {
      shoppingList: [],
      newItem: "",
      visible: true,
      serverConnection: false
    }
  }

  cancelToken = axios.CancelToken;
  source = this.cancelToken.source();

  componentDidMount() {
    axios
      .get('http://localhost:3001/shoppingList', {
        cancelToken: this.source.token
      })
      .then(response =>
        this.setState({
          shoppingList: response.data,
          serverConnection: true
        }))
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log("Connection not established.");
        }
      })
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  addOne = (event) => {
    event.preventDefault();

    if (this.state.newItem === "")
      return;

    const notDupe = (obj) => obj.content !== this.state.newItem;

    if (!(this.state.shoppingList.every(notDupe))) {
      this.setState({ newItem: "" });
      return;
    }

    const newItem = {
      content: this.state.newItem
    }

    axios
      .post('http://localhost:3001/shoppingList', newItem)
      .then(res => this.setState({
        shoppingList: this.state.shoppingList.concat(res.data)
      }))
      .catch(error => this.setState({
        serverConnection: false
      }))

    this.setState({
      newItem: ""
    });
  }

  removeOne = (event) => {
    const shoppingList = this.state.shoppingList.filter(
      obj => obj.id !== Number(event.target.id)
    );

    axios
      .delete(`http://localhost:3001/shoppingList/${event.target.id}`)
      .catch(error =>
        alert("The item is already deleted.")
      )

    this.setState({ shoppingList });
  }

  handleItemChange = (event) =>
    this.setState({ newItem: event.target.value });

  showItems = () => {
    this.setState((prevState) => ({
      visible: !prevState.visible
    }));
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
        "Show items";

    return(
      <div className="main-div">
        <h2>
          My current shopping list
        </h2>
        <p>
          This list is connected to my server.
          Remove entries by clicking on them.
          Will not accept duplications.
        </p>
        <h3>Server status: {this.state.serverConnection ?
          "connected" : "no connection, refresh browser"}</h3>
        <button
          className="toggle-button"
          onClick={this.showItems}>
          {toggleItemsTitle()}
        </button>
        <br/>
        <p>
          {itemsToShow}
        </p>
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

export default ShoppingList;
