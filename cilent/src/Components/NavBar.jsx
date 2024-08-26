import React from 'react'
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";


function NavBar() {    
  return (
    <div>
      <nav className='nav'>
        <ul className='nav-link'>
        <li><Link to={'/'} className='li-link'>BUY</Link></li>
        <li><Link to={'/sell'} className='li-link' >SELL</Link></li>
        <li><Link to={'/agent'} className='li-link'>Agent</Link></li>
        <li className='icon'><FontAwesomeIcon icon={faUser}/></li>


        </ul>
       
      </nav>
    </div>
  )
}

export default NavBar
