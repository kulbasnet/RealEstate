import React from 'react'
import logo from "../Components/logo.png"
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Agentnav() {
  return (
    <div>
        <nav className='Agent-nav'>
            <img src={logo} alt="logo" className='nav-logo' />
            <ul className='Agent-link'>
            <li><Link to={'/dashboard'} className="Agent-li-link">DASHBOARD</Link></li>
            <li><Link to={'/message'} className='Agent-li-link'>MESSAGE</Link> </li>
            <li><FontAwesomeIcon icon={faUser} color='white' className='agent-user' /></li>
            </ul>
           

        </nav>
        <Outlet/>

      
    </div>
  )
}

export default Agentnav
