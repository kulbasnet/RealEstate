import React from 'react';
import { Link, Outlet } from 'react-router-dom';
// import UserFont from '../Components/UserFont';
import AgentFont from '../Components/AgentFont';
import bur from "../pages/bur.png";
import { Pyramid } from 'lucide-react';

function Agentnav() {
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-[#081740] shadow-md z-50 flex items-center justify-between px-8 py-4 h-[100px]">
      <Link to="/dashboard">
            <img src={bur} className='h-15 w-auto ' />
            </Link>
        <ul className="flex gap-[100px] text-white text-lg font-semibold ml-[510px]">
    
          <li>
            <Link to={'/dashboard'} className="hover:text-gray-300">DASHBOARD</Link>
          </li>
          <li>
            <Link to={'/agentMessage'} className="hover:text-gray-300 flex gap-2 "> CLIENTS <Pyramid className='w-4 text-[#DB9F05]'/></Link>
          </li>
        </ul>
        <AgentFont />
      </nav>
      <Outlet />
    </div>
  );
}

export default Agentnav;
