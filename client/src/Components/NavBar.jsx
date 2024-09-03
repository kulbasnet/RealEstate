import React from 'react'
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from "./logo.png";
import SearchBar from './SearchBar';


function NavBar() {    
  return (
    <div>
       <nav className='nav'>
        <img className='nav-logo' src={logo} alt='logo' />
        <ul className='nav-link'>
        <li><Link to={'/'} className='li-link'>BUY</Link></li>
        <li><Link to={'/sell'} className='li-link' >SELL</Link></li>
        <li><Link to={'/agent'} className='li-link'>AGENT</Link></li>
        <SearchBar/>
        {/* <li><button className='search-button'><FontAwesomeIcon icon={faSearch}/></button></li> */}
      <li><button className='icon-button'><FontAwesomeIcon icon={faUser}/></button></li>  


        </ul>
       
      </nav>
</div>
 
  )
}

export default NavBar
