import React from 'react'

const Footer = () => {
  console.log("I can print in the console as well!")

  return(
    <footer>
        <p>This website was constructed using React! Very poorly though.</p>
        <a href="https://rinkkaaj.at"
          target="_blank">
          <img
            src="/gambler.svg"
            className="gambler-logo"
            alt="Gambler logo"
            height ="75"s
          />
        </a>
    </footer>
  )
}

export default Footer
