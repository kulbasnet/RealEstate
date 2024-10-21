import React from 'react'
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from "./logo.png";
import SearchBar from './SearchBar';
import UserFont from './UserFont';


function NavBar() { 
  

  return (
    <div>
       <nav className='nav'>
        <img className='nav-logo' src={logo} alt='logo' />
        <ul className='nav-link'>
        <li><Link to={'/'} className='li-link'>BUY</Link></li>
        <li><Link to={'/sell'} className='li-link' >SELL</Link></li>
        <li><Link to={'/agent'} className='li-link'>AGENT</Link></li>
        <li> <SearchBar/> </li> 
          <li><UserFont/></li>
   </ul>
       
      </nav>
</div>
 
  )
}

export default NavBar
