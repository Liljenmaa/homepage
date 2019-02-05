import React from 'react'
import GeneralInfo from './components/GeneralInfo'
import Knowledge from './components/Knowledge'
import GuidelinesWeb from './components/GuidelinesWeb'

const Info = () =>
  <div className="Info">
    <GeneralInfo />
    <br/>
    <Knowledge />
    <br/>
    <GuidelinesWeb />
  </div>

export default Info
