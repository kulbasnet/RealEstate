import React from 'react';
import { Link } from 'react-router-dom';
import UserFont from './UserFont';
import bur from '../pages/bur.png'
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from './ui/dropdown-menu';




function NavBar() { 
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#081740] shadow-md z-50 flex items-center justify-between px-8 py-4 h-[100px]">
      <Link to={'/hero'}>
        <img className="h-15 w-auto" src={bur} alt="logo" />
      </Link> 

      <ul className="flex gap-[100px] text-white text-lg font-semibold ml-[510px]">
        <li><Link to={'/'} className="hover:underline">BUY</Link></li>
        <li><Link to={'/sell'} className="hover:underline">SELL</Link></li>
        <li><Link to={'/agent'} className="hover:underline">AGENT</Link></li>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
          <li className='flex'> TOOLS <ChevronDown className='ml-3 mt-1'/> </li>
          </DropdownMenuTrigger>
          <DropdownMenuContent
          sideOffset = {10}
          className= "w-48 bg-white shadow-lg rounded-lg p-2 z-50"
          >
          <DropdownMenuItem>
            <Link to='/Emi' className='block text-black font-bold  hover:bg-gray-100 p-2 rounded'>EMI Calculator</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to='/landUnit' className='block text-black font-bold  hover:bg-gray-100 p-2 rounded'>Unit/ Naptol</Link>
          </DropdownMenuItem>

          </DropdownMenuContent>
         
        </DropdownMenu>
      </ul>

      <UserFont className="bg-[gold]" />
    </nav>
  );
}

export default NavBar;
