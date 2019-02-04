import React from 'react'

const BasicForm = ({handleSubmit, inputValue, handleChange, buttonDesc }) =>
  <form
    className="basic-form"
    onSubmit={handleSubmit}>
    <input
      className="basic-form"
      value={inputValue}
      onChange={handleChange}
    />
    <button
      className="basic-form"
      type="submit">
      {buttonDesc}
    </button>
  </form>

export default BasicForm
