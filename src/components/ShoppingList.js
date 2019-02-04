import React from 'react'
import ClickableListNode from './subcomponents/ClickableListNode'
import BasicForm from './subcomponents/BasicForm'
import axios from 'axios'

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
          idCounter: this.state.shoppingList.length
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
      id: this.state.idCounter,
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
          This list is connected to my server.
          Remove entries by clicking on them.
          Will not accept duplications.
        </p>
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

export default ShoppingList
