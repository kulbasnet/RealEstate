import React from 'react';
import { Link } from 'react-router-dom';
import UserFont from './UserFont';
import bur from '../pages/bur.png'
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from './ui/dropdown-menu';




function NavBar() { 
  return (
    <nav className="fixed top-0 left-0 z-50 flex h-[100px] w-full items-center justify-between bg-[#081740] px-8 py-4 shadow-md max-lg:px-5 max-sm:h-[76px] max-sm:px-2 max-sm:py-2">
      <Link to={'/hero'}>
        <img className="h-15 w-auto max-sm:w-[56px]" src={bur} alt="logo" />
      </Link> 

      <ul className="ml-[510px] flex gap-[100px] text-lg font-semibold text-white max-lg:ml-0 max-lg:gap-8 max-lg:text-base max-sm:gap-1 max-sm:text-xs">
        <li><Link to={'/'} className="hover:underline">BUY</Link></li>
        <li><Link to={'/sell'} className="hover:underline">SELL</Link></li>
        <li><Link to={'/agent'} className="hover:underline">AGENT</Link></li>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
          <li className='flex'> TOOLS <ChevronDown className='ml-3 mt-1 max-sm:ml-1 max-sm:h-3 max-sm:w-3'/> </li>
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
