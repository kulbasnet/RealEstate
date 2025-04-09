import React from 'react';
import { Link, Outlet } from 'react-router-dom';
// import UserFont from '../components/UserFont';
import AgentFont from '../components/AgentFont';

function Agentnav() {
  return (
    <div>
      <nav className="bg-[#081740] h-[100px] flex items-center justify-end px-10 gap-[130px]">
        <ul className="flex items-center space-x-8 text-white text-lg font-semibold gap-10">
          <li>
            <Link to={'/dashboard'} className="hover:text-gray-300">DASHBOARD</Link>
          </li>
          <li>
            <Link to={'/agentMessage'} className="hover:text-gray-300"> CLIENTS</Link>
          </li>
        </ul>
        <AgentFont />
      </nav>
      <Outlet />
    </div>
  );
}

export default Agentnav;
