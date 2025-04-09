import React from 'react';
import { Link } from 'react-router-dom';
import logo from "./logo.png";
import UserFont from './UserFont';
import Logo1 from './Logo1.png';

function NavBar() { 
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#081740] shadow-md z-50 flex items-center justify-between px-8 py-4 h-[100px]">
      {/* Logo */}
      <Link to={'/hero'}>
        <img className="h-15 w-auto" src={logo} alt="logo" />
      </Link> 

      {/* Navigation Links */}
      <ul className="flex gap-[140px] text-white text-lg font-semibold ml-[596px]">
        <li><Link to={'/'} className="hover:underline">BUY</Link></li>
        <li><Link to={'/sell'} className="hover:underline">SELL</Link></li>
        <li><Link to={'/agent'} className="hover:underline">AGENT</Link></li>
      </ul>

      {/* User Profile Icon */}
      <UserFont className="bg-[gold]" />
    </nav>
  );
}

export default NavBar;
