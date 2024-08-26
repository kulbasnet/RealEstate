import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div>
      <nav>
        <ul>
        <li><Link to={'/'} >Buy</Link></li>
        <li><Link to={'/sell'} >Sell</Link></li>
        <li><button> Logout</button></li>


        </ul>
       
      </nav>
    </div>
  )
}

export default NavBar
